import React, { useEffect, useRef } from 'react' // Import React core and required hooks
import dp from "../assets/dp.webp" // Import default profile image
import { useSelector } from 'react-redux' // Hook to access Redux state

// This component shows messages sent by the logged-in user (sender)
function SenderMessage({ image, message }) {

  let scroll = useRef() // Create a reference for auto-scrolling the message into view

  // Get logged-in user data from Redux store
  let { userData } = useSelector(state => state.user)

  // Whenever a new message or image is rendered, scroll the message into view
  useEffect(() => {
    scroll?.current.scrollIntoView({ behavior: "smooth" }) // Smooth scroll to this message
  }, [message, image]) // Runs when either the text or image changes

  // Function to scroll when image finishes loading (to avoid broken scroll timing)
  const handleImageScroll = () => {
    scroll?.current.scrollIntoView({ behavior: "smooth" }) // Smooth scroll on image load
  }

  return (
    // Message container aligned to right for sender
    <div className='flex items-start gap-[10px]' >

      {/* Message bubble container aligned to right (ml-auto pushes it to right) */}
      <div
        ref={scroll} // Attach the ref for auto-scrolling
        className='w-fit max-w-[500px] px-[20px] py-[10px] bg-[rgb(23,151,194)] text-white text-[19px] rounded-tr-none rounded-2xl relative right-0 ml-auto shadow-gray-400 shadow-lg gap-[10px] flex flex-col'
      >
        {/* If an image is sent, show it */}
        {image && (
          <img
            src={image} // Display the sent image
            alt=""
            className='w-[150px] rounded-lg' // Small image with rounded corners
            onLoad={handleImageScroll} // Scroll once image is fully loaded
          />
        )}

        {/* If a text message is sent, display it */}
        {message && <span>{message}</span>}
      </div>

      {/* Sender's profile picture (on right side) */}
      <div className='w-[40px] h-[40px] rounded-full overflow-hidden flex justify-center items-center bg-white cursor-pointer shadow-gray-500 shadow-lg'>
        <img
          src={userData.image || dp} // Show user's profile image or fallback to default
          alt=""
          className='h-[100%]' // Full height fit for image inside container
        />
      </div>
    </div>
  )
}

export default SenderMessage
