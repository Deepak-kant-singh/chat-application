// Importing Mongoose library to connect with MongoDB
import mongoose from "mongoose";

// Creating an async function to connect to MongoDB
const connectDb = async () => {
    try {
        // Using Mongoose to connect to the database
        // The connection string is stored in an environment variable for security
        await mongoose.connect(process.env.MONGODB_URL);

        // If connection is successful, log this message
        console.log("db connected");
    } catch (error) {
        // If any error occurs while connecting, log the error message
        console.log("db error", error.message);
    }
}

// Exporting the connectDb function so it can be used in other parts of the app (like index.js/server.js)
export default connectDb;
