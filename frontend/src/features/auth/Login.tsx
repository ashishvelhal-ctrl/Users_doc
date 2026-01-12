import { useState } from "react"
import { Link } from "@tanstack/react-router"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLoginMutation } from "@/lib/mutations"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const loginMutation = useLoginMutation()

  return (
    <Card className="w-full max-w-md bg-slate-900 text-white">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Login</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <Button className="w-full" onClick={() => loginMutation.mutate({ email, password })}>
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </Button>

        {loginMutation.isError && (
          <p className="text-sm text-red-400 text-center">Invalid email or password</p>
        )}

        <p className="text-sm text-center text-gray-400">
          Don't have an account?{" "}
          <Link to="/auth/signup" className="text-indigo-400 hover:underline">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
