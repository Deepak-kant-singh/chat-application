// Importing necessary modules and assets
import React, { useRef, useState } from 'react'
import dp from "../assets/dp.webp" // Default profile image
import { IoCameraOutline } from "react-icons/io5"; // Icon for the camera
import { useDispatch, useSelector } from 'react-redux'; // Redux hooks
import { IoIosArrowRoundBack } from "react-icons/io"; // Back arrow icon
import { useNavigate } from 'react-router-dom'; // Hook to navigate between routes
import axios from 'axios'; // Axios for HTTP requests
import { serverUrl } from '../main'; // Base server URL
import { setUserData } from '../redux/userSlice'; // Redux action to update user data

function Profile() {
  // Accessing the current logged-in user's data from Redux store
  const { userData } = useSelector(state => state.user)

  // Initializing hooks
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Local state to manage name input, profile image, and saving/loading states
  const [name, setName] = useState(userData.name || "") // Controlled input for user name
  const [frontendImage, setFrontendImage] = useState(userData.image || dp) // Preview image shown to user
  const [backendImage, setBackendImage] = useState(null) // Actual image file to be sent to server
  const [saving, setSaving] = useState(false) // Loading state during profile save

  // useRef to simulate a click on the hidden file input when the image is clicked
  const image = useRef()

  // Called when a new profile image is selected from file input
  const handleImage = (e) => {
    const file = e.target.files[0] // Get the selected file
    setBackendImage(file) // Store it in state to send to server
    setFrontendImage(URL.createObjectURL(file)) // Create a preview URL for display
  }

  // Called when the profile form is submitted
  const handleProfile = async (e) => {
    e.preventDefault() // Prevent form from reloading the page
    setSaving(true) // Start loading state

    try {
      // Create a FormData object to send text + file in same request
      const formData = new FormData()
      formData.append("name", name) // Add name to form
      if (backendImage) {
        formData.append("image", backendImage) // Add image file if one was selected
      }

      // Send PUT request to backend to update the profile
      const result = await axios.put(`${serverUrl}/api/user/profile`, formData, {
        withCredentials: true // Ensure cookies are sent for authentication
      })

      // Update Redux store with new user data returned from server
      dispatch(setUserData(result.data))

      // Navigate back to home page after successful update
      navigate("/")
    } catch (error) {
      // Log any error that occurred
      console.error(error)
    } finally {
      // Stop loading state
      setSaving(false)
    }
  }

  return (
    <div className='min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4'>
      
      {/* Back arrow to return to the home page */}
      <div className='fixed top-4 left-4'>
        <IoIosArrowRoundBack
          onClick={() => navigate("/")}
          className='text-gray-600 w-10 h-10 hover:text-[#20c7ff] cursor-pointer transition-all duration-200'
        />
      </div>

      {/* Profile Image Upload Section */}
      <div
        className='relative group'
        onClick={() => image.current.click()} // Trigger file input when image is clicked
      >
        {/* Profile Image Preview with border and shadow */}
        <div className='w-48 h-48 rounded-full overflow-hidden border-4 border-[#20c7ff] shadow-lg bg-white cursor-pointer transition-transform group-hover:scale-105'>
          <img src={frontendImage} alt="profile" className='w-full h-full object-cover' />
        </div>

        {/* Camera Icon at bottom-right of the image */}
        <div className='absolute bottom-3 right-3 bg-[#20c7ff] w-10 h-10 rounded-full flex items-center justify-center shadow-lg'>
          <IoCameraOutline className='text-white text-xl' />
        </div>
      </div>

      {/* Button to remove selected photo and reset to default image */}
      <button
        type="button"
        className='mt-3 text-sm text-red-500 font-medium underline hover:text-red-600 transition-all'
        onClick={() => {
          setFrontendImage(dp) // Reset preview to default image
          setBackendImage(null) // Clear file to be uploaded
        }}
      >
        Remove Photo
      </button>

      {/* Profile Update Form */}
      <form
        className='w-full max-w-md mt-6 flex flex-col gap-5'
        onSubmit={handleProfile}
      >
        {/* Hidden file input that is triggered when image is clicked */}
        <input
          type="file"
          accept='image/*'
          ref={image}
          hidden
          onChange={handleImage}
        />

        {/* Editable input for full name */}
        <input
          type="text"
          placeholder="Enter your name"
          className='w-full px-4 py-3 rounded-xl border border-cyan-300 bg-white shadow-inner text-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-[#20c7ff]'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Read-only Username Field */}
        <input
          type="text"
          readOnly
          value={userData?.userName}
          className='w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 shadow-inner text-gray-500 text-lg cursor-not-allowed'
        />

        {/* Read-only Email Field */}
        <input
          type="email"
          readOnly
          value={userData?.email}
          className='w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 shadow-inner text-gray-500 text-lg cursor-not-allowed'
        />

        {/* Save Profile Button */}
        <button
          type="submit"
          disabled={saving} // Disable button when saving is true
          className='w-full py-3 bg-[#20c7ff] text-white rounded-xl font-semibold text-lg shadow-md hover:bg-[#1bb6e6] transition-all duration-200 disabled:opacity-60'
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  )
}

// Export the Profile component to be used in routes
export default Profile
