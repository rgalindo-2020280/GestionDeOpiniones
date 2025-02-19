import Post from './post.model.js'
import User from '../user/user.model.js'
import Comment from '../comment/comment.model.js'
import Category from '../category/category.model.js'

export const addPost = async (req, res) => {
    try {
        const { title, content, categoryId, userId } = req.body
        if (!title || !content || !categoryId || !userId) {
            return res.status(400).send(
                { 
                    success: false, 
                    message: "All fields (title, content, categoryId, userId) are required" 
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
        const userExists = await User.findById(userId)
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
                userId,
                comments: []
            }
        )
        await newPost.save()
        return res.status(201).send(
            { 
                success: true, 
                message: "Post added successfully", post: newPost 
            }
        )
    } catch (error) {
        return res.status(500).send(
            { 
                success: false, 
                message: "Error adding post", error: error.message 
            }
        )
    }
}