import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Minus, Plus, MapPin, CreditCard, Truck, Clock } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { mockRestaurants } from '@/data/mockData';

// Mock cart data - in a real app, this would come from a cart context or state management
const mockCartItems = [
  { id: 1, restaurantId: 1, name: 'Burger Deluxe', price: 12.99, quantity: 2, image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 2, restaurantId: 1, name: 'French Fries', price: 4.99, quantity: 1, image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 3, restaurantId: 1, name: 'Chocolate Milkshake', price: 5.99, quantity: 1, image: 'https://images.pexels.com/photos/3727250/pexels-photo-3727250.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }
];

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      </View>
      
      <View style={styles.quantityControls}>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => item.quantity === 1 ? onRemove(item) : onDecrease(item)}
        >
          <Minus size={16} color="#E85D04" />
        </TouchableOpacity>
        
        <Text style={styles.quantityText}>{item.quantity}</Text>
        
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => onIncrease(item)}
        >
          <Plus size={16} color="#E85D04" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function CartScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [deliveryOption, setDeliveryOption] = useState('delivery'); // 'delivery' or 'pickup'
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'cash', or 'wallet'
  
  // Get restaurant info from the first cart item
  const restaurant = cartItems.length > 0 
    ? mockRestaurants.find(r => r.id === cartItems[0].restaurantId)
    : null;

  const handleIncreaseQuantity = (item) => {
    setCartItems(prev => 
      prev.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      )
    );
  };

  const handleDecreaseQuantity = (item) => {
    setCartItems(prev => 
      prev.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      )
    );
  };

  const handleRemoveItem = (item) => {
    setCartItems(prev => prev.filter(cartItem => cartItem.id !== item.id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price * item.quantity), 
    0
  );
  
  const deliveryFee = deliveryOption === 'delivery' ? 2.99 : 0;
  const serviceFee = 1.50;
  const total = subtotal + deliveryFee + serviceFee;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('carrito')}</Text>
      </View>

      {cartItems.length > 0 ? (
        <>
          <ScrollView style={styles.content}>
            {restaurant && (
              <View style={styles.restaurantInfo}>
                <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
                <View style={styles.restaurantDetails}>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                  <View style={styles.restaurantLocation}>
                    <MapPin size={14} color="#666" />
                    <Text style={styles.restaurantDistance}>
                      {restaurant.distance}km {t('ubicación')}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('productos')}</Text>
              {cartItems.map(item => (
                <CartItem 
                  key={item.id}
                  item={item}
                  onIncrease={handleIncreaseQuantity}
                  onDecrease={handleDecreaseQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('opciones de envío')}</Text>
              
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    deliveryOption === 'delivery' && styles.selectedOption
                  ]}
                  onPress={() => setDeliveryOption('delivery')}
                >
                  <Truck 
                    size={20} 
                    color={deliveryOption === 'delivery' ? '#E85D04' : '#666'} 
                  />
                  <View style={styles.optionTextContainer}>
                    <Text 
                      style={[
                        styles.optionTitle,
                        deliveryOption === 'delivery' && styles.selectedOptionText
                      ]}
                    >
                      {t('cart.delivery')}
                    </Text>
                    <Text style={styles.optionSubtitle}>
                      {t('tiempo de envío', { time: '30-45' })}
                    </Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    deliveryOption === 'pickup' && styles.selectedOption
                  ]}
                  onPress={() => setDeliveryOption('pickup')}
                >
                  <Clock 
                    size={20} 
                    color={deliveryOption === 'pickup' ? '#E85D04' : '#666'} 
                  />
                  <View style={styles.optionTextContainer}>
                    <Text 
                      style={[
                        styles.optionTitle,
                        deliveryOption === 'pickup' && styles.selectedOptionText
                      ]}
                    >
                      {t('cart.pickup')}
                    </Text>
                    <Text style={styles.optionSubtitle}>
                      {t('tiempo de preparación', { time: '15-20' })}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('método de pago')}</Text>
              
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    paymentMethod === 'card' && styles.selectedOption
                  ]}
                  onPress={() => setPaymentMethod('card')}
                >
                  <CreditCard 
                    size={20} 
                    color={paymentMethod === 'card' ? '#E85D04' : '#666'} 
                  />
                  <Text 
                    style={[
                      styles.optionTitle,
                      paymentMethod === 'card' && styles.selectedOptionText
                    ]}
                  >
                    {t('tarjeta de crédito')}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    paymentMethod === 'cash' && styles.selectedOption
                  ]}
                  onPress={() => setPaymentMethod('cash')}
                >
                  <Text 
                    style={[
                      styles.cashIcon,
                      paymentMethod === 'cash' && styles.selectedCashIcon
                    ]}
                  >
                    $
                  </Text>
                  <Text 
                    style={[
                      styles.optionTitle,
                      paymentMethod === 'cash' && styles.selectedOptionText
                    ]}
                  >
                    {t('efectivo')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('resumen')}</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t('subtotal')}</Text>
                <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t('envio gratis')}</Text>
                <Text style={styles.summaryValue}>
                  {deliveryOption === 'pickup' 
                    ? t('cart.free') 
                    : `$${deliveryFee.toFixed(2)}`}
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t('servicio grati')}</Text>
                <Text style={styles.summaryValue}>${serviceFee.toFixed(2)}</Text>
              </View>
              
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>{t('total')}</Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={() => router.push('/order/confirmation')}
            >
              <Text style={styles.checkoutButtonText}>{t('Ordenar')}</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyCartContainer}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/5677794/pexels-photo-5677794.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }}
            style={styles.emptyCartImage}
          />
          <Text style={styles.emptyCartTitle}>{t('carrito vacio')}</Text>
          <Text style={styles.emptyCartSubtitle}>{t('no hay productos')}</Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.browseButtonText}>{t('buscar restaurantes')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginRight: 40, // To offset the back button and center the title
  },
  content: {
    flex: 1,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  restaurantImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  restaurantDetails: {
    marginLeft: 12,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  restaurantLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantDistance: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
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
    minWidth: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  selectedOption: {
    borderColor: '#E85D04',
    backgroundColor: '#FFF0E6',
  },
  optionTextContainer: {
    marginLeft: 8,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  selectedOptionText: {
    color: '#E85D04',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  cashIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginRight: 8,
  },
  selectedCashIcon: {
    color: '#E85D04',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E85D04',
  },
  footer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  checkoutButton: {
    backgroundColor: '#E85D04',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyCartImage: {
    width: 120,
    height: 120,
    marginBottom: 24,
    borderRadius: 60,
  },
  emptyCartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyCartSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#E85D04',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});