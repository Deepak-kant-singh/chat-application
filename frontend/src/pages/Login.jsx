import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { serverUrl } from '../main'
import { setSelectedUser, setUserData } from '../redux/userSlice'

function Login() {
  const navigate = useNavigate()               // Navigation hook to redirect user
  const dispatch = useDispatch()               // Redux dispatch to update user state

  // Form field states
  const [email, setEmail] = useState("")       // Stores email input
  const [password, setPassword] = useState("") // Stores password input
  const [showPassword, setShowPassword] = useState(false) // Toggles password visibility

  // Loading and error management
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Function that handles login form submission
  const handleLogin = async (e) => {
    e.preventDefault()            // Prevent page reload on form submit
    setLoading(true)              // Start loading state
    setError("")                  // Clear any previous error

    try {
      // Send login request to backend API
      const result = await axios.post(
        `${serverUrl}/api/auth/login`,
        { email, password },      // Payload: email and password
        { withCredentials: true } // Important to send cookies (e.g., session)
      )

      // On successful login, update Redux store with user data
      dispatch(setUserData(result.data))
      dispatch(setSelectedUser(null))

      // Redirect user to home page
      navigate("/")

      // Clear input fields
      setEmail("")
      setPassword("")
    } catch (err) {
      // If login fails, show appropriate error message
      console.error(err)
      setError(err?.response?.data?.message || "Login failed.")
    } finally {
      setLoading(false) // Stop loading animation
    }
  }

  return (
    // Full screen layout with a nice background gradient
    <div className='min-h-screen bg-gradient-to-r from-cyan-200 via-white to-blue-100 flex items-center justify-center p-4'>
      
      {/* Login Card */}
      <div className='w-full max-w-md bg-white/30 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 p-8'>
        
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-gray-800 mb-1 drop-shadow'>Welcome Back 👋</h1>
          <p className='text-gray-600 text-sm'>
            Login to <span className='text-[#20c7ff] font-semibold'>Friendly Chat</span>
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className='flex flex-col gap-6'>

          {/* Email Input */}
          <div className='relative'>
            <input
              type="email"
              placeholder="Enter email"
              className='w-full px-5 py-3 rounded-xl border border-cyan-300 bg-white/70 shadow-inner outline-none focus:ring-2 focus:ring-[#20c7ff] text-gray-700 placeholder-gray-500'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className='relative'>
            <input
              type={showPassword ? "text" : "password"} // Toggle between text/password
              placeholder="Enter password"
              className='w-full px-5 py-3 rounded-xl border border-cyan-300 bg-white/70 shadow-inner outline-none focus:ring-2 focus:ring-[#20c7ff] text-gray-700 placeholder-gray-500'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* Show/Hide Password Toggle */}
            <span
              className='absolute right-4 top-1/2 -translate-y-1/2 text-[#20c7ff] font-medium cursor-pointer text-sm select-none'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <p className='text-red-600 text-sm font-medium -mt-3'>
              * {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className='w-full py-3 bg-[#20c7ff] text-white rounded-xl font-semibold text-lg shadow-lg hover:bg-[#1bb6e6] transition-all duration-200 disabled:opacity-60'
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Redirect to Signup */}
          <p className='text-center text-sm text-gray-600'>
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className='text-[#20c7ff] font-semibold cursor-pointer hover:underline'
            >
              Sign up
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
