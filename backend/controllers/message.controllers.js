// Import Cloudinary upload utility
import uploadOnCloudinary from "../config/cloudinary.js";

// Import MongoDB models
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

// Import Socket.IO and a function to get the receiver's socket ID
import { getReceiverSocketId, io } from "../socket/socket.js";

// =============================
// Controller to SEND a message
// =============================
export const sendMessage = async (req, res) => {
    try {
        // Get sender ID from authenticated request (added via middleware)
        let sender = req.userId;

        // Get receiver ID from the URL parameters
        let { receiver } = req.params;

        // Get message content from request body
        let { message } = req.body;

        let image;

        // If there is an image file in the request, upload it to Cloudinary
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path);
        }

        // Check if a conversation already exists between sender and receiver
        let conversation = await Conversation.findOne({
            partcipants: { $all: [sender, receiver] }
        });

        // Create new message document
        let newMessage = await Message.create({
            sender,
            receiver,
            message,
            image
        });

        // If conversation doesn't exist, create a new one with this message
        if (!conversation) {
            conversation = await Conversation.create({
                partcipants: [sender, receiver],
                messages: [newMessage._id]
            });
        } else {
            // If conversation exists, add new message to messages array
            conversation.messages.push(newMessage._id);
            await conversation.save(); // Save updated conversation
        }

        // Find the receiver's socket ID (if online)
        const receiverSocketId = getReceiverSocketId(receiver);

        // If the receiver is online, send them the message using Socket.IO
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        // Respond with the newly created message
        return res.status(201).json(newMessage);

    } catch (error) {
        // Handle any errors and send error message
        return res.status(500).json({ message: `send Message error ${error}` });
    }
};


// =============================
// Controller to GET all messages between two users
// =============================
export const getMessages = async (req, res) => {
    try {
        // Get sender ID from auth middleware
        let sender = req.userId;

        // Get receiver ID from URL parameter
        let { receiver } = req.params;

        // Find the conversation that includes both sender and receiver
        let conversation = await Conversation.findOne({
            partcipants: { $all: [sender, receiver] }
        }).populate("messages"); // Populate the messages with full details

        // Return the messages array if found, otherwise return null
        return res.status(200).json(conversation?.messages);

    } catch (error) {
        // Handle any errors that occur
        return res.status(500).json({ message: `get Message error ${error}` });
    }
};
