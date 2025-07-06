import * as SQLite from 'expo-sqlite';
import { mockRestaurants } from '@/data/mockData';
import uuid from 'react-native-uuid';

// Abrir la base de datos de forma síncrona
const db = SQLite.openDatabaseSync('mydatabase.db');

// --- MIGRACIÓN: Agregar campo name si no existe ---
const migrateAddNameField = () => {
  const userTableInfo = db.getAllSync("PRAGMA table_info(users)");
  const hasName = userTableInfo.some((col: any) => col.name === 'name');
  if (!hasName) {
    db.runSync('ALTER TABLE users ADD COLUMN name TEXT');
  }
};

// MIGRACIÓN: Cambia user_id y restaurant_id a TEXT en Cart, CartItems, Orders, OrderItems
export const migrateCartAndOrdersToText = () => {
  // Cart
  db.runSync('CREATE TABLE IF NOT EXISTS Cart_new (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, restaurant_id TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)');
  db.runSync('INSERT INTO Cart_new (id, user_id, restaurant_id, created_at) SELECT id, CAST(user_id AS TEXT), CAST(restaurant_id AS TEXT), created_at FROM Cart');
  db.runSync('DROP TABLE IF EXISTS Cart');
  db.runSync('ALTER TABLE Cart_new RENAME TO Cart');
  // CartItems (no user_id, pero dependiente de Cart)
  // Orders
  db.runSync('CREATE TABLE IF NOT EXISTS Orders_new (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, restaurant_id TEXT, status TEXT, total_amount DECIMAL(10,2), delivery_fee DECIMAL(10,2), service_fee DECIMAL(10,2), created_at DATETIME DEFAULT CURRENT_TIMESTAMP, delivery_address TEXT, customer_name TEXT, customer_phone TEXT)');
  db.runSync('INSERT INTO Orders_new (id, user_id, restaurant_id, status, total_amount, delivery_fee, service_fee, created_at, delivery_address, customer_name, customer_phone) SELECT id, CAST(user_id AS TEXT), CAST(restaurant_id AS TEXT), status, total_amount, delivery_fee, service_fee, created_at, delivery_address, customer_name, customer_phone FROM Orders');
  db.runSync('DROP TABLE IF EXISTS Orders');
  db.runSync('ALTER TABLE Orders_new RENAME TO Orders');
  // Products y OrderItems no requieren migración de user_id
};

