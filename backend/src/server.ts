import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())


mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => {
    console.error(" MongoDB connection error:", err)
    process.exit(1)
  })


const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
  },
  { timestamps: true }
)

const User = mongoose.model("User", userSchema)


app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" })
  }

  res.json({
    token: "fake-jwt-token",
    user: { id: user._id, email: user.email },
  })
})


app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" })
  }

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(409).json({ message: "Email already registered" })
  }

  const user = await User.create({ name, email, password })

  res.status(201).json({
    message: "User created successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(` Backend running on http://localhost:${PORT}`)
})
