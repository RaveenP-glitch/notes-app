import React from "react";
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search Notes"
        className="w-full text-sm p-2 pr-20 border border-gray-300 rounded-md"
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {value && (
          <IoMdClose
            className="text-slate-500 cursor-pointer hover:text-slate-700"
            onClick={onClearSearch}
            size={20}
          />
        )}
        <FaSearch
          size={16}
          className="text-slate-400 cursor-pointer mr-1 hover:text-slate-700"
          onClick={handleSearch}
        />
      </div>
    </div>
  );
};

export default SearchBar;
