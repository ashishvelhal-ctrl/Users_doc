import { api } from "@/lib/axios"

export const loginApi = (data: {
  email: string
  password: string
}) => api.post("/auth/login", data)

export const signupApi = (data: {
  name: string
  email: string
  password: string
}) => api.post("/auth/signup", data)
