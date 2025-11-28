import React, { useState } from "react";
import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";

const Navbar = ({userInfo, onSearchNote, handleClearSearch}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    setSearchQuery(searchQuery);
    onSearchNote(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery("");
    handleClearSearch();
  };

  return (
    <div className="w-full h-16 bg-white shadow-md drop-shadow px-3 md:px-6 py-2 flex items-center justify-between gap-2">
      <h2 className="text-lg md:text-xl font-medium whitespace-nowrap">Notes</h2>
      <SearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        handleSearch={handleSearch}
        onClearSearch={handleClear}
      />
      <ProfileInfo userInfo={userInfo} onLogout={handleLogout} />
    </div>
  );
};

export default Navbar;
