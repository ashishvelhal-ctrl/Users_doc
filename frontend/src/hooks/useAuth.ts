import { useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "@/lib/axios"
import { logoutApi } from "@/features/auth/auth.api"

export function useAuth() {
  const queryClient = useQueryClient()

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await axios.get("/auth/me")
      return res.data
    },
    retry: false,
  })

  const logout = async () => {
    await logoutApi()
    queryClient.clear() 
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !isError,
    logout,
  }
}
