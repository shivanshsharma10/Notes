import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

const BLANK_NOTE = { title: '', content: '' };

function App() {
  const API_URL = 'https://my-note-api-chd3.onrender.com/api/notes';

  // --- EXISTING STATE ---
  const [notes, setNotes] = useState([]); 
  const [activeNote, setActiveNote] = useState(BLANK_NOTE);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  // --- NEW STATE FOR GEMINI FEATURE ---
  const [geminiPrompt, setGeminiPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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

  // --- 2. THEME TOGGLE ---
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // --- 3. SIDEBAR CLICK HANDLERS ---
  const handleNewNoteClick = () => {
    setActiveNote(BLANK_NOTE); 
  };

  const handleSelectNote = (note) => {
    setActiveNote(note); 
  };

  // --- 4. MAIN CONTENT FORM HANDLERS ---
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

  // --- 5. NEW GEMINI FEATURE HANDLERS ---
  
  // This is a placeholder. It just simulates a 2-second API call.
  const handleGenerateNote = async () => {
    if (!geminiPrompt) return; // Don't run if prompt is empty

    setIsGenerating(true);
    setGeneratedText('');

    // --- TODO: LATER WE WILL REPLACE THIS WITH THE REAL API CALL ---
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate loading
    const simulatedResponse = `This is a generated note about: "${geminiPrompt}". We will replace this with real Gemini output later.`;
    setGeneratedText(simulatedResponse);
    // --- END OF SIMULATION ---

    setIsGenerating(false);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generatedText);
    alert('Copied to clipboard!');
  };

  // --- 6. RENDER THE APP ---
  return (
    <div className={`app-container ${theme}`}>
      
      {/* --- SIDEBAR (Left) --- */}
      <div className="sidebar">
        <h1 className="app-title">LovesNotes</h1>
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
        
        {/* --- NEW GEMINI SECTION --- */}
        <div className="gemini-section">
          <h3 className="sidebar-heading">Generate Note</h3>
          <textarea
            className="gemini-prompt"
            placeholder="Enter a prompt for Gemini..."
            value={geminiPrompt}
            onChange={(e) => setGeminiPrompt(e.target.value)}
          />
          <button className="gemini-btn" onClick={handleGenerateNote} disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>
          
          {/* Output area for generated text */}
          {generatedText && (
            <div className="generated-text-container">
              <pre>{generatedText}</pre>
              <button className="copy-btn" onClick={handleCopyText}>Copy</button>
            </div>
          )}
        </div>
        {/* --- END OF NEW GEMINI SECTION --- */}
        
      </div>

      {/* --- MAIN CONTENT (Right) --- */}
      <div className="main-content">
        <div className="main-content-header">
          <div className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Night' : '☀️ Day'}
          </div>
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