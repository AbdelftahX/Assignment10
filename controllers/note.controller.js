const Note = require('../models/note.model');
const mongoose = require('mongoose');

// 1. Create a Single Note
exports.createNote = async (req, res) => {
    try {
        const userId = req.headers.userid;
        const { title, content } = req.body;
        await Note.create({ title, content, userId });
        res.json({ message: "Note created" });
    } catch (error) {
        res.json({ message: "Error", error: error.message });
    }
};

// 2. Update a single Note
exports.updateNote = async (req, res) => {
    try {
        const userId = req.headers.userid;
        const { noteId } = req.params;

        const note = await Note.findById(noteId);
        if (!note) return res.json({ message: "Note not found" });
        if (note.userId.toString() !== userId) return res.json({ message: "You are not the owner" });

        const updatedNote = await Note.findByIdAndUpdate(noteId, req.body, { new: true });
        res.json({ message: "updated", note: updatedNote });
    } catch (error) {
        res.json({ message: "Error", error: error.message });
    }
};

// 3. Replace the entire note
exports.replaceNote = async (req, res) => {
    try {
        const userId = req.headers.userid;
        const { noteId } = req.params;

        const note = await Note.findById(noteId);
        if (!note) return res.json({ message: "Note not found" });
        if (note.userId.toString() !== userId) return res.json({ message: "You are not the owner" });

        const replacedNote = await Note.findOneAndReplace({ _id: noteId }, { ...req.body, userId }, { new: true });
        res.json(replacedNote);
    } catch (error) {
        res.json({ message: "Error", error: error.message });
    }
};

// 4. Update title of all notes for logged-in user
exports.updateAllTitles = async (req, res) => {
    try {
        const userId = req.headers.userid;
        const { title } = req.body;
        
        const result = await Note.updateMany({ userId }, { title });
        if (result.matchedCount === 0) return res.json({ message: "No note found" });
        res.json({ message: "All notes updated" });
    } catch (error) {
        res.json({ message: "Error", error: error.message });
    }
};

// 5. Delete a single Note
exports.deleteNote = async (req, res) => {
    try {
        const userId = req.headers.userid;
        const { noteId } = req.params;

        const note = await Note.findById(noteId);
        if (!note) return res.json({ message: "Note not found" });
        if (note.userId.toString() !== userId) return res.json({ message: "You are not the owner" });

        await Note.findByIdAndDelete(noteId);
        res.json({ message: "deleted", note });
    } catch (error) {
        res.json({ message: "Error", error: error.message });
    }
};

// 6. Paginated list sorted by createdAt
exports.paginateNotes = async (req, res) => {
    try {
        const userId = req.headers.userid;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const skip = (page - 1) * limit;

        const notes = await Note.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit);
        res.json(notes);
    } catch (error) {
        res.json({ message: "Error", error: error.message });
    }
};

// 7. Get note by id
exports.getNoteById = async (req, res) => {
    try {
        const userId = req.headers.userid;
        const { id } = req.params;

        const note = await Note.findById(id);
        if (!note) return res.json({ message: "Note not found" });
        if (note.userId.toString() !== userId) return res.json({ message: "You are not the owner" });

        res.json(note);
    } catch (error) {
        res.json({ message: "Error", error: error.message });
    }
};

// 8. Get note by content
exports.getNoteByContent = async (req, res) => {
    try {
        const userId = req.headers.userid;
        const { content } = req.query;

        const notes = await Note.find({ userId, content });
        if (notes.length === 0) return res.json({ message: "No note found" });
        
        res.json(notes);
    } catch (error) {
        res.json({ message: "Error", error: error.message });
    }
};

// 9. Retrieve notes with user info
exports.getNotesWithUser = async (req, res) => {
    try {
        const userId = req.headers.userid;
        const notes = await Note.find({ userId })
            .select('title userId createdAt')
            .populate('userId', 'email -_id');
        res.json(notes);
    } catch (error) {
        res.json({ message: "Error", error: error.message });
    }
};

// 10. Aggregation
exports.aggregateNotes = async (req, res) => {
    try {
        const userId = req.headers.userid;
        const { title } = req.query;

        const notes = await Note.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), title: title } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    userId: 1,
                    createdAt: 1,
                    "user.name": 1,
                    "user.email": 1
                }
            }
        ]);
        res.json(notes);
    } catch (error) {
        res.json({ message: "Error", error: error.message });
    }
};

// 11. Delete all notes
exports.deleteAllNotes = async (req, res) => {
    try {
        const userId = req.headers.userid;
        await Note.deleteMany({ userId });
        res.json({ message: "Deleted" });
    } catch (error) {
        res.json({ message: "Error", error: error.message });
    }
};