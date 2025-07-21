// Import express to create the router
import express from "express"

// Import controller functions to handle user-related logic
import { editProfile, getCurrentUser, getOtherUsers, search } from "../controllers/user.controllers.js"

// Import middleware to protect routes (ensures the user is logged in)
import isAuth from "../middlewares/isAuth.js"

// Import multer middleware to handle image upload
import { upload } from "../middlewares/multer.js"

// Create a new router instance
const userRouter = express.Router()

// ======================= ROUTES ======================= //

// ✅ Route to get the current logged-in user's details
// - GET request
// - Uses isAuth to verify token
// - Calls getCurrentUser controller
userRouter.get("/current", isAuth, getCurrentUser)

// ✅ Route to get all users *except* the currently logged-in user
// - GET request
// - Useful to display other people to chat with
userRouter.get("/others", isAuth, getOtherUsers)

// ✅ Route to edit user profile (name and image)
// - PUT request
// - Uses isAuth to ensure only logged-in user can edit their profile
// - Uses multer upload middleware to handle optional image file
userRouter.put("/profile", isAuth, upload.single("image"), editProfile)

// ✅ Route to search users by name or username
// - GET request with `query` parameter in URL
// - Searches using regex (case-insensitive)
userRouter.get("/search", isAuth, search)

// Export the router so it can be used in the main server file (app.js)
export default userRouter
