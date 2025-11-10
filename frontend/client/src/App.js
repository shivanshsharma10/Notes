import React, {useEffect, useState} from "react";
import axios from 'axios';

const API_URL = 'https://my-note-api-chd3.onrender.com/api/notes'

function App(){
const [notes, setNotes] = useState([]);

const [newNote, setNewNote] = useState({title: '', content: ''})

const [editingNote, setEditingNote] = useState(null);

useEffect(()=>{
  const fetchNotes = async () =>{
    try{
      const response = await axios.get(API_URL)
      setNotes(response.data)
    } catch(error){
      console.error('Error fetching notes :', error)
    }
  }

  fetchNotes();
},[])

const handleSubmit = async (e) => { // <-- MODIFIED
    e.preventDefault(); 
    
    if (editingNote) {
      // If we are editing, call the update function
      await handleUpdateNote(); // <-- MODIFIED
    } else {
      // Otherwise, call the create function (original logic)
      try {
        const response = await axios.post(API_URL, newNote);
        setNotes([...notes, response.data]);
        setNewNote({ title: '', content: '' });
      } catch (error) {
        console.error('Error creating note:', error);
      }
    }
  };

const handleDeleteNote = async (id) =>{
  try{
    await axios.delete(`${API_URL}/${id}`)
    const updatedNotes = notes.filter(note => note._id !== id);
    setNotes(updatedNotes);
  } catch(error){
    console.error('error deleting the note:' , error)
  }
}

// --- 2. NEW FUNCTION ---
  // This function will load a note's data into the form for editing
  const handleEditClick = (note) => { // <-- NEW
    setEditingNote(note); // Set the note we're editing
    setNewNote({ title: note.title, content: note.content }); // Load its data into the form
  };

  // --- 3. NEW FUNCTION ---
  // This function will handle the "Cancel" button click
  const handleCancelEdit = () => { // <-- NEW
    setEditingNote(null); // Clear the editing state
    setNewNote({ title: '', content: '' }); // Clear the form
  };

  // --- 4. NEW FUNCTION ---
  // This function handles the actual API call for updating a note
  const handleUpdateNote = async () => { // <-- NEW
    try {
      const response = await axios.put(`${API_URL}/${editingNote._id}`, newNote);
      // Update the notes list in state by replacing the old note with the new one
      const updatedNotes = notes.map(note =>
        note._id === editingNote._id ? response.data : note
      );
      setNotes(updatedNotes);
      
      // Reset the form and editing state
      handleCancelEdit();
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };


const handleInputChange = (e)=>{
  const {name, value} = e.target;
  setNewNote({...newNote, [name]:value})
}

return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>My Notes App</h1>

      {/* --- Form now calls handleSubmit --- */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        
        {/* --- Title changes based on editing state --- */}
        <h3>{editingNote ? 'Edit Note' : 'Add a New Note'}</h3> {/* <-- MODIFIED */}
        
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newNote.title}
          onChange={handleInputChange}
          required
          style={{ display: 'block', width: '300px', marginBottom: '10px', padding: '5px' }}
        />
        <textarea
          name="content"
          placeholder="Content"
          value={newNote.content}
          onChange={handleInputChange}
          required
          style={{ display: 'block', width: '300px', height: '100px', marginBottom: '10px', padding: '5px' }}
        />
        
        {/* --- Button text changes --- */}
        <button type="submit" style={{ padding: '5px 10px' }}>
          {editingNote ? 'Update Note' : 'Save Note'} {/* <-- MODIFIED */}
        </button>
        
        {/* --- New "Cancel" button --- */}
        {editingNote && ( // <-- NEW
          <button 
            type="button" 
            onClick={handleCancelEdit} 
            style={{ marginLeft: '10px', padding: '5px 10px' }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* --- Notes List --- */}
      <div>
        <h2>Your Notes</h2>
        {notes.length === 0 ? (
          <p>No notes found. Add one!</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {notes.map((note) => (
              <div key={note._id} style={{ border: '1.5px solid black', borderRadius: '5px', padding: '15px', width: '250px' }}>
                <h3 style={{ marginTop: 0 }}>{note.title}</h3>
                <p>{note.content}</p>
                
                {/* --- New "Edit" Button --- */}
                <button // <-- NEW
                  onClick={() => handleEditClick(note)}
                  style={{ backgroundColor: '#4d94ff', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', marginRight: '5px' }}
                >
                  Edit
                </button>
                
                <button 
                  onClick={() => handleDeleteNote(note._id)}
                  style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


export default App;