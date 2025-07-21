// Import createSlice from Redux Toolkit to simplify writing reducers and actions
import { createSlice } from "@reduxjs/toolkit";

// Create a slice of the Redux state called "message"
const messageSlice = createSlice({
  
  // Name of this slice of the state
  name: "message",

  // Initial state for this slice
  initialState: {
    messages: null  // This will store the array of chat messages; initially it's null
  },

  // Reducers define how the state should change in response to actions
  reducers: {
    
    // Action to set (update) the messages in state
    setMessages: (state, action) => {
      // Set the state's messages property to the value from the dispatched action's payload
      state.messages = action.payload
    }
  }
})

// Export the action so you can dispatch it from components (e.g., dispatch(setMessages(data)))
export const { setMessages } = messageSlice.actions

// Export the reducer so it can be included in the store
export default messageSlice.reducer
