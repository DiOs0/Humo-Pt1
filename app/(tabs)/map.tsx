import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { mockRestaurants } from '../../data/mockData';
import { geocodeAddress } from '../../utils/geocode';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');

interface MarkerType {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

export default function MapTestScreen() {
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchMarkers() {
      try {
        const results = await Promise.all(
          mockRestaurants.map(async (rest) => {
            try {
              const coords = await geocodeAddress(rest.address);
              return {
                id: Number(rest.id), // Asegura que el id sea number
                name: rest.name,
                lat: coords.lat,
                lng: coords.lng,
              };
            } catch (e) {
              console.error(`Error geocodificando ${rest.name}:`, e);
              return null;
            }
          })
        );
        if (!isMounted) return;
        const validMarkers = results.filter(Boolean) as MarkerType[];
        setMarkers(validMarkers);
        if (validMarkers.length === 0) {
          setError('No se pudieron cargar las ubicaciones de los restaurantes');
        }
      } catch (e) {
        if (isMounted) {
          console.error('Error cargando marcadores:', e);
          setError('Error al cargar el mapa');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    fetchMarkers();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E85D04" />
        <Text style={styles.loadingText}>Cargando mapa...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Centrar en Quito o el primer marcador
  const initialRegion = {
    latitude: markers.length > 0 ? markers[0].lat : -0.1807,
    longitude: markers.length > 0 ? markers[0].lng : -78.4678,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapWebView}
        initialRegion={initialRegion}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.lat, longitude: marker.lng }}
            title={marker.name}
          />
        ))}
      </MapView>
      {/* <Text style={styles.title}>Restaurantes encontrados:</Text>
      {markers.map((marker) => (
        <View key={marker.id} style={styles.markerBox}>
          <Text style={styles.markerTitle}>{marker.name}</Text>
          <Text style={styles.markerCoords}>
            Lat: {marker.lat}, Lng: {marker.lng}
          </Text>
        </View>
      ))} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#fff',
    paddingVertical: 0,
  },
  mapWebView: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 0,
    marginBottom: 0,
    backgroundColor: '#eee',
    overflow: 'hidden',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#E85D04',
  },
  markerBox: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    width: width - 40,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  markerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  markerCoords: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#E85D04',
    textAlign: 'center',
    marginHorizontal: 32,
  },
});