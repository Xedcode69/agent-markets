"use client"

import Link from "next/link"
import { Filter, Search, Star } from "lucide-react"
import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  type Agent,
  type PricingType,
  agentDescription,
  formatAgentDate,
  formatAgentPrice,
  formatPricingType,
} from "@/lib/agents"

type AgentMarketplaceProps = {
  agents: Agent[]
  error?: string | null
}

export function AgentMarketplace({ agents, error }: AgentMarketplaceProps) {
  const [query, setQuery] = useState("")
  const [pricingType, setPricingType] = useState<PricingType | "all">("all")

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchesQuery =
        agent.name.toLowerCase().includes(query.toLowerCase()) ||
        agentDescription(agent).toLowerCase().includes(query.toLowerCase())
      const matchesPricing =
        pricingType === "all" || agent.pricing_type === pricingType

      return matchesQuery && matchesPricing
    })
  }, [agents, pricingType, query])

  return (
    <>
      <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-base font-semibold">Find an agent</h2>
          <p className="text-sm text-muted-foreground">
            Compare available agents by description and price.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative w-full min-w-0 sm:w-80">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Search agents"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={pricingType === "all" ? "default" : "outline"}
              onClick={() => setPricingType("all")}
            >
              <Filter className="size-4" />
              All
            </Button>
            <Button
              variant={pricingType === "per_call" ? "default" : "outline"}
              onClick={() => setPricingType("per_call")}
            >
              Per call
            </Button>
            <Button
              variant={pricingType === "subscription" ? "default" : "outline"}
              onClick={() => setPricingType("subscription")}
            >
              Subscription
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {error ? (
          <Card className="rounded-lg md:col-span-2 xl:col-span-4">
            <CardContent className="py-8 text-sm text-destructive">
              {error}
            </CardContent>
          </Card>
        ) : null}
        {!error && !filteredAgents.length ? (
          <Card className="rounded-lg md:col-span-2 xl:col-span-4">
            <CardContent className="py-8 text-sm text-muted-foreground">
              No matching agents found.
            </CardContent>
          </Card>
        ) : null}
        {filteredAgents.map((agent) => (
          <Card key={agent.id} className="rounded-lg">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="truncate">{agent.name}</CardTitle>
                  <CardDescription>
                    {formatPricingType(agent.pricing_type)}
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  {agent.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {agentDescription(agent)}
              </p>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="mt-1 flex items-center gap-1 font-medium">
                    <Star className="size-4 fill-current" />
                    Listed
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="mt-1 font-medium">
                    {formatAgentDate(agent.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Price</p>
                  <p className="mt-1 font-medium">{formatAgentPrice(agent)}</p>
                </div>
              </div>
              <Button className="w-full" asChild>
                <Link href={`/agents/${agent.id}`}>View profile</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  )
}
