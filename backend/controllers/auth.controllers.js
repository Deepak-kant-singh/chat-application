// Import the function to generate JWT tokens
import genToken from "../config/token.js"

// Import the User model (MongoDB schema)
import User from "../models/user.model.js"

// Import bcrypt for hashing and comparing passwords
import bcrypt from "bcryptjs"

// ===================== SIGNUP CONTROLLER =====================
export const signUp = async (req, res) => {
    try {
        // Extract required fields from request body
        const { userName, email, password } = req.body;

        // Check if a user already exists with the same username
        const checkUserByUserName = await User.findOne({ userName });
        if (checkUserByUserName) {
            return res.status(400).json({ message: "userName already exist" });
        }

        // Check if a user already exists with the same email
        const checkUserByEmail = await User.findOne({ email });
        if (checkUserByEmail) {
            return res.status(400).json({ message: "email already exist" });
        }

        // Ensure password length is at least 6 characters
        if (password.length < 6) {
            return res.status(400).json({ message: "password must be at least 6 characters" });
        }

        // Hash the password before saving to database
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt round

        // Create new user in the database
        const user = await User.create({
            userName,
            email,
            password: hashedPassword
        });

        // Generate JWT token using the user's ID
        const token = await genToken(user._id);

        // Store token in cookie for authentication (expires in 7 days)
        res.cookie("token", token, {
            httpOnly: true, // Cannot be accessed by client-side JS
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            sameSite: "None", // Protect against CSRF
            secure: true // Set true if using HTTPS (e.g., in production)
        });

        // Respond with the created user object
        return res.status(201).json(user);

    } catch (error) {
        // If something goes wrong, return error message
        return res.status(500).json({ message: `signup error ${error}` });
    }
};


// ===================== LOGIN CONTROLLER =====================
export const login = async (req, res) => {
    try {
        // Extract email and password from request body
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "user does not exist" });
        }

        // Compare entered password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "incorrect password" });
        }

        // Generate JWT token for the logged-in user
        const token = await genToken(user._id);

        // Store the token in a cookie (valid for 7 days)
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "None",
            secure: true
        });

        // Respond with user info
        return res.status(200).json(user);

    } catch (error) {
        // If something fails, return error message
        return res.status(500).json({ message: `login error ${error}` });
    }
};


// ===================== LOGOUT CONTROLLER =====================
export const logOut = async (req, res) => {
    try {
        // Clear the authentication token stored in cookie
        res.clearCookie("token");

        // Send logout success response
        return res.status(200).json({ message: "log out successfully" });

    } catch (error) {
        // If logout fails, return error message
        return res.status(500).json({ message: `logout error ${error}` });
    }
};
