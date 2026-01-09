import { useState } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ COOKIE ENABLED
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) throw new Error("Invalid credentials")
      return res.json()
    },

    onSuccess: (data) => {
      // ❌ NO TOKEN STORAGE
      // ✅ ONLY USER INFO (UI PURPOSE)
      localStorage.setItem("user", JSON.stringify(data.user))

      navigate({ to: "/app/dashboard" })
    },
  })

  return (
    <Card className="w-full max-w-md bg-slate-900 text-white">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Login</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <Button className="w-full" onClick={() => loginMutation.mutate()}>
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </Button>

        {loginMutation.isError && (
          <p className="text-sm text-red-400 text-center">Invalid email or password</p>
        )}

        <p className="text-sm text-center text-gray-400">
          Don’t have an account?{" "}
          <Link to="/auth/signup" className="text-indigo-400 hover:underline">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
