"use client"

import Link from "next/link"
import { Bot, Plus } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

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
  type Agent,
  formatAgentPrice,
  formatPricingType,
  getOwnerAgents,
} from "@/lib/agents"
import {
  type Execution,
  formatNumber,
  getSellerExecutions,
} from "@/lib/backend"

export function SellerDashboardPanel() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [executions, setExecutions] = useState<Execution[]>([])

  useEffect(() => {
    Promise.all([getOwnerAgents(), getSellerExecutions()])
      .then(([ownedAgents, runs]) => {
        setAgents(ownedAgents)
        setExecutions(runs)
      })
      .catch(() => {
        setAgents([])
        setExecutions([])
      })
  }, [])

  const revenue = useMemo(() => {
    return executions.reduce((total, item) => total + Number(item.cost || 0), 0)
  }, [executions])

  return (
    <>
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-lg">
          <CardHeader>
            <CardDescription>Total listed agents</CardDescription>
            <CardTitle className="text-2xl">{agents.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-lg">
          <CardHeader>
            <CardDescription>Executions</CardDescription>
            <CardTitle className="text-2xl">{executions.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-lg">
          <CardHeader>
            <CardDescription>Credits earned</CardDescription>
            <CardTitle className="text-2xl">{formatNumber(revenue)}</CardTitle>
          </CardHeader>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="rounded-lg">
          <CardHeader className="border-b">
            <CardTitle>Agent management</CardTitle>
            <CardDescription>Owned agents and publishing state.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {!agents.length ? (
              <p className="p-4 text-sm text-muted-foreground">
                No owned agents yet.
              </p>
            ) : null}
            <div className="divide-y">
              {agents.slice(0, 5).map((agent) => (
                <Link
                  key={agent.id}
                  href={`/seller/agents/${agent.id}/edit`}
                  className="grid gap-3 px-4 py-4 transition-colors hover:bg-muted/60 md:grid-cols-[auto_1fr_auto_auto]"
                >
                  <span className="flex size-9 items-center justify-center rounded-md bg-muted">
                    <Bot className="size-4 text-muted-foreground" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{agent.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPricingType(agent.pricing_type)}
                    </p>
                  </div>
                  <Badge variant={agent.is_active ? "secondary" : "outline"}>
                    {agent.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {formatAgentPrice(agent)}
                  </p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader className="border-b">
            <CardTitle>Create new agent</CardTitle>
            <CardDescription>Publish a new capability.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-md border p-3">
              <Plus className="size-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Start with listing details</p>
                <p className="text-sm text-muted-foreground">
                  Define endpoint, pricing, and description.
                </p>
              </div>
            </div>
            <Button className="w-full" asChild>
              <Link href="/agents/new">Create new agent</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </>
  )
}
