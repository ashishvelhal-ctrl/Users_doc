import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/auth/__layout")({
  component: () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <Outlet />
    </div>
  ),
})
