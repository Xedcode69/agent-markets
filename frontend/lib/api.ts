const configuredApiUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000/api/v1"

const API_BASE_URL = configuredApiUrl.endsWith("/api/v1")
  ? configuredApiUrl
  : `${configuredApiUrl.replace(/\/$/, "")}/api/v1`

let csrfToken: string | null = null

async function getCsrfToken(): Promise<string> {
  if (csrfToken) {
    return csrfToken
  }

  const response = await fetch(`${API_BASE_URL}/auth/csrf-token`, {
    credentials: "include",
  })
  const data = await response.json().catch(() => null)

  if (!response.ok || !data?.csrfToken) {
    throw new Error("Could not start a secure session")
  }

  csrfToken = String(data.csrfToken)
  return csrfToken
}

function needsCsrf(method?: string) {
  return !["GET", "HEAD", "OPTIONS"].includes((method ?? "GET").toUpperCase())
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set("Content-Type", "application/json")

  if (needsCsrf(options.method)) {
    headers.set("x-csrf-token", await getCsrfToken())
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("user")
      window.location.assign("/login")
    }

    throw new Error(data?.message || "Something went wrong")
  }

  return data
}

export async function authRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  return apiRequest<T>(path, {
    ...options,
    headers: {
      ...options.headers,
    },
  })
}
