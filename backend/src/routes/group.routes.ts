import { Router } from "express"
import {
  createGroup,
  getGroups,
  addMemberToGroup,getGroupById,
} from "../controllers/group.controller"

const router = Router()

router.post("/", createGroup)
router.get("/", getGroups)
router.post("/:groupId/add-member", addMemberToGroup)
router.get("/:groupId", getGroupById)


export default router
