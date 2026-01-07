import axios from "axios"

const API = axios.create({
  baseURL: "http://localhost:5000/api",
})

export const signupApi = (data: any) =>
  API.post("/auth/signup", data)

export const loginApi = (data: any) =>
  API.post("/auth/login", data)
