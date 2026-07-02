"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { getMe } from "@/lib/backend"
import { getAuthUser, getDashboardPath, saveAuthSession } from "@/lib/auth"

export default function DashboardRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    async function redirectToDashboard() {
      let user = getAuthUser()

      if (!user) {
        try {
          user = await getMe()
          saveAuthSession(user)
        } catch {
          router.replace("/login")
          return
        }
      }

      router.replace(getDashboardPath(user.role))
    }

    redirectToDashboard()
  }, [router])

  return null
}
