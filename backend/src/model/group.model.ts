import mongoose, { Schema, Document, Model } from "mongoose"

export interface IGroup extends Document {
  name: string
  description?: string
  members: string[]     
  createdBy: string    
  createdAt: Date
  updatedAt: Date
}

const groupSchema = new Schema<IGroup>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    members: {
      type: [String],    
      default: [],
    },

    createdBy: {
      type: String,     
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
)

export const Group: Model<IGroup> =
  mongoose.model<IGroup>("Group", groupSchema)
