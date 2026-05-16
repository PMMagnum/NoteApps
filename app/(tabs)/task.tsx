import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Ensure this path matches your project structure
import { deleteNote, getNotes, Note, updateNote } from "../../lib/database";

export default function NotesList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const router = useRouter();

  // Modal States
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  // Editing States
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Load notes from local database
  const loadNotes = async () => {
    try {
      const dbNotes = await getNotes();
      setNotes(dbNotes ?? []);
    } catch (error) {
      console.error("Error loading notes:", error);
      setNotes([]);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadNotes();
    }, []),
  );

  const openDeleteModal = (id: any) => {
    const stringId = String(id);
    const note = notes.find((n) => String(n.id) === stringId);
    if (note) {
      setSelectedNote(note);
      setDeleteModalVisible(true);
    }
  };

  const confirmDelete = async () => {
    if (selectedNote) {
      try {
        await deleteNote(selectedNote.id);
        setNotes((prevNotes) =>
          prevNotes.filter((n) => n.id !== selectedNote.id),
        );
        setDeleteModalVisible(false);
        setSelectedNote(null);
      } catch (error) {
        Alert.alert("Error", "Failed to delete note");
      }
    }
  };

  const handleViewNote = (item: Note) => {
    setSelectedNote(item);
    setEditTitle(item.title);
    setEditContent(item.content);
    setEditCategory(item.category || "");
    setIsEditing(false);
    setViewModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!selectedNote) return;
    if (editTitle.trim() === "" || editContent.trim() === "") {
      Alert.alert("Wait!", "Title and Content cannot be empty.");
      return;
    }

    try {
      await updateNote(selectedNote.id, {
        title: editTitle,
        content: editContent,
        category: editCategory,
      });

      setNotes((prevNotes) =>
        prevNotes.map((n) =>
          n.id === selectedNote.id
            ? {
                ...n,
                title: editTitle,
                content: editContent,
                category: editCategory,
              }
            : n,
        ),
      );

      setIsEditing(false);
      setViewModalVisible(false);
      Alert.alert("Success", "Note updated! ✨");
    } catch (error) {
      Alert.alert("Error", "Failed to save changes.");
    }
  };

  return (
    <View style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notes</Text>
        </View>
      </View>

      {/* --- VIEW / EDIT MODAL --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={viewModalVisible}
        onRequestClose={() => setViewModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContent, styles.viewModalContent]}>
            {/* 1. CATEGORY */}
            {isEditing ? (
              <TextInput
                style={styles.editCategoryInput}
                value={editCategory}
                onChangeText={setEditCategory}
                placeholder="Category"
                placeholderTextColor="#FFB7CE"
              />
            ) : (
              <Text style={styles.viewCategory}>
                {selectedNote?.category || "No Category"}
              </Text>
            )}

            {/* 2. TITLE */}
            {isEditing ? (
              <TextInput
                style={styles.editTitleInput}
                value={editTitle}
                onChangeText={setEditTitle}
                placeholder="Title"
              />
            ) : (
              <Text style={styles.viewTitle}>{selectedNote?.title}</Text>
            )}

            {/* 3. CONTENT AREA */}
            <View style={styles.scrollWrapper}>
              {isEditing ? (
                <TextInput
                  style={styles.editContentInput}
                  value={editContent}
                  onChangeText={setEditContent}
                  multiline={true}
                  placeholder="Type your note here..."
                  textAlignVertical="top"
                />
              ) : (
                <ScrollView showsVerticalScrollIndicator={true}>
                  <Text style={styles.viewBodyText}>
                    {selectedNote?.content}
                  </Text>
                </ScrollView>
              )}
            </View>

            {/* ACTIONS */}
            <View style={styles.modalButtons}>
              {isEditing ? (
                <>
                  <TouchableOpacity
                    style={[styles.modalBtn, styles.cancelBtn]}
                    onPress={() => setIsEditing(false)}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalBtn, styles.updateBtn]}
                    onPress={handleUpdate}
                  >
                    <Text style={styles.updateBtnText}>Update ✨</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={[styles.modalBtn, styles.editBtn]}
                    onPress={() => setIsEditing(true)}
                  >
                    <Text style={styles.editBtnText}>Edit ✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalBtn, styles.closeBtn]}
                    onPress={() => setViewModalVisible(false)}
                  >
                    <Text style={styles.closeBtnText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* --- DELETE MODAL --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>🥺</Text>
            <Text style={styles.modalTitle}>Delete Note?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.deleteBtn]}
                onPress={confirmDelete}
              >
                <Text style={styles.deleteBtnText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- NOTES LIST --- */}
      <FlatList
        data={notes}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 150, paddingTop: 10 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.infoContainer}
              onPress={() => handleViewNote(item)}
            >
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardTag}>{item.category}</Text>
              <Text numberOfLines={1} style={styles.cardPreview}>
                {item.content}
              </Text>
            </TouchableOpacity>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => openDeleteModal(item.id)}
              >
                <Text style={styles.iconText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notes yet! 📝</Text>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => router.push("/add")}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: "#FFF5F8" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: { fontSize: 26, fontWeight: "bold", color: "#D81B60" },
  headerSubtitle: { fontSize: 14, color: "#FF80AB", fontWeight: "500" },
  headerEmoji: { fontSize: 30 },

  card: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 5,
    borderLeftColor: "#FF80AB",
    elevation: 3,
  },
  infoContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#444" },
  cardTag: {
    fontSize: 11,
    color: "#FF80AB",
    marginTop: 2,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  cardPreview: {
    fontSize: 13,
    color: "#888",
    marginTop: 5,
    fontStyle: "italic",
  },
  actions: { justifyContent: "center", alignItems: "center" },
  actionButton: {
    padding: 10,
    marginLeft: 10,
    backgroundColor: "#FFF0F5",
    borderRadius: 12,
  },
  iconText: { fontSize: 20 },

  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#FF80AB",
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  fabText: { fontSize: 35, color: "white", marginTop: -4 },
  emptyText: {
    textAlign: "center",
    marginTop: 100,
    color: "#888",
    fontSize: 16,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 25,
    padding: 20,
    maxHeight: "85%",
  },
  viewModalContent: { alignItems: "stretch" },

  viewCategory: {
    fontSize: 12,
    color: "#FF80AB",
    fontWeight: "bold",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  editCategoryInput: {
    fontSize: 14,
    color: "#D81B60",
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#FFD1DC",
    marginBottom: 10,
    paddingVertical: 5,
  },

  viewTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 15,
  },
  editTitleInput: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#444",
    borderBottomWidth: 1,
    borderBottomColor: "#FFD1DC",
    marginBottom: 15,
    paddingVertical: 8,
  },

  scrollWrapper: { flex: 1, marginBottom: 20, minHeight: 150 },
  viewBodyText: { fontSize: 16, color: "#555", lineHeight: 24 },
  editContentInput: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
    flex: 1,
    padding: 10,
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFD1DC",
    textAlignVertical: "top",
  },

  modalButtons: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 15,
    alignItems: "center",
  },
  cancelBtn: { backgroundColor: "#F5F5F5" },
  cancelBtnText: { color: "#888", fontWeight: "bold" },
  updateBtn: { backgroundColor: "#FF80AB" },
  updateBtnText: { color: "white", fontWeight: "bold" },
  editBtn: {
    backgroundColor: "#FFF0F5",
    borderWidth: 1,
    borderColor: "#FF80AB",
  },
  editBtnText: { color: "#FF80AB", fontWeight: "bold" },
  closeBtn: { backgroundColor: "#F5F5F5" },
  closeBtnText: { color: "#888", fontWeight: "bold" },
  deleteBtn: { backgroundColor: "#FF80AB" },
  deleteBtnText: { color: "white", fontWeight: "bold" },
  modalEmoji: { fontSize: 50, textAlign: "center" },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D81B60",
    marginBottom: 20,
    textAlign: "center",
  },
});
