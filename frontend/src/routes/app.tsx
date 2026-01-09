import { createFileRoute, Outlet } from "@tanstack/react-router"
import Navbar from "@/components/Layout/navbar"
import Sidebar from "@/components/Layout/sidebar"
// import Footer from "@/components/Layout/footer"

export const Route = createFileRoute("/app")({
  component: AppLayout,
  notFoundComponent: () => (
    <div className="flex-1 flex items-center justify-center text-gray-400">
      Page not found
    </div>
  ),
})

function AppLayout() {
  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
