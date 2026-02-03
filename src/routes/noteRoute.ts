import express from 'express';
import { CreateNote, GetAllNotes, SearchNotes, UpdateNote } from '../controllers/noteControllers.js';
const app = express.Router();

app.get('/notes',GetAllNotes)
app.post('/notes',CreateNote)
app.put('/notes/:id',UpdateNote)

app.get("/notes/search", SearchNotes);

export default app;