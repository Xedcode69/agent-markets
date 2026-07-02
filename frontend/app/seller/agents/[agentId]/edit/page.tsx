import { notFound } from "next/navigation"
import { Bot, ShieldCheck } from "lucide-react"

import { AgentForm } from "@/components/agents/agent-form"
import { SellerShell } from "@/components/seller/seller-shell"
import { Badge } from "@/components/ui/badge"
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
  getAgent,
} from "@/lib/agents"

type SellerAgentEditPageProps = {
  params: Promise<{
    agentId: string
  }>
}

export default async function SellerAgentEditPage({
  params,
}: SellerAgentEditPageProps) {
  const { agentId } = await params
  const agent = await getAgent(agentId).catch(() => null)

  if (!agent) {
    notFound()
  }

  return (
    <SellerShell
      active="agents"
      eyebrow="Edit agent"
      title={agent.name}
      action={{ href: "/agents/new", label: "Create agent" }}
    >
      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="rounded-lg">
          <CardHeader className="border-b">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>Listing details</CardTitle>
                <CardDescription>
                  Update marketplace copy, endpoint, and pricing.
                </CardDescription>
              </div>
              <Badge variant={agent.is_active ? "secondary" : "outline"}>
                {agent.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <AgentForm agent={agent} />
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader className="border-b">
            <CardTitle>Publishing summary</CardTitle>
            <CardDescription>Live usage and listing health.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-md border p-3">
              <Bot className="size-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{formatAgentPrice(agent)}</p>
                <p className="text-sm text-muted-foreground">
                  {agentDescription(agent)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-md border p-3">
              <ShieldCheck className="size-5 text-emerald-600" />
              <div>
                <p className="font-medium">
                  {agent.is_active ? "Marketplace active" : "Marketplace inactive"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Created {formatAgentDate(agent.created_at)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </SellerShell>
  )
}
