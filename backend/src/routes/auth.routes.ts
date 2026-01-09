import { Router } from "express"
import {
  login,
  signup,
  refreshToken,
  logout,
  me,           
} from "../controllers/auth.controller"


const router = Router()

router.post("/login", login)
router.post("/signup", signup)
router.post("/refresh", refreshToken)
router.post("/logout", logout)
router.get("/me", me)


export default router
