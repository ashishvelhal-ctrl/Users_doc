import { Request, Response } from "express"
import { Group } from "../models/group.model"

export const createGroup = async (req: Request, res: Response) => {
  try {
    console.log("REQ BODY:", req.body) 

    const name = req.body.name
    const description = req.body.description
    const users = req.body.users || []
    const creatorEmail = req.body?.createdBy?.email

    if (!name) {
      return res.status(400).json({ message: "Group name required" })
    }

    if (!creatorEmail) {
      return res.status(400).json({
        message: "Creator email is required",
      })
    }

    const group = await Group.create({
      name,
      description,
      members: users,
      createdBy: {
        email: creatorEmail, 
      },
    })

    res.status(201).json(group)
  } catch (error) {
    console.error("Create group error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const getGroups = async (_req: Request, res: Response) => {
  try {
    const groups = await Group.find()
      .select("_id name") 
      .sort({ createdAt: -1 })

    res.json(groups)
  } catch (error) {
    console.error("Get groups error:", error)
    res.status(500).json({ message: "Failed to load groups" })
  }
}

export const getGroupById = async (req: Request, res: Response) => {
  const group = await Group.findById(req.params.groupId)
    .populate("members", "name email")

  if (!group) {
    return res.status(404).json({ message: "Group not found" })
  }

  res.json(group)
}



export const addMemberToGroup = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({ message: "User ID required" })
    }

    const group = await Group.findByIdAndUpdate(
      groupId,
      { $addToSet: { members: userId } },
      { new: true }
    ).populate("members", "name email")

    res.json(group)
  } catch (error) {
    console.error("Add member error:", error)
    res.status(500).json({ message: "Failed to add member" })
  }
}
