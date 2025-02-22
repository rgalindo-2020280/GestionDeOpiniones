import Category from "./category.model.js"
import Post from "../post/post.model.js"

export const addCategory = async (req, res) => {
    try {
        const { name, description, postIds } = req.body

        if (!name) {
            return res.status(400).send({ success: false, message: "Category name is required" })
        }

        const existingCategory = await Category.findOne({ name })
        if (existingCategory) {
            return res.status(400).send({ success: false, message: "Category already exists" })
        }

        const newCategory = new Category({
            name,
            description: description || "",
            posts: []
        })

        await newCategory.save()

        if (postIds && postIds.length > 0) {
            await Post.updateMany(
                { _id: { $in: postIds } },
                { $set: { categoryId: newCategory._id } }
            )
            newCategory.posts = postIds
            await newCategory.save()
        }

        const populatedCategory = await Category.findById(newCategory._id).populate("posts", "title content")

        return res.status(201).send({
            success: true,
            message: "Category added successfully",
            category: populatedCategory
        })

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error adding category",
            error: error.message
        })
    }
}

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params
        const { name, description, postIds } = req.body
        const category = await Category.findById(id)
        if (!category) {
            return res.status(404).send(
                { 
                    success: false, 
                    message: "Category not found" 
                }
            )
        }

        if (name && name !== category.name) {
            const existingCategory = await Category.findOne({ name })
            if (existingCategory) {
                return res.status(400).send(
                    { 
                        success: false, 
                        message: "Category name already exists" 
                    }
                )
            }
        }

        category.name = name || category.name
        category.description = description || category.description

        if (postIds) {
            await Post.updateMany(
                { categoryId: category._id },
                { $unset: { categoryId: "" } }
            )

            await Post.updateMany(
                { _id: { $in: postIds } },
                { $set: { categoryId: category._id } }
            )

            category.posts = postIds
        }

        await category.save()

        const populatedCategory = await Category.findById(category._id).populate("posts", "title content")

        return res.status(200).send({
            success: true,
            message: "Category updated successfully",
            category: populatedCategory
        })

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error updating category",
            error: error.message
        })
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params
        const category = await Category.findById(id)
        if (!category) {
            return res.status(404).send(
                { 
                    success: false, 
                    message: "Category not found" 
                }
            )
        }
        const defaultCategory = await Category.findOne({ name: "General" })
        if (!defaultCategory) {
            return res.status(500).send(
                { 
                    success: false, 
                    message: "Default category not found. Cannot proceed with deletion." 
                }
            )
        }
        const postsToUpdate = await Post.find({ categoryId: category._id })
        await Post.updateMany(
            { categoryId: category._id },
            { $set: { categoryId: defaultCategory._id } }
        )
        if (postsToUpdate.length > 0) {
            await Category.findByIdAndUpdate(defaultCategory._id, {
                $push: { posts: { $each: postsToUpdate.map(post => post._id) } }
            })
        }
        await Category.findByIdAndDelete(id)
        const populatedDefaultCategory = await Category.findById(defaultCategory._id).populate("posts", "title content")
        return res.status(200).send({
            success: true,
            message: "Category deleted successfully. Posts moved to default category.",
            defaultCategory: populatedDefaultCategory
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error deleting category",
            error: error.message
        })
    }
}

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().populate("posts", "title content -_id")

        if (categories.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No categories found"
            })
        }

        return res.status(200).send({
            success: true,
            message: "Categories retrieved successfully",
            categories
        })

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error retrieving categories",
            error: error.message
        })
    }
}
