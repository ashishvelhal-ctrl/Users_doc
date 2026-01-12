import { useState } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSignupMutation } from "@/lib/mutations"

export default function Signup() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const signupMutation = useSignupMutation()

  return (
    <Card className="w-full max-w-md bg-slate-900 text-white">
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          Create Account
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          className="w-full"
          onClick={() => signupMutation.mutate({ name, email, password })}
          disabled={signupMutation.isPending}
        >
          {signupMutation.isPending ? "Creating..." : "Sign Up"}
        </Button>

        {signupMutation.isError && (
          <p className="text-sm text-red-400 text-center">
            Signup failed
          </p>
        )}

        <p className="text-sm text-center text-gray-400">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="text-indigo-400 hover:underline"
          >
            Login
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
