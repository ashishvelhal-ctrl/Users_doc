import {
  Link,
  useNavigate,
  useMatchRoute,
} from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/hooks/useAuth"
import { useState } from "react"
import { API_BASE_URL } from "@/lib/api-config"

type Group = {
  _id: string
  name: string
  users?: string[]
  members?: string[]
  [key: string]: any // Allow any other properties
}

async function fetchGroups(): Promise<Group[]> {
  const res = await fetch(`${API_BASE_URL}/groups`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("Failed to load groups")
  return res.json()
}

export default function Sidebar() {
  const navigate = useNavigate()
  const matchRoute = useMatchRoute()
  const { logout } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const {
    data: groups = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["groups"],
    queryFn: fetchGroups,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  })

  const handleLogout = async () => {
    await logout()
    navigate({ to: "/auth/login", replace: true })
  }

  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } bg-black text-white border-r border-gray-800 p-3 flex flex-col transition-all duration-300`}
    >
      <button
        onClick={() => setIsCollapsed((p) => !p)}
        className="mb-3 flex items-center justify-center h-10 rounded hover:bg-gray-800"
        title={isCollapsed ? "Expand" : "Collapse"}
      >
        {isCollapsed ? "->" : "<-"}
      </button>

      <Link
        to="/dashboard"
        title="Dashboard"
        className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800 ${
          isCollapsed && "justify-center"
        }`}
      >
        {!isCollapsed && <span>Dashboard</span>}
      </Link>

      {!isCollapsed && (
        <p className="px-3 mt-4 text-xs uppercase text-gray-400">
          Groups
        </p>
      )}

      {isLoading && !isCollapsed && (
        <p className="px-3 text-sm text-gray-500">
          Loading...
        </p>
      )}

      {isError && !isCollapsed && (
        <p className="px-3 text-sm text-red-400">
          Failed
        </p>
      )}

      <div className="flex-1 mt-2 space-y-1 overflow-y-auto">
        {groups.map((group) => {
          const isActive = matchRoute({
            to: "/groups/$groupId",
            params: { groupId: group._id },
          })

          return (
            <Link
              key={group._id}
              to="/groups/$groupId"
              params={{ groupId: group._id }}
              title={group.name}
              className={`flex items-center gap-3 px-3 py-2 text-sm rounded transition ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-800 text-gray-300"
              } ${isCollapsed && "justify-center"}`}
            >
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-semibold">
                {group.name[0]?.toUpperCase()}
              </div>

              {!isCollapsed && (
                <span className="truncate">
                  {group.name}
                </span>
              )}
            </Link>
          )
        })}
      </div>

      <Link
        to="/groups/create"
        title="Create Group"
        className={`mt-3 flex items-center gap-3 px-3 py-2 text-sm text-indigo-400 hover:bg-gray-800 rounded ${
          isCollapsed && "justify-center"
        }`}
      >
        {!isCollapsed && <span>Create Group</span>}
      </Link>

      <button
        onClick={handleLogout}
        title="Logout"
        className={`mt-2 flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-gray-800 rounded ${
          isCollapsed && "justify-center"
        }`}
      >
        {!isCollapsed && <span>Logout</span>}
      </button>
    </aside>
  )
}
