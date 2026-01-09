import api from "@/lib/axios"

export const getGroupById = async (groupId: string) => {
  const res = await api.get(`/groups/${groupId}`)
  return res.data
}
