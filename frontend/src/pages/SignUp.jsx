import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../main'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function SignUp() {
  const navigate = useNavigate()          // Hook to redirect user
  const dispatch = useDispatch()          // Redux dispatch to store user data globally

  // Input field states
  const [userName, setUserName] = useState("")     // Username input state
  const [email, setEmail] = useState("")           // Email input state
  const [password, setPassword] = useState("")     // Password input state

  // Toggle password visibility
  const [show, setShow] = useState(false)

  // State for handling loading and error messages
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState("")

  // Handle form submission
  const handleSignUp = async (e) => {
    e.preventDefault()               // Prevent page reload
    setLoading(true)                // Start loading state
    setErr("")                      // Clear previous error

    try {
      // Send signup data to the backend API
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { userName, email, password },
        { withCredentials: true }
      )

      // On success: store user data in Redux and navigate to profile
      dispatch(setUserData(result.data))
      navigate("/profile")

      // Clear the input fields
      setUserName("")
      setEmail("")
      setPassword("")
    } catch (error) {
      // Handle and show error
      console.log(error)
      setErr(error?.response?.data?.message || "Signup failed.")
    } finally {
      setLoading(false) // Stop loading
    }
  }

  return (
    // Outer container with centered card layout
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#e0f7fa] via-white to-[#e0f7fa] px-4'>

      {/* Card */}
      <div className='w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-cyan-100'>

        {/* Title */}
        <div className='text-center mb-6'>
          <h1 className='text-3xl font-bold text-gray-700 tracking-wide'>Create an Account</h1>
          <p className='text-gray-500 text-sm mt-1'>
            Join <span className='text-[#20c7ff] font-semibold'>Friendly Chat</span> today
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignUp} className='flex flex-col gap-5'>

          {/* Username Field */}
          <input
            type="text"
            placeholder="Username"
            className='w-full px-5 py-3 rounded-xl border border-cyan-300 bg-white shadow-md outline-none focus:ring-2 focus:ring-[#20c7ff] text-gray-700 placeholder-gray-500 transition-all duration-200'
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />

          {/* Email Field */}
          <input
            type="email"
            placeholder="Email"
            className='w-full px-5 py-3 rounded-xl border border-cyan-300 bg-white shadow-md outline-none focus:ring-2 focus:ring-[#20c7ff] text-gray-700 placeholder-gray-500 transition-all duration-200'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password Field with Show/Hide Toggle */}
          <div className='relative'>
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              className='w-full px-5 py-3 rounded-xl border border-cyan-300 bg-white shadow-md outline-none focus:ring-2 focus:ring-[#20c7ff] text-gray-700 placeholder-gray-500 transition-all duration-200'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* Show/Hide Password Toggle */}
            <span
              className='absolute right-4 top-1/2 -translate-y-1/2 text-[#20c7ff] font-medium cursor-pointer text-sm select-none'
              onClick={() => setShow(!show)}
            >
              {show ? "Hide" : "Show"}
            </span>
          </div>

          {/* Error Message */}
          {err && (
            <p className='text-red-500 text-sm font-medium -mt-2'>* {err}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className='w-full py-3 bg-[#20c7ff] text-white rounded-xl font-semibold text-lg shadow-lg hover:bg-[#1bb6e6] transition-all duration-200 disabled:opacity-60'
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

          {/* Navigate to Login */}
          <p className='text-center text-sm text-gray-600 mt-2'>
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className='text-[#20c7ff] font-semibold cursor-pointer hover:underline'
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default SignUp
