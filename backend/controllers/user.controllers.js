// Import Cloudinary upload helper
import uploadOnCloudinary from "../config/cloudinary.js"
// Import User model from Mongoose
import User from "../models/user.model.js"

// Controller to get the currently logged-in user's data
export const getCurrentUser = async (req, res) => {
    try {
        // Find user by ID (set from middleware after token verification)
        // Exclude password from the result
        let user = await User.findById(req.userId).select("-password")
        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }

        // Send back user data
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: `current user error ${error}` })
    }
}

// Controller to edit user profile (name or profile image)
export const editProfile = async (req, res) => {
    try {
        let { name } = req.body // Get name from request body
        let image;

        // If image file is uploaded, upload it to Cloudinary
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path)
        }

        // Find user by ID and update name and/or image
        let user = await User.findByIdAndUpdate(req.userId, {
            name,
            image
        }, { new: true }) // Return the updated document

        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }

        // Return updated user info
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: `profile error ${error}` })
    }
}

// Controller to get all users except the currently logged-in one
export const getOtherUsers = async (req, res) => {
    try {
        // Find all users whose ID is not equal to the logged-in user's ID
        let users = await User.find({
            _id: { $ne: req.userId }
        }).select("-password") // Exclude passwords for security

        // Send list of other users
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({ message: `get other users error ${error}` })
    }
}

// Controller to search users by name or username using a case-insensitive regex
export const search = async (req, res) => {
    try {
        let { query } = req.query // Get search query from URL

        if (!query) {
            return res.status(400).json({ message: "query is required" })
        }

        // Search for users where name or userName matches the query (case-insensitive)
        let users = await User.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { userName: { $regex: query, $options: "i" } },
            ]
        })

        // Send matched users
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({ message: `search users error ${error}` })
    }
}
