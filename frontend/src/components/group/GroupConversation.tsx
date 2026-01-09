import { useQuery } from "@tanstack/react-query"
import { getMessages } from "@/features/groups/messages.api"
import { useLayoutEffect, useRef, useState } from "react"

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

const isImageFile = (filename: string) => {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(filename)
}

export default function GroupConversation({ groupId }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  )

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ["messages", groupId],
    queryFn: () => getMessages(groupId),
  })

  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      })
    })
  }, [messages])

  return (
    <>
      <div
        ref={containerRef}
        className="h-full overflow-y-auto p-4 bg-slate-900"
      >
        {isLoading && <div className="h-full" />}

        {!isLoading && messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            No messages yet
          </div>
        )}

        {!isLoading &&
          messages.map((msg) => {
            const isMe = msg.senderEmail === currentUser?.email
            const fileUrl = msg.file
              ? `http://localhost:5000${msg.file.url}`
              : null

            return (
              <div
                key={msg._id}
                className={`flex ${
                  isMe ? "justify-end" : "justify-start"
                } mb-3`}
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
                          onLoad={() =>
                            bottomRef.current?.scrollIntoView({
                              behavior: "smooth",
                            })
                          }
                        />
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
          <div className="relative max-w-[90%] max-h-[90%]">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-full rounded-lg"
            />

            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 text-white bg-black/60 hover:bg-black px-3 py-1 rounded"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  )
}
