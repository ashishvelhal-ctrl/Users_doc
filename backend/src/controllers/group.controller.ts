import { Request, Response } from "express"
import { Group } from "../models/group.model"
import { User } from "../models/user.model"
import mongoose from "mongoose"

export const createGroup = async (req: Request, res: Response) => {
  try {
    const { name, description, users = [], createdBy } = req.body

    if (!name || !createdBy) {
      return res.status(400).json({
        message: "Group name and creator id required",
      })
    }
    if (!mongoose.Types.ObjectId.isValid(createdBy)) {
      return res.status(400).json({ message: "Invalid creator id" })
    }

    const creator = await User.findById(createdBy)
    if (!creator) {
      return res.status(404).json({ message: "Creator not found" })
    }

    const members = Array.from(
      new Set([
        createdBy,
        ...users.filter((u: string) =>
          mongoose.Types.ObjectId.isValid(u)
        ),
      ])
    )

    const group = await Group.create({
      name: name.trim(),
      description,
      createdBy,
      members,
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
