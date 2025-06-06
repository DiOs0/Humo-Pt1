import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Check, MapPin, Clock, ChevronRight } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  
  // In a real app, this would come from the order creation response
  const orderNumber = "EF" + Math.floor(10000 + Math.random() * 90000);
  const estimatedTime = "30-45";

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Check size={40} color="white" />
        </View>
        
        <Text style={styles.title}>{t('orderConfirmation.success')}</Text>
        <Text style={styles.subtitle}>{t('orderConfirmation.subtitle')}</Text>
        
        <View style={styles.orderInfo}>
          <Text style={styles.orderLabel}>{t('orderConfirmation.orderNumber')}</Text>
          <Text style={styles.orderNumber}>{orderNumber}</Text>
        </View>
        
        <View style={styles.card}>
          <View style={styles.restaurantInfo}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }} 
              style={styles.restaurantImage} 
            />
            <View style={styles.restaurantDetails}>
              <Text style={styles.restaurantName}>Burger Palace</Text>
              <View style={styles.restaurantLocation}>
                <MapPin size={14} color="#666" />
                <Text style={styles.locationText}>2.1km {t('orderConfirmation.away')}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.deliveryInfo}>
            <View style={styles.deliveryDetail}>
              <Clock size={16} color="#E85D04" />
              <View style={styles.deliveryTextContainer}>
                <Text style={styles.deliveryLabel}>{t('orderConfirmation.estimatedDelivery')}</Text>
                <Text style={styles.deliveryValue}>{estimatedTime} {t('orderConfirmation.minutes')}</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.trackButton}
              onPress={() => router.push(`/order/${orderNumber}`)}
            >
              <Text style={styles.trackButtonText}>{t('orderConfirmation.track')}</Text>
              <ChevronRight size={16} color="#E85D04" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.orderSummary}>
          <Text style={styles.summaryTitle}>{t('orderConfirmation.orderSummary')}</Text>
          
          <View style={styles.summaryItem}>
            <Text style={styles.itemName}>Burger Deluxe x2</Text>
            <Text style={styles.itemPrice}>$25.98</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.itemName}>French Fries x1</Text>
            <Text style={styles.itemPrice}>$4.99</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.itemName}>Chocolate Milkshake x1</Text>
            <Text style={styles.itemPrice}>$5.99</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>{t('orderConfirmation.subtotal')}</Text>
            <Text style={styles.summaryValue}>$36.96</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>{t('orderConfirmation.deliveryFee')}</Text>
            <Text style={styles.summaryValue}>$2.99</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>{t('orderConfirmation.serviceFee')}</Text>
            <Text style={styles.summaryValue}>$1.50</Text>
          </View>
          
          <View style={[styles.summaryItem, styles.totalItem]}>
            <Text style={styles.totalLabel}>{t('orderConfirmation.total')}</Text>
            <Text style={styles.totalValue}>$41.45</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => router.push('/')}
        >
          <Text style={styles.homeButtonText}>{t('orderConfirmation.backToHome')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
    alignItems: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#33A95B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  orderInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  orderLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E85D04',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
  deliveryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deliveryDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryTextContainer: {
    marginLeft: 8,
  },
  deliveryLabel: {
    fontSize: 12,
    color: '#666',
  },
  deliveryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackButtonText: {
    fontSize: 14,
    color: '#E85D04',
    fontWeight: '500',
    marginRight: 4,
  },
  orderSummary: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#333',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
  },
  totalItem: {
    marginTop: 8,
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
  homeButton: {
    backgroundColor: '#E85D04',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  homeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});