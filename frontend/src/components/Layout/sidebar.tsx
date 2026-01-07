import { Link } from "@tanstack/react-router"

export default function Sidebar() {
  return (
    <aside className="w-64 bg-black text-white border-r border-gray-800 min-h-screen p-4">
      
      {/* Dashboard */}
      <div className="mb-6">
        <h3 className="text-xs uppercase text-gray-400 mb-2">Dashboard</h3>
        <Link
          to="/app/dashboard"
          className="block px-3 py-2 rounded-md text-gray-200 hover:bg-gray-800"
        >
          Home
        </Link>
      </div>

      {/* Users */}
      <div className="mb-6">
        <h3 className="text-xs uppercase text-gray-400 mb-2">Users</h3>
        <p className="text-xs text-gray-500 italic">
          Users will load from API
        </p>
      </div>

      {/* Groups */}
      <div className="mb-6">
        <h3 className="text-xs uppercase text-gray-400 mb-2">Groups</h3>
        <p className="text-xs text-gray-500 italic">
          Groups will load from API
        </p>

        <Link
          to="/group/create"
          className="mt-3 block text-sm text-indigo-400 hover:text-indigo-300"
        >
          + Create Group
        </Link>
      </div>
    </aside>
  )
}
