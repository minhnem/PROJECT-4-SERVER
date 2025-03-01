import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import userRouter from "./src/router/user"
import storegeRouter from "./src/router/storege"
import supplierRouter from "./src/router/supplier"
import productRouter from "./src/router/productRouter"
import cors from "cors"
import { verifyToken } from "./src/middlewares/verifyToken"
import customerRouter from "./src/router/customerRouter"
import promotionRouter from "./src/router/promotionRouter"

dotenv.config()

const PORT = process.env.PORT
const dbURL = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.qz32e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const app = express()

app.use(express.json())
app.use(cors())

app.use("/auth", userRouter)
app.use("/customer", customerRouter)
app.use("/product", productRouter)
app.use("/promotion", promotionRouter)

app.use(verifyToken)
app.use("/storege", storegeRouter)
app.use("/supplier", supplierRouter)

const connectDB = async () => {
    try {
        await mongoose.connect(dbURL)
        console.log("connect to db successfully") 
    } catch (error) {
        console.log(`can not connect to db ${error}`)
    }
}

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server is starting at http://localhost:${PORT}`)
    })
}).catch((error) => {
    console.log(error)
})
