import mongoose, { Schema, Document, Model } from "mongoose"

export interface IGroup extends Document {
  name: string
  description?: string
  members: string[]     // ✅ EMAILS ONLY
  createdBy: string     // ✅ EMAIL ONLY
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
      type: [String],    // ✅ STRING ARRAY
      default: [],
    },

    createdBy: {
      type: String,      // ✅ STRING
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
)

export const Group: Model<IGroup> =
  mongoose.model<IGroup>("Group", groupSchema)
