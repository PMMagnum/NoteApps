// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert, TextInput } from 'react-native';
// import { useRouter, useFocusEffect } from 'expo-router';
// import { getNotes, deleteNote, updateNote, Note } from '../lib/database'; 

// export default function NotesList() {
//   const [notes, setNotes] = useState<Note[]>([]);
//   const router = useRouter();

//   // Modal Visibility States
//   const [deleteModalVisible, setDeleteModalVisible] = useState(false);
//   const [viewModalVisible, setViewModalVisible] = useState(false);
  
//   // Editing States
//   const [selectedNote, setSelectedNote] = useState<Note | null>(null);
//   const [editTitle, setEditTitle] = useState('');
//   const [editContent, setEditContent] = useState('');
//   const [isEditing, setIsEditing] = useState(false);

//   // Load notes from local database
//   const loadNotes = async () => {
//     try {
//       const dbNotes = getNotes();
//       setNotes(dbNotes);
//     } catch (error) {
//       console.error('Error loading notes:', error);
//     }
//   };

//   useFocusEffect(
//     React.useCallback(() => {
//       loadNotes();
//     }, [])
//   );

//   const openDeleteModal = (id: string) => {
//     const note = notes.find(n => n.id === id);
//     if (note) {
//       setSelectedNote(note);
//       setDeleteModalVisible(true);
//     }
//   };

//   const confirmDelete = async () => {
//     if (selectedNote) {
//       try {
//         deleteNote(selectedNote.id);
//         setNotes(prevNotes => prevNotes.filter(n => n.id !== selectedNote.id));
//         setDeleteModalVisible(false);
//         setSelectedNote(null);
//       } catch (error) {
//         Alert.alert('Error', 'Failed to delete note');
//       }
//     }
//   };

//   const handleViewNote = (item: Note) => {
//     setSelectedNote(item);
//     setEditTitle(item.title);
//     setEditContent(item.content);
//     setIsEditing(false);
//     setViewModalVisible(true);
//   };

//   // CORRECTED UPDATE LOGIC
//   const handleUpdate = () => {
//     if (!selectedNote) return;

//     if (editTitle.trim() === '' || editContent.trim() === '') {
//       Alert.alert('Wait!', 'Title and Content cannot be empty.');
//       return;
//     }

//     try {
//       // Your DB function expects: updateNote(id, { title, content })
//       updateNote(selectedNote.id, {
//         title: editTitle,
//         content: editContent,
//       });

//       // Update the local list so the change is visible immediately
//       setNotes(prevNotes =>
//         prevNotes.map(n =>
//           n.id === selectedNote.id 
//             ? { ...n, title: editTitle, content: editContent } 
//             : n
//         )
//       );

//       setIsEditing(false);
//       setViewModalVisible(false);
//       Alert.alert('Success', 'Note updated! ✨');
//     } catch (error) {
//       console.error('Update Error:', error);
//       Alert.alert('Error', 'Failed to save changes.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* VIEW / EDIT MODAL */}
//       <Modal animationType="slide" transparent={true} visible={viewModalVisible} onRequestClose={() => setViewModalVisible(false)}>
//         <View style={styles.modalOverlay}>
//           <View style={[styles.modalContent, styles.viewModalContent]}>
//             <Text style={styles.viewCategory}>{selectedNote?.category}</Text>
            
//             {isEditing ? (
//               <TextInput 
//                 style={styles.editTitleInput} 
//                 value={editTitle} 
//                 onChangeText={setEditTitle}
//                 placeholder="Title"
//                 autoFocus
//               />
//             ) : (
//               <Text style={styles.viewTitle}>{selectedNote?.title}</Text>
//             )}

//             <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
//               {isEditing ? (
//                 <TextInput 
//                   style={styles.editContentInput} 
//                   value={editContent} 
//                   onChangeText={setEditContent} 
//                   multiline
//                   placeholder="Type your note here..."
//                 />
//               ) : (
//                 <Text style={styles.viewBodyText}>{selectedNote?.content}</Text>
//               )}
//             </ScrollView>

