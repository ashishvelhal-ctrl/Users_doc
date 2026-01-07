type Props = React.InputHTMLAttributes<HTMLInputElement>

export function Input(props: Props) {
  return (
    <input
      {...props}
      style={{
        padding: "8px",
        width: "100%",
        borderRadius: 4,
        border: "1px solid #ccc",
      }}
    />
  )
}
