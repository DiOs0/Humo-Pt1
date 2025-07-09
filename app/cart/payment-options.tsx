import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, DollarSign, Shield } from 'lucide-react-native';

export default function PaymentOptionsScreen() {
  const router = useRouter();

  const handleCreditCard = () => {
    router.push('/cart/credit-card' as any);
  };

  const handleCash = () => {
    router.push('/cart');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Método de Pago</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.securityBadge}>
          <Shield size={24} color="#4CAF50" />
          <Text style={styles.securityText}>Pago Seguro y Protegido</Text>
        </View>

        <TouchableOpacity style={styles.paymentOption} onPress={handleCreditCard}>
          <View style={styles.optionContent}>
            <CreditCard size={24} color="#4CAF50" />
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Tarjeta de Crédito/Débito</Text>
              <Text style={styles.optionDescription}>Paga de forma segura con tu tarjeta</Text>
            </View>
          </View>
          <Text style={styles.arrowRight}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.paymentOption} onPress={handleCash}>
          <View style={styles.optionContent}>
            <DollarSign size={24} color="#4CAF50" />
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Efectivo</Text>
              <Text style={styles.optionDescription}>Paga al recibir tu pedido</Text>
            </View>
          </View>
          <Text style={styles.arrowRight}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 16,
  },
  content: {
    padding: 16,
    flex: 1,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
  },
  securityText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    justifyContent: 'space-between',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionText: {
    marginLeft: 16,
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  arrowRight: {
    fontSize: 24,
    color: '#666',
    marginLeft: 16,
  },
});
