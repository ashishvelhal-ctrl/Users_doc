import { useEffect, useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useCreateGroupMutation } from "@/lib/mutations"
import { useAuth } from "@/hooks/useAuth"

export default function CreateGroup() {
  const { user } = useAuth()
  const [groupName, setGroupName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [search, setSearch] = useState("")

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("http://localhost:5000/api/users", {
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to load users")
      return response.json()
    },
    staleTime: 1000 * 60 * 10,
  })

  const createGroupMutation = useCreateGroupMutation()

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
    if (!groupName.trim()) return

    createGroupMutation.mutate({
      name: groupName.trim(),
      description: description.trim() || undefined,
      users: selectedUsers,
      createdBy: user!._id,
    })
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
        disabled={createGroupMutation.isPending}
        className="mt-4 w-full bg-indigo-600 py-2 rounded"
      >
        {createGroupMutation.isPending ? "Creating..." : "Create Group"}
      </button>
    </div>
  )
}
