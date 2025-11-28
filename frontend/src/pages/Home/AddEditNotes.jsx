import React, { useState } from "react";
import { MdSave, MdClose } from "react-icons/md";
import TagInput from "../../components/Navbar/Input/TagInput";
import axiosInstance from "../../utils/axiosInstance";

const AddEditNotes = ({ noteData, type, onClose, getAllNotes, showToast }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [isPinned, setIsPinned] = useState(noteData?.isPinned || false);
  const [error, setError] = useState(null);

  //Edit Note
  const editNote = async () => {
    const noteId = noteData?._id;
    try {
        const response = await axiosInstance.put("/edit-note/" + noteId, {
          title,
          content,
          tags,
        });
  
        if (response.data && response.data.note) {
          getAllNotes();
          onClose();
          showToast("success", "Note updated successfully");
        } else {
          setError(response.data.message || "Failed to add note");
          showToast("error", response.data.message || "Failed to add note");
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setError(error.response.data.message);
          showToast("error", error.response.data.message || "Failed to add note");
        } else {
          setError("An error occurred while adding note. Please try again.");
          showToast("error", "An error occurred while adding note. Please try again.");
        }
      }
  };

  //Add Note
  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/add-note", {
        title,
        content,
        tags,
      });

      if (response.data && response.data.note) {
        getAllNotes();
        onClose();
        showToast("success", "Note added successfully");
      } else {
        setError(response.data.message || "Failed to add note");
        showToast("error", response.data.message || "Failed to add note");
        showToast("error", "An error occurred while adding note. Please try again.");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
        showToast("error", error.response.data.message || "Failed to add note");
      } else {
        setError("An error occurred while adding note. Please try again.");
        showToast("error", "An error occurred while adding note. Please try again.");
    }
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Title is required");
      showToast("error", "Title is required");
      return;
    }
    if (!content) {
      setError("Content is required");
      showToast("error", "Content is required");
      return;
    }

    setError("");

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className="flex flex-col border border-gray-200 rounded-md p-4 mb-2">
      <button
        onClick={onClose}
        className="w-7 h-7 self-end btn-primary bg-transparent border border-transparent text-white pr-2 pl-2 py-2 mr-3 rounded-md hover:cursor-pointer active:scale-97"
      >
        <MdClose className="text-slate-500" size={20} />
      </button>

      <div className="bg-white p-4">
        <label className="text-sm text-slate-500 input-label" htmlFor="title">
          TITLE
        </label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Go to gym at 6:00 AM"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="bg-white p-4">
        <label className="text-sm text-slate-500 input-label" htmlFor="content">
          CONTENT
        </label>
        <textarea
          id="content"
          name="content"
          placeholder="Write your note here"
          className="w-full p-2 border border-gray-300 rounded-md"
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>

      <div className="bg-white p-4">
        <label className="text-sm text-slate-500 input-label" htmlFor="tags">
          TAGS
        </label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-sm mb-2 mt-2">{error}</p>}

      <div className="flex justify-end mr-4">
        <button
          className="w-35 btn-primary bg-blue-500 text-white text-md font-medium py-3 pr-1 pl-3 mt-4 rounded-md flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors duration-300 cursor-pointer active:scale-97"
          onClick={handleAddNote}
        >
          {type === "edit" ? "UPDATE" : "SAVE"}
          <MdSave className="text-white" size={18} />
        </button>
      </div>
    </div>
  );
};

export default AddEditNotes;
