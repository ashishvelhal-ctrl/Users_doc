import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/app/users")({
  component: () => <h1 className="text-2xl">Users</h1>,
})
