import React, { useState } from "react";
import { MdAdd } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const addNewTag = () => {
    if (inputValue.trim() !== "") {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addNewTag();
    }
  };

  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap flex-row">
        {tags?.length > 0 && tags.map((tag, index) => (
          <span
            key={index}
            className="text-sm flex flex-row item-center gap-2 bg-slate-100 text-slate-600 px-2 py-1 rounded"
          >
            #{tag}
            <IoMdClose
                      className="text-slate-400 cursor-pointer pt-1 hover:text-slate-700"
                      size={15}
                      onClick={() => handleRemoveTag(index)}
                    />
          </span>
                     
        ))}
      </div>

      <div className="flex items-center gap-4 mt-3">
        <input
          type="text"
          placeholder="Add tags"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />

        <button
          className="w-11 h-10 btn-primary bg-blue-500 text-white pr-2 pl-3 py-2 rounded-md"
          onClick={() => addNewTag()}
        >
          <MdAdd className="text-white" size={20} />
        </button>
      </div>
    </div>
  );
};

export default TagInput;
