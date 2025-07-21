// Import mongoose to define the schema and interact with MongoDB
import mongoose from "mongoose"

// Define the schema for the message collection
const messageSchema = new mongoose.Schema({

    // Sender: Reference to the user who sent the message
    sender: {
        type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId type
        ref: "User",                          // Refers to the User model
        required: true                        // This field is mandatory
    },

    // Receiver: Reference to the user who received the message
    receiver: {
        type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId type
        ref: "User",                          // Refers to the User model
        required: true                        // This field is also mandatory
    },

    // Message text content
    message: {
        type: String,       // Text message
        default: ""         // If no text is sent, default is empty string
    },

    // Image URL (optional, for image messages)
    image: {
        type: String,       // Stores image URL/path from Cloudinary or local
        default: ""         // If no image is sent, default is empty string
    }

}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
})

// Create a model named "Message" using the defined schema
const Message = mongoose.model("Message", messageSchema)

// Export the model so it can be used in other files (e.g., controllers)
export default Message
