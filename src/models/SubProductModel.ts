import mongoose, { Schema } from "mongoose";

const schema = new Schema({
    size: String,
    color: String,
    price: {
        type: Number,
        required: true
    },
    qty: {
        type: Number,
        default: 0,
        required: true
    },
    images: {
        type: [String]
    },
    productId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})

const SubProductModel = mongoose.model('subproducts', schema)
export default SubProductModel