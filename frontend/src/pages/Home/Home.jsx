import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h4 className="text-2xl mb-7 font-medium">Home</h4>

        <div className="container mx-auto">
          <div className="grid grid-cols-3 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <NoteCard
              title="Note 1"
              date="2025-01-01"
              content="This is a note"
              tags={["tag1", "tag2"]}
              isPinned={true}
              onEdit={() => {}}
              onDelete={() => {}}
              onPinNote={() => {}}
            />
            <NoteCard
              title="Note 1"
              date="2025-01-01"
              content="This is a note"
              tags={["tag1", "tag2"]}
              isPinned={true}
              onEdit={() => {}}
              onDelete={() => {}}
              onPinNote={() => {}}
            />{" "}
            <NoteCard
              title="Note 1"
              date="2025-01-01"
              content="This is a note"
              tags={["tag1", "tag2"]}
              isPinned={false}
              onEdit={() => {}}
              onDelete={() => {}}
              onPinNote={() => {}}
            />
            <NoteCard
              title="Note 1"
              date="2025-01-01"
              content="This is a note"
              tags={["tag1", "tag2"]}
              isPinned={false}
              onEdit={() => {}}
              onDelete={() => {}}
              onPinNote={() => {}}
            />
          </div>
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
              width: "500px",
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
          />
        </Modal>

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
