// Import axios for making HTTP requests to the backend
import axios from "axios"

// Import useEffect hook to run side effects (like API calls) when the component loads
import { useEffect } from "react"

// Import server base URL from config
import { serverUrl } from "../main"

// Import Redux hooks to access and update the global state
import { useDispatch, useSelector } from "react-redux"

// Import the action to update the logged-in user data in Redux
import { setUserData } from "../redux/userSlice"


// Custom function to get the current logged-in user from the backend
const getCurrentUser = () => {
    
    // Get the dispatch function to trigger Redux actions
    let dispatch = useDispatch()

    // Access the current user data from Redux state (optional, not used in this function)
    let { userData } = useSelector(state => state.user)

    // useEffect will run once when this function/component is first used
    useEffect(() => {

        // Define an async function to fetch user data from the backend
        const fetchUser = async () => {
            try {
                // Make a GET request to /api/user/current with credentials (cookies, etc.)
                let result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true })

                // Store the returned user data in Redux using setUserData action
                dispatch(setUserData(result.data))
            } catch (error) {
                // If there's any error (e.g., not logged in), log it to console
                console.log(error)
            }
        }

        // Call the fetchUser function to run the above logic
        fetchUser()
    }, []) // Empty dependency array means it runs only once on initial render
}

// Export this function so it can be used in other components
export default getCurrentUser
