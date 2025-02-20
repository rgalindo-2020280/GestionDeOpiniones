import Comment from './comment.model.js'
import Post from '../post/post.model.js'
import User from '../user/user.model.js'

export const addComment = async (req, res) => {
    try {
        const { postId, content } = req.body
        const userIdFromToken = req.user.uid

        if (!postId || !content) {
            return res.status(400).send({ success: false, message: "Post ID and content are required" })
        }

        const postExists = await Post.findById(postId)
        if (!postExists) {
            return res.status(400).send({ success: false, message: "Post does not exist" })
        }

        const userExists = await User.findById(userIdFromToken)
        if (!userExists) {
            return res.status(400).send({ success: false, message: "User does not exist" })
        }

        const newComment = new Comment({
            postId,
            userId: userIdFromToken,
            content
        })

        await newComment.save()

        await Post.findByIdAndUpdate(postId, { $push: { comments: newComment._id } })
        await User.findByIdAndUpdate(userIdFromToken, { $push: { comments: newComment._id } })

        return res.status(201).send({
            success: true,
            message: "Comment added successfully",
            comment: newComment
        })

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error adding comment",
            error: error.message
        })
    }
}

export const updateComment = async (req, res) => {
    try {
        const { id } = req.params
        const { content, postId } = req.body
        const userIdFromToken = req.user.uid

        const comment = await Comment.findById(id)
        if (!comment) {
            return res.status(404).send({ success: false, message: "Comment not found" })
        }

        if (comment.userId.toString() !== userIdFromToken) {
            return res.status(403).send({ success: false, message: "You are not authorized to edit this comment" })
        }

        let postChanged = false

        if (postId && postId !== comment.postId.toString()) {
            const newPostExists = await Post.findById(postId)
            if (!newPostExists) {
                return res.status(400).send({ success: false, message: "New post does not exist" })
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

        return res.status(200).send({
            success: true,
            message: "Comment updated successfully",
            comment
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
            return res.status(404).send({ success: false, message: "Comment not found" })
        }

        if (comment.userId.toString() !== userIdFromToken) {
            return res.status(403).send({ success: false, message: "You are not authorized to delete this comment" })
        }

        await Comment.findByIdAndDelete(id)

        await Post.findByIdAndUpdate(comment.postId, { $pull: { comments: id } })

        return res.status(200).send({
            success: true,
            message: "Comment deleted successfully"
        })

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error deleting comment",
            error: error.message
        })
    }
}
