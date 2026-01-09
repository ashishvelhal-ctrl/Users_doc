import { useQuery } from "@tanstack/react-query"
import { getMessages } from "@/features/groups/messages.api"
import { useLayoutEffect, useRef, useState } from "react"

type Message = {
  _id: string
  text?: string
  senderEmail: string
  senderName?: string
  createdAt: string
  file?: {
    url: string
    originalName: string
  }
}

type Props = {
  groupId: string
}

const PAGE_SIZE = 15

const isImageFile = (filename: string) =>
  /\.(jpg|jpeg|png|gif|webp)$/i.test(filename)

export default function GroupConversation({ groupId }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const currentUser = JSON.parse(localStorage.getItem("user") || "null")

  const { data = [], isLoading } = useQuery<Message[]>({
    queryKey: ["messages", groupId],
    queryFn: () => getMessages(groupId),
  })
  const sortedMessages = [...data].sort(
    (a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)
  )
  const visibleMessages = sortedMessages.slice(
    Math.max(sortedMessages.length - visibleCount, 0)
  )
  useLayoutEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [data.length])
  const handleScroll = () => {
    if (!containerRef.current) return

    if (
      containerRef.current.scrollTop === 0 &&
      visibleCount < sortedMessages.length &&
      !isLoadingMore
    ) {
      setIsLoadingMore(true)
      setTimeout(() => {
        setVisibleCount((prev) =>
          Math.min(prev + PAGE_SIZE, sortedMessages.length)
        )
        setIsLoadingMore(false)
      }, 400)
    }
  }

  return (
    <>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto p-4 bg-slate-900"
      >
        {isLoadingMore && (
          <div className="text-center text-xs text-slate-400 mb-3">
            Loading older messages...
          </div>
        )}

        {isLoading && (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            Loading messages...
          </div>
        )}

        {!isLoading && visibleMessages.length === 0 && (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            No messages yet
          </div>
        )}

        {visibleMessages.map((msg) => {
          const isMe = msg.senderEmail === currentUser?.email
          const fileUrl = msg.file
            ? `http://localhost:5000${msg.file.url}`
            : null

          return (
            <div
              key={msg._id}
              className={`flex ${isMe ? "justify-end" : "justify-start"} mb-3`}
            >
              <div className="max-w-[70%]">
                {!isMe && (
                  <div className="text-[11px] mb-1 text-indigo-400">
                    {msg.senderName || msg.senderEmail}
                  </div>
                )}

                {isMe && (
                  <div className="text-[11px] mb-1 text-right text-indigo-300">
                    You
                  </div>
                )}

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
                      <img
                        src={fileUrl}
                        alt={msg.file.originalName}
                        className="max-w-full rounded-md mb-2 cursor-pointer"
                        onClick={() => setPreviewImage(fileUrl)}
                      />
                    )}

                  {msg.text && <p>{msg.text}</p>}
                </div>
              </div>
            </div>
          )
        })}

        <div ref={bottomRef} />
      </div>
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            className="max-w-[90%] max-h-[90%] rounded-lg"
          />
        </div>
      )}
    </>
  )
}
