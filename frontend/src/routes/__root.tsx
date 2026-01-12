import { createRootRoute, Outlet } from "@tanstack/react-router"

export const Route = createRootRoute({
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-gray-400">Page not found</p>
      </div>
    </div>
  ),
  component: () => <Outlet />,
})
