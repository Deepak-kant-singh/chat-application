// Import axios for making HTTP requests to the backend
import axios from "axios"

// useEffect hook allows you to run code (like fetching data) when a component loads or updates
import { useEffect } from "react"

// Import the base server URL from your config file
import { serverUrl } from "../main"

// Import hooks from Redux to read state (useSelector) and dispatch actions (useDispatch)
import { useDispatch, useSelector } from "react-redux"

// Import Redux actions to set user data and other users (not used here but imported)
import { setOtherUsers, setUserData } from "../redux/userSlice"

// Import Redux action to set chat messages
import { setMessages } from "../redux/messageSlice"

// ❌ This is a regular function using React hooks, which is NOT allowed by React rules
// Hooks like useSelector, useEffect, and useDispatch must only be used inside a component or a custom hook
const getMessage = () => {

    // Get the dispatch function to trigger Redux actions
    let dispatch = useDispatch()

    // Extract current user data and the selected user (whom you're chatting with) from Redux state
    let { userData, selectedUser } = useSelector(state => state.user)

    // useEffect runs when component loads or when selectedUser or userData changes
    useEffect(() => {

        // Define an async function to fetch messages from backend
        const fetchMessages = async () => {
            try {
                // Send GET request to fetch messages with the selected user
                let result = await axios.get(
                    `${serverUrl}/api/message/get/${selectedUser._id}`, // API endpoint to get chat messages
                    { withCredentials: true } // Include cookies for authentication/session
                )

                // Update Redux state with the fetched messages
                dispatch(setMessages(result.data))

            } catch (error) {
                // Log error to the console if API fails
                console.log(error)
            }
        }

        // Call the fetchMessages function to execute the API request
        fetchMessages()

    }, [selectedUser, userData]) // Re-run this effect if selectedUser or userData changes
}

// Export the function to be used in other files
export default getMessage
