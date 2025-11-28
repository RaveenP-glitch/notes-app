import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import PasswordInput from "../../components/Navbar/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    // Validate inputs
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    //SignUp API call
    try {
      const response = await axiosInstance.post("/create-user", {
        fullName: name,
        email: email,
        password: password,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      } else {
        setError(response.data.message || "SignUp failed. Please try again.");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred while signing up. Please try again.");
      }
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center h-screen mt-5">
        <div className="w-96 max-w-md p-8 border border-gray-200 bg-white rounded-md drop-shadow">
          <form onSubmit={handleSignUp}>
            <div>
              <h4 className="text-2xl mb-7 font-medium">Sign Up</h4>
            </div>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              className="w-full p-2 mb-3 border border-gray-300 rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              className="w-full p-2 mb-3 border border-gray-300 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm mb-2 mt-2">{error}</p>}

          <button
            type="submit"
            className="w-full btn-primary bg-blue-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-600 cursor-pointer transition-colors"
          >
            Sign Up
          </button>

            <p className="text-sm text-center mt-5">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-500 font-medium text-primary underline hover:text-blue-700 cursor-pointer"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
