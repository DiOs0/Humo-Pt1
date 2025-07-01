import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function ProfileDetailsScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/login/fotoperfil.png")}
        style={styles.profileImage}
      />
      <Text style={styles.profileName}>Jhon Laverde</Text>
      <Text style={styles.profileEmail}>laverdejohn@hotmail.com</Text>
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
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 24,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
  },
});
