import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model"

// helpers
const createAccessToken = (userId: string) =>
  jwt.sign(
    { userId },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: "15m" }
  )

const createRefreshToken = (userId: string) =>
  jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
  )

// ✅ SIGNUP (almost same)
export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  })

  res.status(201).json({
    message: "User created",
    user: { id: user._id, email: user.email },
  })
}

// ✅ LOGIN (COOKIE BASED)
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" })
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" })
  }

  const accessToken = createAccessToken(user._id.toString())
  const refreshToken = createRefreshToken(user._id.toString())

  // save refresh token
  user.refreshToken = refreshToken
  await user.save()

  // ✅ send refresh token as cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // true in production (HTTPS)
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })

  // ❌ DO NOT send token in response
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    accessToken, // optional (can keep only in memory)
  })
}

// ✅ REFRESH ACCESS TOKEN
export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken
  if (!token) return res.sendStatus(401)

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET!
    ) as any

    const user = await User.findById(payload.userId)
    if (!user || user.refreshToken !== token) {
      return res.sendStatus(403)
    }

    const newAccessToken = createAccessToken(user._id.toString())
    res.json({ accessToken: newAccessToken })
  } catch {
    res.sendStatus(403)
  }
}

// ✅ LOGOUT
export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken

  if (token) {
    const payload = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET!
    ) as any

    await User.findByIdAndUpdate(payload.userId, {
      refreshToken: null,
    })
  }

  res.clearCookie("refreshToken")
  res.sendStatus(204)
}

export const me = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
      return res.status(401).json({ message: "Not authenticated" })
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as any

    const user = await User.findById(decoded.userId)
      .select("_id name email")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch {
    return res.status(401).json({ message: "Invalid token" })
  }
}

// unchanged
export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await User.find()
    .select("_id name email")
    .sort({ createdAt: -1 })

  res.json(users)
}
