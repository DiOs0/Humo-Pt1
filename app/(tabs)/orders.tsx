import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, Clock } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { mockOrders } from '@/data/mockData';

function OrderStatusIndicator({ status }) {
  const getStatusColor = () => {
    switch (status) {
      case 'preparing':
        return '#FF8C42';
      case 'ready':
        return '#33A95B';
      case 'delivering':
        return '#2B80FF';
      case 'completed':
        return '#666666';
      case 'cancelled':
        return '#E53935';
      default:
        return '#666666';
    }
  };

  const getStatusText = (status) => {
    const { t } = useTranslation();
    switch (status) {
      case 'preparing':
        return t('orders.statusPreparing');
      case 'ready':
        return t('orders.statusReady');
      case 'delivering':
        return t('orders.statusDelivering');
      case 'completed':
        return t('orders.statusCompleted');
      case 'cancelled':
        return t('orders.statusCancelled');
      default:
        return status;
    }
  };

  return (
    <View style={[styles.statusIndicator, { backgroundColor: `${getStatusColor()}20` }]}>
      <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
      <Text style={[styles.statusText, { color: getStatusColor() }]}>
        {getStatusText(status)}
      </Text>
    </View>
  );
}

function OrderItem({ order, onPress }) {
  const { t } = useTranslation();
  const formattedDate = new Date(order.date).toLocaleDateString();
  const formattedTime = new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <TouchableOpacity style={styles.orderItem} onPress={onPress}>
      <View style={styles.orderHeader}>
        <Image source={{ uri: order.restaurantImage }} style={styles.restaurantImage} />
        <View style={styles.orderInfo}>
          <Text style={styles.restaurantName}>{order.restaurantName}</Text>
          <Text style={styles.orderDate}>
            <Clock size={12} color="#666" /> {formattedDate} {formattedTime}
          </Text>
        </View>
        <OrderStatusIndicator status={order.status} />
      </View>
      
      <View style={styles.orderSummary}>
        <Text style={styles.orderItems}>
          {order.items.map(item => item.name).join(', ')}
        </Text>
        <Text style={styles.orderTotal}>
          ${order.total.toFixed(2)}
        </Text>
      </View>
      
      <View style={styles.orderFooter}>
        <Text style={styles.orderId}>
          {t('orders.orderID')}: #{order.id}
        </Text>
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsText}>{t('orders.details')}</Text>
          <ArrowRight size={16} color="#E85D04" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function OrdersScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('active');

  const activeOrders = mockOrders.filter(order => 
    ['preparing', 'ready', 'delivering'].includes(order.status)
  );
  
  const pastOrders = mockOrders.filter(order => 
    ['completed', 'cancelled'].includes(order.status)
  );

  const displayOrders = activeTab === 'active' ? activeOrders : pastOrders;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('orders.title')}</Text>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text 
            style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}
          >
            {t('orders.active')} ({activeOrders.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text 
            style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}
          >
            {t('orders.past')}
          </Text>
        </TouchableOpacity>
      </View>

      {displayOrders.length > 0 ? (
        <FlatList
          data={displayOrders}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <OrderItem 
              order={item} 
              onPress={() => router.push(`/order/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.ordersList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/8964968/pexels-photo-8964968.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyTitle}>
            {activeTab === 'active' 
              ? t('orders.noActiveOrders') 
              : t('orders.noPastOrders')}
          </Text>
          <Text style={styles.emptySubtitle}>
            {activeTab === 'active' 
              ? t('orders.browseRestaurants') 
              : t('orders.orderHistory')}
          </Text>
          {activeTab === 'active' && (
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => router.push('/')}
            >
              <Text style={styles.browseButtonText}>{t('orders.browse')}</Text>
            </TouchableOpacity>
          )}
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
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tab: {
    paddingVertical: 12,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#E85D04',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    fontWeight: '600',
    color: '#E85D04',
  },
  ordersList: {
    padding: 16,
  },
  orderItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  restaurantImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  orderInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    height: 24,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  orderItems: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 16,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  orderId: {
    fontSize: 12,
    color: '#999',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsText: {
    fontSize: 14,
    color: '#E85D04',
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
    opacity: 0.8,
    borderRadius: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
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