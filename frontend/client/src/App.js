import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Make sure this is imported

// This is a blank note to use for a new note
const BLANK_NOTE = { title: '', content: '' };

function App() {
  const API_URL = 'https://my-note-api-chd3.onrender.com/api/notes';

  // --- STATE ---
  const [notes, setNotes] = useState([]); 
  const [activeNote, setActiveNote] = useState(BLANK_NOTE);

  // --- NEW THEME STATE ---
  // We get the saved theme from localStorage, or default to 'light'
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // --- 1. FETCH ALL NOTES ---
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(API_URL);
        setNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };
    fetchNotes();
  }, []);

  // --- NEW THEME TOGGLE FUNCTION ---
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // Save the user's preference to localStorage
    localStorage.setItem('theme', newTheme);
  };

  // --- 2. SIDEBAR CLICK HANDLERS ---
  const handleNewNoteClick = () => {
    setActiveNote(BLANK_NOTE);
  };

  const handleSelectNote = (note) => {
    setActiveNote(note);
  };

  // --- 3. MAIN CONTENT FORM HANDLERS ---
  const handleNoteChange = (e) => {
    const { name, value } = e.target;
    setActiveNote(prevNote => ({
      ...prevNote,
      [name]: value,
    }));
  };

  const handleSaveNote = async () => {
    if (activeNote._id) {
      // --- UPDATE (PUT) ---
      try {
        const response = await axios.put(`${API_URL}/${activeNote._id}`, {
          title: activeNote.title,
          content: activeNote.content,
        });
        setNotes(prevNotes => 
          prevNotes.map(note => (note._id === activeNote._id ? response.data : note))
        );
      } catch (error) {
        console.error('Error updating note:', error);
      }
    } else {
      // --- CREATE (POST) ---
      try {
        const response = await axios.post(API_URL, {
          title: activeNote.title,
          content: activeNote.content,
        });
        setNotes(prevNotes => [...prevNotes, response.data]);
        setActiveNote(response.data);
      } catch (error) {
        console.error('Error creating note:', error);
      }
    }
  };

  const handleDeleteNote = async () => {
    if (!activeNote._id) return;
    try {
      await axios.delete(`${API_URL}/${activeNote._id}`);
      setNotes(prevNotes => prevNotes.filter(note => note._id !== activeNote._id));
      setActiveNote(BLANK_NOTE);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // --- 4. RENDER THE APP ---
  // --- We add the current 'theme' as a class to the main container ---
  return (
    <div className={`app-container ${theme}`}>
      
      {/* --- SIDEBAR (Left) --- */}
      <div className="sidebar">
        <button className="new-note-btn" onClick={handleNewNoteClick}>
          + New Note
        </button>
        <h2 className="sidebar-heading">Your Notes</h2>
        <ul className="notes-list">
          {notes.map((note) => (
            <li
              key={note._id}
              className="note-list-item"
              onClick={() => handleSelectNote(note)}
            >
              {note.title || 'Untitled Note'}
            </li>
          ))}
        </ul>
      </div>

      {/* --- MAIN CONTENT (Right) --- */}
      <div className="main-content">

        {/* --- NEW THEME TOGGLE BUTTON --- */}
        <div className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Night' : '☀️ Day'}
        </div>
        
        <form className="main-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            name="title"
            placeholder="Note Title"
            value={activeNote.title}
            onChange={handleNoteChange}
          />
          <textarea
            name="content"
            placeholder="Start writing your note..."
            value={activeNote.content}
            onChange={handleNoteChange}
          />
          <div className="action-buttons">
            <button className="save-btn" onClick={handleSaveNote}>
              Save Note
            </button>
            {activeNote._id && (
              <button className="delete-btn" onClick={handleDeleteNote}>
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;