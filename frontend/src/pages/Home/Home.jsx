import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard/NoteCard";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import axiosInstance from "../../utils/axiosInstance";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [toastMessage, setToastMessage] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data: noteDetails });
  };

  const handleDelete = async (noteId) => {
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId, {
        data: {
          noteId: noteId,
        },
      });
      if (response.data && response.data.message) {
        getAllNotes();
        showToast("success", "Note deleted successfully");
      } else {
        console.error("Error deleting note:", response.data.message);
        showToast("error", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      showToast(
        "error",
        "An error occurred while deleting note. Please try again."
      );
    }
  };

  const handlePinNote = async (noteId) => {
    try {
      // Find the current note to get its isPinned status
      const currentNote = allNotes.find((note) => note._id === noteId);
      if (!currentNote) {
        console.error("Note not found");
        showToast("error", "Note not found");
        return;
      }

      const response = await axiosInstance.put(
        "/update-note-pinned/" + noteId,
        {
          isPinned: !currentNote.isPinned,
        }
      );

      if (response.data && response.data.note) {
        getAllNotes();
      } else {
        console.error("Failed to update pin status:", response.data?.message);
      }
    } catch (error) {
      console.error("Error updating pin status:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.error("Error message:", error.response.data.message);
      }
    }
  };

  const showToast = (type, message) => {
    setToastMessage({
      isShown: true,
      type,
      data: message,
    });
  };

  const handleCloseToast = () => {
    setToastMessage({
      isShown: false,
      type: "add",
      data: null,
    });
  };

  //Get User Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      } else {
        console.error("User data not found in response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  //Get all notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");

      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
        console.log("All Notes:", response.data.notes);
      }
    } catch (error) {
      console.error("Error fetching all notes:", error);
    }
  };

  //Search for a Note
  const onSearchNote = async (searchQuery) => {
    setIsSearching(true);
    try {
      const response = await axiosInstance.get("/search-notes", {
        params: { searchQuery },
      });

      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.error("Error searching notes:", error);
    }
  };

  const handleClear = () => {
    setIsSearching(false);
    getAllNotes();
  };

  useEffect(() => {
    Modal.setAppElement("#root");
    getUserInfo();
    getAllNotes();
    return () => {};
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClear} />

      <div className="container mx-auto px-4 py-8">

        <div className="container mx-auto">
          {allNotes.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {allNotes.map((note) => (
                <NoteCard
                  key={note._id}
                  title={note.title}
                  date={moment(note.createdOn).format("Do MMM YYYY")}
                  content={note.content}
                  tags={note.tags}
                  isPinned={note.isPinned}
                  onEdit={() => handleEdit(note)}
                  onDelete={() => handleDelete(note._id)}
                  onPinNote={() => handlePinNote(note._id)}
                />
              ))}
            </div>
          ) : (
            <EmptyCard imgSrc={ isSearching ? "/no-result-found.jpg" : "/add-note.svg" } message={isSearching ? "No notes found. Please try a different search." : "No notes found. Click the + button below to add a new note."} />
          )}
        </div>

        <Modal
          isOpen={openAddEditModal.isShown}
          onRequestClose={() =>
            setOpenAddEditModal({ isShown: false, type: "add", data: null })
          }
          style={{
            overlay: {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
            },
            content: {
              width: "90%",
              maxWidth: "500px",
              maxHeight: "75vh",
              margin: "auto",
              border: "none",
              borderRadius: "10px",
              padding: "0",
              position: "relative",
              inset: "auto",
              zIndex: 1001,
            },
          }}
          contentLabel="Add Edit Note"
        >
          <AddEditNotes
            type={openAddEditModal.type}
            noteData={openAddEditModal.data}
            onClose={() =>
              setOpenAddEditModal({ isShown: false, type: "add", data: null })
            }
            getAllNotes={getAllNotes}
            showToast={showToast}
          />
        </Modal>

        <Toast
          isShown={toastMessage.isShown}
          type={toastMessage.type}
          data={toastMessage.data}
          onClose={handleCloseToast}
        />

        <button
          className="fixed bottom-6 right-6 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors z-50"
          onClick={() =>
            setOpenAddEditModal({ isShown: true, type: "add", data: null })
          }
        >
          <MdAdd className="text-white" size={28} />
        </button>
      </div>
    </>
  );
};

export default Home;
