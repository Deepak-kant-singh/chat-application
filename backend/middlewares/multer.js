// Import multer for handling file uploads
import multer from "multer";

// Define storage configuration for multer
const storage = multer.diskStorage({
    // Specify the destination folder where files will be stored
    destination: (req, file, cb) => {
        cb(null, "./public"); // Store files in the 'public' folder
    },

    // Specify the filename to be used when saving the file
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use the original file name
    }
});

// Export a multer instance configured with the storage settings
// This can be used as middleware in routes to handle file uploads
export const upload = multer({ storage });
