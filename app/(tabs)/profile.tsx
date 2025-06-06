import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Switch, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut, ChevronRight, Bell, CreditCard, Globe, HelpCircle, Settings, ShieldCheck, User2 } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';

function ProfileMenuItem({ icon, title, subtitle, onPress, showToggle = false, toggleValue = false, onToggleChange = null }) {
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
  const { t, toggleLanguage, currentLanguage } = useTranslation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isVendorMode, setIsVendorMode] = useState(false);

  const switchToVendorMode = () => {
    setIsVendorMode(true);
    router.push('/vendor/dashboard');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('profile.title')}</Text>
      </View>

      <ScrollView>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileEmail}>john.doe@example.com</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>{t('profile.edit')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>{t('profile.account')}</Text>
        </View>

        <View style={styles.menuSection}>
          <ProfileMenuItem
            icon={User2}
            title={t('profile.personalInfo')}
            onPress={() => console.log('Personal Info')}
          />
          
          <ProfileMenuItem
            icon={CreditCard}
            title={t('profile.paymentMethods')}
            subtitle={t('profile.addPaymentMethod')}
            onPress={() => console.log('Payment Methods')}
          />
          
          <ProfileMenuItem
            icon={Bell}
            title={t('profile.notifications')}
            showToggle={true}
            toggleValue={notificationsEnabled}
            onToggleChange={setNotificationsEnabled}
          />
        </View>

        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>{t('profile.preferences')}</Text>
        </View>

        <View style={styles.menuSection}>
          <ProfileMenuItem
            icon={Globe}
            title={t('profile.language')}
            subtitle={currentLanguage === 'en' ? 'English' : 'Español'}
            onPress={toggleLanguage}
          />
          
          <ProfileMenuItem
            icon={ShieldCheck}
            title={t('profile.privacy')}
            onPress={() => console.log('Privacy')}
          />
        </View>

        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>{t('profile.support')}</Text>
        </View>

        <View style={styles.menuSection}>
          <ProfileMenuItem
            icon={HelpCircle}
            title={t('profile.help')}
            onPress={() => console.log('Help')}
          />
          
          <ProfileMenuItem
            icon={Settings}
            title={t('profile.settings')}
            onPress={() => console.log('Settings')}
          />
        </View>

        <View style={styles.vendorSection}>
          <Text style={styles.vendorTitle}>{t('profile.areYouVendor')}</Text>
          <Text style={styles.vendorSubtitle}>{t('profile.vendorSubtitle')}</Text>
          <TouchableOpacity 
            style={styles.vendorButton}
            onPress={switchToVendorMode}
          >
            <Text style={styles.vendorButtonText}>{t('profile.switchToVendor')}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => router.push('/auth/login')}
        >
          <LogOut size={20} color="#E53935" />
          <Text style={styles.logoutText}>{t('profile.logout')}</Text>
        </TouchableOpacity>

        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>EasyFood v1.0.0</Text>
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