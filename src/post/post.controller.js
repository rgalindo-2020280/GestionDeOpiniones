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
        await User.findByIdAndUpdate(post.userId, { $pull: { posts: post._id } })
        await Category.findByIdAndUpdate(post.categoryId, { $pull: { posts: post._id } })
        return res.status(200).send({
            success: true,
            message: "Post status changed to false and removed from related arrays",
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