//             <View style={styles.modalButtons}>
//               {isEditing ? (
//                 <>
//                   <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setIsEditing(false)}>
//                     <Text style={styles.cancelBtnText}>Cancel</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={[styles.modalBtn, styles.updateBtn]} onPress={handleUpdate}>
//                     <Text style={styles.updateBtnText}>Update ✨</Text>
//                   </TouchableOpacity>
//                 </>
//               ) : (
//                 <>
//                   <TouchableOpacity style={[styles.modalBtn, styles.editBtn]} onPress={() => setIsEditing(true)}>
//                     <Text style={styles.editBtnText}>Edit ✏️</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={[styles.modalBtn, styles.closeBtn]} onPress={() => setViewModalVisible(false)}>
//                     <Text style={styles.closeBtnText}>Close</Text>
//                   </TouchableOpacity>
//                 </>
//               )}
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* DELETE MODAL */}
//       <Modal animationType="fade" transparent={true} visible={deleteModalVisible} onRequestClose={() => setDeleteModalVisible(false)}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalEmoji}>🥺</Text>
//             <Text style={styles.modalTitle}>Delete Note?</Text>
//             <View style={styles.modalButtons}>
//               <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setDeleteModalVisible(false)}>
//                 <Text style={styles.cancelBtnText}>No</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={[styles.modalBtn, styles.deleteBtn]} onPress={confirmDelete}>
//                 <Text style={styles.deleteBtnText}>Yes</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       <FlatList
//         data={notes}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={{ paddingBottom: 100 }}
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             <TouchableOpacity style={styles.infoContainer} onPress={() => handleViewNote(item)}>
//               <Text style={styles.cardTitle}>{item.title}</Text>
//               <Text style={styles.cardTag}>{item.category}</Text>
//               <Text numberOfLines={1} style={styles.cardPreview}>{item.content}</Text>
//             </TouchableOpacity>
//             <View style={styles.actions}>
//               <TouchableOpacity style={styles.actionButton} onPress={() => openDeleteModal(item.id)}>
//                 <Text style={styles.iconText}>🗑️</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}
//       />
      
//       <TouchableOpacity style={styles.fab} onPress={() => router.push("/add")}>
//         <Text style={styles.fabText}>+</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: '#FFF5F8' },
//   card: { backgroundColor: '#FFF', padding: 15, borderRadius: 15, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderLeftWidth: 5, borderLeftColor: '#FF80AB', elevation: 3 },
//   infoContainer: { flex: 1 },
//   cardTitle: { fontSize: 16, fontWeight: '600', color: '#444' },
//   cardTag: { fontSize: 11, color: '#FF80AB', marginTop: 2, fontWeight: 'bold' },
//   cardPreview: { fontSize: 13, color: '#888', marginTop: 5, fontStyle: 'italic' },
//   actions: { flexDirection: 'row', alignItems: 'center' },
//   actionButton: { padding: 10, marginLeft: 10, backgroundColor: '#FFF0F5', borderRadius: 12 },
//   iconText: { fontSize: 20 },
//   fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: '#FF80AB', width: 65, height: 65, borderRadius: 32.5, justifyContent: 'center', alignItems: 'center', elevation: 8 },
//   fabText: { fontSize: 35, color: 'white', marginTop: -4 },
  
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
//   modalContent: { width: '85%', backgroundColor: 'white', borderRadius: 25, padding: 25, alignItems: 'center' },
//   viewModalContent: { maxHeight: '80%', alignItems: 'flex-start' },
//   viewCategory: { fontSize: 12, color: '#FF80AB', fontWeight: 'bold', marginBottom: 5 },
//   viewTitle: { fontSize: 22, fontWeight: 'bold', color: '#444', marginBottom: 10 },
//   editTitleInput: { fontSize: 22, fontWeight: 'bold', color: '#444', width: '100%', borderBottomWidth: 1, borderBottomColor: '#FFD1DC', marginBottom: 10, paddingVertical: 5 },
//   contentScroll: { width: '100%', marginBottom: 20 },
//   viewBodyText: { fontSize: 16, color: '#555', lineHeight: 24 },
//   editContentInput: { fontSize: 16, color: '#555', lineHeight: 24, textAlignVertical: 'top', minHeight: 150, width: '100%' },
  
//   modalButtons: { flexDirection: 'row', width: '100%', gap: 10 },
//   modalBtn: { flex: 1, paddingVertical: 12, borderRadius: 15, alignItems: 'center' },
//   cancelBtn: { backgroundColor: '#F0F0F0' },
//   cancelBtnText: { color: '#666', fontWeight: 'bold' },
//   updateBtn: { backgroundColor: '#FF80AB' },
//   updateBtnText: { color: 'white', fontWeight: 'bold' },
//   editBtn: { backgroundColor: '#FFF0F5', borderWidth: 1, borderColor: '#FF80AB' },
//   editBtnText: { color: '#FF80AB', fontWeight: 'bold' },
//   closeBtn: { backgroundColor: '#F0F0F0' },
//   closeBtnText: { color: '#666', fontWeight: 'bold' },
//   deleteBtn: { backgroundColor: '#FF80AB' },
//   deleteBtnText: { color: 'white', fontWeight: 'bold' },
//   modalEmoji: { fontSize: 40, marginBottom: 10 },
//   modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#D81B60', marginBottom: 10 },
// });