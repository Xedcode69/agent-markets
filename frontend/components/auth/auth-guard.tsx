"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { getMe } from "@/lib/backend"
import {
  getAuthUser,
  getDashboardPath,
  saveAuthSession,
  type AuthUser,
  type UserRole,
} from "@/lib/auth"

type AuthGuardProps = {
  expectedRole?: UserRole
  children: React.ReactNode
}

export function AuthGuard({ expectedRole, children }: AuthGuardProps) {
  const router = useRouter()
  const [isAllowed, setIsAllowed] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function checkSession() {
      let user: AuthUser | null = getAuthUser()

      if (!user) {
        try {
          user = await getMe()
          saveAuthSession(user)
        } catch {
          router.replace("/login")
          return
        }
      }

      if (expectedRole && user.role !== expectedRole) {
        router.replace(getDashboardPath(user.role))
        return
      }

      if (isMounted) {
        setIsAllowed(true)
      }
    }

    checkSession()

    return () => {
      isMounted = false
    }
  }, [expectedRole, router])

  if (!isAllowed) {
    return null
  }

  return <>{children}</>
}
