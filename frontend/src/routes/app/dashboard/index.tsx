import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/app/dashboard/")({
  component: Dashboard,
})

function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
    </div>
  )
}
