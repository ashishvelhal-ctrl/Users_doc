import api from "@/lib/axios"

export type Message = {
  _id: string
  senderEmail: string
  text?: string
  file?: {
    originalName: string
    url: string
    mimeType: string
  }
  createdAt: string
}

export const getMessages = async (
  groupId: string
): Promise<Message[]> => {
  const res = await api.get(`/messages/${groupId}`)
  return res.data
}

export const sendMessage = async (
  groupId: string,
  data: FormData
) => {
  const res = await api.post(`/messages/${groupId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return res.data
}
