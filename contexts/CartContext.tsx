import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as Database from '@/utils/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  notes?: string;
  name: string;
  image_url: string;
  restaurant_id?: number;
  restaurantId?: number;
  cart_id?: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: any, quantity: number, notes?: string) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
  isLoading: boolean;
  reloadCart: () => Promise<void>; // <-- Nueva función para recargar el carrito
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Usuario temporal para pruebas
  const userId = '1'; // Cambiado a string para compatibilidad

  // Permitir recarga manual del carrito desde fuera
  const loadCartItems = async () => {
    try {
      setIsLoading(true);
      const cartItems = await Database.getCartItems(userId);
      setItems(cartItems as CartItem[]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Inicializar la base de datos si es necesario
    Database.initDatabase();
    // Cargar elementos del carrito al inicio
    loadCartItems();
  }, []);

  const addItem = async (product: any, quantity: number, notes: string = '') => {
    try {
      const restaurantId = product.restaurant_id ?? product.restaurantId;
      if (!restaurantId) {
        Alert.alert('Error', 'No se pudo identificar el restaurante del producto');
        return;
      }
      // Si el carrito actual tiene productos y el restaurante es diferente, limpiar el carrito antes de agregar
      if (items.length > 0 && items[0].restaurant_id !== restaurantId && items[0].restaurantId !== restaurantId) {
        await clearCart();
      }
      await Database.addToCart(
        userId,
        restaurantId,
        product.id,
        quantity,
        product.price,
        notes
      );
      // Recarga los items del carrito después de agregar para actualizar el estado
      await loadCartItems();
    } catch (error) {
      console.error('Error adding item to cart:', error);
      Alert.alert('Error', 'No se pudo agregar el producto al carrito');
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await Database.removeFromCart(itemId);
      // Recarga los items del carrito después de eliminar
      await loadCartItems();
    } catch (error) {
      // Solo registrar el error en consola sin mostrar alerta al usuario
      console.error('Error removing item from cart:', error);
      
      // Actualizamos el estado local para mantener sincronización
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    }
  };

  const clearCart = async () => {
    try {
      if (userId && items.length > 0) {
        const cartId = items[0].cart_id;
        // Eliminar todos los elementos del carrito uno por uno
        for (const item of items) {
          await Database.removeFromCart(item.id);
        }
        setItems([]);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      Alert.alert('Error', 'No se pudo limpiar el carrito');
    }
  };

  // Calculamos solo el subtotal de los items sin gastos de envío
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        total,
        isLoading,
        reloadCart: loadCartItems, // <-- Exponer función para recargar
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
