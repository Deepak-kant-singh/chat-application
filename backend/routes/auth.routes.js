// Import Express to use Router functionality
import express from "express"

// Import controller functions for handling auth logic
import { login, logOut, signUp } from "../controllers/auth.controllers.js"

// Create a new router object to define auth-related routes
const authRouter = express.Router()

// Route for user signup (register a new user)
// Expects: { userName, email, password } in the request body
authRouter.post("/signup", signUp)

// Route for user login
// Expects: { email, password } in the request body
authRouter.post("/login", login)

// Route for user logout
// Clears the auth token cookie from the client
authRouter.get("/logout", logOut)

// Export the router so it can be used in the main app
export default authRouter
