import Post from "./post.model.js"
import User from "../user/user.model.js"
import Category from "../category/category.model.js"

export const addPost = async (req, res) => {
    try {
        const { title, content, categoryId } = req.body
        const userIdFromToken = req.user.uid

        if (!title || !content || !categoryId) {
            return res.status(400).send(
                { 
                    success: false, 
                    message: "All fields (title, content, categoryId) are required" 
                }
            )
        }

        const categoryExists = await Category.findById(categoryId)
        if (!categoryExists) {
            return res.status(400).send(
                { 
                    success: false, 
                    message: "Category does not exist" 
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

        const newPost = new Post({
            title,
            content,
            categoryId,
            userId: userIdFromToken,
            comments: []
        })

        await newPost.save()

        await User.findByIdAndUpdate(userIdFromToken, { $push: { posts: newPost._id } })
        await Category.findByIdAndUpdate(categoryId, { $push: { posts: newPost._id } })

        const populatedPost = await Post.findById(newPost._id)
            .populate("userId", "username email")
            .populate("categoryId", "name description")

        return res.status(201).send({
            success: true,
            message: "Post added successfully",
            post: populatedPost
        })

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error adding post",
            error: error.message
        })
    }
}

export const updatePost = async (req, res) => {
    try {
        const { id } = req.params
        const { title, content, categoryId } = req.body
        const userIdFromToken = req.user.uid

        const post = await Post.findById(id)
        if (!post) {
            return res.status(404).send(
                { 
                    success: false, 
                    message: "Post not found" 
                }
            )
        }

        if (post.userId.toString() !== userIdFromToken) {
            return res.status(403).send(
                { 
                    success: false, 
                    message: "You are not authorized to update this post" 
                }
            )
        }

        let categoryChanged = false
        if (categoryId && categoryId !== post.categoryId.toString()) {
            const categoryExists = await Category.findById(categoryId)
            if (!categoryExists) {
                return res.status(400).send(
                    { 
                        success: false, 
                        message: "Category does not exist" 
                    }
                )
            }
            categoryChanged = true
        }

        post.title = title || post.title
        post.content = content || post.content

        if (categoryChanged) {
            await Category.findByIdAndUpdate(post.categoryId, { $pull: { posts: post._id } })
            post.categoryId = categoryId
            await Category.findByIdAndUpdate(categoryId, { $push: { posts: post._id } })
        }

        await post.save()

        const populatedPost = await Post.findById(post._id)
            .populate("userId", "username email")
            .populate("categoryId", "name description")

        return res.status(200).send({
            success: true,
            message: "Post updated successfully",
            post: populatedPost
        })

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error updating post",
            error: error.message
        })
    }
}

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params
        const userIdFromToken = req.user.uid

        const post = await Post.findById(id)
        if (!post) {
            return res.status(404).send(
                { 
                    success: false, 
                    message: "Post not found" 
                }
            )
        }

        if (post.userId.toString() !== userIdFromToken) {
            return res.status(403).send(
                { 
                    success: false, 
                    message: "You are not authorized to delete this post" 
                }
            )
        }

        post.status = false
        await post.save()
        await Comment.updateMany({ postId: post._id }, { $set: { status: false } })
        await User.findByIdAndUpdate(post.userId, { $pull: { posts: post._id } })
        await Category.findByIdAndUpdate(post.categoryId, { $pull: { posts: post._id } })

        return res.status(200).send({
            success: true,
            message: "Post status changed to false, comments deactivated, and removed from related arrays",
            post
        })

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error updating post status",
            error: error.message
        })
    }
}


export const getAllPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query 
        const skip = (page - 1) * limit  
        const posts = await Post.find({ status: true }).populate("userId", "username email -_id").populate("categoryId", "name description -_id") .populate({
            path: 'comments',
            select: '-_id postId', 
            populate: {
                path: 'userId',
                select: 'username email -_id'
            }
        })
            .skip(skip)
            .limit(limit)
        if (posts.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No posts found"
            })
        }
        const totalPosts = await Post.countDocuments({ status: true })
        return res.status(200).send({
            success: true,
            message: "Posts retrieved successfully",
            posts,
            totalPosts,
        })

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error retrieving posts",
            error: error.message
        })
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query 
        const skip = (page - 1) * limit 
        const userIdFromToken = req.user.uid 
        const posts = await Post.find({ userId: userIdFromToken, status: true })
            .populate("userId", "username email -_id") 
            .populate("categoryId", "name description -_id") 
            .populate({
                path: 'comments',
                select: '-_id postId', 
                populate: {
                    path: 'userId',
                    select: 'username email -_id'
                }
            })
            .skip(skip)
            .limit(limit)

        if (posts.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No posts found"
            })
        }

        const totalPosts = await Post.countDocuments({ userId: userIdFromToken, status: true })

        return res.status(200).send({
            success: true,
            message: "Posts retrieved successfully",
            posts,
            totalPosts
        })

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error retrieving posts",
            error: error.message
        })
    }
}




