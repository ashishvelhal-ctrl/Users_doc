import { useEffect, useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import API from "@/features/auth/auth.api"
import { useAuth } from "@/hooks/useAuth"

type User = {
  _id: string
  name: string
  email: string
}

async function fetchUsers(): Promise<User[]> {
  const res = await API.get("/users")
  return res.data
}

export default function CreateGroup() {
  const { user } = useAuth()

  const [groupName, setGroupName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)

  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  })

  // ✅ Auto-select creator
  useEffect(() => {
    if (user?._id) {
      setSelectedUsers([user._id])
    }
  }, [user])

  const toggleUser = (id: string) => {
    if (id === user?._id) return

    setSelectedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((u) => u !== id)
        : [...prev, id]
    )
  }

  // 🔍 Filter users by search
  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    )
  }, [users, search])

  const handleCreate = async () => {
    if (!user) {
      alert("Not authenticated")
      return
    }

    try {
      setLoading(true)

      await API.post("/groups", {
        name: groupName,
        description,
        members: selectedUsers,
      })

      setGroupName("")
      setDescription("")
      setSelectedUsers([user._id])
      setSearch("")

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

      {user && (
        <div className="mb-4 p-3 bg-slate-800 border border-slate-700 rounded">
          <p className="text-xs text-gray-400 mb-1">
            Created By
          </p>
          <p className="text-sm font-medium">
            {user.name}
          </p>
          <p className="text-xs text-gray-400">
            {user.email}
          </p>
        </div>
      )}

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

      {/* 🔍 Search Users */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search users..."
        className="w-full p-2 mb-3 bg-slate-800 border border-slate-700 rounded text-sm"
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

          {filteredUsers.map((u) => {
            const isCreator = u._id === user?._id

            return (
              <label
                key={u._id}
                className="flex items-center gap-2 px-3 py-2 hover:bg-slate-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(u._id)}
                  disabled={isCreator}
                  onChange={() => toggleUser(u._id)}
                />
                <span className="text-sm">
                  {u.name}
                  <span className="text-gray-400 text-xs">
                    {" "}({u.email})
                  </span>
                  {isCreator && (
                    <span className="ml-2 text-xs text-indigo-400">
                      (You)
                    </span>
                  )}
                </span>
              </label>
            )
          })}
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
