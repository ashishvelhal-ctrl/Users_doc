export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: 8,
        maxWidth: 500,
        margin: "auto",
      }}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div style={{ marginBottom: 12 }}>{children}</div>
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3>{children}</h3>
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
