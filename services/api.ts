// API Configuration and methods for backend communication

// Change this to your XAMPP local IP or localhost
// For local development: http://localhost or http://127.0.0.1
// For physical devices: use your computer's IP address (e.g., http://192.168.x.x)
const API_BASE_URL = 'http://192.168.1.60/notes-app-backend/backend/api';

// Timeout for requests (in milliseconds)
const REQUEST_TIMEOUT = 10000;

export interface Note {
  id: string;
  title: string;
  category: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Generic API fetch wrapper with timeout
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Get all notes from backend
 */
export async function getAllNotes(): Promise<Note[]> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/get-all-notes.php`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ApiResponse<Note[]> = await response.json();
    
    if (data.success) {
      return data.data || [];
    } else {
      throw new Error(data.error || 'Failed to fetch notes');
    }
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
}

/**
 * Get a note by ID
 */
export async function getNoteById(id: string): Promise<Note | null> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/get-note.php?id=${encodeURIComponent(id)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ApiResponse<Note> = await response.json();
    
    if (data.success && data.data) {
      return data.data;
    } else if (response.status === 404) {
      return null;
    } else {
      throw new Error(data.error || 'Failed to fetch note');
    }
  } catch (error) {
    console.error('Error fetching note:', error);
    throw error;
  }
}

/**
 * Create a new note
 */
export async function createNote(note: Note): Promise<void> {
  try {
    const url = `${API_BASE_URL}/create-note.php`;
    console.log('Creating note with URL:', url);
    console.log('Note data:', note);
    
    const response = await fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: note.id,
        title: note.title,
        category: note.category,
        content: note.content,
      }),
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('HTTP error response:', errorText);
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }
    
    const data: ApiResponse<any> = await response.json();
    console.log('Response data:', data);
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to create note - unknown error');
    }
    
    console.log('Note created successfully:', note.id);
  } catch (error: any) {
    console.error('Error creating note:', error);
    const errorMessage = error.message || 'Unknown error occurred';
    throw new Error(`Failed to add note: ${errorMessage}`);
  }
}

/**
 * Update an existing note
 */
export async function updateNote(id: string, updates: Partial<Note>): Promise<void> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/update-note.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        ...updates,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ApiResponse<any> = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to update note');
    }
    
    console.log('Note updated successfully:', id);
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
}

/**
 * Delete a note
 */
export async function deleteNote(id: string): Promise<void> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/delete-note.php`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ApiResponse<any> = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to delete note');
    }
    
    console.log('Note deleted successfully:', id);
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
}

/**
 * Search notes by query
 */
export async function searchNotes(query: string): Promise<Note[]> {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/search-notes.php?q=${encodeURIComponent(query)}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ApiResponse<Note[]> = await response.json();
    
    if (data.success) {
      return data.data || [];
    } else {
      throw new Error(data.error || 'Failed to search notes');
    }
  } catch (error) {
    console.error('Error searching notes:', error);
    throw error;
  }
}
