import React, { useEffect, useRef, useState } from 'react' // Import React hooks
import { IoIosArrowRoundBack } from "react-icons/io"; // Back button icon
import dp from "../assets/dp.webp" // Default profile picture
import { useDispatch, useSelector } from 'react-redux'; // Redux hooks
import { setSelectedUser } from '../redux/userSlice'; // Action to deselect user
import { RiEmojiStickerLine } from "react-icons/ri"; // Emoji icon
import { FaImages } from "react-icons/fa6"; // Image upload icon
import { RiSendPlane2Fill } from "react-icons/ri"; // Send message icon
import EmojiPicker from 'emoji-picker-react'; // Emoji picker library
import SenderMessage from './SenderMessage'; // Component for messages sent by self
import ReceiverMessage from './ReceiverMessage'; // Component for messages received
import axios from 'axios'; // Axios for API requests
import { serverUrl } from '../main'; // Base server URL
import { setMessages } from '../redux/messageSlice'; // Redux action to set messages

function MessageArea() {
  let { selectedUser, userData, socket } = useSelector(state => state.user) // Extract user data from Redux
  let dispatch = useDispatch() // Initialize dispatch function

  let [showPicker, setShowPicker] = useState(false) // Show/hide emoji picker
  let [input, setInput] = useState("") // Text input for message
  let [frontendImage, setFrontendImage] = useState(null) // Image preview (frontend)
  let [backendImage, setBackendImage] = useState(null) // Image file (backend)
  let image = useRef() // Ref to the hidden image input element
  let { messages } = useSelector(state => state.message) // Messages from Redux

  // When user selects an image file
  const handleImage = (e) => {
    let file = e.target.files[0] // Get first file
    setBackendImage(file) // Save actual image file for upload
    setFrontendImage(URL.createObjectURL(file)) // Create a local preview
  }

  // Send message (text/image)
  const handleSendMessage = async (e) => {
    e.preventDefault() // Prevent default form submit

    // Do nothing if both input and image are empty
    if (input.length === 0 && backendImage == null) return

    try {
      let formData = new FormData() // Create form data to send files
      formData.append("message", input) // Add message text
      if (backendImage) {
        formData.append("image", backendImage) // Add image if present
      }

      // Send message to server
      let result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
      )

      // Add sent message to Redux message list
      dispatch(setMessages([...messages, result.data]))

      // Reset input and image fields
      setInput("")
      setFrontendImage(null)
      setBackendImage(null)
    } catch (error) {
      console.log(error) // Log errors
    }
  }

  // When an emoji is selected
  const onEmojiClick = (emojiData) => {
    setInput(prevInput => prevInput + emojiData.emoji) // Append emoji to input
    setShowPicker(false) // Hide emoji picker
  }

  // Listen for real-time messages via socket
  useEffect(() => {
    socket?.on("newMessage", (mess) => {
      dispatch(setMessages([...messages, mess])) // Add new message to list
    })
    return () => socket?.off("newMessage") // Cleanup listener on unmount
  }, [messages, setMessages]) // Dependencies: messages and setter

  return (
    <div className={`lg:w-[70%] relative ${selectedUser ? "flex" : "hidden"} lg:flex w-full h-full bg-slate-200 border-l-2 border-gray-300 overflow-hidden`}>

      {/* If a user is selected, show the chat screen */}
      {selectedUser &&
        <div className='w-full h-[100vh] flex flex-col overflow-hidden gap-[20px] items-center'>

          {/* Top header with user info */}
          <div className='w-full h-[100px] bg-[#1797c2] rounded-b-[30px] shadow-gray-400 shadow-lg gap-[20px] flex items-center px-[20px] '>
            <div className='cursor-pointer' onClick={() => dispatch(setSelectedUser(null))}>
              <IoIosArrowRoundBack className='w-[40px] h-[40px] text-white' /> {/* Back button */}
            </div>
            <div className='w-[50px] h-[50px] rounded-full overflow-hidden flex justify-center items-center bg-white cursor-pointer shadow-gray-500 shadow-lg'>
              <img src={selectedUser?.image || dp} alt="" className='h-[100%]' /> {/* User profile image */}
            </div>
            <h1 className='text-white font-semibold text-[20px]'>{selectedUser?.name || "user"}</h1> {/* Username */}
          </div>

          {/* Message display section */}
          <div className='w-full h-[70%] flex flex-col py-[30px]  px-[20px] overflow-auto gap-[20px] '>
            {/* Show emoji picker if open */}
            {showPicker &&
              <div className='absolute bottom-[120px] left-[20px]'>
                <EmojiPicker width={250} height={350} className='shadow-lg z-[100]' onEmojiClick={onEmojiClick} />
              </div>}

            {/* Render all messages */}
            {messages && messages.map((mess) => (
              mess.sender === userData._id
                ? <SenderMessage image={mess.image} message={mess.message} /> // My messages
                : <ReceiverMessage image={mess.image} message={mess.message} /> // Other user's messages
            ))}
          </div>
        </div>}

      {/* Bottom input form (only if user selected) */}
      {selectedUser &&
        <div className='w-full lg:w-[70%] h-[100px] fixed bottom-[20px] flex items-center justify-center '>
          {/* Preview selected image above input */}
          <img src={frontendImage} alt="" className='w-[80px] absolute bottom-[100px] right-[20%] rounded-lg shadow-gray-400 shadow-lg' />

          {/* Message form */}
          <form className='w-[95%] lg:w-[70%] h-[60px] bg-[rgb(23,151,194)] shadow-gray-400 shadow-lg rounded-full flex items-center gap-[20px] px-[20px] relative' onSubmit={handleSendMessage}>

            {/* Emoji button */}
            <div onClick={() => setShowPicker(prev => !prev)}>
              <RiEmojiStickerLine className='w-[25px] h-[25px] text-white cursor-pointer' />
            </div>

            {/* Hidden file input for image */}
            <input type="file" accept="image/*" ref={image} hidden onChange={handleImage} />

            {/* Message text input */}
            <input
              type="text"
              className='w-full h-full px-[10px] outline-none border-0 text-[19px] text-white bg-transparent placeholder-white'
              placeholder='Message'
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />

            {/* Image upload icon to trigger hidden input */}
            <div onClick={() => image.current.click()}>
              <FaImages className='w-[25px] h-[25px] cursor-pointer text-white' />
            </div>

            {/* Show send icon only if input or image exists */}
            {(input.length > 0 || backendImage != null) && (
              <button>
                <RiSendPlane2Fill className='w-[25px] cursor-pointer h-[25px] text-white' />
              </button>
            )}
          </form>
        </div>}

      {/* Welcome message if no user is selected */}
      {!selectedUser &&
        <div className='w-full h-full flex flex-col justify-center items-center'>
          <h1 className='text-gray-700 font-bold text-[50px]'>Welcome to friendly chat</h1>
          <span className='text-gray-700 font-semibold text-[30px]'>Start conversation !</span>
        </div>}
    </div>
  )
}

export default MessageArea
