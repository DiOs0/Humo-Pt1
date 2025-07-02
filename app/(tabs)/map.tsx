import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, Text, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { mockRestaurants } from '../../data/mockData';
import { geocodeAddress } from '../../utils/geocode';

const { width, height } = Dimensions.get('window');

// Coordenadas de Quito
const INITIAL_REGION = {
  latitude: -0.1807,
  longitude: -78.4678,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

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
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchMarkers() {
      try {
        const results = await Promise.all(
          mockRestaurants.map(async (rest) => {
            try {
              const coords = await geocodeAddress(rest.address);
              return {
                id: rest.id,
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

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        onMapReady={() => {
          if (markers.length > 0) {
            mapRef.current?.fitToElements(true);
          }
        }}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{ 
              latitude: marker.lat, 
              longitude: marker.lng 
            }}
            title={marker.name}
            description="Toca para ver detalles"
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  map: {
    width,
    height,
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