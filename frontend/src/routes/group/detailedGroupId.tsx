import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/group/detailedGroupId")({
  component: () => <h1>Group Details</h1>,
})
