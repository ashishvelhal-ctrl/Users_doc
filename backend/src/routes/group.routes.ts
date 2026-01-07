import { Router } from "express"
import { protect } from "../middlewares/auth.middleware"
import {
  createGroup,
  getMyGroups,
  addMember,
} from "../controllers/group.controller"

const router = Router()

router.post("/", protect, createGroup)
router.get("/", protect, getMyGroups)
router.post("/:groupId/add-member", protect, addMember)

export default router
