import mongoose, { Schema, Document, Model } from "mongoose"

export interface IMessage extends Document {
  groupId: mongoose.Types.ObjectId
  senderEmail: string
  text?: string
  file?: {
    originalName: string
    fileName: string
    mimeType: string
    size: number
    url: string
  }
  createdAt: Date
  updatedAt: Date
}

const messageSchema = new Schema<IMessage>(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },

    senderEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    text: {
      type: String,
      trim: true,
    },

    file: {
      originalName: String,
      fileName: String,
      mimeType: String,
      size: Number,
      url: String,
    },
  },
  {
    timestamps: true,
  }
)

export const Message: Model<IMessage> =
  mongoose.model<IMessage>("Message", messageSchema)
