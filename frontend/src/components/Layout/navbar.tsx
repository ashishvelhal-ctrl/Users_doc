import { useNavigate } from "@tanstack/react-router"
import { useAuth } from "@/hooks/useAuth"

type NavbarProps = {
  onCreateGroup?: () => void
}

export default function Navbar({ onCreateGroup }: NavbarProps) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleCreateGroup = () => {
    onCreateGroup?.()
    navigate({ to: "/app/groups/create" })
  }

  return (
    <header className="h-14 bg-black border-b border-gray-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="font-semibold text-white">Dashboard</h1>

        {user && (
          <span className="text-sm text-gray-400">
            Hi, <span className="text-white">{user.name}</span>
          </span>
        )}
      </div>

      <button
        onClick={handleCreateGroup}
        className="bg-indigo-600 px-4 py-2 rounded text-sm text-white hover:bg-indigo-700 transition"
      >
        + Create Group
      </button>
    </header>
  )
}
