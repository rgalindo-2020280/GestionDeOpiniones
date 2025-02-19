import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const commentSchema = new Schema({
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: [true, "Post ID is required"]
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"]
        },
        content: {
            type: String,
            required: [true, "Content is required"],
            maxLength: [500, "Cannot exceed 500 characters"]
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
)

export default model("Comment", commentSchema)
