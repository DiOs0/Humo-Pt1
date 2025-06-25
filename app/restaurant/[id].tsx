import { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Clock, MapPin, Star, Plus, Minus, ShoppingBag } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { mockRestaurants } from '@/data/mockData';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: number; // Cambiado a number para imágenes locales (require)
  category: string;
}

interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  distance: number;
  deliveryTime: string;
  image: number; // Cambiado a number para imágenes locales (require)
  menu: MenuItem[];
  description?: string;
  promo?: string | null;
}

interface MenuItemProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
  onRemove: (item: MenuItem) => void;
  quantity: number;
}

interface CartItems {
  [key: number]: number;
}

function MenuItem({ item, onAdd, onRemove, quantity = 0 }: MenuItemProps) {
  return (
    <View style={styles.menuItem}>
      <Image source={item.image} style={styles.menuItemImage} />
      <View style={styles.menuItemInfo}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        <Text style={styles.menuItemDescription}>{item.description}</Text>
        <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.quantityControls}>
        {quantity > 0 ? (
          <>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => onRemove(item)}
            >
              <Minus size={16} color="#E85D04" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => onAdd(item)}
            >
              <Plus size={16} color="#E85D04" />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => onAdd(item)}
          >
            <Plus size={16} color="#E85D04" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [cartItems, setCartItems] = useState<CartItems>({});
  
  // Find the restaurant by ID
  const restaurant: Restaurant | undefined = mockRestaurants.find(r => r.id.toString() === id);
  
  if (!restaurant) {
    return (
      <View style={styles.container}>
        <Text>Restaurant not found</Text>
      </View>
    );
  }

  const menuCategories = ['all', ...new Set(restaurant.menu.map(item => item.category))];
  
  const filteredMenu = activeCategory === 'all' 
    ? restaurant.menu 
    : restaurant.menu.filter(item => item.category === activeCategory);

  const handleAddItem = (item: MenuItem) => {
    setCartItems(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1
    }));
  };

  const handleRemoveItem = (item: MenuItem) => {
    setCartItems(prev => {
      const newItems = { ...prev };
      if (newItems[item.id] > 1) {
        newItems[item.id] -= 1;
      } else {
        delete newItems[item.id];
      }
      return newItems;
    });
  };

  const totalItems: number = Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0);
  
  const totalPrice: number = Object.entries(cartItems).reduce((sum, [itemId, quantity]) => {
    const item = restaurant.menu.find(menuItem => menuItem.id === parseInt(itemId));
    return sum + (item ? item.price * quantity : 0);
  }, 0);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={restaurant.image} style={styles.coverImage} />
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            
            <View style={styles.ratingContainer}>
              <Star size={16} color="#FFD700" fill="#FFD700" />
              <Text style={styles.ratingText}>{restaurant.rating}</Text>
              <Text style={styles.reviewCount}>({restaurant.reviewCount})</Text>
            </View>
            
            <Text style={styles.cuisineText}>{restaurant.cuisine}</Text>
            
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <MapPin size={16} color="#666" />
                <Text style={styles.infoText}>{restaurant.distance}km de distancia</Text>
              </View>
              <View style={styles.infoItem}>
                <Clock size={16} color="#666" />
                <Text style={styles.infoText}>{restaurant.deliveryTime} {t('restaurant.deliveryTime')}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.aboutSection}>
            <Text style={styles.sectionTitle}>{t('restaurant.about')}</Text>
            <Text style={styles.aboutText}>{restaurant.description || t('restaurant.noDescription')}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{t('restaurant.menu')}</Text>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesContainer}
            >
              {menuCategories.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    activeCategory === category && styles.activeCategoryButton
                  ]}
                  onPress={() => setActiveCategory(category)}
                >
                  <Text 
                    style={[
                      styles.categoryButtonText,
                      activeCategory === category && styles.activeCategoryButtonText
                    ]}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {filteredMenu.map(item => (
              <MenuItem 
                key={item.id}
                item={item}
                quantity={cartItems[item.id] || 0}
                onAdd={handleAddItem}
                onRemove={handleRemoveItem}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      
      {totalItems > 0 && (
        <View style={styles.cartContainer}>
          <View style={styles.cartInfo}>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalItems}</Text>
            </View>
            <Text style={styles.cartText}>{t('restaurant.itemsInCart')}</Text>
          </View>
          <Text style={styles.cartTotal}>${totalPrice.toFixed(2)}</Text>
          <TouchableOpacity 
            style={styles.viewCartButton}
            onPress={() => router.push('/cart')}
          >
            <ShoppingBag size={20} color="white" />
            <Text style={styles.viewCartText}>{t('restaurant.viewCart')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  coverImage: {
    width: '100%',
    height: 200,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 16,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  cuisineText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
  aboutSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  menuSection: {
    marginBottom: 16,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
  },
  activeCategoryButton: {
    backgroundColor: '#FFF0E6',
    borderWidth: 1,
    borderColor: '#FFE0CC',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
  },
  activeCategoryButtonText: {
    color: '#E85D04',
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  menuItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E85D04',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 100,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF0E6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE0CC',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FFF0E6',
    borderWidth: 1,
    borderColor: '#FFE0CC',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E85D04',
    marginLeft: 4,
  },
  cartContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E85D04',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  cartText: {
    fontSize: 14,
    color: '#666',
  },
  cartTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E85D04',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewCartText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
});