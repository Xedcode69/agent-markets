"use client"

import Link from "next/link"
import { Bot, CircleDollarSign, ClipboardList } from "lucide-react"
import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { type Agent, formatAgentPrice, getAgents } from "@/lib/agents"
import {
  type Execution,
  type UserProfile,
  formatDateTime,
  formatNumber,
  getMe,
  getMyExecutions,
} from "@/lib/backend"

export function BuyerDashboardPanel() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [executions, setExecutions] = useState<Execution[]>([])
  const [agents, setAgents] = useState<Agent[]>([])

  useEffect(() => {
    Promise.all([getMe(), getMyExecutions(), getAgents()])
      .then(([profile, runs, listings]) => {
        setUser(profile)
        setExecutions(runs)
        setAgents(listings)
      })
      .catch(() => {
        setAgents([])
      })
  }, [])

  const completed = executions.filter((item) => item.status === "completed").length

  return (
    <>
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-lg">
          <CardHeader>
            <CardDescription>Credit balance</CardDescription>
            <CardTitle className="text-2xl">
              {formatNumber(user?.credits)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-lg">
          <CardHeader>
            <CardDescription>Total executions</CardDescription>
            <CardTitle className="text-2xl">{executions.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-lg">
          <CardHeader>
            <CardDescription>Completed runs</CardDescription>
            <CardTitle className="text-2xl">{completed}</CardTitle>
          </CardHeader>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="rounded-lg">
          <CardHeader className="border-b">
            <CardTitle>Recent executions</CardTitle>
            <CardDescription>Your latest agent runs.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {!executions.length ? (
              <p className="p-4 text-sm text-muted-foreground">
                No executions yet.
              </p>
            ) : null}
            <div className="divide-y">
              {executions.slice(0, 5).map((execution) => (
                <Link
                  key={execution.id}
                  href="/buyer/executions"
                  className="grid gap-3 px-4 py-4 transition-colors hover:bg-muted/60 sm:grid-cols-[auto_1fr_auto_auto]"
                >
                  <span className="flex size-9 items-center justify-center rounded-md bg-muted">
                    <ClipboardList className="size-4 text-muted-foreground" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      Execution #{execution.id}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(execution.created_at)}
                    </p>
                  </div>
                  <Badge variant="secondary">{execution.status}</Badge>
                  <p className="text-sm text-muted-foreground">
                    {formatNumber(execution.cost)} credits
                  </p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader className="border-b">
            <CardTitle>Credits</CardTitle>
            <CardDescription>Current buyer balance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-md border p-3">
              <CircleDollarSign className="size-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{formatNumber(user?.credits)} credits</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button className="w-full" asChild>
              <Link href="/buyer/credits">View credits</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">Recommended agents</h2>
            <p className="text-sm text-muted-foreground">
              A few active marketplace listings to try.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/agents">Browse all</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {agents.slice(0, 3).map((agent) => (
            <Card key={agent.id} className="rounded-lg">
              <CardHeader>
                <span className="flex size-9 items-center justify-center rounded-md bg-muted">
                  <Bot className="size-4 text-muted-foreground" />
                </span>
                <CardTitle className="truncate">{agent.name}</CardTitle>
                <CardDescription>{formatAgentPrice(agent)}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" className="w-full" asChild>
                  <Link href={`/agents/${agent.id}`}>View profile</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  )
}
