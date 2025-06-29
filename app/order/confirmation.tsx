import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Phone, MessageCircle, Clock, Check, MapPin } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { mockOrders } from '@/data/mockData';

// Función auxiliar para validar el estado del pedido
function isValidOrderStatus(status: string): status is OrderStatus {
  return ['preparing', 'ready', 'delivering', 'completed', 'cancelled'].includes(status);
}

type OrderStatus = 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

interface Order {
  id: number;
  restaurantId: number;
  restaurantName: string;
  restaurantImage: string;
  status: OrderStatus;
  date: string;
  total: number;
  customerName: string;
  items: OrderItem[];
}

interface OrderStatusTrackerProps {
  currentStatus: OrderStatus;
}

// Simulated progress tracking
const ORDER_STATUSES: OrderStatus[] = ['preparing', 'ready', 'delivering', 'completed'];

function OrderStatusTracker({ currentStatus }: OrderStatusTrackerProps) {
  const statusIndex = ORDER_STATUSES.indexOf(currentStatus);
  
  return (
    <View style={styles.statusTracker}>
      {ORDER_STATUSES.map((status, index) => {
        const isCompleted = index <= statusIndex;
        const isActive = index === statusIndex;
        
        return (
          <View key={status} style={styles.statusStep}>
            <View 
              style={[
                styles.statusDot,
                isCompleted && styles.completedDot,
                isActive && styles.activeDot
              ]}
            >
              {isCompleted && <Check size={12} color="white" />}
            </View>
            
            {index < ORDER_STATUSES.length - 1 && (
              <View 
                style={[
                  styles.statusLine,
                  isCompleted && index < statusIndex && styles.completedLine
                ]} 
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

function StatusLabel({ status }: { status: OrderStatus }) {
  const { t } = useTranslation();
  
  const getStatusInfo = () => {
    switch(status) {
      case 'preparing':
        return {
          title: t('en preparacion'),
          description: t('descripcion de preparacion'),
          icon: Clock,
          color: '#FF8C42'
        };
      case 'ready':
        return {
          title: t('listo'),
          description: t('descripcion de listo'),
          icon: Check,
          color: '#33A95B'
        };
      case 'delivering':
        return {
          title: t('enviado'),
          description: t('descripcion de enviado'),
          icon: MapPin,
          color: '#2B80FF'
        };
      case 'completed':
        return {
          title: t('completado'),
          description: t('descripcion de completado'),
          icon: Check,
          color: '#33A95B'
        };
      default:
        return {
          title: status,
          description: '',
          icon: Clock,
          color: '#666666'
        };
    }
  };
  
  const { title, description, icon: Icon, color } = getStatusInfo();
  
  return (
    <View style={styles.statusLabel}>
      <View style={[styles.statusIconContainer, { backgroundColor: `${color}20` }]}>
        <Icon size={24} color={color} />
      </View>
      <View style={styles.statusTextContainer}>
        <Text style={[styles.statusTitle, { color }]}>{title}</Text>
        <Text style={styles.statusDescription}>{description}</Text>
      </View>
    </View>
  );
}

export default function OrderTrackingScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  
  // In a real app, we would fetch the order details from an API
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Simulate order status changes for demo purposes
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('preparing');
  
  useEffect(() => {
    // Simulate fetching order details
    const fetchedOrder = mockOrders.find(o => o.id.toString() === id);
    
    if (fetchedOrder && isValidOrderStatus(fetchedOrder.status)) {
      setOrder({
        ...fetchedOrder,
        status: fetchedOrder.status as OrderStatus
      });
      setCurrentStatus(fetchedOrder.status as OrderStatus);
    }
    
    setLoading(false);
    
    // Simulate status updates for demo purposes
    const interval = setInterval(() => {
      setCurrentStatus(prev => {
        const currentIndex = ORDER_STATUSES.indexOf(prev);
        if (currentIndex < ORDER_STATUSES.length - 1) {
          return ORDER_STATUSES[currentIndex + 1];
        }
        return prev;
      });
    }, 20000); // Change status every 20 seconds
    
    return () => clearInterval(interval);
  }, [id]);
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{t('cargando')}</Text>
      </View>
    );
  }
  
  if (!order) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t('no se encontró el pedido')}</Text>
        <TouchableOpacity 
          style={styles.backToOrdersButton}
          onPress={() => router.push('/orders')}
        >
          <Text style={styles.backToOrdersText}>{t('volver a pedidos')}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Format the order time
  const orderTime = new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const estimatedDeliveryTime = new Date(new Date(order.date).getTime() + 45 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('Pedido')}</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.orderInfoCard}>
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.orderNumber}>#{order.id}</Text>
              <Text style={styles.orderDate}>{orderTime} • {order.items.length} {t('artículos')}</Text>
            </View>
            <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.restaurantInfo}>
            <Image source={{ uri: order.restaurantImage }} style={styles.restaurantImage} />
            <View style={styles.restaurantDetails}>
              <Text style={styles.restaurantName}>{order.restaurantName}</Text>
              <View style={styles.restaurantLocation}>
                <MapPin size={14} color="#666" />
                <Text style={styles.locationText}>1.8km {t('ubicación')}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.timeEstimate}>
            <View style={styles.timeItem}>
              <Text style={styles.timeLabel}>{t('hora del pedido')}</Text>
              <Text style={styles.timeValue}>{orderTime}</Text>
            </View>
            <View style={styles.timeArrow}>
              <ArrowLeft size={16} color="#999" style={{ transform: [{ rotate: '180deg' }] }} />
            </View>
            <View style={styles.timeItem}>
              <Text style={styles.timeLabel}>{t('hora de entrega')}</Text>
              <Text style={styles.timeValue}>{estimatedDeliveryTime}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>{t('estado')}</Text>
          <OrderStatusTracker currentStatus={currentStatus} />
          <StatusLabel status={currentStatus} />
        </View>
        
        {currentStatus === 'delivering' && (
          <View style={styles.courierSection}>
            <Text style={styles.sectionTitle}>{t('repartidor')}</Text>
            <View style={styles.courierCard}>
              <View style={styles.courierInfo}>
                <Image 
                  source={{ uri: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }} 
                  style={styles.courierImage}
                />
                <View style={styles.courierDetails}>
                  <Text style={styles.courierName}>Carlos Rodriguez</Text>
                  <Text style={styles.courierStatus}>{t('repartidor en camino')}</Text>
                </View>
              </View>
              
              <View style={styles.courierActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Phone size={20} color="#E85D04" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <MessageCircle size={20} color="#E85D04" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        
        <View style={styles.orderDetailsSection}>
          <Text style={styles.sectionTitle}>{t('detalles del pedido')}</Text>
          <View style={styles.orderCard}>
            {order.items.map((item, index) => (
              <View key={index} style={styles.orderItem}>
                <View style={styles.itemQuantity}>
                  <Text style={styles.quantityText}>{item.quantity}x</Text>
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  {item.notes && <Text style={styles.itemNotes}>{item.notes}</Text>}
                </View>
                <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
            
            <View style={styles.divider} />
            
            <View style={styles.orderSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t('subtotal')}</Text>
                <Text style={styles.summaryValue}>${(order.total - 4.49).toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t('deliveryFee')}</Text>
                <Text style={styles.summaryValue}>$2.99</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t('serviceFee')}</Text>
                <Text style={styles.summaryValue}>$1.50</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>{t('total')}</Text>
                <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </View>
        
        {currentStatus !== 'completed' && currentStatus !== 'cancelled' && (
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>{t('orden cancelada')}</Text>
          </TouchableOpacity>
        )}
        
        {currentStatus === 'completed' && (
          <TouchableOpacity 
            style={styles.rateButton}
            onPress={() => router.push(`/review/${order.id}`)}
          >
            <Text style={styles.rateButtonText}>{t('calificar pedido')}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
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
    padding: 16,
  },
  orderInfoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E85D04',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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
  timeEstimate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeItem: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timeArrow: {
    padding: 8,
  },
  statusSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  statusTracker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  statusStep: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  completedDot: {
    backgroundColor: '#33A95B',
  },
  activeDot: {
    borderWidth: 3,
    borderColor: '#33A95B',
  },
  statusLine: {
    height: 2,
    backgroundColor: '#E0E0E0',
    flex: 1,
  },
  completedLine: {
    backgroundColor: '#33A95B',
  },
  statusLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 14,
    color: '#666',
  },
  courierSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  courierCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courierInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courierImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  courierDetails: {
    marginLeft: 12,
  },
  courierName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  courierStatus: {
    fontSize: 14,
    color: '#33A95B',
  },
  courierActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF0E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#FFE0CC',
  },
  orderDetailsSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderCard: {
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  orderItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemQuantity: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E85D04',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  itemNotes: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  orderSummary: {
    padding: 12,
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
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E85D04',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#E53935',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  cancelButtonText: {
    color: '#E53935',
    fontSize: 16,
    fontWeight: '600',
  },
  rateButton: {
    backgroundColor: '#E85D04',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  rateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  backToOrdersButton: {
    backgroundColor: '#E85D04',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backToOrdersText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});