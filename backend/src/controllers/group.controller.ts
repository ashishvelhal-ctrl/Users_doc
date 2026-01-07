import { Request, Response } from "express"
import { Group } from "../model/group.model"

export const createGroup = async (
  req: Request & { userId?: string },
  res: Response
) => {
  const { name, description, members } = req.body

  const group = await Group.create({
    name,
    description,
    createdBy: req.userId,
    members: [req.userId, ...(members || [])],
  })

  res.status(201).json(group)
}

export const getMyGroups = async (
  req: Request & { userId?: string },
  res: Response
) => {
  const groups = await Group.find({
    members: req.userId,
  }).populate("members", "name email")

  res.json(groups)
}

export const addMember = async (
  req: Request & { userId?: string },
  res: Response
) => {
  const { groupId } = req.params
  const { userId } = req.body

  const group = await Group.findByIdAndUpdate(
    groupId,
    { $addToSet: { members: userId } },
    { new: true }
  )

  res.json(group)
}
