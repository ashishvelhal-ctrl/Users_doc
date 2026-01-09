import express, { Request, Response, NextFunction } from "express"
import cors from "cors"
import { ZodError } from "zod"

import authRoutes from "./routes/auth.routes"
import userRoutes from "./routes/user.routes"
import groupRoutes from "./routes/group.routes"
import messageRoutes from "./routes/message.routes"
import path from "path"



const app = express()


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
)
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/groups", groupRoutes)
app.use("/api/messages", messageRoutes)

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
)


app.use(
  (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      })
    }

    console.error("Unhandled error:", err)
    return res.status(500).json({
      message: "Internal server error",
    })
  }
)

export default app
