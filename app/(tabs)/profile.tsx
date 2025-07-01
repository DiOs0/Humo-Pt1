import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Switch, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut, ChevronRight, Bell, CreditCard, Globe, HelpCircle, Settings, ShieldCheck, User2, Store } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';

interface ProfileMenuItemProps {
  icon: any;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showToggle?: boolean;
  toggleValue?: boolean;
  onToggleChange?: (value: boolean) => void;
}

function ProfileMenuItem({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  showToggle = false, 
  toggleValue = false, 
  onToggleChange 
}: ProfileMenuItemProps) {
  const IconComponent = icon;
  
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIconContainer}>
        <IconComponent size={20} color="#666" />
      </View>
      
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      
      {showToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggleChange}
          trackColor={{ false: '#D9D9D9', true: '#FFD166' }}
          thumbColor={toggleValue ? '#E85D04' : '#F4F4F4'}
        />
      ) : (
        <ChevronRight size={20} color="#CCC" />
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { toggleLanguage, currentLanguage } = useTranslation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isVendorMode, setIsVendorMode] = useState(false);

  const switchToVendorMode = () => {
    setIsVendorMode(true);
    router.push('/vendor/dashboard');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
      </View>

      <ScrollView>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Jhon Laverde</Text>
            <Text style={styles.profileEmail}>laverdejohn@hotmail.com</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Cuenta</Text>
        </View>

        <View style={styles.menuSection}>
          <ProfileMenuItem
            icon={User2}
            title="Información Personal"
            subtitle="Gestiona tus datos personales"
            onPress={() => console.log('Personal Info')}
          />
          
          <ProfileMenuItem
            icon={CreditCard}
            title="Métodos de Pago"
            subtitle="Agregar o editar formas de pago"
            onPress={() => console.log('Payment Methods')}
          />

          <ProfileMenuItem
            icon={Bell}
            title="Notificaciones"
            subtitle="Configurar alertas y avisos"
            showToggle
            toggleValue={notificationsEnabled}
            onToggleChange={setNotificationsEnabled}
            onPress={() => console.log('Notifications')}
          />
        </View>

        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Preferencias</Text>
        </View>

        <View style={styles.menuSection}>
          <ProfileMenuItem
            icon={Settings}
            title="Configuración"
            subtitle="Personaliza tu experiencia"
            onPress={() => console.log('Settings')}
          />

          <ProfileMenuItem
            icon={Globe}
            title="Idioma"
            subtitle={currentLanguage === 'es' ? 'Español' : 'English'}
            onPress={toggleLanguage}
          />

          <ProfileMenuItem
            icon={ShieldCheck}
            title="Privacidad y Seguridad"
            subtitle="Gestiona tu privacidad"
            onPress={() => console.log('Privacy')}
          />
        </View>

        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Ayuda y Soporte</Text>
        </View>

        <View style={styles.menuSection}>
          <ProfileMenuItem
            icon={HelpCircle}
            title="Centro de Ayuda"
            subtitle="Preguntas frecuentes y soporte"
            onPress={() => console.log('Help Center')}
          />

          <ProfileMenuItem
            icon={Store}
            title="Modo Restaurante"
            subtitle="¿Tienes un restaurante? Administra tu negocio"
            onPress={switchToVendorMode}
          />
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => router.push('/auth/login')}
        >
          <LogOut size={20} color="#E53935" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
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
  profileSection: {
    backgroundColor: 'white',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  editButton: {
    backgroundColor: '#FFF0E6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE0CC',
  },
  editButtonText: {
    color: '#E85D04',
    fontWeight: '500',
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  menuSection: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    color: '#333',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  vendorSection: {
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
    marginTop: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  vendorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  vendorSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  vendorButton: {
    backgroundColor: '#E85D04',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  vendorButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  logoutText: {
    color: '#E53935',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  versionInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
});