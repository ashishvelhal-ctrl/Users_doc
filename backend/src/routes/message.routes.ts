import { Router } from "express"
import {
  getMessagesByGroup,
  sendMessage,
} from "../controllers/message.controller"
import { upload } from "../middlewares/upload.middleware"

const router = Router()

router.get("/:groupId", getMessagesByGroup)

router.post(
  "/:groupId",
  upload.single("file"),
  sendMessage
)

export default router
