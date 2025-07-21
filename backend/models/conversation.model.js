// Import mongoose for defining the schema and model
import mongoose, { mongo } from "mongoose";

// Define schema for Conversation model
const conversationSchema = new mongoose.Schema({
    // Array of participant user IDs (references to User model)
    partcipants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" // Reference to User collection
        }
    ],
    // Array of message IDs (references to Message model)
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message" // Reference to Message collection
    }]
}, { timestamps: true }) // Automatically adds createdAt and updatedAt fields

// Create Conversation model from the schema
const Conversation = mongoose.model("Conversation", conversationSchema)

// Export the model to use it in other files
export default Conversation
