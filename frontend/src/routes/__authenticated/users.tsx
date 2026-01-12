import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/__authenticated/users")({
  component: () => <h1>Users List</h1>,
})
