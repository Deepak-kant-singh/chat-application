// Import required modules
import express from "express"                   // Express framework
import dotenv from "dotenv"                     // Loads environment variables from .env file
import connectDb from "./config/db.js"          // MongoDB connection function
import authRouter from "./routes/auth.routes.js" // Routes for signup, login, logout
import cookieParser from "cookie-parser"        // Parses cookies sent with requests
import cors from "cors"                         // Enables Cross-Origin Resource Sharing
import userRouter from "./routes/user.routes.js" // Routes related to user data
import messageRouter from "./routes/message.routes.js" // Routes for sending and receiving messages
import { app, server } from "./socket/socket.js" // Express app and Socket.io server

// Load environment variables (like PORT, DB URL, etc.)
dotenv.config()

// Define port (from .env file or fallback to 5000)
const port = process.env.PORT || 5000

// Enable CORS so frontend (running at port 5173) can access this backend
app.use(cors({
    origin: "http://localhost:5173",  // Allow requests from frontend
    credentials: true                 // Allow cookies to be sent
}))

// Middleware to parse JSON data in incoming requests
app.use(express.json())

// Middleware to parse cookies from the client
app.use(cookieParser())

// Route groups: all APIs starting with /api/auth go to authRouter
app.use("/api/auth", authRouter)

// User-related routes (get current user, update profile, search, etc.)
app.use("/api/user", userRouter)

// Messaging routes (send/get messages)
app.use("/api/message", messageRouter)

// Start the server and listen on specified port
server.listen(port, () => {
    // Connect to MongoDB once the server is running
    connectDb()
    console.log("server started")
})
