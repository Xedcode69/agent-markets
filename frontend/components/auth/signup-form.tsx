"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { apiRequest } from "@/lib/api"
import type { SignupResponse, UserRole } from "@/lib/auth"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"

export function SignupForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole | "">("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    if (!role) {
      setError("Please select buyer or seller.")
      return
    }

    setLoading(true)

    try {
      const data = await apiRequest<SignupResponse>("/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      })

      router.push(
        `/otp?userId=${encodeURIComponent(String(data.userId))}&email=${encodeURIComponent(email)}&role=${role}`
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md rounded-lg bg-card shadow-sm">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-semibold">Create your account</CardTitle>
        <CardDescription>
          Choose how you want to use Agent Markets.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a password"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              name="role"
              value={role}
              onValueChange={(value) => setRole(value as UserRole)}
              required
            >
              <SelectTrigger id="role" className="w-full">
                <SelectValue placeholder="Select buyer or seller" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Account type</SelectLabel>
                  <SelectItem value="buyer">Buyer</SelectItem>
                  <SelectItem value="seller">Seller</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            className="mt-2 w-full"
            size="lg"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign up"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </form>
    </Card>
  )
}
