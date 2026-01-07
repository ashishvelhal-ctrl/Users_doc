import { useQuery } from "@tanstack/react-query"
import { fetchUsers } from "@/features/users/users.api"

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  })
}
