// Import required modules
import http from "http"                   // Used to create HTTP server
import express from "express"            // Express framework for API
import { Server } from "socket.io"       // Socket.IO server for real-time communication

// Create an Express app instance
let app = express()

// Create an HTTP server using the Express app
const server = http.createServer(app)

// Create a new instance of socket.io server and configure CORS
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173"  // Allow connection from frontend running on port 5173 (Vite)
    }
})

// Map to keep track of online users with userId as key and socket.id as value
const userSocketMap = {}

// ✅ Utility function to get the socket ID of a specific receiver user
// This will help us send real-time messages to the correct person
export const getReceiverSocketId = (receiver) => {
    return userSocketMap[receiver]
}

// Listen for new client connections via socket.io
io.on("connection", (socket) => {

    // Get userId from handshake query when a client connects
    const userId = socket.handshake.query.userId

    // If userId exists, store the socket.id mapped to this user
    if (userId !== undefined) {
        userSocketMap[userId] = socket.id
    }

    // Emit to everyone the list of currently online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    // Listen for disconnect event when user closes tab or loses connection
    socket.on("disconnect", () => {
        // Remove the disconnected user from the map
        delete userSocketMap[userId]

        // Emit updated list of online users
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })

})

// Export app for Express routes, server for listening, and io for using in other files
export { app, server, io }


// userSocketMap: Stores the real-time mapping of each logged-in user to their socket connection.

// getReceiverSocketId: Helps send messages directly to the receiver's socket.

// io.on("connection"): Registers new connections and stores socket IDs.

// io.emit("getOnlineUsers"): Keeps all clients updated with the latest online user list.

// socket.on("disconnect"): Cleans up when a user disconnects.