import mongoose, { Schema } from "mongoose";

const schema = new Schema({
    title: {
        type: String,
        require: true,
    },
    parentId: String,
    slug: {
        type: String,
    },
    description: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
})

const CategoryModel = mongoose.model('categories', schema)
export default CategoryModel