import React, { useEffect, useState } from 'react'
// Import necessary React and Redux functions
import { useDispatch, useSelector } from 'react-redux'
// Import default profile image
import dp from "../assets/dp.webp"
// Import icons
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { BiLogOutCircle } from "react-icons/bi";
// Import server base URL
import { serverUrl } from '../main';
// Axios for API calls
import axios from 'axios';
// Import Redux actions
import { setOtherUsers, setSearchData, setSelectedUser, setUserData } from '../redux/userSlice';
// React Router hook for navigation
import { useNavigate } from 'react-router-dom';

function SideBar() {
    // Get data from Redux store
    let {userData, otherUsers, selectedUser, onlineUsers, searchData} = useSelector(state => state.user)
    
    // Local state to control search visibility and input
    let [search, setSearch] = useState(false)
    let [input, setInput] = useState("")

    let dispatch = useDispatch()
    let navigate = useNavigate()

    // Logout function
    const handleLogOut = async () => {
        try {
            let result = await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
            dispatch(setUserData(null))         // Clear logged in user data
            dispatch(setOtherUsers(null))       // Clear list of other users
            navigate("/login")                  // Navigate to login page
        } catch (error) {
            console.log(error)
        }
    }

    // Search handler for user search
    const handlesearch = async () => {
        try {
            let result = await axios.get(`${serverUrl}/api/user/search?query=${input}`, { withCredentials: true })
            dispatch(setSearchData(result.data)) // Store search results in Redux
        } catch(error){
            console.log(error)
        }
    }

    // Trigger search API call when input changes
    useEffect(() => {
        if(input){
            handlesearch()
        }
    }, [input])

    return (
        // Sidebar layout — show only if no user selected or on large screens
        <div className={`lg:w-[30%] w-full h-full overflow-hidden lg:block bg-slate-200 relative ${!selectedUser ? "block" : "hidden"}`}>

            {/* Logout button at bottom-left */}
            <div className='w-[60px] h-[60px] mt-[10px] rounded-full overflow-hidden flex justify-center items-center bg-[#20c7ff] shadow-gray-500 text-gray-700 cursor-pointer shadow-lg fixed bottom-[20px] left-[10px]' onClick={handleLogOut}>
                <BiLogOutCircle className='w-[25px] h-[25px]'/>
            </div>

            {/* If input is not empty, show search results */}
            {input.length > 0 &&
            <div className='flex absolute top-[250px] bg-[white] w-full h-[500px] overflow-y-auto items-center pt-[20px] flex-col gap-[10px] z-[150] shadow-lg'>
                {searchData?.map((user) => (
                    <div className='w-[95%] h-[70px] flex items-center gap-[20px] px-[10px] hover:bg-[#78cae5] border-b-2 border-gray-400 cursor-pointer' 
                         onClick={() => {
                             dispatch(setSelectedUser(user)) // Set selected user
                             setInput("")                   // Clear search input
                             setSearch(false)               // Close search box
                         }}>
                        {/* User profile image */}
                        <div className='relative rounded-full bg-white flex justify-center items-center'>
                            <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center '>
                                <img src={user.image || dp} alt="" className='h-[100%]'/>
                            </div>
                            {/* Green online dot if user is online */}
                            {onlineUsers?.includes(user._id) &&
                                <span className='w-[12px] h-[12px] rounded-full absolute bottom-[6px] right-[-1px] bg-[#3aff20] shadow-gray-500 shadow-md'></span>}
                        </div>
                        {/* Username */}
                        <h1 className='text-gray-800 font-semibold text-[20px]'>{user.name || user.userName}</h1>
                    </div>
                ))}
            </div>
            }

            {/* Top section with current user info and search bar */}
            <div className='w-full h-[300px] bg-[#20c7ff] rounded-b-[30%] shadow-gray-400 shadow-lg flex flex-col justify-center px-[20px] '>
                <h1 className='text-white font-bold text-[25px]'>friendly chat</h1>
                
                {/* Welcome text with user profile and navigation to profile page */}
                <div className='w-full flex justify-between items-center'>
                    <h1 className='text-gray-800 font-bold text-[25px]'>Hii , {userData.name || "user"}</h1>
                    <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center bg-white cursor-pointer shadow-gray-500 shadow-lg' onClick={() => navigate("/profile")}>
                        <img src={userData.image || dp} alt="" className='h-[100%]'/>
                    </div>
                </div>

                {/* Search area / other users' icons */}
                <div className='w-full flex items-center gap-[20px] overflow-y-auto py-[18px]'>

                    {/* If search is false, show search icon */}
                    {!search &&
                        <div className='w-[60px] h-[60px] mt-[10px] rounded-full overflow-hidden flex justify-center items-center bg-white shadow-gray-500 cursor-pointer shadow-lg' onClick={() => setSearch(true)}>
                            <IoIosSearch className='w-[25px] h-[25px]'/>
                        </div>}

                    {/* If search is active, show input field */}
                    {search &&
                        <form className='w-full h-[60px] bg-white shadow-gray-500 shadow-lg flex items-center gap-[10px] mt-[10px] rounded-full overflow-hidden px-[20px] relative'>
                            <IoIosSearch className='w-[25px] h-[25px]'/>
                            <input type="text" placeholder='search users...' className='w-full h-full p-[10px] text-[17px] outline-none border-0 ' onChange={(e) => setInput(e.target.value)} value={input}/>
                            <RxCross2 className='w-[25px] h-[25px] cursor-pointer' onClick={() => setSearch(false)}/>
                        </form>}

                    {/* Show small icons of online users (if not in search) */}
                    {!search && otherUsers?.map((user) => (
                        onlineUsers?.includes(user._id) &&
                        <div className='relative rounded-full shadow-gray-500 bg-white shadow-lg flex justify-center items-center mt-[10px] cursor-pointer' onClick={() => dispatch(setSelectedUser(user))}>
                            <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center '>
                                <img src={user.image || dp} alt="" className='h-[100%]'/>
                            </div>
                            <span className='w-[12px] h-[12px] rounded-full absolute bottom-[6px] right-[-1px] bg-[#3aff20] shadow-gray-500 shadow-md'></span>
                        </div>
                    ))}
                </div>
            </div>

            {/* List of all other users */}
            <div className='w-full h-[50%] overflow-auto flex flex-col gap-[20px] items-center mt-[20px]'>
                {otherUsers?.map((user) => (
                    <div className='w-[95%] h-[60px] flex items-center gap-[20px] shadow-gray-500 bg-white shadow-lg rounded-full hover:bg-[#78cae5] cursor-pointer' onClick={() => dispatch(setSelectedUser(user))}>
                        {/* User image and online dot */}
                        <div className='relative rounded-full shadow-gray-500 bg-white shadow-lg flex justify-center items-center mt-[10px]'>
                            <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center '>
                                <img src={user.image || dp} alt="" className='h-[100%]'/>
                            </div>
                            {onlineUsers?.includes(user._id) &&
                                <span className='w-[12px] h-[12px] rounded-full absolute bottom-[6px] right-[-1px] bg-[#3aff20] shadow-gray-500 shadow-md'></span>}
                        </div>
                        {/* Username */}
                        <h1 className='text-gray-800 font-semibold text-[20px]'>{user.name || user.userName}</h1>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SideBar
