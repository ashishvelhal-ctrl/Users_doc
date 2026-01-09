import { useQuery } from "@tanstack/react-query"
import axios from "@/lib/axios"

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await axios.get("/auth/me")
      return res.data
    },
    retry: false,
  })

  return { user, isLoading }
}
