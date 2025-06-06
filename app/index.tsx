import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '@/hooks/useTranslation';

export default function WelcomeScreen() {
  const router = useRouter();
  const { t, toggleLanguage, currentLanguage } = useTranslation();

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
        <Text style={styles.slogan}>{t('welcome.slogan')}</Text>
        <Text style={styles.subText}>{t('welcome.supportLocal')}</Text>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push('/auth/login')}
        >
          <Text style={styles.startButtonText}>{t('welcome.getStarted')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.languageButton}
          onPress={toggleLanguage}
        >
          <Text style={styles.languageButtonText}>
            {t('welcome.switchTo')} {currentLanguage === 'en' ? 'Español' : 'English'}
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
  startButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E85D04',
  },
  languageButton: {
    padding: 16,
  },
  languageButtonText: {
    fontSize: 16,
    color: 'white',
    textDecorationLine: 'underline',
  },
});