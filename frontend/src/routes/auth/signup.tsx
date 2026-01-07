import { createFileRoute } from "@tanstack/react-router";
import Signup from "@/features/auth/Signup";

export const Route = createFileRoute("/auth/signup")({
  component: Signup,
});
