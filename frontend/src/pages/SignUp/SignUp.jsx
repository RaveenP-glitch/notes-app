import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import PasswordInput from '../../components/Navbar/Input/PasswordInput'
import { Link } from 'react-router-dom'

const SignUp = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    console.log(name, email, password);
  }

  return (
    <>
     <Navbar />

     <div className='flex items-center justify-center h-screen mt-5'>
      <div className='w-96 max-w-md p-8 border border-gray-200 bg-white rounded-md drop-shadow'>
        <form onSubmit={handleSignUp}>
          <div>
            <h4 className='text-2xl mb-7 font-medium'>Sign Up</h4>
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
            className="w-full p-2 border border-gray-300 rounded-md"
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
            className="w-full btn-primary bg-blue-500 text-white px-4 py-2 mt-4 rounded-md"
          >
            Sign Up
          </button>

          <p className="text-sm text-center mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 font-medium text-primary underline">
              Login
            </Link>
          </p>
        </form>
      </div>
     </div>
    </>
  )
}

export default SignUp