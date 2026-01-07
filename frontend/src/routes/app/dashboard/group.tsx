import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/app/dashboard/group")({
  component: () => <h1>Groups</h1>,
})
