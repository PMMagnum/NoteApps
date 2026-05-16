import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { addNote } from '../lib/database';

export default function AddNote() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState(''); 
  const router = useRouter();

  const handleSave = async () => {
    try {
      if (!title || !category || !content) {
        throw new Error("Please fill in all fields to save your memory! ✨");
      }

      // Save note to local database
      console.log('Saving note...');
      addNote(title, category, content);

      console.log('Note saved successfully!');
      Alert.alert("Success! 🎉", "Note added", [
        { text: "OK", onPress: async () => {
          // Clear form
          setTitle('');
          setCategory('');
          setContent('');
          
          // Navigate back to notes
          setTimeout(() => {
            router.dismissAll();
            router.push('/task');
          }, 100);
        }}
      ]);

    } catch (err: any) {
      console.error('Save error:', err);
      Alert.alert("Oops ❌", err.message || "Failed to add note.");
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Category</Text>
      <TextInput 
        style={styles.input} 
        placeholder="e.g., Personal, School, Work" 
        value={category} 
        onChangeText={setCategory} 
        placeholderTextColor="#CCAABB"
      />

      <Text style={styles.label}>Title</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Give your note a name..." 
        value={title} 
        onChangeText={setTitle} 
        placeholderTextColor="#CCAABB"
      />

      <Text style={styles.label}>Note Content</Text>
      <TextInput 
        style={[styles.input, styles.contentInput]} 
        placeholder="Write your heart out here... 📝" 
        value={content} 
        onChangeText={setContent} 
        multiline={true}
        textAlignVertical="top"
        placeholderTextColor="#CCAABB"
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Add to Notes 🎀</Text>
      </TouchableOpacity>
      
      <View style={{ height: 40 }} /> 
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF5F8' },
  label: { color: '#D81B60', fontSize: 14, fontWeight: 'bold', marginBottom: 5, marginLeft: 5, textTransform: 'uppercase' },
  input: { backgroundColor: '#FFF', padding: 15, borderRadius: 15, marginBottom: 20, fontSize: 16, color: '#444', borderWidth: 1, borderColor: '#FFD1DC' },
  contentInput: { height: 150, paddingTop: 15 },
  button: { backgroundColor: '#FF80AB', padding: 18, borderRadius: 25, alignItems: 'center', elevation: 5, marginTop: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 18 }
});