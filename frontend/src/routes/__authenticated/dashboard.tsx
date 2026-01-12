import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/__authenticated/dashboard")({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-gray-400 mt-2">
        Welcome to your dashboard!
      </p>
    </div>
  )
}
