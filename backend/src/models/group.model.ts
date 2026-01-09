import mongoose, { Schema, Document, Model } from "mongoose"

export interface IGroup extends Document {
  name: string
  description?: string
  members: mongoose.Types.ObjectId[]
  createdBy?: {
    email?: string
  }
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

    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    createdBy: {
      email: {
        type: String,
        required: false, 
        lowercase: true,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
)

export const Group: Model<IGroup> = mongoose.model<IGroup>(
  "Group",
  groupSchema
)
