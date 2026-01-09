import { Router } from "express"
import { signup, login, getAllUsers } from "../controllers/auth.controller"

const router = Router()

router.post("/signup", signup)
router.post("/login", login)
router.get("/", getAllUsers)


export default router
