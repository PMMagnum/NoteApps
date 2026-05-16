import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { updateNote } from '../lib/database';

export default function Details() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const [title, setTitle] = useState((params.title as string) || '');
  const [category, setCategory] = useState((params.category as string) || '');
  const [noteContent, setNoteContent] = useState((params.content as string) || '');

  const handleUpdate = async () => {
    try {
      if (title.trim().length < 3) throw new Error("Title needs at least 3 characters! ✨");
      if (noteContent.trim().length === 0) throw new Error("Content can't be empty! 📝");

      // Save changes to local database
      updateNote(params.id as string, {
        title: title,
        category: category,
        content: noteContent,
      });

      Alert.alert("Success!", "Note updated 💖");
      router.back();
      
    } catch (err: any) {
      Alert.alert("Wait a sec!", err.message);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Category</Text>
      <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="e.g., Personal" />
      
      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Note Title" />

      <Text style={styles.label}>Content</Text>
      <TextInput 
        style={[styles.input, { height: 180, paddingTop: 18 }]} 
        value={noteContent} 
        onChangeText={setNoteContent} 
        multiline 
        textAlignVertical="top" 
      />

      <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
        <Text style={styles.updateText}>Save Changes 💖</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: '#FFF5F8' },
  label: { fontSize: 13, color: '#D81B60', fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: '#FFF', padding: 18, borderRadius: 18, fontSize: 16, borderColor: '#FFD1DC', borderWidth: 1.5, marginBottom: 20, color: '#444' },
  updateBtn: { backgroundColor: '#FF80AB', padding: 20, borderRadius: 30, alignItems: 'center', elevation: 4 },
  updateText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 }
});