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
            <ExecutionForm agentId={agent.id} />
            <Button variant="outline" className="w-full" asChild>
              <Link href="/agents">Back to agents</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </BuyerShell>
  )
}
