import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '@/hooks/useTranslation';
import { Store, User } from 'lucide-react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  const { toggleLanguage, currentLanguage } = useTranslation();

  return (
    <LinearGradient
      colors={['#FF8C42', '#E85D04']}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/5907599/pexels-photo-5907599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }}
          style={styles.logoBackground}
        />
        <View style={styles.logoOverlay}>
          <Text style={styles.logoText}>EasyFood</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.slogan}>Tu comida favorita a un click</Text>
        <Text style={styles.subText}>Apoya a los negocios locales</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.userButton}
            onPress={() => router.push('/auth/login')}
          >
            <User size={24} color="#E85D04" />
            <Text style={styles.userButtonText}>Ingresar como Usuario</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.restaurantButton}
            onPress={() => router.push('/auth/restaurant-login' as any)}
          >
            <Store size={24} color="#fff" />
            <Text style={styles.restaurantButtonText}>Ingresar como Restaurante</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.languageButton}
          onPress={toggleLanguage}
        >
          <Text style={styles.languageButtonText}>
            Cambiar a {currentLanguage === 'en' ? 'Español' : 'English'}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.5,
  },
  logoOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#E85D04',
  },
  contentContainer: {
    flex: 0.5,
    paddingHorizontal: 24,
    paddingBottom: 40,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  slogan: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  subText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  userButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  userButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E85D04',
  },
  restaurantButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  restaurantButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  languageButton: {
    marginTop: 20,
  },
  languageButtonText: {
    color: 'white',
    fontSize: 16,
  },
});