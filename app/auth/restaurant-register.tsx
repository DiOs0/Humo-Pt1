import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, ImageIcon, Plus } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

interface RestaurantImage {
  uri: string;
  type: string;
  name: string;
}

export default function RestaurantRegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    restaurantName: '',
    responsableName: '',
    email: '',
    phone: '',
    address: '',
    ruc: '',
  });
  const [images, setImages] = useState<RestaurantImage[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Se necesita permiso para acceder a la galería');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newImage = {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: `restaurant_photo_${Date.now()}.jpg`,
        };
        setImages(prev => [...prev, newImage]);
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // Aquí iría la lógica para enviar los datos al servidor
    console.log('Datos del formulario:', { ...formData, images });
    router.push('/vendor/dashboard');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Registro de Restaurante</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre del Restaurante</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese el nombre del restaurante"
              value={formData.restaurantName}
              onChangeText={(value) => handleInputChange('restaurantName', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre del Responsable</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre completo del responsable"
              value={formData.responsableName}
              onChangeText={(value) => handleInputChange('responsableName', value)}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo Electrónico Empresarial</Text>
            <TextInput
              style={styles.input}
              placeholder="ejemplo@restaurante.com"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono de Contacto</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese el número de teléfono"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dirección del Local</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ingrese la dirección completa"
              value={formData.address}
              onChangeText={(value) => handleInputChange('address', value)}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>RUC</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese el RUC"
              value={formData.ruc}
              onChangeText={(value) => handleInputChange('ruc', value)}
              keyboardType="numeric"
              maxLength={13}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fotos del Local</Text>
            <View style={styles.imageGrid}>
              {images.map((image, index) => (                <View key={index} style={styles.imageContainer}>
                  <Image 
                    source={{ uri: image.uri }} 
                    style={styles.imagePreview} 
                    accessibilityLabel="Foto del restaurante"
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                    accessibilityLabel="Eliminar foto"
                  >
                    <Text style={styles.removeImageText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {images.length < 5 && (
                <TouchableOpacity 
                  style={styles.addImageButton}
                  onPress={pickImage}
                  accessibilityLabel="Agregar foto del restaurante"
                >
                  <View style={styles.addImageContent}>
                    <Plus size={24} color="#666" />
                    <Text style={styles.addImageText}>Agregar foto</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Registrar Restaurante</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  addImageContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E1E1E1',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageText: {
    color: '#666',
    marginTop: 4,
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: '#E85D04',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
