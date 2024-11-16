import express from "express"
import dotenv from "dotenv"
dotenv.config()

const PORT = process.env.PORT || 3001
const dbURL = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.qz32e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const app = express()

app.listen(process.env.PORT, () => {
    console.log(`server is starting at http://localhost:${PORT}`)
})
