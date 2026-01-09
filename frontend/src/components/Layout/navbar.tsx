import { useNavigate } from "@tanstack/react-router"

type NavbarProps = {
  onCreateGroup?: () => void
}

export default function Navbar({ onCreateGroup }: NavbarProps) {
  const navigate = useNavigate()

  const handleCreateGroup = () => {
    onCreateGroup?.()

    navigate({ to: "/app/groups/create" })
  }

  return (
    <header className="h-14 bg-black border-b border-gray-800 flex items-center justify-between px-6">
      <h1 className="font-semibold text-white">Dashboard</h1>

      <button
        onClick={handleCreateGroup}
        className="bg-indigo-600 px-4 py-2 rounded text-sm text-white hover:bg-indigo-700 transition"
      >
        + Create Group
      </button>
    </header>
  )
}
