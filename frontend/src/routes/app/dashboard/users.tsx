import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/app/dashboard/users")({
  component: () => <h1>Users List</h1>,
})
