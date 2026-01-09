import { useQuery } from "@tanstack/react-query"
import { getMessages } from "@/features/groups/messages.api"
import { useEffect, useRef } from "react"

type Message = {
  _id: string
  text?: string
  senderEmail: string
  senderName?: string
  file?: {
    url: string
    originalName: string
  }
}

type Props = {
  groupId: string
}

const CURRENT_USER_EMAIL = "ashish@gmail.com"

const isImageFile = (filename: string) => {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(filename)
}

export default function GroupConversation({ groupId }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ["messages", groupId],
    queryFn: () => getMessages(groupId),
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="h-full overflow-y-auto p-4 bg-slate-900">
      {isLoading && <div className="h-full" />}

      {!isLoading && messages.length === 0 && (
        <div className="h-full flex items-center justify-center text-slate-500 text-sm">
          No messages yet
        </div>
      )}

      {!isLoading &&
        messages.map((msg) => {
          const isMe = msg.senderEmail === CURRENT_USER_EMAIL
          const fileUrl = msg.file
            ? `http://localhost:5000${msg.file.url}`
            : null

          return (
            <div
              key={msg._id}
              className={`max-w-[70%] mb-2 ${isMe ? "ml-auto" : ""}`}
            >
              <div
                className={`text-[11px] mb-1 ${
                  isMe
                    ? "text-right text-indigo-300"
                    : "text-indigo-400"
                }`}
              >
                {msg.senderName || msg.senderEmail}
              </div>

              <div
                className={`px-4 py-2 rounded-lg text-sm text-white ${
                  isMe
                    ? "bg-indigo-600 rounded-br-none"
                    : "bg-slate-800 rounded-bl-none"
                }`}
              >
                {msg.file &&
                  fileUrl &&
                  isImageFile(msg.file.originalName) && (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={fileUrl}
                        alt={msg.file.originalName}
                        className="max-w-full rounded-md mb-2 cursor-pointer"
                      />
                    </a>
                  )}

                {msg.text && <p>{msg.text}</p>}
                {msg.file &&
                  fileUrl &&
                  !isImageFile(msg.file.originalName) && (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-300 underline text-xs block mt-2"
                    >
                      📎 {msg.file.originalName}
                    </a>
                  )}
              </div>
            </div>
          )
        })}

      <div ref={bottomRef} />
    </div>
  )
}
