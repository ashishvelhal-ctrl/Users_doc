import { useQuery } from "@tanstack/react-query"
import { fetchGroups } from "@/features/groups/groups.api"

export function useGroups() {
  return useQuery({
    queryKey: ["groups"],
    queryFn: fetchGroups,
  })
}
