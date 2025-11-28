import React from "react";
import { MdOutlinePushPin } from "react-icons/md";
import { MdCreate, MdDelete } from "react-icons/md";

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <span className="text-sm text-slate-500">{date}</span>
        </div>

        <MdOutlinePushPin
          className={`cursor-pointer transition-transform ${
            isPinned ? "text-blue-500" : "text-slate-400 rotate-45"
          }`}
          onClick={onPinNote}
          size={20}
        />
      </div>

      <p className="text-md text-slate-500 mb-3">{content?.slice(0, 60)}...</p>

      <div className="flex items-center justify-between">
        {tags && tags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <MdCreate
            className="text-slate-400 cursor-pointer hover:text-slate-700"
            size={20}
            onClick={onEdit}
          />
          <MdDelete
            className="text-slate-400 cursor-pointer hover:text-slate-700"
            size={20}
            onClick={onDelete}
            
          />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
