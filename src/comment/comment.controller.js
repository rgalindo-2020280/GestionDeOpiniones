import Comment from "./comment.model.js"
import Post from "../post/post.model.js"
import User from "../user/user.model.js"

export const addComment = async (req, res) => {
    try {
        const { postId, content } = req.body
        const userIdFromToken = req.user.uid

        if (!postId || !content) {
            return res.status(400).send(
                { 
                    success: false, 
                    message: "Post ID and content are required" 
                }
            )
        }
        const postExists = await Post.findById(postId)
        if (!postExists) {
            return res.status(400).send(
                { 
                    success: false, 
                    message: "Post does not exist" 
                }
            )
        }
        const userExists = await User.findById(userIdFromToken)
        if (!userExists) {
            return res.status(400).send(
                { 
                    success: false, 
                    message: "User does not exist" 
                }
            )
        }

        const newComment = new Comment({
                postId,
                userId: userIdFromToken,
                content
            }
        )
        await newComment.save()
        await Post.findByIdAndUpdate(postId, { $push: { comments: newComment._id } })
        await User.findByIdAndUpdate(userIdFromToken, { $push: { comments: newComment._id } })

        const populatedComment = await Comment.findById(newComment._id).populate("userId", "username email -_id").populate("postId", "title -_id")

        return res.status(201).send({
                success: true,
                message: "Comment added successfully",
                comment: populatedComment
            }
        )
    } catch (error) {
        return res.status(500).send({
                success: false,
                message: "Error adding comment",
                error: error.message
            }
        )
    }
}

export const updateComment = async (req, res) => {
    try {
        const { id } = req.params
        const { content, postId } = req.body
        const userIdFromToken = req.user.uid
        const comment = await Comment.findById(id)
        if (!comment) {
            return res.status(404).send(
                { 
                    success: false, 
                    message: "Comment not found" 
                }
            )
        }
        if (comment.userId.toString() !== userIdFromToken) {
            return res.status(403).send(
                { 
                    success: false, 
                    message: "You are not authorized to edit this comment" 
                }
            )
        }
        let postChanged = false
        if (postId && postId !== comment.postId.toString()) {
            const newPostExists = await Post.findById(postId)
            if (!newPostExists) {
                return res.status(400).send(
                    { 
                        success: false, 
                        message: "New post does not exist" 
                    }
                )
            }
            postChanged = true
        }
        comment.content = content || comment.content
        if (postChanged) {
            await Post.findByIdAndUpdate(comment.postId, { $pull: { comments: comment._id } })
            await User.findByIdAndUpdate(comment.userId, { $pull: { comments: comment._id } })
            comment.postId = postId
            await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } })
            await User.findByIdAndUpdate(comment.userId, { $push: { comments: comment._id } })
        }
        await comment.save()
        const populatedComment = await Comment.findById(comment._id).populate("userId", "username email -_id").populate("postId", "title -_id")
        return res.status(200).send({
            success: true,
            message: "Comment updated successfully",
            comment: populatedComment
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error updating comment",
            error: error.message
        })
    }
}

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params
        const userIdFromToken = req.user.uid

        const comment = await Comment.findById(id)
        if (!comment) {
            return res.status(404).send(
                { 
                    success: false, 
                    message: "Comment not found" 
                }
            )
        }

        if (comment.userId.toString() !== userIdFromToken) {
            return res.status(403).send(
                { 
                    success: false, 
                    message: "You are not authorized to delete this comment" 
                }
            )
        }
        comment.status = false
        await comment.save()
        await Post.findByIdAndUpdate(comment.postId, { $pull: { comments: comment._id } })
        await User.findByIdAndUpdate(comment.userId, { $pull: { comments: comment._id } })

        return res.status(200).send({
            success: true,
            message: "Comment status changed to false and removed from related arrays",
            comment
        })

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error updating comment status",
            error: error.message
        })
    }
}

export const getComments = async (req, res) => {
    try {
        const { postId } = req.body
        if (!postId) {
            return res.status(400).send({ success: false, message: "Post ID is required" })
        }
        const postExists = await Post.findById(postId)
        if (!postExists) {
            return res.status(400).send(
                { 
                    success: false, 
                    message: "Post does not exist" 
                }
            )
        }
        const comments = await Comment.find({ postId }).populate("userId", "username email -_id").populate("postId", "title -_id")
        if (comments.length === 0) {
            return res.status(404).send(
                { 
                    success: false, 
                    message: "No comments found for this post" 
                }
            )
        }
        return res.status(200).send({
            success: true,
            message: "Comments retrieved successfully",
            comments
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error retrieving comments",
            error: error.message
        })
    }
}

export const getAllComments = async (req, res) => {
    try {
        const userIdFromToken = req.user.uid 
        const comments = await Comment.find({ userId: userIdFromToken, status: true }).populate("userId", "username email -_id").populate("postId", "title -_id") 
        if (comments.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No comments found"
            })
        }

        return res.status(200).send(
            {
                success: true,
                message: "Comments retrieved successfully",
                comments
            }
        )

    } catch (error) {
        return res.status(500).send(
            {
                success: false,
                message: "Error retrieving comments",
                error: error.message
            }
        )
    }
}

