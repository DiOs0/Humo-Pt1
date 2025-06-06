import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { X, Navigation, Star } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { mockRestaurants } from '@/data/mockData';

// Mock component to simulate a map since we can't use real maps in this context
function MapView({ onSelectMarker }) {
  return (
    <View style={styles.mapContainer}>
      <Image
        source={{ uri: 'https://images.pexels.com/photos/4312800/pexels-photo-4312800.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }}
        style={styles.mapImage}
      />
      {mockRestaurants.slice(0, 5).map((restaurant, index) => (
        <TouchableOpacity
          key={restaurant.id}
          style={[
            styles.mapMarker,
            { 
              top: 100 + (index * 60),
              left: 50 + (index * 50) 
            }
          ]}
          onPress={() => onSelectMarker(restaurant)}
        >
          <View style={styles.markerInner}>
            <Text style={styles.markerText}>{restaurant.name.charAt(0)}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function MapScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const handleMarkerSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleCloseCard = () => {
    setSelectedRestaurant(null);
  };

  const handleNavigate = (restaurant) => {
    // In a real app, this would integrate with a maps application
    console.log(`Navigating to ${restaurant.name}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('map.title')}</Text>
        <Text style={styles.headerSubtitle}>{t('map.subtitle')}</Text>
      </View>

      <MapView onSelectMarker={handleMarkerSelect} />

      {selectedRestaurant && (
        <View style={styles.restaurantCardContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={handleCloseCard}
          >
            <X size={20} color="#666" />
          </TouchableOpacity>

          <View style={styles.restaurantCard}>
            <Image
              source={{ uri: selectedRestaurant.image }}
              style={styles.restaurantImage}
            />
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{selectedRestaurant.name}</Text>
              <View style={styles.ratingContainer}>
                <Star size={16} color="#FFD700" fill="#FFD700" />
                <Text style={styles.ratingText}>{selectedRestaurant.rating}</Text>
                <Text style={styles.reviewCount}>({selectedRestaurant.reviewCount})</Text>
              </View>
              <Text style={styles.distance}>{selectedRestaurant.distance}km {t('map.away')}</Text>

              <View style={styles.cardActions}>
                <TouchableOpacity 
                  style={styles.viewButton}
                  onPress={() => router.push(`/restaurant/${selectedRestaurant.id}`)}
                >
                  <Text style={styles.viewButtonText}>{t('map.viewMenu')}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.navigateButton}
                  onPress={() => handleNavigate(selectedRestaurant)}
                >
                  <Navigation size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
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
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapMarker: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E85D04',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E85D04',
  },
  restaurantCardContainer: {
    position: 'absolute',
    bottom: 90,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantCard: {
    flexDirection: 'row',
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  restaurantInfo: {
    flex: 1,
    marginLeft: 16,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  distance: {
    fontSize: 14,
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#FFF0E6',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#FFE0CC',
  },
  viewButtonText: {
    color: '#E85D04',
    fontWeight: '500',
  },
  navigateButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#E85D04',
    justifyContent: 'center',
    alignItems: 'center',
  },
});