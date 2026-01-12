import api from "@/lib/axios"

export type Message = {
  _id: string
  senderEmail: string
  senderName?: string
  text?: string
  createdAt: string
  file?: {
    url: string
    originalName: string
  }
}

export type MessagesResponse = {
  messages: Message[]
  nextCursor: string | null
}

export const getMessages = async ({
  groupId,
  cursor,
  limit = 15,
}: {
  groupId: string
  cursor?: string | null
  limit?: number
}): Promise<MessagesResponse> => {
  const res = await api.get(`/messages/${groupId}`, {
    params: { cursor, limit },
  })
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
