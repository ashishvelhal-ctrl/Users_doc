import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export const protect = (
  req: Request & { userId?: string },
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET!
    ) as any

    req.userId = decoded.userId
    next()
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" })
  }
}
