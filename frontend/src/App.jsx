// Import core React functionality
import React, { useEffect } from 'react'

// Import routing components to manage page navigation
import { Navigate, Route, Routes } from 'react-router-dom'

// Import different pages of the app
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Home from './pages/Home'
import Profile from './pages/Profile'

// Import custom hooks to fetch user data
import getCurrentUser from './customHooks/getCurrentUser'
import getOtherUsers from './customHooks/getOtherUsers'

// Import Redux hooks to access and update global state
import { useDispatch, useSelector } from 'react-redux'

// Import Socket.io client to manage real-time connection
import { io } from "socket.io-client"

// Base URL of backend server
import { serverUrl } from './main'

// Redux actions to update socket and online users
import { setOnlineUsers, setSocket } from './redux/userSlice'

function App() {
  // Call custom hook to get the current logged-in user from backend
  getCurrentUser()

  // Call custom hook to fetch all users except the logged-in user
  getOtherUsers()

  // Access necessary values from Redux store
  let { userData, socket, onlineUsers } = useSelector(state => state.user)

  // Create dispatch method to update Redux state
  let dispatch = useDispatch()

  // useEffect runs whenever userData changes
  useEffect(() => {
    if (userData) {
      // If user is logged in, create a new socket connection
      const socketio = io(`${serverUrl}`, {
        query: {
          userId: userData?._id // Pass user ID to backend via socket
        }
      })

      // Save socket connection to Redux store
      dispatch(setSocket(socketio))

      // Listen for online user list from server
      socketio.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users)) // Update list of online users in Redux
      })

      // Clean up: close socket when component unmounts
      return () => socketio.close()

    } else {
      // If user logs out and socket exists, close the connection
      if (socket) {
        socket.close()
        dispatch(setSocket(null)) // Remove socket from Redux
      }
    }
  }, [userData]) // Dependency array: runs effect whenever userData changes

  return (
    // Define app routes using React Router
    <Routes>

      {/* If user is not logged in, show login page. Otherwise, redirect to Home */}
      <Route path='/login' element={!userData ? <Login /> : <Navigate to="/" />} />

      {/* If user is not logged in, show signup page. Otherwise, redirect to Profile */}
      <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to="/profile" />} />

      {/* Home page: Only accessible if user is logged in. Otherwise, redirect to login */}
      <Route path='/' element={userData ? <Home /> : <Navigate to="/login" />} />

      {/* Profile page: Only accessible if user is logged in. Otherwise, redirect to signup */}
      <Route path='/profile' element={userData ? <Profile /> : <Navigate to="/signup" />} />

    </Routes>
  )
}

// Export the App component as default export
export default App
