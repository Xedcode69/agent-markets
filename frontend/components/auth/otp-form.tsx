"use client"

import { RefreshCwIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { apiRequest } from "@/lib/api"
import type { OtpResponse, UserRole } from "@/lib/auth"

type InputOTPFormProps = {
  userId?: string
  email?: string
  role?: UserRole | ""
}

export function InputOTPForm({
  userId = "",
  email = "",
  role = "",
}: InputOTPFormProps) {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setMessage("")

    if (!userId) {
      setError("Missing user ID. Please sign up again.")
      return
    }

    setLoading(true)

    try {
      await apiRequest<OtpResponse>("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({
          userId,
          code,
        }),
      })

      if (role) {
        localStorage.setItem("signupRole", role)
      }

      router.push("/login")
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP verification failed")
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setError("")
    setMessage("")

    if (!userId) {
      setError("Missing user ID. Please sign up again.")
      return
    }

    setResending(true)

    try {
      const data = await apiRequest<OtpResponse>("/auth/resend-otp", {
        method: "POST",
        body: JSON.stringify({ userId }),
      })
      setMessage(data.message)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend code")
    } finally {
      setResending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Verify your email</CardTitle>
          <CardDescription>
            Enter the verification code we sent to{" "}
            <span className="font-medium">{email || "your email address"}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Field>
            <div className="flex items-center justify-between gap-3">
              <FieldLabel htmlFor="otp-verification">
                Verification code
              </FieldLabel>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={handleResend}
                disabled={resending}
              >
                <RefreshCwIcon />
                {resending ? "Sending..." : "Resend Code"}
              </Button>
            </div>
            <InputOTP
              maxLength={6}
              id="otp-verification"
              value={code}
              onChange={setCode}
              required
            >
              <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            {message ? (
              <p className="text-sm text-muted-foreground" role="status">
                {message}
              </p>
            ) : null}
          </Field>
        </CardContent>
        <CardFooter>
          <Field>
            <Button type="submit" className="w-full" disabled={loading || code.length !== 6}>
              {loading ? "Verifying..." : "Verify"}
            </Button>
            <div className="text-sm text-muted-foreground">
              After verification, use your email and password to log in.
            </div>
          </Field>
        </CardFooter>
      </Card>
    </form>
  )
}

