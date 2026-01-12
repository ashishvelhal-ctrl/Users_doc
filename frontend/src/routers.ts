import { createRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"
import { useAuth } from "./hooks/useAuth"

export const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
  defaultPreload: "intent",
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
