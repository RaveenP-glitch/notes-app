import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import PasswordInput from "../../components/Navbar/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Validate inputs
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password.");
      return;
    }

    //Login API call
    try {
      const response = await axiosInstance.post("/login", {
        email,
        password,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      } else {
        setError(response.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred while logging in. Please try again.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center h-screen">
        <div className="w-96 max-w-md p-8 border border-gray-200 bg-white rounded-md drop-shadow">
          <form onSubmit={handleLogin}>
            <div>
              <h4 className="text-2xl mb-7 font-medium">Login</h4>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded-md mb-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <PasswordInput
                value={password}
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && (
                <p className="text-red-500 text-sm mb-2 mt-2">{error}</p>
              )}

              <button
                type="submit"
                className="w-full btn-primary bg-blue-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-600 cursor-pointer transition-colors"
              >
                Login
              </button>

              <p className="text-sm text-center mt-5">
                Not registered yet?{" "}
                <Link
                  to="/signup"
                  className="text-blue-500 font-medium text-primary underline"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
