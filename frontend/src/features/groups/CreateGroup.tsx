import { useEffect, useMemo, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import API from "@/features/auth/auth.api"
import { useAuth } from "@/hooks/useAuth"

export default function CreateGroup() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const [groupName, setGroupName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => (await API.get("/users")).data,
    staleTime: 1000 * 60 * 10,
  })

  useEffect(() => {
    if (user?._id) setSelectedUsers([user._id])
  }, [user])

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u: any) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      ),
    [users, search]
  )

  const handleCreate = async () => {
    if (!groupName.trim() || !user) return

    setLoading(true)
    const res = await API.post("/groups", {
      name: groupName.trim(),
      description,
      users: selectedUsers,
      createdBy: user._id,
    })

    queryClient.setQueryData(["groups"], (old: any) => {
      return old ? [res.data, ...old] : [res.data]
    })

    setGroupName("")
    setDescription("")
    setSelectedUsers([user._id])
    setSearch("")
    setLoading(false)
  }

  return (
    <div className="max-w-xl mx-auto bg-slate-900 p-6 rounded-lg text-white">
      <h2 className="text-xl mb-4">Create Group</h2>

      <input
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Group Name"
        className="w-full mb-3 p-2 bg-slate-800 rounded"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full mb-3 p-2 bg-slate-800 rounded"
      />

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search users..."
        className="w-full mb-3 p-2 bg-slate-800 rounded"
      />

      {filteredUsers.map((u: any) => (
        <label key={u._id} className="flex gap-2 py-1">
          <input
            type="checkbox"
            checked={selectedUsers.includes(u._id)}
            disabled={u._id === user?._id}
            onChange={() =>
              setSelectedUsers((prev) =>
                prev.includes(u._id)
                  ? prev.filter((id) => id !== u._id)
                  : [...prev, u._id]
              )
            }
          />
          {u.name} ({u.email})
        </label>
      ))}

      <button
        onClick={handleCreate}
        disabled={loading}
        className="mt-4 w-full bg-indigo-600 py-2 rounded"
      >
        {loading ? "Creating..." : "Create Group"}
      </button>
    </div>
  )
}
