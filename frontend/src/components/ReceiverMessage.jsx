import React, { useEffect, useRef } from 'react' // Import necessary React hooks
import dp from "../assets/dp.webp" // Default profile picture if none exists
import { useSelector } from 'react-redux' // Import hook to access Redux state

// Component receives 'image' and 'message' props from parent
function ReceiverMessage({ image, message }) {

  let scroll = useRef() // Create a ref to scroll the message into view automatically

  let { selectedUser } = useSelector(state => state.user) // Get the selected chat user from Redux store

  // When 'message' or 'image' changes, scroll the message into view smoothly
  useEffect(() => {
    scroll?.current.scrollIntoView({ behavior: "smooth" }) // Auto-scroll to this message bubble
  }, [message, image])

  // Helper function: also scrolls the image into view once it finishes loading
  const handleImageScroll = () => {
    scroll?.current.scrollIntoView({ behavior: "smooth" }) // Smooth scroll on image load
  }

  return (
    // Message wrapper with sender's profile picture and message bubble
    <div className='flex items-start gap-[10px]' >

      {/* Profile image on the left (of the other user) */}
      <div className='w-[40px] h-[40px] rounded-full overflow-hidden flex justify-center items-center bg-white cursor-pointer shadow-gray-500 shadow-lg'>
        <img src={selectedUser.image || dp} alt="" className='h-[100%]' /> {/* Show user's image or default */}
      </div>

      {/* Message bubble */}
      <div
        ref={scroll} // Attach ref here for scrolling
        className='w-fit max-w-[500px] px-[20px] py-[10px] bg-[rgb(23,151,194)] text-white text-[19px] rounded-tl-none rounded-2xl relative left-0 shadow-gray-400 shadow-lg gap-[10px] flex flex-col'
      >
        {/* If there is an image, render it and scroll after load */}
        {image && (
          <img
            src={image} // Image sent by other user
            alt=""
            className='w-[150px] rounded-lg' // Small image with rounded corners
            onLoad={handleImageScroll} // Scroll to this message when image finishes loading
          />
        )}

        {/* If there is text, show it inside the message bubble */}
        {message && <span>{message}</span>}
      </div>
    </div>
  )
}

export default ReceiverMessage
