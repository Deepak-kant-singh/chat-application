// Import axios for making API calls
import axios from "axios"

// useEffect is a React hook used to run side effects (like API calls) after the component mounts or updates
import { useEffect } from "react"

// Import the backend server base URL from your config
import { serverUrl } from "../main"

// Redux hooks to access (useSelector) and update (useDispatch) global state
import { useDispatch, useSelector } from "react-redux"

// Redux actions to update user-related state
import { setOtherUsers, setUserData } from "../redux/userSlice"


// ⚠️ This is a regular function using hooks, which is invalid in React.
// Hooks like useEffect/useDispatch/useSelector must only be used inside a React component or custom hook
const getOtherUsers = () => {

    // Get dispatch function to send actions to Redux store
    let dispatch = useDispatch()

    // Get logged-in user data from Redux state (used as a dependency to trigger fetching)
    let { userData } = useSelector(state => state.user)

    // useEffect runs when the component loads or when userData changes
    useEffect(() => {

        // Async function to fetch the list of other users from the server
        const fetchUser = async () => {
            try {
                // Send GET request to get users other than the current user
                let result = await axios.get(
                    `${serverUrl}/api/user/others`, // API endpoint to get other users
                    { withCredentials: true } // Send cookies/session for authentication
                )

                // Save the list of other users in Redux state
                dispatch(setOtherUsers(result.data))

            } catch (error) {
                // Log error if the API call fails
                console.log(error)
            }
        }

        // Call the function to actually fetch users
        fetchUser()

    }, [userData]) // Runs whenever userData changes (like on login or reload)
}

// Export the function so it can be imported in other files
export default getOtherUsers
