import GroupHeader from "./GroupHeader"
import GroupConversation from "./GroupConversation"
import GroupMessageInput from "./GroupMessageInput"

type Props = {
  groupId: string
  groupName: string
}

export default function GroupChatLayout({ groupId, groupName }: Props) {
  return (
    <div className="h-full flex flex-col bg-slate-900">
      <GroupHeader name={groupName} />
      <div className="flex-1 overflow-hidden">
        <GroupConversation groupId={groupId} />
      </div>
      <GroupMessageInput groupId={groupId} />
    </div>
  )
}
