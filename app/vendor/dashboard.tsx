import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowUpRight, ChevronRight, DollarSign, Package, ShoppingBag, Star, TrendingUp, Users } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { mockOrders, mockProducts } from '@/data/mockData';

// Chart component simulation (in a real app, we'd use a real chart library)
function Chart() {
  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartBars}>
        <View style={[styles.chartBar, { height: 60 }]} />
        <View style={[styles.chartBar, { height: 100 }]} />
        <View style={[styles.chartBar, { height: 80 }]} />
        <View style={[styles.chartBar, { height: 120 }]} />
        <View style={[styles.chartBar, { height: 90 }]} />
        <View style={[styles.chartBar, { height: 150 }]} />
        <View style={[styles.chartBar, { height: 110 }]} />
      </View>
      <View style={styles.chartLabels}>
        <Text style={styles.chartLabel}>Mon</Text>
        <Text style={styles.chartLabel}>Tue</Text>
        <Text style={styles.chartLabel}>Wed</Text>
        <Text style={styles.chartLabel}>Thu</Text>
        <Text style={styles.chartLabel}>Fri</Text>
        <Text style={styles.chartLabel}>Sat</Text>
        <Text style={styles.chartLabel}>Sun</Text>
      </View>
    </View>
  );
}

function StatCard({ icon, title, value, trend, trendValue }) {
  const IconComponent = icon;
  const isPositiveTrend = trendValue >= 0;
  
  return (
    <View style={styles.statCard}>
      <View style={styles.statIconContainer}>
        <IconComponent size={20} color="#E85D04" />
      </View>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      
      <View style={[
        styles.trendContainer,
        { backgroundColor: isPositiveTrend ? '#E6F7EF' : '#FDEEEE' }
      ]}>
        <ArrowUpRight 
          size={14} 
          color={isPositiveTrend ? '#33A95B' : '#E53935'} 
          style={{ transform: [{ rotate: isPositiveTrend ? '0deg' : '90deg' }] }}
        />
        <Text 
          style={[
            styles.trendText,
            { color: isPositiveTrend ? '#33A95B' : '#E53935' }
          ]}
        >
          {trendValue}% {trend}
        </Text>
      </View>
    </View>
  );
}

