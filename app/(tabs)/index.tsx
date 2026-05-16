import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Link, Stack } from 'expo-router'; // Import Stack

import { initDatabase } from "../../lib/database";

export default function Home() {
  useEffect(() => {
    try {
      initDatabase();
    } catch (error) {
      Alert.alert("Database Error", "Failed to initialize database");
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* --- HEADER CONFIGURATION --- */}
      <Stack.Screen 
        options={{
          title: "Home",
          headerStyle: { backgroundColor: '#FF80AB' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerShown: true, // Set to false if you want a custom View header instead
        }} 
      />

      <Text style={styles.emoji}>✨</Text>
      <Text style={styles.title}>Notes ni Larisya</Text>
      
      <Link href="/task" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Open sesame 📖</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#FFF5F8' 
  },
  emoji: { fontSize: 60, marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#D81B60', marginBottom: 30 },
  button: { backgroundColor: '#FF80AB', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 25 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '600' }
});