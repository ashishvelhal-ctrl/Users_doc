import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sendMessage } from "@/features/groups/messages.api"

type Props = {
  groupId: string
}

export default function GroupMessageInput({ groupId }: Props) {
  const [text, setText] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: FormData) => sendMessage(groupId, data),
    onSuccess: () => {
      setText("")
      setFile(null)
      queryClient.invalidateQueries({
        queryKey: ["messages", groupId],
      })
    },
  })

  const handleSend = () => {
    if (!text.trim() && !file) return

    const formData = new FormData()
    formData.append("senderEmail", "ashish@gmail.com")

    if (text.trim()) {
      formData.append("text", text)
    }

    if (file) {
      formData.append("file", file)
    }

    mutation.mutate(formData)
  }

  return (
    <div className="border-t border-slate-700 bg-slate-800 p-3">
      {/* 🔹 File Preview */}
      {file && (
        <div className="mb-2 text-xs text-slate-400 flex items-center gap-2">
          📎 {file.name}
          <button
            onClick={() => setFile(null)}
            className="text-red-400 hover:text-red-500"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* Attachment */}
        <label className="cursor-pointer text-gray-400">
          📎
          <input
            type="file"
            hidden
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
          />
        </label>

        {/* Text input */}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-4 py-2 text-sm text-white outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleSend()
            }
          }}
        />

        {/* Send */}
        <button
          onClick={handleSend}
          disabled={!text.trim() && !file}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-4 py-2 rounded-full text-sm text-white"
        >
          Send
        </button>
      </div>
    </div>
  )
}