// Inicializar tablas
export const initDatabase = () => {
  try {
    migrateAddNameField();
    migrateCartAndOrdersToText();
    
    db.execSync(`
      -- ESTRUCTURA EASYFOOD RELACIONAL
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('customer', 'restaurant')),
        name TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY NOT NULL,
        user_id TEXT NOT NULL,
        full_name TEXT,
        phone TEXT,
        address TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );
      CREATE TABLE IF NOT EXISTS restaurants (
        id TEXT PRIMARY KEY NOT NULL,
        user_id TEXT NOT NULL,
        name TEXT,
        description TEXT,
        image_url TEXT,
        location TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );
      CREATE TABLE IF NOT EXISTS menu_items (
        id TEXT PRIMARY KEY NOT NULL,
        restaurant_id TEXT NOT NULL,
        name TEXT,
        description TEXT,
        price REAL,
        image_url TEXT,
        is_available INTEGER DEFAULT 1,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(restaurant_id) REFERENCES restaurants(id)
      );
      CREATE TABLE IF NOT EXISTS orders_rel (
        id TEXT PRIMARY KEY NOT NULL,
        customer_id TEXT NOT NULL,
        restaurant_id TEXT NOT NULL,
        total REAL,
        status TEXT NOT NULL CHECK(status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(customer_id) REFERENCES customers(id),
        FOREIGN KEY(restaurant_id) REFERENCES restaurants(id)
      );
      CREATE TABLE IF NOT EXISTS order_items_rel (
        id TEXT PRIMARY KEY NOT NULL,
        order_id TEXT NOT NULL,
        menu_item_id TEXT NOT NULL,
        quantity INTEGER,
        subtotal REAL,
        FOREIGN KEY(order_id) REFERENCES orders_rel(id),
        FOREIGN KEY(menu_item_id) REFERENCES menu_items(id)
      );
      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY NOT NULL,
        customer_id TEXT NOT NULL,
        restaurant_id TEXT NOT NULL,
        rating INTEGER,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(customer_id) REFERENCES customers(id),
        FOREIGN KEY(restaurant_id) REFERENCES restaurants(id)
      );
      -- FIN ESTRUCTURA EASYFOOD RELACIONAL
      
      -- Estructura previa (carrito, productos, etc.)
      CREATE TABLE IF NOT EXISTS Cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        restaurant_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS CartItems (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cart_id INTEGER,
        product_id INTEGER,
        quantity INTEGER,
        price DECIMAL(10,2),
        notes TEXT,
        FOREIGN KEY (cart_id) REFERENCES Cart(id)
      );
      CREATE TABLE IF NOT EXISTS Orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        restaurant_id INTEGER,
        status TEXT CHECK(status IN ('preparing', 'ready', 'delivering', 'completed', 'cancelled')),
        total_amount DECIMAL(10,2),
        delivery_fee DECIMAL(10,2),
        service_fee DECIMAL(10,2),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        delivery_address TEXT,
        customer_name TEXT,
        customer_phone TEXT
      );
      CREATE TABLE IF NOT EXISTS OrderItems (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER,
        product_id INTEGER,
        quantity INTEGER,
        price DECIMAL(10,2),
        notes TEXT,
        FOREIGN KEY (order_id) REFERENCES Orders(id)
      );
      CREATE TABLE IF NOT EXISTS Products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        restaurant_id INTEGER,
        name TEXT,
        description TEXT,
        price DECIMAL(10,2),
        image_url TEXT,
        category TEXT,
        available BOOLEAN DEFAULT 1
      );
    `);
    
    // Insertar productos de ejemplo
    insertSampleProducts();
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Función para insertar productos de ejemplo de los datos mock
const insertSampleProducts = () => {
  try {
    // Verificar si ya hay productos en la tabla
    const productsCount = db.getFirstSync('SELECT COUNT(*) as count FROM Products', []);
    
    if (productsCount && (productsCount as any)['count'] > 0) {
      // Ya hay productos, no necesitamos insertar más
      return;
    }
    
    // Insertar todos los productos de los restaurantes mock
    mockRestaurants.forEach(restaurant => {
      restaurant.menu.forEach(item => {
        // Convertir la imagen a una URL string para almacenar en la base de datos
        let imageUrl = '';
        if (typeof item.image === 'string') {
          imageUrl = item.image;
        } else {
          // Esto es una aproximación, ya que require() no devuelve un string URL
          // En un caso real, necesitaríamos manejar esto de otra manera
          imageUrl = `${restaurant.id}-${item.id}`;
        }
        
        try {
          db.runSync(
            `INSERT INTO Products (
              id, restaurant_id, name, description, price, image_url, category
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              item.id,
              restaurant.id,
              item.name,
              item.description,
              item.price,
              imageUrl,
              item.category
            ]
          );
        } catch (error) {
          // Si hay un error (por ejemplo, por duplicado de ID), lo ignoramos
          console.error('Error al insertar producto:', error);
        }
      });
    });
  } catch (error) {
    console.error('Error inserting sample products:', error);
  }
};

// Función para agregar un producto al carrito
export const addToCart = (
  userId: string,
  restaurantId: number,
  productId: number,
  quantity: number,
  price: number,
  notes: string = ''
) => {
  try {
    console.log('addToCart llamado', { userId, restaurantId, productId, quantity, price, notes });
    
    // Buscar carrito existente
    const cartResult: any = db.getFirstSync(
      'SELECT * FROM Cart WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    let cartId = cartResult?.id;

    // Si no hay carrito, crear uno nuevo
    if (!cartId) {
      db.runSync(
        'INSERT INTO Cart (user_id, restaurant_id) VALUES (?, ?)',
        [userId, restaurantId]
      );
      const newCart: any = db.getFirstSync(
        'SELECT * FROM Cart WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
        [userId]
      );
      cartId = newCart?.id;
    }

    // Si todavía no tenemos cartId, algo salió mal
    if (!cartId) {
      console.error('No se pudo crear o encontrar el carrito');
      return;
    }

    // Verificar si el producto ya está en el carrito
    const item: any = db.getFirstSync(
      'SELECT * FROM CartItems WHERE cart_id = ? AND product_id = ?',
      [cartId, productId]
    );
    
    if (item) {
      const newQuantity = item.quantity + quantity;
      console.log('Actualizando cantidad', { itemId: item.id, oldQuantity: item.quantity, quantity, newQuantity });
      
      if (newQuantity <= 0) {
        // Si la nueva cantidad es 0 o menos, eliminar el item
        console.log('Eliminando item porque la cantidad es <= 0', { itemId: item.id });
        db.runSync(
          'DELETE FROM CartItems WHERE id = ?',
          [item.id]
        );
      } else {
        // Actualizar cantidad
        console.log('Actualizando cantidad a', newQuantity);
        db.runSync(
          'UPDATE CartItems SET quantity = ? WHERE id = ?',
          [newQuantity, item.id]
        );
      }
    } else if (quantity > 0) {
      // Solo insertar si la cantidad es positiva
      console.log('Insertando nuevo item en el carrito');
      db.runSync(
        'INSERT INTO CartItems (cart_id, product_id, quantity, price, notes) VALUES (?, ?, ?, ?, ?)',
        [cartId, productId, quantity, price, notes]
      );
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
};

// Obtener items del carrito
export const getCartItems = (userId: string) => {
  try {
    console.log('getCartItems llamado', { userId });
    
    const cart: any = db.getFirstSync(
      'SELECT * FROM Cart WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    
    if (!cart) {
      console.log('No se encontró carrito para el usuario', userId);
      return [];
    }
    
    console.log('Carrito encontrado:', cart);
    
    const items = db.getAllSync(
      `SELECT 
          ci.id AS id,
          ci.product_id,
          ci.quantity,
          ci.price,
          ci.notes,
          ci.cart_id,
          p.name,
          p.image_url,
          p.restaurant_id
       FROM CartItems ci
       JOIN Products p ON ci.product_id = p.id
       WHERE ci.cart_id = ?`,
      [cart.id]
    );
    
    console.log('Items en el carrito:', items);
    return items;
  } catch (error) {
    console.error('Error getting cart items:', error);
    return [];
  }
};

// Eliminar item del carrito
export const removeFromCart = (cartItemId: number) => {
  try {
    console.log('removeFromCart llamado con ID:', cartItemId);
    
    // Verificar si el item existe antes de eliminarlo
    const checkQuery = 'SELECT * FROM CartItems WHERE id = ?';
    console.log('Ejecutando consulta:', checkQuery, 'con parámetro:', cartItemId);
    
    const item = db.getFirstSync(checkQuery, [cartItemId]);
    
    if (item) {
      console.log('Item encontrado, eliminando:', item);
      const deleteQuery = 'DELETE FROM CartItems WHERE id = ?';
      console.log('Ejecutando consulta:', deleteQuery, 'con parámetro:', cartItemId);
      
      db.runSync(deleteQuery, [cartItemId]);
      console.log('Item eliminado correctamente');
      
      // Verificar que se haya eliminado
      const verifyItem = db.getFirstSync('SELECT * FROM CartItems WHERE id = ?', [cartItemId]);
      if (!verifyItem) {
        console.log('Verificado: el item ya no existe en la base de datos');
      } else {
        console.log('Información: El item no se eliminó correctamente, pero continuaremos de todas formas');
      }
    } else {
      // Solo registramos en consola sin mostrar error al usuario
      console.log('Información: No se encontró el item con ID:', cartItemId, '- Esto es normal en algunos casos');
      
      // Obtener todos los IDs de CartItems para depuración (sin mostrar al usuario)
      if (process.env.NODE_ENV === 'development') {
        const allItems = db.getAllSync('SELECT id, product_id FROM CartItems', []);
        console.log('IDs disponibles en CartItems:', allItems);
      }
    }
    
    // Siempre devolvemos true para evitar errores en la UI
    return true;
  } catch (error) {
    // Solo log, sin error para el usuario
    console.log('Información: Error técnico al eliminar del carrito, pero continuamos:', error);
    return true; // Devolvemos true de todas formas para no romper la UI
  }
};

// Crear una orden desde el carrito
export const createOrder = (
  userId: string,
  deliveryAddress: string,
  customerName: string,
  customerPhone: string
): number => {
  try {
    const cart: any = db.getFirstSync(
      'SELECT * FROM Cart WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    if (!cart) throw new Error('No hay carrito');
    const items: any[] = db.getAllSync(
      'SELECT * FROM CartItems WHERE cart_id = ?',
      [cart.id]
    );
    if (!items.length) throw new Error('Carrito vacío');
    const totalAmount = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 2.99;
    const serviceFee = 1.50;
    db.runSync(
      `INSERT INTO Orders (
        user_id, restaurant_id, status, total_amount,
        delivery_fee, service_fee, delivery_address,
        customer_name, customer_phone
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        cart.restaurant_id,
        'preparing',
        totalAmount + deliveryFee + serviceFee,
        deliveryFee,
        serviceFee,
        deliveryAddress,
        customerName,
        customerPhone
      ]
    );
    const order: any = db.getFirstSync(
      'SELECT * FROM Orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    // Transferir los items del carrito a la orden
    items.forEach((item: any) => {
      db.runSync(
        `INSERT INTO OrderItems (order_id, product_id, quantity, price, notes)
         VALUES (?, ?, ?, ?, ?)`,
        [order.id, item.product_id, item.quantity, item.price, item.notes]
      );
    });
    // Limpiar solo el carrito del usuario actual
    clearUserCart(userId);
    return order.id;
  } catch (error) {
    console.error('Error creating order:', error);
    return 0;
  }
};

// Obtener órdenes del usuario
export const getOrders = (userId: number) => {
  try {
    return db.getAllSync(
      `SELECT o.*, 
        (SELECT COUNT(*) FROM OrderItems WHERE order_id = o.id) as item_count
       FROM Orders o 
       WHERE o.user_id = ? 
       ORDER BY o.created_at DESC`,
      [userId]
    );
  } catch (error) {
    console.error('Error getting orders:', error);
    return [];
  }
};

// Obtener detalles de una orden
export const getOrderDetails = (orderId: number) => {
  try {
    const order: any = db.getFirstSync(
      `SELECT * FROM Orders WHERE id = ?`,
      [orderId]
    );
    
    if (!order) return null;
    
    const items = db.getAllSync(
      `SELECT oi.*, p.name, p.image_url
       FROM OrderItems oi
       JOIN Products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId]
    );
    
    return { ...order, items };
  } catch (error) {
    console.error('Error getting order details:', error);
    return null;
  }
};

// Actualizar estado de la orden
export const updateOrderStatus = (orderId: number, status: string) => {
  try {
    db.runSync('UPDATE Orders SET status = ? WHERE id = ?', [status, orderId]);
  } catch (error) {
    console.error('Error updating order status:', error);
  }
};

// Función de utilidad para ver el contenido de una tabla (para depuración)
export const logTable = (tableName: string) => {
  try {
    const rows = db.getAllSync(`SELECT * FROM ${tableName}`);
    console.log(`Contenido de la tabla ${tableName}:`, rows);
  } catch (e) {
    console.log('Error al leer la tabla', tableName, e);
  }
};

// Función para depurar CartItems - muestra todos los elementos en la tabla
export const debugCartItems = () => {
  try {
    console.log('\n===== DEPURACIÓN DE CARTITEMS =====');
    const items = db.getAllSync('SELECT * FROM CartItems', []);
    
    if (items && items.length > 0) {
      console.log(`Encontrados ${items.length} elementos en CartItems:`);
      items.forEach((item: any, index: number) => {
        console.log(`[${index}] ID: ${item.id}, product_id: ${item.product_id}, quantity: ${item.quantity}, price: ${item.price}`);
      });
    } else {
      console.log('La tabla CartItems está vacía');
    }
    console.log('===== FIN DEPURACIÓN =====\n');
    return items;
  } catch (error) {
    console.error('Error en debugCartItems:', error);
    return [];
  }
};

// ================= FUNCIONES EASYFOOD RELACIONAL ===================

// Insertar usuario
export const getUserByEmail = (email: string) => {
  const result = db.getFirstSync('SELECT * FROM users WHERE email = ?', [email]);
  return result;
};

// Modificar insertUser para lanzar error si el correo ya existe
export const insertUser = (user: { id?: string, email: string, password: string, role: string }) => {
  const existing = db.getFirstSync('SELECT * FROM users WHERE email = ?', [user.email]);
  if (existing) {
    throw new Error('El correo ya está registrado');
  }
  const userId = user.id || uuid.v4();
  db.runSync(
    'INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, ?)',
    [userId, user.email, user.password, user.role]
  );
  return userId;
};

// Elimina usuario y todos sus datos relacionados (pedidos, reviews, etc)
export const deleteUserAndData = (userId: string) => {
  // Eliminar reviews
  db.runSync('DELETE FROM reviews WHERE customer_id = (SELECT id FROM customers WHERE user_id = ?)', [userId]);
  // Eliminar order_items_rel y orders_rel
  db.runSync('DELETE FROM order_items_rel WHERE order_id IN (SELECT id FROM orders_rel WHERE customer_id = (SELECT id FROM customers WHERE user_id = ?))', [userId]);
  db.runSync('DELETE FROM orders_rel WHERE customer_id = (SELECT id FROM customers WHERE user_id = ?)', [userId]);
  // Eliminar carrito y sus items
  clearUserCart(userId);
  // Eliminar customer
  db.runSync('DELETE FROM customers WHERE user_id = ?', [userId]);
  // Eliminar usuario
  db.runSync('DELETE FROM users WHERE id = ?', [userId]);
};

// Actualizar nombre de usuario
export const updateUserName = (userId: string, name: string) => {
  const db = require('expo-sqlite').openDatabaseSync('mydatabase.db');
  db.runSync('UPDATE users SET name = ? WHERE id = ?', [name, userId]);
};

// Limpiar carrito del usuario (y sus items) al eliminar cuenta o cerrar sesión
export const clearUserCart = (userId: string) => {
  // Eliminar items del carrito del usuario
  const carts = db.getAllSync('SELECT id FROM Cart WHERE user_id = ?', [userId]);
  carts.forEach((cart: any) => {
    db.runSync('DELETE FROM CartItems WHERE cart_id = ?', [cart.id]);
  });
  db.runSync('DELETE FROM Cart WHERE user_id = ?', [userId]);
};
