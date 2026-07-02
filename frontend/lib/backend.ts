import { authRequest } from "@/lib/api"

export type UserProfile = {
  id: number
  email: string
  role: "buyer" | "seller"
  credits: number
  is_verified: boolean
  created_at: string
}

export type Execution = {
  id: number
  agent_id: number
  user_id: number
  input: unknown
  output: unknown
  status: "pending" | "completed" | "failed"
  cost: string | number
  response_time: number
  created_at: string
}

export type Transaction = {
  id: number
  user_id: number
  amount: string | number
  type: "credit_purchase" | "usage_deduction"
  status: string
  created_at: string
}

type ApiResponse<T> = {
  message: string
  data: T
}

export async function getMe() {
  const response = await authRequest<ApiResponse<UserProfile>>("/users/me")
  return response.data
}

export async function getMyTransactions() {
  const response = await authRequest<ApiResponse<Transaction[]>>(
    "/users/me/transactions"
  )
  return response.data
}

export async function purchaseCredits(amount: number) {
  const response = await authRequest<ApiResponse<UserProfile>>("/users/me/credits", {
    method: "POST",
    body: JSON.stringify({ amount }),
  })

  return response.data
}

export async function getMyExecutions() {
  const response = await authRequest<ApiResponse<Execution[]>>("/executions/me")
  return response.data
}

export async function getSellerExecutions() {
  const response = await authRequest<ApiResponse<Execution[]>>(
    "/executions/seller"
  )
  return response.data
}

export async function runAgent(agentId: string | number, input: unknown) {
  const response = await authRequest<
    ApiResponse<{
      output: unknown
      status: "completed" | "failed"
      cost: number
      responseTime: number
    }>
  >(`/executions/${agentId}`, {
    method: "POST",
    body: JSON.stringify(input),
  })

  return response.data
}

export function formatNumber(value: string | number | undefined) {
  const amount = Number(value ?? 0)
  return Number.isFinite(amount) ? amount.toLocaleString("en-US") : String(value)
}

export function formatDateTime(value?: string) {
  if (!value) {
    return "Not available"
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value))
}
