import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";

export type Note = {
  id: string;
  title: string;
  category: string;
  content: string;
  created_at?: string;
  updated_at?: string;
};
const WEB_STORAGE_KEY = "notes_app_data";

function webGetNotes(): Note[] {
  try {
    const raw = localStorage.getItem(WEB_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function webSaveNotes(notes: Note[]): void {
  localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(notes));
}
function webAddNote(title: string, category: string, content: string): string {
  const notes = webGetNotes();
  const now = new Date().toISOString();
  const id = Math.random().toString(36).substr(2, 9);
  notes.unshift({
    id,
    title,
    category,
    content,
    created_at: now,
    updated_at: now,
  });
  webSaveNotes(notes);
  return id;
}

function webUpdateNote(
  id: string,
  updates: { title?: string; category?: string; content?: string },
): void {
  const notes = webGetNotes().map((n) =>
    n.id === id
      ? { ...n, ...updates, updated_at: new Date().toISOString() }
      : n,
  );
  webSaveNotes(notes);
}

function webDeleteNote(id: string): void {
  webSaveNotes(webGetNotes().filter((n) => n.id !== id));
}

function webGetNoteById(id: string): Note | null {
  return webGetNotes().find((n) => n.id === id) ?? null;
}

// ─── Native SQLite ─────────────────────────────────────────────────────────────

let db: SQLite.SQLiteDatabase | null = null;

function getDB() {
  if (!db) throw new Error("Database not initialized");
  return db;
}

// ─── Unified init ──────────────────────────────────────────────────────────────

export function initDatabase() {
  if (Platform.OS === "web") {
    console.log("Web platform: using localStorage fallback");
    return;
  }
  try {
    db = SQLite.openDatabaseSync("notes.db");
    db.execSync(`
      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Problem initializing the database:", error);
    throw error;
  }
}
export function addNote(
  title: string,
  category: string,
  content: string,
): string {
  if (Platform.OS === "web") return webAddNote(title, category, content);
  try {
    const id = Math.random().toString(36).substr(2, 9);
    getDB().runSync(
      "INSERT INTO notes (id, title, category, content) VALUES (?, ?, ?, ?);",
      [id, title, category, content],
    );
    console.log("Note added successfully:", id);
    return id;
  } catch (error) {
    console.error("Problem adding a note:", error);
    throw error;
  }
}
export function updateNote(
  id: string,
  updates: { title?: string; category?: string; content?: string },
): void {
  if (Platform.OS === "web") return webUpdateNote(id, updates);
  try {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.title !== undefined) {
      fields.push("title = ?");
      values.push(updates.title);
    }
    if (updates.category !== undefined) {
      fields.push("category = ?");
      values.push(updates.category);
    }
    if (updates.content !== undefined) {
      fields.push("content = ?");
      values.push(updates.content);
    }

    if (fields.length === 0) return;

    fields.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id);

    const query = `UPDATE notes SET ${fields.join(", ")} WHERE id = ?`;
    getDB().runSync(query, values);
    console.log("Note updated successfully:", id);
  } catch (error) {
    console.error("Problem updating note:", error);
    throw error;
  }
}
export function deleteNote(id: string): void {
  if (Platform.OS === "web") return webDeleteNote(id);
  try {
    getDB().runSync("DELETE FROM notes WHERE id = ?;", [id]);
    console.log("Note deleted successfully:", id);
  } catch (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
}
export function getNotes(): Note[] {
  if (Platform.OS === "web") return webGetNotes();
  try {
    return getDB().getAllSync<Note>(
      "SELECT * FROM notes ORDER BY updated_at DESC;",
    );
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
}

export function getNoteById(id: string): Note | null {
  if (Platform.OS === "web") return webGetNoteById(id);
  try {
    const result = getDB().getFirstSync<Note>(
      "SELECT * FROM notes WHERE id = ?;",
      [id],
    );
    return result || null;
  } catch (error) {
    console.error("Error fetching note:", error);
    throw error;
  }
}
