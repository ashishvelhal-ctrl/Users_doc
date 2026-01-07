import { createFileRoute } from "@tanstack/react-router";
import CreateGroup from "@/features/groups/CreateGroup";

export const Route = createFileRoute("/group/create")({
  component: CreateGroup,
});
