import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center bg-transparent border-[1.5px] px-2 py-2 border border-gray-300 rounded-md mt-5">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        name="password"
        id="password"
        onChange={onChange}
        placeholder={placeholder || "Password"}
        className="w-full bg-transparent outline-none"
      />

      {showPassword ? (
        <FaRegEye
          size={20}
          className="text-blue-400 cursor-pointer"
          onClick={toggleShowPassword}
        />
      ) : (
        <FaRegEyeSlash
          size={22}
          className="text-blue-400 cursor-pointer"
          onClick={toggleShowPassword}
        />
      )}
    </div>
  );
};

export default PasswordInput;
