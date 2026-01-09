import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import GroupChatLayout from "../../../components/group/GroupChatLayout"
import { getGroupById } from "@/features/groups/groups.api"

export const Route = createFileRoute("/app/groups/$groupId")({
  component: GroupChatPage,
})

function GroupChatPage() {
  const { groupId } = Route.useParams()

  const { data: group, isLoading } = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => getGroupById(groupId),
  })

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Loading group...
      </div>
    )
  }

  if (!group) {
    return (
      <div className="h-full flex items-center justify-center text-red-500">
        Group not found
      </div>
    )
  }

  return (
    <div className="h-full">
      <GroupChatLayout
        groupId={groupId}
        groupName={group.name}
      />
    </div>
  )
}
