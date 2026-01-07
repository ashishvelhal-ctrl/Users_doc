import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/app/")({
  component: AppHome,
})

function AppHome() {
  return (
    <div>
      <h1 className="text-2xl font-bold">
        Welcome to Dashboard
      </h1>
      <p className="text-gray-400 mt-2">
        Select an option from the sidebar
      </p>
    </div>
  )
}
