import { Request, Response } from "express"
import { Message } from "../models/message.model"
import { Group } from "../models/group.model"

export const getMessagesByGroup = async (
  req: Request,
  res: Response
) => {
  try {
    const { groupId } = req.params
    const { cursor, limit = 15 } = req.query

    const query: any = { groupId }
    if (cursor) {
      query._id = { $lt: cursor }
    }

    const messages = await Message.find(query)
      .sort({ _id: -1 })
      .limit(Number(limit))

    const nextCursor =
      messages.length > 0
        ? messages[messages.length - 1]._id
        : null

    res.status(200).json({
      messages: messages.reverse(),
      nextCursor,
    })
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

    const group = await Group.findById(groupId)
    if (!group) {
      return res
        .status(404)
        .json({ message: "Group not found" })
    }
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
