import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  timeout: 10000,
})


export function useLoginMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await api.post('/auth/login', credentials)
      return response.data
    },
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data.user))
      queryClient.invalidateQueries({ queryKey: ["me"] })
      setTimeout(() => {
        navigate({ to: "/dashboard" })
      }, 100)
    },
  })
}

export function useSignupMutation() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (userData: { name: string; email: string; password: string }) => {
      const response = await api.post('/auth/signup', userData)
      return response.data
    },
    onSuccess: () => {
      navigate({ to: "/auth/login" })
    },
  })
}

export function useLogoutMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/auth/logout')
      return response.data
    },
    onSuccess: () => {
      localStorage.removeItem("user")
      queryClient.clear()
      navigate({ to: "/auth/login" })
    },
  })
}


export function useCreateGroupMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (groupData: { name: string; description?: string; users?: string[]; createdBy?: string }) => {
      const response = await api.post('/groups', groupData)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] })
      navigate({ to: `/groups/${data._id}` })
    },
  })
}

export function useUpdateGroupMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ groupId, data }: { groupId: string; data: { name?: string; description?: string } }) => {
      const response = await api.put(`/groups/${groupId}`, data)
      return response.data
    },
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] })
      queryClient.invalidateQueries({ queryKey: ["group", groupId] })
    },
  })
}

export function useDeleteGroupMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (groupId: string) => {
      const response = await api.delete(`/groups/${groupId}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] })
      navigate({ to: "/dashboard" })
    },
  })
}

export function useJoinGroupMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (groupId: string) => {
      const response = await api.post(`/groups/${groupId}/join`)
      return response.data
    },
    onSuccess: (_, groupId) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] })
      queryClient.invalidateQueries({ queryKey: ["group", groupId] })
    },
  })
}

export function useLeaveGroupMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (groupId: string) => {
      const response = await api.post(`/groups/${groupId}/leave`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] })
      navigate({ to: "/dashboard" })
    },
  })
}


export function useSendMessageMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ groupId, data }: { groupId: string; data: FormData }) => {
      const response = await api.post(`/messages/${groupId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    },
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: ["messages", groupId] })
    },
  })
}

export function useDeleteMessageMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ groupId, messageId }: { groupId: string; messageId: string }) => {
      const response = await api.delete(`/messages/${groupId}/${messageId}`)
      return response.data
    },
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: ["messages", groupId] })
    },
  })
}

export function useEditMessageMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ groupId, messageId, text }: { groupId: string; messageId: string; text: string }) => {
      const response = await api.patch(`/messages/${groupId}/${messageId}`, { text })
      return response.data
    },
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: ["messages", groupId] })
    },
  })
}


export function useUpdateProfileMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userData: { name?: string; email?: string; avatar?: string }) => {
      const response = await api.put('/users/profile', userData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] })
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: async (passwordData: { currentPassword: string; newPassword: string }) => {
      const response = await api.post('/users/change-password', passwordData)
      return response.data
    },
  })
}

export function useDeleteAccountMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async () => {
      const response = await api.delete('/users/account')
      return response.data
    },
    onSuccess: () => {
      localStorage.removeItem("user")
      queryClient.clear()
      navigate({ to: "/auth/login" })
    },
  })
}

export function useUploadFileMutation() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      const response = await api.post('/upload', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    },
  })
}

export function useDeleteFileMutation() {
  return useMutation({
    mutationFn: async (fileUrl: string) => {
      const response = await api.delete('/upload', { data: { fileUrl } })
      return response.data
    },
  })
}
