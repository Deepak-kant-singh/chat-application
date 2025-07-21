// Import mongoose to define schema and interact with MongoDB
import mongoose from "mongoose";

// Define a schema for the User collection
const userSchema = new mongoose.Schema({

    // Full name of the user (optional field)
    name: {
        type: String,
    },

    // Unique username required for login or profile
    userName: {
        type: String,
        required: true,  // This field is mandatory
        unique: true     // Each username must be unique
    },

    // User's email ID
    email: {
        type: String,
        required: true,  // Mandatory field
        unique: true     // No duplicate emails allowed
    },

    // Password (hashed before saving)
    password: {
        type: String,
        required: true   // Password is mandatory
    },

    // Profile image URL (optional, default is empty)
    image: {
        type: String,
        default: ""      // If user doesn't upload image, default is empty
    }

}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create a model called "User" based on the schema
const User = mongoose.model("User", userSchema);

// Export the User model to be used in controllers and other files
export default User;
