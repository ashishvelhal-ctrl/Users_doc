import { createFileRoute } from "@tanstack/react-router"
import CreateGroup from "@/features/groups/CreateGroup"

export const Route = createFileRoute("/app/groups/create")({
  component: CreateGroup,
})
