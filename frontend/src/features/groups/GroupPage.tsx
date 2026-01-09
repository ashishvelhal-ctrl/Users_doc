import { useParams } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"

import GroupHeader from "@/components/group/GroupHeader"
import GroupConversation from "@/components/group/GroupConversation"
import GroupMessageInput from "@/components/group/GroupMessageInput"

import { getGroupById } from "./groups.api"

export default function GroupPage() {
  const { groupId } = useParams({ strict: false })

  const { data: group, isLoading } = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => getGroupById(groupId),
  })

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="flex flex-col flex-1 bg-slate-900 text-white">
      <GroupHeader name={group.name} />
      <GroupConversation groupId={groupId} />
      <GroupMessageInput groupId={groupId} />
    </div>
  )
}
