import Link from "next/link"
import { notFound } from "next/navigation"
import { CheckCircle2, ShieldCheck } from "lucide-react"

import { ExecutionForm } from "@/components/agents/execution-form"
import { BuyerShell } from "@/components/buyer/buyer-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  agentDescription,
  formatAgentDate,
  formatAgentJson,
  formatAgentPrice,
  formatPricingType,
  getAgent,
} from "@/lib/agents"

type AgentPageProps = {
  params: Promise<{
    agentId: string
  }>
}

export default async function AgentDetailPage({ params }: AgentPageProps) {
  const { agentId } = await params
  const agent = await getAgent(agentId).catch(() => null)

  if (!agent) {
    notFound()
  }

  return (
    <BuyerShell
      active="agents"
      eyebrow="Agent profile"
      title={agent.name}
      action={{ href: "/buyer/executions", label: "View executions" }}
    >
      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="rounded-lg">
          <CardHeader className="border-b">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="text-2xl">{agent.name}</CardTitle>
                <CardDescription>{agentDescription(agent)}</CardDescription>
              </div>
              <Badge variant="secondary">
                {agent.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Pricing</p>
                <p className="mt-1 font-medium">
                  {formatPricingType(agent.pricing_type)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="mt-1 font-medium">{formatAgentDate(agent.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Owner</p>
                <p className="mt-1 font-medium">Seller #{agent.owner_id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="mt-1 font-medium">{formatAgentPrice(agent)}</p>
              </div>
            </div>
            <div>
              <h2 className="mb-3 text-base font-semibold">Execution details</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-2 rounded-md border p-3">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span className="text-sm font-medium">Endpoint configured</span>
                </div>
                <div className="flex items-center gap-2 rounded-md border p-3">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span className="text-sm font-medium">Schema-backed pricing</span>
                </div>
                <div className="flex items-center gap-2 rounded-md border p-3">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span className="text-sm font-medium">Active marketplace listing</span>
                </div>
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-md border p-3">
                <h2 className="text-base font-semibold">Input instructions</h2>
                <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                  {agent.instructions?.trim() ||
                    "The seller has not provided run instructions yet."}
                </p>
              </div>
              <div className="rounded-md border p-3">
                <h2 className="text-base font-semibold">Input schema</h2>
                {agent.input_schema ? (
                  <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap text-xs">
                    {formatAgentJson(agent.input_schema)}
                  </pre>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">
                    No schema has been provided yet.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader className="border-b">
            <CardTitle>Run this agent</CardTitle>
            <CardDescription>Start a buyer execution from this profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-md border p-3">
              <ShieldCheck className="size-5 text-emerald-600" />
              <div>
                <p className="font-medium">Buyer controls</p>
                <p className="text-sm text-muted-foreground">
                  This run will charge {formatAgentPrice(agent)} if it completes.
                </p>
              </div>
            </div>
            {agent.example_input ? (
              <div className="rounded-md border p-3">
                <p className="text-sm font-medium">Example input</p>
                <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap text-xs">
                  {formatAgentJson(agent.example_input)}
                </pre>
              </div>
            ) : null}
            <ExecutionForm agentId={agent.id} exampleInput={agent.example_input} />
            <Button variant="outline" className="w-full" asChild>
              <Link href="/agents">Back to agents</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </BuyerShell>
  )
}
