import mongoose, { Schema } from "mongoose";

const schema = new Schema({
    name: String,
    email: {
        require: true,
        type: String
    },
    password: {
        require: true,
        type: String
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

const CustomerModel = mongoose.model('customers', schema)
export default CustomerModel