"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { getAuthUser, getDashboardPath, type UserRole } from "@/lib/auth"

type AuthGuardProps = {
  expectedRole?: UserRole
  children: React.ReactNode
}

export function AuthGuard({ expectedRole, children }: AuthGuardProps) {
  const router = useRouter()
  const [isAllowed, setIsAllowed] = useState(false)

  useEffect(() => {
    let isMounted = true
    const token = localStorage.getItem("token")
    const user = getAuthUser()

    if (!token) {
      router.replace("/login")
      return
    }

    if (expectedRole && user?.role && user.role !== expectedRole) {
      router.replace(getDashboardPath(user.role))
      return
    }

    window.setTimeout(() => {
      if (isMounted) {
        setIsAllowed(true)
      }
    }, 0)

    return () => {
      isMounted = false
    }
  }, [expectedRole, router])

  if (!isAllowed) {
    return null
  }

  return <>{children}</>
}
