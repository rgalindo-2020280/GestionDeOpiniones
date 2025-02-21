import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const postSchema = new Schema({
        title: {
            type: String,
            required: [true, "Title is required"],
            maxLength: [100, "Cannot exceed 100 characters"]
        },
        content: {
            type: String,
            required: [true, "Content is required"]
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Category is required"]
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"]
        },
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }],
        status: {
            type: Boolean,
            default: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
)

export default model("Post", postSchema)
