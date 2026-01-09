import { Link, useNavigate } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/hooks/useAuth"

type Group = {
  _id: string
  name: string
}

async function fetchGroups(): Promise<Group[]> {
  const res = await fetch("http://localhost:5000/api/groups", {
    credentials: "include",
  })
  if (!res.ok) throw new Error("Failed to load groups")
  return res.json()
}

export default function Sidebar() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const {
    data: groups = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["groups"],
    queryFn: fetchGroups,
  })

  const handleLogout = async () => {
    await logout()
    navigate({ to: "/auth/login", replace: true })
  }

  return (
    <aside className="w-64 bg-black text-white border-r border-gray-800 p-4 flex flex-col">
      <div className="mb-4">
        <Link
          to="/app/dashboard"
          className="block px-3 py-2 rounded-md hover:bg-gray-800"
        >
          Dashboard
        </Link>
      </div>
      <div className="mb-4 flex-1">
        <p className="px-3 text-xs uppercase text-gray-400 mb-2">
          Groups
        </p>

        {isLoading && (
          <p className="px-3 text-sm text-gray-500">
            Loading groups...
          </p>
        )}

        {isError && (
          <p className="px-3 text-sm text-red-400">
            Failed to load groups
          </p>
        )}

        {!isLoading && groups.length === 0 && (
          <p className="px-3 text-sm text-gray-500">
            No groups yet
          </p>
        )}

        {groups.map((group) => (
          <Link
            key={group._id}
            to={`/app/groups/${group._id}`}
            className="block px-3 py-2 text-sm rounded-md hover:bg-gray-800"
          >
            {group.name}
          </Link>
        ))}
      </div>
      <div className="mb-4">
        <Link
          to="/app/groups/create"
          className="block px-3 py-2 text-sm text-indigo-400 hover:text-indigo-300 hover:bg-gray-800 rounded-md"
        >
          + Create Group
        </Link>
      </div>
      <button
        onClick={handleLogout}
        className="mt-auto px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-md text-left"
      >
        Logout
      </button>
    </aside>
  )
}
