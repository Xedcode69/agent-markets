"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { apiRequest } from "@/lib/api"
import {
    getDashboardPath,
    saveAuthSession,
    type LoginResponse,
    type UserRole,
} from "@/lib/auth"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

export function LoginForm(){
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError("")
        setLoading(true)

        try {
            const data = await apiRequest<LoginResponse>("/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password,
                }),
            })
            const user = data.user

            saveAuthSession(data.token, user)

            if (user?.role) {
                router.push(getDashboardPath(user.role))
                return
            }

            const fallbackRole = localStorage.getItem("signupRole") as UserRole | null
            const role = fallbackRole ?? "buyer"

            saveAuthSession(data.token, {
                id: "",
                email,
                role,
            })
            router.push(getDashboardPath(role))
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed")
        } finally {
            setLoading(false)
        }
    }

    return(
        <Card className="w-full max-w-md rounded-lg bg-card shadow-sm">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-semibold">Login to your account</CardTitle>
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
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    {error ? (
                        <p className="text-sm text-destructive" role="alert">
                            {error}
                        </p>
                    ) : null}
                    <Button type="submit" className="mt-2 w-full" size="lg" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        New to Agent Markets?{" "}
                        <Link href="/signup" className="font-medium text-primary hover:underline">
                        Sign Up
                        </Link>
                    </p>
                
                </CardContent>
            </form>
        </Card>
    )
}
