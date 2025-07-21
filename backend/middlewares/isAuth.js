// Import JWT library to verify tokens
import jwt from "jsonwebtoken"

// Middleware to check if user is authenticated
const isAuth = async (req, res, next) => {
  try {
    // Get token from cookies
    let token = req.cookies.token

    // If token is not found, send error
    if (!token) {
      return res.status(400).json({ message: "token is not found" })
    }

    // Verify the token using the secret key from environment variable
    let verifyToken = jwt.verify(token, process.env.JWT_SECRET)

    // If valid, store userId (from token payload) in req object
    // So it can be accessed in the next middleware/controller
    req.userId = verifyToken.userId

    // Call next() to proceed to the next function (controller or middleware)
    next()

  } catch (error) {
    // If any error (token invalid, expired, etc), log and send error response
    console.log(error)
    return res.status(500).json({ message: `isauth error ${error}` })
  }
}

// Export this middleware to be used in protected routes
export default isAuth
