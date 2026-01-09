import { Request, Response } from "express"
import { Message } from "../models/message.model"
import { Group } from "../models/group.model"

export const getMessagesByGroup = async (
  req: Request,
  res: Response
) => {
  try {
    const { groupId } = req.params

    const messages = await Message.find({ groupId })
      .sort({ createdAt: 1 })

    res.json(messages)
  } catch (error) {
    console.error("Get messages error:", error)
    res.status(500).json({ message: "Failed to load messages" })
  }
}

export const sendMessage = async (
  req: Request,
  res: Response
) => {
  try {
    const { text, senderEmail } = req.body
    const { groupId } = req.params

    if (!text && !req.file) {
      return res
        .status(400)
        .json({ message: "Message is empty" })
    }

    // ✅ Validate group
    const group = await Group.findById(groupId)
    if (!group) {
      return res
        .status(404)
        .json({ message: "Group not found" })
    }

    // ✅ CORRECT FIELD: groupId (not group)
    const message = await Message.create({
      groupId: groupId,
      senderEmail,
      text: text?.trim() || undefined,

      file: req.file
        ? {
            originalName: req.file.originalname,
            fileName: req.file.filename,
            mimeType: req.file.mimetype,
            size: req.file.size,
            url: `/uploads/${req.file.filename}`,
          }
        : undefined,
    })

    res.status(201).json(message)
  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error)
    res.status(500).json({
      message: "Internal server error",
    })
  }
}
