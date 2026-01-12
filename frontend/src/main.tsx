import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "@tanstack/react-router"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { router } from "./routers"
import { queryClient } from "./lib/queryClient"
import { useAuth } from "./hooks/useAuth"

import "./index.css"

function App() {
  const auth = useAuth()
  
  return (
    <RouterProvider router={router} context={{ auth }} />
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
)
