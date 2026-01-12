import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/__authenticated/group")({
  component: () => <h1>Group</h1>,
})
