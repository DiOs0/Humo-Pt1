import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Dimensions, Animated, DeviceEventEmitter } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, Lock, Calendar, Hash, DollarSign, Check } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useCart } from '@/contexts/CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createOrder, updateOrderStatus } from '@/utils/database';

const { width } = Dimensions.get('window');

export default function CreditCardScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { clearCart } = useCart();
  const [activeTab, setActiveTab] = useState(0);
  const slideAnim = useState(new Animated.Value(0))[0];
  
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const tabs = [
    { id: 0, title: 'Datos de Tarjeta' },
    { id: 1, title: 'Resumen de Pago' },
  ];

  const handleTabChange = (tabId: number) => {
    Animated.timing(slideAnim, {
      toValue: tabId,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setActiveTab(tabId);
  };

  const formatCardNumber = (text: string) => {
    // Eliminar espacios y caracteres no numéricos
    const numbers = text.replace(/\D/g, '');
    // Formatear con espacios cada 4 dígitos
    const formatted = numbers.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.slice(0, 19); // Máximo 16 dígitos + 3 espacios
  };

  const formatExpiryDate = (text: string) => {
    // Eliminar caracteres no numéricos
    const numbers = text.replace(/\D/g, '');
    // Formatear como MM/YY
    if (numbers.length >= 2) {
      return numbers.slice(0, 2) + '/' + numbers.slice(2, 4);
    }
    return numbers;
  };

  const validateForm = () => {
    const newErrors = {
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
    };

    // Validar número de tarjeta (16 dígitos)
    const cardNumbers = formData.cardNumber.replace(/\s/g, '');
    if (!cardNumbers || cardNumbers.length !== 16) {
      newErrors.cardNumber = 'El número de tarjeta debe tener 16 dígitos';
    }

    // Validar nombre
    if (!formData.cardName.trim()) {
      newErrors.cardName = 'El nombre del titular es requerido';
    }

    // Validar fecha de expiración
    if (!formData.expiryDate || formData.expiryDate.length !== 5) {
      newErrors.expiryDate = 'Fecha de expiración inválida (MM/YY)';
    } else {
      const [month, year] = formData.expiryDate.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Mes inválido';
      } else if (parseInt(year) < currentYear || 
                (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'La tarjeta está vencida';
      }
    }

    // Validar CVV
    if (!formData.cvv || formData.cvv.length !== 3) {
      newErrors.cvv = 'El CVV debe tener 3 dígitos';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  const handleAccept = () => {
    if (validateForm()) {
      handleTabChange(1);
    }
  };

  const handleConfirmPayment = async () => {
    try {
      // Obtener el email del usuario
      const email = await AsyncStorage.getItem('userEmail');
      let userId = '1';
      if (email) {
        const user = await require('@/utils/database').getUserByEmail(email);
        if (user && user.id) userId = user.id;
      }

      // Crear la orden
      const deliveryAddress = 'Dirección de ejemplo';
      const customerName = 'Nombre de ejemplo';
      const customerPhone = '0999999999';
      const orderId = await createOrder(
        userId,
        deliveryAddress,
        customerName,
        customerPhone
      );

      if (orderId) {
        // Limpiar el carrito
        await clearCart();
        
        // Simular procesamiento del pedido
        setTimeout(() => {
          updateOrderStatus(orderId, 'completed');
        }, 15000);

        // Emitir evento para refrescar pedidos
        DeviceEventEmitter.emit('refreshOrders');
        
        // Redirigir a la confirmación
        router.push('/order/confirmation' as any);
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Ocurrió un error al procesar tu pago. Por favor, intenta nuevamente.'
      );
    }
  };

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tab,
            activeTab === tab.id && styles.activeTab
          ]}
          onPress={() => handleTabChange(tab.id)}
        >
          <Text style={[
            styles.tabText,
            activeTab === tab.id && styles.activeTabText
          ]}>
            {tab.title}
          </Text>
        </TouchableOpacity>
      ))}
      <Animated.View
        style={[
          styles.tabIndicator,
          {
            transform: [{
              translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, width / 2]
              })
            }]
          }
        ]}
      />
    </View>
  );

  const renderCardForm = () => (
    <ScrollView style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.field}>
          <Text style={styles.label}>Número de Tarjeta</Text>
          <View style={styles.inputContainer}>
            <CreditCard size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChangeText={(text) => setFormData({ ...formData, cardNumber: formatCardNumber(text) })}
              keyboardType="numeric"
              maxLength={19}
            />
          </View>
          {errors.cardNumber ? <Text style={styles.error}>{errors.cardNumber}</Text> : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Nombre del Titular</Text>
          <View style={styles.inputContainer}>
            <Hash size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="NOMBRE COMO APARECE EN LA TARJETA"
              value={formData.cardName}
              onChangeText={(text) => setFormData({ ...formData, cardName: text.toUpperCase() })}
              autoCapitalize="characters"
            />
          </View>
          {errors.cardName ? <Text style={styles.error}>{errors.cardName}</Text> : null}
        </View>

        <View style={styles.row}>
          <View style={[styles.field, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Fecha de Expiración</Text>
            <View style={styles.inputContainer}>
              <Calendar size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChangeText={(text) => setFormData({ ...formData, expiryDate: formatExpiryDate(text) })}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
            {errors.expiryDate ? <Text style={styles.error}>{errors.expiryDate}</Text> : null}
          </View>

          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>CVV</Text>
            <View style={styles.inputContainer}>
              <Lock size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder="123"
                value={formData.cvv}
                onChangeText={(text) => setFormData({ ...formData, cvv: text })}
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
              />
            </View>
            {errors.cvv ? <Text style={styles.error}>{errors.cvv}</Text> : null}
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleAccept}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderPaymentSummary = () => (
    <ScrollView style={styles.container}>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryHeader}>
          <DollarSign size={24} color="#4CAF50" />
          <Text style={styles.summaryTitle}>Resumen de la Transacción</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Tarjeta</Text>
            <Text style={styles.summaryValue}>•••• {formData.cardNumber.slice(-4)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Titular</Text>
            <Text style={styles.summaryValue}>{formData.cardName}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total a Pagar</Text>
            <Text style={styles.summaryValue}>$25.99</Text>
          </View>
        </View>

        <View style={styles.securityNote}>
          <Lock size={20} color="#666" />
          <Text style={styles.securityText}>
            Tu pago está protegido con encriptación de grado bancario
          </Text>
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPayment}>
          <Check size={20} color="#FFF" />
          <Text style={styles.confirmButtonText}>Confirmar Pago</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => {
            if (activeTab === 1) {
              handleTabChange(0);
            } else {
              router.push('/cart/payment-options' as any);
            }
          }} 
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pago con Tarjeta</Text>
      </View>
      {renderTabs()}
      {activeTab === 0 ? renderCardForm() : renderPaymentSummary()}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: width / 2,
    height: 2,
    backgroundColor: '#4CAF50',
  },
  container: {
    flex: 1,
  },
  cardContainer: {
    padding: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  error: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  summaryContainer: {
    padding: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 12,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  securityText: {
    marginLeft: 12,
    color: '#666',
    flex: 1,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
