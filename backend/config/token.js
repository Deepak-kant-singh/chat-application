// Importing jsonwebtoken library to create JWT tokens
import jwt from "jsonwebtoken"

// This async function generates a JWT token for a given user ID
const genToken = async (userId) => {
    try {
        // Create and sign a token with the userId as payload
        // Secret key is stored securely in .env (environment variable)
        // Token will expire in 7 days
        const token = await jwt.sign(
            { userId },                // Payload: data to encode in the token
            process.env.JWT_SECRET,   // Secret key for signing the token
            { expiresIn: "7d" }       // Token will be valid for 7 days
        );

        // Return the generated token
        return token;
    } catch (error) {
        // If there's an error while generating token, log a custom message
        console.log("gen token error");
    }
}

// Export this function to use in other parts of the app (e.g., during login)
export default genToken;
