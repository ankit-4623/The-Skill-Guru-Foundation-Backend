import TryCatch from "../config/TryCatch.js";
import { redisClient } from "../index.js";
import { NoteModel } from "../models/notemodel.js";

// Create a new note
export const CreateNote = TryCatch(async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }
  if (typeof title !== "string" || typeof content !== "string") {
    return res
      .status(400)
      .json({ message: "Title and content must be strings" });
  }
  if (title === "" || content === "") {
    return res
      .status(400)
      .json({ message: "Title and content cannot be empty strings" });
  }
  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();
  const noteRateLimitKey = `note:create:${req.ip}`;
  const notecountLimit = await redisClient.get(noteRateLimitKey);
    if (notecountLimit && parseInt(notecountLimit) >= 5) {
      return res.status(429).json({ message: "Rate limit exceeded" });
    }
    await redisClient.set(noteRateLimitKey, notecountLimit ? (parseInt(notecountLimit) + 1).toString() : "1", { EX: 60 });
    

  const newNote = { title: trimmedTitle, content: trimmedContent };
  await NoteModel.create(newNote);
  res.status(201).json({ message: "Note created", note: newNote });
});

// Get all notes
export const GetAllNotes = TryCatch(async (req, res) => {
  const allNotes = await NoteModel.find().sort({ createdAt: -1 });
  res.status(200).json({ notes: allNotes });
});

// Update a note
export const UpdateNote = TryCatch(async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (title === "" || content === "") {
    return res
      .status(400)
      .json({ message: "Title and content cannot be empty strings" });
  }

  const note = await NoteModel.findById(id);
  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  if (note.title === title || note.content === content) {
    return res.status(200).json({ message: "No changes detected", note });
  }

   const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  const updatedNote = await NoteModel.findByIdAndUpdate(
    id,
    { title: trimmedTitle, content: trimmedContent },
    { new: true },
  );
  if (!updatedNote) {
    return res.status(404).json({ message: "Note not found" });
  }
  res.status(200).json({ message: "Note updated", note: updatedNote });
});

// Search notes by title or content
export const SearchNotes = TryCatch(async (req, res) => {
  const search = req.query.q as string;
  if (!search || search.trim() === "") {
    return res
      .status(400)
      .json({ message: "Search query cannot be empty" });
  }
  const query = search.trim()
  const regex = new RegExp(query as string, "i");

  const notes = await NoteModel.find({
    $or: [{ title: regex }, { content: regex }],
  });
  res.status(200).json({ notes });
});
