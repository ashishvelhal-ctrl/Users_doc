import { useInfiniteQuery } from "@tanstack/react-query"
import { getMessages } from "@/features/groups/messages.api"
import type { Message } from "@/features/groups/messages.api"
import { useEffect, useRef, useState } from "react"

type Props = {
  groupId: string
}

const PAGE_SIZE = 15

const isImageFile = (name: string) =>
  /\.(jpg|jpeg|png|gif|webp)$/i.test(name)

export default function GroupConversation({ groupId }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const isFirstLoad = useRef(true)
  const isFetchingOlder = useRef(false)

  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const currentUser = JSON.parse(localStorage.getItem("user") || "null")

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["messages", groupId],
    queryFn: ({ pageParam }) =>
      getMessages({
        groupId,
        cursor: pageParam,
        limit: PAGE_SIZE,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000 * 10,
  })

  const messages: Message[] =
    data?.pages
      .flatMap((p) => p.messages)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      ) ?? []
  useEffect(() => {
    if (!containerRef.current) return
    if (isFirstLoad.current) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" })
      isFirstLoad.current = false
      return
    }
    if (isFetchingOlder.current) {
      isFetchingOlder.current = false
      return
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  const handleScroll = () => {
    if (!containerRef.current || !hasNextPage) return

    if (
      containerRef.current.scrollTop === 0 &&
      !isFetchingOlder.current
    ) {
      isFetchingOlder.current = true
      fetchNextPage()
    }
  }

  return (
    <>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto p-4 bg-slate-900"
      >
        {isFetchingNextPage && (
          <div className="text-center text-xs text-slate-400 mb-2">
            Loading older messages...
          </div>
        )}

        {isLoading && (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            Loading messages...
          </div>
        )}

        {!isLoading && messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            No messages yet
          </div>
        )}

        {messages.map((msg) => {
          if (!msg || !msg.senderEmail) return null

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
                <div
                  className={`text-[11px] mb-1 ${
                    isMe
                      ? "text-right text-indigo-300"
                      : "text-indigo-400"
                  }`}
                >
                  {isMe ? "You" : msg.senderName || msg.senderEmail}
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
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            className="max-w-[90%] max-h-[90%] rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
