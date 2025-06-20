import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowUpRight, ChevronRight, DollarSign, Package, ShoppingBag, Star, TrendingUp, Users } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { mockOrders, mockProducts } from '@/data/mockData';

interface StatCardProps {
  icon: any;
  title: string;
  value: string;
  trend: string;
  trendValue: number;
}

// Componente simulación de gráfico (en una app real, usaríamos una librería de gráficos)
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
        <Text style={styles.chartLabel}>Lun</Text>
        <Text style={styles.chartLabel}>Mar</Text>
        <Text style={styles.chartLabel}>Mié</Text>
        <Text style={styles.chartLabel}>Jue</Text>
        <Text style={styles.chartLabel}>Vie</Text>
        <Text style={styles.chartLabel}>Sáb</Text>
        <Text style={styles.chartLabel}>Dom</Text>
      </View>
    </View>
  );
}

function StatCard({ icon, title, value, trend, trendValue }: StatCardProps) {
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
          size={16}
          color={isPositiveTrend ? '#33A95B' : '#E53935'}
          style={{ transform: [{ rotate: isPositiveTrend ? '0deg' : '90deg' }] }}
        />
        <Text style={[
          styles.trendText,
          { color: isPositiveTrend ? '#33A95B' : '#E53935' }
        ]}>
          {trend}
        </Text>
      </View>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      
      <View style={[
        styles.trendContainer,
        { backgroundColor: isPositiveTrend ? '#E6F7EF' : '#FDEEEE' }
      ]}>
        <ArrowUpRight 
          size={16} 
          color={isPositiveTrend ? '#33A95B' : '#E53935'} 
          style={{ transform: [{ rotate: isPositiveTrend ? '0deg' : '90deg' }] }}
        />
        <Text style={[
          styles.trendText,
          { color: isPositiveTrend ? '#33A95B' : '#E53935' }
        ]}>
          {trend}
        </Text>
      </View>
    </View>
  );
}

export default function VendorDashboard() {
  const router = useRouter();
  const orderStats = {
    total: mockOrders.length,
    pending: mockOrders.filter(o => o.status === 'preparing').length,
    completed: mockOrders.filter(o => o.status === 'completed').length
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>¡Bienvenido de vuelta!</Text>
          <Text style={styles.restaurantName}>Burger Palace</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.switchText}>Volver a Cliente</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          icon={DollarSign}
          title="Ventas del Día"
          value="$1,458.50"
          trend="↑ 12% vs ayer"
          trendValue={12}
        />
        <StatCard
          icon={ShoppingBag}
          title="Pedidos Nuevos"
          value={orderStats.pending.toString()}
          trend="↑ 8% vs ayer"
          trendValue={8}
        />
        <StatCard
          icon={Package}
          title="Pedidos Completados"
          value={orderStats.completed.toString()}
          trend="↓ 5% vs ayer"
          trendValue={-5}
        />
        <StatCard
          icon={Star}
          title="Calificación"
          value="4.8"
          trend="↑ 0.2 vs mes anterior"
          trendValue={0.2}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Resumen de Ventas</Text>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>Ver Detalles</Text>
            <ChevronRight size={16} color="#666" />
          </TouchableOpacity>
        </View>
        <Chart />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pedidos Activos</Text>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>Ver Todos</Text>
            <ChevronRight size={16} color="#666" />
          </TouchableOpacity>
        </View>
        
        {mockOrders
          .filter(order => ['preparing', 'ready', 'delivering'].includes(order.status))
          .slice(0, 3)
          .map(order => (
            <TouchableOpacity key={order.id} style={styles.orderCard}>
              <View style={styles.orderInfo}>
                <Text style={styles.orderNumber}>Pedido #{order.id}</Text>
                <Text style={styles.orderItems}>
                  {order.items.map(item => item.name).join(', ')}
                </Text>
                <Text style={styles.orderCustomer}>{order.customerName}</Text>
              </View>
              <View style={styles.orderStatus}>
                <Text style={[
                  styles.statusText,
                  { color: order.status === 'preparing' ? '#FF8C42' : '#33A95B' }
                ]}>
                  {order.status === 'preparing' ? 'Preparando' : 'Listo'}
                </Text>
                <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
              </View>
            </TouchableOpacity>
          ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Menú</Text>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>Editar Menú</Text>
            <ChevronRight size={16} color="#666" />
          </TouchableOpacity>
        </View>
        
        {mockProducts.slice(0, 3).map(product => (
          <TouchableOpacity key={product.id} style={styles.menuItem}>
            <Image source={{ uri: product.image }} style={styles.menuItemImage} />
            <View style={styles.menuItemInfo}>
              <Text style={styles.menuItemName}>{product.name}</Text>
              <Text style={styles.menuItemDescription}>{`${product.category} • ${product.available ? 'Disponible' : 'No disponible'}`}</Text>
              <Text style={styles.menuItemPrice}>${product.price.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
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
  welcomeText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E85D04',
  },
  switchText: {
    fontSize: 14,
    color: '#666',
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
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderInfo: {
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  orderItems: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  orderCustomer: {
    fontSize: 12,
    color: '#666',
  },
  orderStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  menuItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  menuItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  menuItemDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  menuItemPrice: {
    fontSize: 14,
    color: '#E85D04',
    fontWeight: '500',
    marginTop: 4,
  },
});