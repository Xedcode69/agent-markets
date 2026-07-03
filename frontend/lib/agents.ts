import { apiRequest, authRequest } from "@/lib/api"

export type PricingType = "per_call" | "subscription"
export type EndpointMethod = "GET" | "POST"

export type Agent = {
  id: number
  name: string
  description: string | null
  endpoint_url: string
  endpoint_method: EndpointMethod
  pricing_type: PricingType
  price: string | number
  instructions: string | null
  input_schema: Record<string, unknown> | null
  example_input: Record<string, unknown> | null
  is_active: boolean
  owner_id: number
  created_at: string
}

export type AgentInput = {
  name: string
  description: string
  endpoint_url: string
  endpoint_method: EndpointMethod
  pricing_type: PricingType
  price: number
  instructions: string
  input_schema: Record<string, unknown> | null
  example_input: Record<string, unknown> | null
}

type ApiResponse<T> = {
  message: string
  data: T
}

const AGENT_PATH = "/agents"

export async function getAgents() {
  const response = await apiRequest<ApiResponse<Agent[]>>(AGENT_PATH, {
    cache: "no-store",
  })

  return response.data
}

export async function getAgent(agentId: string) {
  const response = await apiRequest<ApiResponse<Agent>>(
    `${AGENT_PATH}/${agentId}`,
    { cache: "no-store" }
  )

  return response.data
}

export async function getOwnerAgents() {
  const response = await authRequest<ApiResponse<Agent[]>>(`${AGENT_PATH}/owner`)

  return response.data
}

export async function createAgent(input: AgentInput) {
  const response = await authRequest<ApiResponse<Agent>>(AGENT_PATH, {
    method: "POST",
    body: JSON.stringify(input),
  })

  return response.data
}

export async function updateAgent(agentId: number | string, input: AgentInput) {
  const response = await authRequest<ApiResponse<Agent>>(
    `${AGENT_PATH}/${agentId}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    }
  )

  return response.data
}

export async function deleteAgent(agentId: number | string) {
  const response = await authRequest<ApiResponse<Agent>>(
    `${AGENT_PATH}/${agentId}`,
    { method: "DELETE" }
  )

  return response.data
}

export function formatAgentPrice(agent: Pick<Agent, "price" | "pricing_type">) {
  const amount = Number(agent.price)
  const formatted = Number.isFinite(amount)
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }).format(amount)
    : `$${agent.price}`

  return agent.pricing_type === "subscription"
    ? `${formatted}/subscription`
    : `${formatted}/call`
}

export function formatPricingType(pricingType: PricingType) {
  return pricingType === "subscription" ? "Subscription" : "Per call"
}

export function formatAgentDate(value?: string) {
  if (!value) {
    return "Not available"
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

export function agentDescription(agent: Pick<Agent, "description">) {
  return agent.description?.trim() || "No marketplace description yet."
}

export function formatAgentJson(value: unknown) {
  if (!value) {
    return ""
  }

  return JSON.stringify(value, null, 2)
}
