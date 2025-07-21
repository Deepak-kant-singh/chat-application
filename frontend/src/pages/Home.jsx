// Importing React and necessary components/hooks
import React from 'react'

// Import the SideBar component (user list, contacts, etc.)
import SideBar from '../components/SideBar'

// Import the MessageArea component (chat/message display)
import MessageArea from '../components/MessageArea'

// Import Redux hook to access user state
import { useSelector } from 'react-redux'

// Import custom hook to fetch messages
import getMessage from '../customHooks/getMessages'

function Home() {
  // Get the currently selected user (the person you're chatting with) from Redux store
  let { selectedUser } = useSelector(state => state.user)

  // Custom hook to fetch messages from backend when Home component renders
  // This might populate Redux state or manage side effects
  getMessage()

  return (
    // Main container for Home page layout
    // Takes full width and height of the viewport and arranges children side by side
    <div className='w-full h-[100vh] flex'>
      
      {/* Left side - Sidebar with list of users/contacts */}
      <SideBar />
      
      {/* Right side - Chat message area with current selected user */}
      <MessageArea />
    </div>
  )
}

// Export Home component to be used in routes
export default Home
