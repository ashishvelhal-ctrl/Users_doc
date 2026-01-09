import app from "./app.js"
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("MongoDB connected")
    app.listen(5000, () => {
      console.log("Server running on http://localhost:5000")
    })
  })
  .catch(console.error)
