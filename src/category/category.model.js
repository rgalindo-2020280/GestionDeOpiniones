import { Schema, model } from "mongoose";

const categorySchema = new Schema({
        name: {
            type: String,
            required: [true, "Category name is required"],
            unique: true,
            maxLength: [50, "Cannot exceed 50 characters"]
        },
        description: {
            type: String,
            maxLength: [250, "Cannot exceed 250 characters"]
        },
        posts: [{
            type: Schema.Types.ObjectId,
            ref: "Post"
        }],
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
)

const Category = model("Category", categorySchema)

const createCategory = async () => {
    try {
        const categoryExists = await Category.findOne({ name: "General" })
        if (!categoryExists) {
            const defaultCategory = new Category({
                name: "General", 
                description: "Default category"
            })
            await defaultCategory.save();
            console.log("Default category created");
        }
    } catch (error) {
        console.error("Error creating default category:", error)
    }
}

createCategory()
export default Category
