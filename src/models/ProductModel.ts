import mongoose, { Schema } from "mongoose";

const schema = new Schema({
    title: {
        type: String,
        require: true
    },
    slug: String,
    description: String,
    categories: [String],
    supplier: {
        type: String, 
        require: true
    },
    expiryDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    } 
})

const ProductModel = mongoose.model('products', schema)
export default ProductModel