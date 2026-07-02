"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { apiRequest } from "@/lib/api"
import { clearAuthSession } from "@/lib/auth"

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await apiRequest("/auth/logout", { method: "POST" }).catch(() => null)
    clearAuthSession()
    router.replace("/login")
  }

  return (
    <Button variant="ghost" size="icon-sm" onClick={handleLogout} aria-label="Log out">
      <LogOut className="size-4" />
    </Button>
  )
}
