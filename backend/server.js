const express = require("express")
const mongoose = require('mongoose')
const { GoogleGenerativeAI } = require("@google/generative-ai")
// const { connectToServer } = require('./db');
const cors = require("cors")
const app = express()
const PORT = process.env.port || 5000

app.use(cors());
app.use(express.json());
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


const noteSchema = new mongoose.Schema({
    title: String,
    content: String
},{
  timestamps : true
});

const Note = mongoose.model('Note',noteSchema)

app.post('/api/notes',async (req,res)=>{
  try{
    const {title , content} = req.body;
    const newNote = new Note({ title , content});
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error){
    res.status(400).json({message: error.message});
  }
})

app.get('/api/notes' , async (req , res)=>{
    try{
      const notes = await Note.find();
      res.status(200).json(notes);
    } catch(error){
        res.status(500).json({message : error.message});
    }
});

app.put('/api/notes/:id', async (req, res)=>{
  try{
    const{id} = req.params;
    const{title,content} = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      id, {title ,content} , {new : true}
    );

    if(!updatedNote) return res.status(404).json({message:"note not found"})
    res.status(200).json(updatedNote);

    } catch(error){
      res.status(400).json({message:error.message});
  }
})

app.delete("/api/notes/:id" , async (req , res)=>{
  try {
    const {id} = req.params;
    const deletedNote =await Note.findByIdAndDelete(id);

    if(!deletedNote) return res.status(404).json({message:"Note not found"})
    res.status(200).json({message :"Note deleted successfully"})
  } catch(error){
    res.status(500).json({message: error.message});
  }
});

// --- NEW GEMINI API ROUTE ---
app.post('/api/generate-note', async (req, res) => {
  try {
    // Get the prompt from the user's request
    const { prompt } = req.body;

    // Get the generative model
    // --- THIS IS THE NEW, CORRECT LINE ---
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

    // Generate the content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Send the generated text back to the front-end
    res.status(200).json({ generatedText: text });

  } catch (error) {
    console.error("Error with Gemini API:", error);
    res.status(500).json({ message: "Failed to generate note" });
  }
});

app.listen(PORT ,()=>{
  console.log(`Server is running on port ${PORT}`)
})





// connectToServer(function (err) {
//   if (err) {
//     console.error(err);
//     process.exit();
//   }

//   app.listen(port, () => {
//     console.log(`Server is running on port: ${port}`);
//   });
// });