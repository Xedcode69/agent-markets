export type UserRole = "buyer" | "seller"

export type AuthUser = {
  id: number | string
  email: string
  role: UserRole
}

export type LoginResponse = {
  message: string
  token: string
  user?: AuthUser
}

export type SignupResponse = {
  message: string
  userId: number | string
}

export type OtpResponse = {
  message: string
}

export function getDashboardPath(role: UserRole) {
  return role === "seller" ? "/seller/dashboard" : "/buyer/dashboard"
}

export function saveAuthSession(token: string, user?: AuthUser) {
  localStorage.setItem("token", token)

  if (user) {
    localStorage.setItem("user", JSON.stringify(user))
  }
}

export function getAuthUser(): AuthUser | null {
  const rawUser = localStorage.getItem("user")

  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser) as AuthUser
  } catch {
    localStorage.removeItem("user")
    return null
  }
}

export function clearAuthSession() {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}
