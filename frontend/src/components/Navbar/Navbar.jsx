import React, { useState } from "react";
import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  const handleSearch = () => {
    setSearchQuery(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="w-full h-16 bg-white shadow-md drop-shadow px-6 py-2 flex items-center justify-between">
      <h2 className="text-xl font-medium">Notes</h2>
      <SearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        handleSearch={handleSearch}
        onClearSearch={handleClearSearch}
      />
      <ProfileInfo onLogout={handleLogout} />
    </div>
  );
};

export default Navbar;
