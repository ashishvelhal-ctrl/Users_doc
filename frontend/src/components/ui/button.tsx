type Props = React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ children, ...props }: Props) {
  return (
    <button
      {...props}
      style={{
        padding: "8px 16px",
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  )
}
