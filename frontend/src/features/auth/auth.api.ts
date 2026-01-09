import axios from "axios"

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
})

export const signupApi = (data: any) =>
  API.post("/auth/signup", data)

export const loginApi = (data: any) =>
  API.post("/auth/login", data)

export const meApi = () =>
  API.get("/auth/me")

export const logoutApi = () =>
  API.post("/auth/logout")

export default API
