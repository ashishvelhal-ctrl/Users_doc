import { createFileRoute, Outlet } from "@tanstack/react-router"
import Navbar from "@/components/Layout/navbar"
import Sidebar from "@/components/Layout/sidebar"
import Footer from "@/components/Layout/footer"

export const Route = createFileRoute("/app/__layout")({
  component: AppLayout,
})

function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  )
}
