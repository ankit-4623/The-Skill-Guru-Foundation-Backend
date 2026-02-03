import mongoose from 'mongoose';

export interface INote {
    _id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

const noteSchema = new mongoose.Schema<INote>({
    title: { type: String, required: true },
    content: { type: String, required: true },
}, {
    timestamps: true
});

export const NoteModel = mongoose.model<INote>('Note', noteSchema);