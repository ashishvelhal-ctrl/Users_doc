import { useInfiniteQuery } from "@tanstack/react-query"
import { useVirtualizer } from "@tanstack/react-virtual"
import { getMessages } from "@/features/groups/messages.api"
import type { Message } from "@/features/groups/messages.api"
import { useEffect, useMemo, useRef, useState } from "react"

type Props = {
  groupId: string
}

const PAGE_SIZE = 15
const MAX_MESSAGES = 300

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
    initialPageParam: undefined,
  })

  const messages: Message[] = useMemo(() => {
    return (
      data?.pages
        .flatMap((p) => p.messages)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
        )
        .slice(-MAX_MESSAGES) ?? []
    )
  }, [data])

  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 80,
    overscan: 5,
  })

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

    const el = containerRef.current
    const isNearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 150

    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }
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
        {isFetchingNextPage && isFetchingOlder.current && (
          <div className="sticky top-0 z-10 flex justify-center py-2 bg-slate-900">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
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

        <div
          style={{
            height: rowVirtualizer.getTotalSize(),
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const msg = messages[virtualRow.index]
            if (!msg || !msg.senderEmail) return null

            const isMe = msg.senderEmail === currentUser?.email
            const fileUrl = msg.file
              ? `http://localhost:5000${msg.file.url}`
              : null

            return (
              <div
                key={msg._id}
                ref={rowVirtualizer.measureElement}
                data-index={virtualRow.index}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
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
                          loading="lazy"
                          decoding="async"
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
        </div>

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
