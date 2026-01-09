import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

type User = {
  _id: string
  name: string
  email: string
}

async function fetchUsers(): Promise<User[]> {
  const res = await fetch("http://localhost:5000/api/users")
  if (!res.ok) throw new Error("Failed to load users")
  return res.json()
}

const currentUser = JSON.parse(
  sessionStorage.getItem("user") || "{}"
)

export default function CreateGroup() {
  const [groupName, setGroupName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  })

  const toggleUser = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((u) => u !== id)
        : [...prev, id]
    )
  }

  const handleCreate = async () => {
    if (!currentUser?.email) {
      alert("User not logged in")
      return
    }

    try {
      setLoading(true)
      const memberEmails = users
        .filter((u) => selectedUsers.includes(u._id))
        .map((u) => u.email)

      const payload = {
        name: groupName,
        description,
        users: memberEmails,             
        createdBy: currentUser.email,    
      }

      const res = await fetch("http://localhost:5000/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Create failed")

      setGroupName("")
      setDescription("")
      setSelectedUsers([])

      alert("Group created successfully ✅")
    } catch (err) {
      console.error(err)
      alert("Failed to create group ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-slate-900 p-6 rounded-lg text-white">
      <h2 className="text-xl font-semibold mb-4">
        Create Group
      </h2>
      <div className="mb-4 p-3 bg-slate-800 border border-slate-700 rounded">
        <p className="text-xs text-gray-400 mb-1">
          Created By
        </p>
        <p className="text-sm font-medium">
          {currentUser.name || "Unknown User"}
        </p>
        <p className="text-xs text-gray-400">
          {currentUser.email || ""}
        </p>
      </div>

      <input
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Group Name"
        className="w-full p-2 mb-3 bg-slate-800 border border-slate-700 rounded"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full p-2 mb-4 bg-slate-800 border border-slate-700 rounded"
      />

      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-2">
          Add Users
        </p>

        <div className="max-h-48 overflow-y-auto border border-slate-700 rounded bg-slate-800">
          {isLoading && (
            <p className="p-3 text-gray-400">
              Loading users...
            </p>
          )}

          {isError && (
            <p className="p-3 text-red-400">
              Failed to load users
            </p>
          )}

          {users.map((user) => (
            <label
              key={user._id}
              className="flex items-center gap-2 px-3 py-2 hover:bg-slate-700 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedUsers.includes(user._id)}
                onChange={() => toggleUser(user._id)}
              />
              <span className="text-sm">
                {user.name}
                <span className="text-gray-400 text-xs">
                  {" "}({user.email})
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handleCreate}
        disabled={!groupName || loading}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-4 py-2 rounded w-full"
      >
        {loading ? "Creating..." : "Create Group"}
      </button>
    </div>
  )
}
