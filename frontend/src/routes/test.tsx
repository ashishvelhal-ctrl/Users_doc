import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/test")({
  component: () => (
    <div style={{ padding: '20px', color: 'white' }}>
      <h1>Test Route Working!</h1>
      <p>If you can see this, routing is working.</p>
    </div>
  ),
})
