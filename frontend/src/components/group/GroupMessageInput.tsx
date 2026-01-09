import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sendMessage } from "@/features/groups/messages.api"

type Props = {
  groupId: string
}

const isImageFile = (file: File) => {
  return file.type.startsWith("image/")
}

export default function GroupMessageInput({ groupId }: Props) {
  const [text, setText] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  )

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

    if (!currentUser?.email) {
      alert("User not logged in")
      return
    }

    const formData = new FormData()

    formData.append("senderEmail", currentUser.email)

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
      {file && (
        <div className="mb-3 flex items-center gap-3 bg-slate-900 p-2 rounded-md">
          {isImageFile(file) ? (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="w-16 h-16 object-cover rounded-md"
            />
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              📎 {file.name}
            </div>
          )}

          <button
            onClick={() => setFile(null)}
            className="ml-auto text-red-400 hover:text-red-500 text-sm"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <label className="cursor-pointer text-gray-400 hover:text-white">
          📎
          <input
            type="file"
            hidden
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
          />
        </label>

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
