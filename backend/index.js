require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");

mongoose
  .connect(config.connectionString)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

const User = require("./models/user.model");
const Note = require("./models/note.model");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({ data: "Hello World" });
});

//Create User
app.post("/create-user", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = new User({ fullName, email, password });
  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "360000s",
  });

  return res.json({
    error: false,
    user,
    accessToken,
    message: "User created successfully",
  });
});

//Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const userInfo = await User.findOne({ email });

  if (!userInfo) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  if (userInfo.password !== password) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // Exclude password from token and response
  const userPayload = {
    id: userInfo._id,
    email: userInfo.email,
    fullName: userInfo.fullName,
  };

  const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "360000s",
  });

  return res.json({
    error: false,
    message: "Login successful",
    user: userPayload,
    accessToken,
  });
});

//Get User
app.get("/get-user", authenticateToken, async (req, res) => {
  const user = req.user;

  try {
    const isUser = await User.findOne({ _id: user.id });

    if (!isUser) {
      return res.status(401).json({ 
        error: true, 
        message: "User not found" 
      });
    }

    return res.json({
      error: false,
      user: {
        fullName: isUser.fullName,
        email: isUser.email,
        createdOn: isUser.createdOn,
      },
      message: "User fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});

//Add Note
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const user = req.user;

  if (!title) {
    return res.status(400).json({ error: true, message: "Title is required" });
  }

  if (!content) {
    return res
      .status(400)
      .json({ error: true, message: "Content is required" });
  }

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: user.id.toString(),
    });

    await note.save();

    return res.json({
      error: false,
      message: "Note added successfully",
      note,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});

//Edit Note
app.put("/edit-note/:id", authenticateToken, async (req, res) => {
  const noteId = req.params.id?.trim();
  const { title, content, tags, isPinned } = req.body;
  const user = req.user;

  console.log(
    "Received noteId:",
    noteId,
    "Type:",
    typeof noteId,
    "Length:",
    noteId?.length
  );

  // Validate ObjectId format
  if (!noteId || !mongoose.Types.ObjectId.isValid(noteId)) {
    console.log("Invalid noteId:", noteId);
    return res
      .status(400)
      .json({ error: true, message: "Invalid note id.", receivedId: noteId });
  }

  // Require at least one field to update
  if (
    !title &&
    !content &&
    typeof tags === "undefined" &&
    typeof isPinned === "undefined"
  ) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided." });
  }

  try {
    // Ensure userId is a string to match database format
    const userIdString = String(user.id);

    const note = await Note.findOne({
      _id: new mongoose.Types.ObjectId(noteId),
      userId: userIdString,
    });

    if (!note) {
      return res.status(404).json({
        error: true,
        message:
          "Note not found or you don't have permission to edit this note.",
      });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (typeof tags !== "undefined") note.tags = tags; // allow clearing tags with []
    if (typeof isPinned !== "undefined") note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully.",
    });
  } catch (error) {
    console.error("Error updating note:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ error: true, message: "Invalid note id." });
    }

    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

//Get All Notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {
  const user = req.user;
  try {
    const notes = await Note.find({ userId: user.id.toString() }).sort({
      isPinned: -1,
    });
    return res.json({
      error: false,
      notes,
      message: "Notes fetched successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

//Delete Note
app.delete("/delete-note/:id", authenticateToken, async (req, res) => {
  const noteId = req.params.id?.trim();
  const user = req.user;

  // Validate ObjectId format
  if (!noteId || !mongoose.Types.ObjectId.isValid(noteId)) {
    return res.status(400).json({ error: true, message: "Invalid note id." });
  }

  try {
    const userIdString = String(user.id);
    const note = await Note.findOne({
      _id: new mongoose.Types.ObjectId(noteId),
      userId: userIdString,
    });
    
    if (!note) {
      return res.status(404).json({ 
        error: true, 
        message: "Note not found or you don't have permission to delete this note." 
      });
    }
    
    await note.deleteOne();
    return res.json({
      error: false,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting note:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

//Update isPinned value
app.put("/update-note-pinned/:id", authenticateToken, async (req, res) => {
  const noteId = req.params.id?.trim();
  const { isPinned } = req.body;
  const user = req.user;

  // Validate ObjectId format
  if (!noteId || !mongoose.Types.ObjectId.isValid(noteId)) {
    return res.status(400).json({ error: true, message: "Invalid note id." });
  }

  // Validate isPinned is a boolean
  if (typeof isPinned !== "boolean") {
    return res.status(400).json({ 
      error: true, 
      message: "isPinned must be a boolean value." 
    });
  }

  try {
    const userIdString = String(user.id);
    const note = await Note.findOne({
      _id: new mongoose.Types.ObjectId(noteId),
      userId: userIdString,
    });
    
    if (!note) {
      return res.status(404).json({ 
        error: true, 
        message: "Note not found or you don't have permission to update this note." 
      });
    }

    note.isPinned = isPinned;
    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note pin status updated successfully",
    });
  } catch (error) {
    console.error("Error updating note pin status:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

//Search notes
app.get("/search-notes", authenticateToken, async (req, res) => {
    const user = req.user;
    const { searchQuery } = req.query;

    if (!searchQuery || !searchQuery.trim()) {
        return res
        .status(400)
        .json({ error: true, message: "Search query is required" });
    }

    try {
        const trimmedQuery = searchQuery.trim();
        const userIdString = String(user.id);

        const matchingNotes = await Note.find({
            userId: userIdString,
            $or: [
                { title: { $regex: trimmedQuery, $options: "i" } },
                { content: { $regex: trimmedQuery, $options: "i" } },
                { tags: { $in: [new RegExp(trimmedQuery, "i")] } },
            ],
        }).sort({ isPinned: -1 });

        return res.status(200).json({
            error: false,
            notes: matchingNotes,
            message: "Notes searched successfully",
        });

    } catch (error) {
        console.error("Error searching notes:", error);
        return res
        .status(500)
        .json({ error: true, message: "Internal server error" });
    }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
