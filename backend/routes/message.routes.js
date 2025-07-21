// Import Express to create the router
import express from "express"

// Import middleware to check if the user is authenticated (i.e., logged in)
import isAuth from "../middlewares/isAuth.js"

// Import multer middleware to handle file uploads (for message images)
import { upload } from "../middlewares/multer.js"

// Import controller functions that handle sending and getting messages
import { getMessages, sendMessage } from "../controllers/message.controllers.js"

// Create a new Express router for message-related routes
const messageRouter = express.Router()

// Route to send a message to a specific user (with optional image)
// - POST method
// - :receiver is the ID of the user who will receive the message
// - isAuth middleware ensures only logged-in users can send messages
// - upload.single("image") allows sending a single image file with the message
// - sendMessage is the controller that processes and stores the message
messageRouter.post("/send/:receiver", isAuth, upload.single("image"), sendMessage)

// Route to fetch all messages between the logged-in user and a specific user
// - GET method
// - :receiver is the ID of the user whose conversation you want to view
// - isAuth middleware ensures only logged-in users can fetch messages
// - getMessages is the controller that fetches conversation messages from the DB
messageRouter.get("/get/:receiver", isAuth, getMessages)

// Export the router to be used in your main server file (e.g., app.js)
export default messageRouter
