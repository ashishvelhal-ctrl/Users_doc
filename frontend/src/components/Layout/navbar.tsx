import { Link } from "@tanstack/react-router"

export default function Navbar() {
  return (
    <header className="w-full bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-semibold text-white hover:text-indigo-400 transition"
        >
          MyApp
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm">
          <Link
            to="/dashboard"
            className="text-gray-300 hover:text-white transition"
          >
            Dashboard
          </Link>

          <Link
            to="/group/create"
            className="text-gray-300 hover:text-white transition"
          >
            Create Group
          </Link>

          <Link
            to="/auth/login"
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  )
}
