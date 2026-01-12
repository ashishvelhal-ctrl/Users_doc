import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import Navbar from "@/components/Layout/navbar"
import Sidebar from "@/components/Layout/sidebar"

export const Route = createFileRoute("/__authenticated")({
  component: AppLayout,
})

function AppLayout() {
  return (
    <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
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