function OrderItem({ order }) {
  const { t } = useTranslation();
  const formattedTime = new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return (
    <TouchableOpacity style={styles.orderItem}>
      <View style={styles.orderItemHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>#{order.id}</Text>
          <Text style={styles.orderTime}>{formattedTime}</Text>
        </View>
        <View style={[
          styles.orderStatus,
          { backgroundColor: order.status === 'preparing' ? '#FFF0E6' : '#E6F7EF' }
        ]}>
          <Text style={[
            styles.orderStatusText,
            { color: order.status === 'preparing' ? '#E85D04' : '#33A95B' }
          ]}>
            {t(`orders.status${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`)}
          </Text>
        </View>
      </View>
      
      <View style={styles.orderItemContent}>
        <Text style={styles.orderItems}>
          {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
        </Text>
        <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
      </View>
      
      <View style={styles.orderItemFooter}>
        <Text style={styles.customerName}>{order.customerName}</Text>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>{t('vendor.viewDetails')}</Text>
          <ChevronRight size={16} color="#E85D04" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function VendorDashboard() {
  const router = useRouter();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('today');
  
  // Filter today's orders
  const todayOrders = mockOrders.filter(order => {
    const orderDate = new Date(order.date);
    const today = new Date();
    return orderDate.getDate() === today.getDate() &&
           orderDate.getMonth() === today.getMonth() &&
           orderDate.getFullYear() === today.getFullYear();
  });

  // Get pending orders
  const pendingOrders = mockOrders.filter(order => 
    ['preparing', 'ready'].includes(order.status)
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{t('vendor.dashboard')}</Text>
          <Text style={styles.headerSubtitle}>{t('vendor.welcomeBack')}</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <Image
            source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          <StatCard 
            icon={DollarSign} 
            title={t('vendor.revenue')} 
            value="$1,248.42" 
            trend={t('vendor.thisWeek')} 
            trendValue={12.5} 
          />
          <StatCard 
            icon={ShoppingBag} 
            title={t('vendor.orders')} 
            value="46" 
            trend={t('vendor.thisWeek')} 
            trendValue={8.2} 
          />
          <StatCard 
            icon={Users} 
            title={t('vendor.customers')} 
            value="23" 
            trend={t('vendor.thisWeek')} 
            trendValue={5.1} 
          />
          <StatCard 
            icon={Star} 
            title={t('vendor.rating')} 
            value="4.8" 
            trend={t('vendor.thisWeek')} 
            trendValue={0.3} 
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('vendor.salesOverview')}</Text>
            <TouchableOpacity onPress={() => router.push('/vendor/statistics')}>
              <Text style={styles.seeAllText}>{t('vendor.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          <Chart />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('vendor.orders')}</Text>
            <View style={styles.tabsContainer}>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'today' && styles.activeTab]}
                onPress={() => setActiveTab('today')}
              >
                <Text 
                  style={[styles.tabText, activeTab === 'today' && styles.activeTabText]}
                >
                  {t('vendor.today')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
                onPress={() => setActiveTab('pending')}
              >
                <Text 
                  style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}
                >
                  {t('vendor.pending')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {(activeTab === 'today' ? todayOrders : pendingOrders).length > 0 ? (
            (activeTab === 'today' ? todayOrders : pendingOrders).map(order => (
              <OrderItem key={order.id} order={order} />
            ))
          ) : (
            <View style={styles.emptyOrders}>
              <Text style={styles.emptyOrdersText}>
                {activeTab === 'today' 
                  ? t('vendor.noOrdersToday') 
                  : t('vendor.noPendingOrders')}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('vendor.topProducts')}</Text>
            <TouchableOpacity onPress={() => router.push('/vendor/products')}>
              <Text style={styles.seeAllText}>{t('vendor.manageProducts')}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.productsContainer}>
            {mockProducts.slice(0, 3).map(product => (
              <View key={product.id} style={styles.productItem}>
                <Image source={{ uri: product.image }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
                </View>
                <View style={styles.productSales}>
                  <Package size={16} color="#666" />
                  <Text style={styles.productSalesText}>{product.sales} {t('vendor.sold')}</Text>
                </View>
              </View>
            ))}

            <TouchableOpacity 
              style={styles.addProductButton}
              onPress={() => router.push('/vendor/products/new')}
            >
              <Text style={styles.addProductText}>{t('vendor.addNewProduct')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/vendor/statistics')}
          >
            <TrendingUp size={20} color="#E85D04" />
            <Text style={styles.actionText}>{t('vendor.viewStats')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/vendor/profile')}
          >
            <Users size={20} color="#E85D04" />
            <Text style={styles.actionText}>{t('vendor.editProfile')}</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
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
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FFF0E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#E85D04',
  },
  chartContainer: {
    height: 200,
    marginBottom: 8,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flex: 1,
    paddingBottom: 8,
  },
  chartBar: {
    width: 24,
    backgroundColor: '#FFD166',
    borderRadius: 4,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartLabel: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    width: 24,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#FFF0E6',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
  },
  activeTabText: {
    color: '#E85D04',
    fontWeight: '500',
  },
  orderItem: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  orderItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  orderTime: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  orderStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  orderItemContent: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 8,
    marginBottom: 8,
  },
  orderItems: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  orderItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customerName: {
    fontSize: 14,
    color: '#666',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 14,
    color: '#E85D04',
  },
  emptyOrders: {
    padding: 16,
    alignItems: 'center',
  },
  emptyOrdersText: {
    fontSize: 14,
    color: '#666',
  },
  productsContainer: {
    marginBottom: 8,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  productImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  productSales: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productSalesText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  addProductButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  addProductText: {
    fontSize: 14,
    color: '#E85D04',
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#FFE0CC',
  },
  actionText: {
    fontSize: 14,
    color: '#E85D04',
    fontWeight: '500',
    marginLeft: 8,
  },
});