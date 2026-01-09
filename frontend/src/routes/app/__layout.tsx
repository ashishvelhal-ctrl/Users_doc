import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import Navbar from "@/components/Layout/navbar"
import Sidebar from "@/components/Layout/sidebar"
import Footer from "@/components/Layout/footer"

export const Route = createFileRoute("/app/__layout")({
  beforeLoad: ({ context }) => {
    const { auth } = context

    if (auth.isLoading) return

    if (!auth.isAuthenticated) {
      throw redirect({
        to: "/auth/login",
      })
    }
  },
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
