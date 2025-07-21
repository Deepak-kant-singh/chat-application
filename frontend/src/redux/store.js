// Import configureStore from Redux Toolkit to easily set up the Redux store
import { configureStore } from "@reduxjs/toolkit"

// Import the userSlice reducer to manage user-related state (like login, selected user, etc.)
import userSlice from "./userSlice"

// Import the messageSlice reducer to manage chat message-related state
import messageSlice from "./messageSlice"

// Create the Redux store using configureStore
export const store = configureStore({
    
    // Register the reducers for different parts (slices) of the global state
    reducer: {
        user: userSlice,       // user slice manages data like logged-in user, other users, selected user
        message: messageSlice  // message slice manages data like chat messages
    }
})




// configureStore automatically sets up the Redux store with good defaults.

// reducer is an object where each key (e.g., user, message) becomes a part of your Redux global state.

// So, your Redux state will look like:

// js
// Copy
// Edit
// {
//   user: { userData, selectedUser, ... },
//   message: { messages: [...] }
// }
