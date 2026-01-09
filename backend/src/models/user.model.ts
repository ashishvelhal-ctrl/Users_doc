import mongoose, { Schema, Document, Model } from "mongoose"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  refreshToken?: string | null 
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },

    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
)

export const User: Model<IUser> = mongoose.model<IUser>(
  "User",
  userSchema
)
