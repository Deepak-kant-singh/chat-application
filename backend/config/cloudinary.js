// Importing Cloudinary v2 SDK for image uploads
import { v2 as cloudinary } from 'cloudinary';

// Importing Node.js built-in file system module to delete local files after upload
import fs from "fs";

// This is an async function to upload a file to Cloudinary
const uploadOnCloudinary = async (filePath) => {

    // Configure Cloudinary credentials from environment variables (.env file)
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,   // Your Cloudinary cloud name
        api_key: process.env.API_KEY,         // Your Cloudinary API key
        api_secret: process.env.API_SECRET    // Your Cloudinary secret key
    });

    try {
        // Upload file to Cloudinary using the file path provided
        const uploadResult = await cloudinary.uploader.upload(filePath);

        // After successful upload, delete the local file to save storage
        fs.unlinkSync(filePath);

        // Return the secure URL of the uploaded image (public Cloudinary link)
        return uploadResult.secure_url;

    } catch (error) {
        // If any error occurs during upload, also delete the local file
        fs.unlinkSync(filePath);

        // Log the error for debugging
        console.log(error);
    }
}

// Export the function so it can be used in other files
export default uploadOnCloudinary;
