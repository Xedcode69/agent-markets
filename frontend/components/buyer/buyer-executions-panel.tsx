"use client"

import Link from "next/link"
import { CheckCircle2, Clock3, PlayCircle, XCircle } from "lucide-react"
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
  type Execution,
  formatDateTime,
  formatNumber,
  getMyExecutions,
} from "@/lib/backend"

const statusIcon = {
  completed: CheckCircle2,
  failed: XCircle,
  pending: Clock3,
}

export function BuyerExecutionsPanel() {
  const [executions, setExecutions] = useState<Execution[]>([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getMyExecutions()
      .then(setExecutions)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load executions.")
      )
      .finally(() => setIsLoading(false))
  }, [])

  const counts = useMemo(() => {
    return {
      completed: executions.filter((item) => item.status === "completed").length,
      failed: executions.filter((item) => item.status === "failed").length,
      total: executions.length,
    }
  }, [executions])

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading executions...</p>
  }

  return (
    <>
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-lg">
          <CardHeader>
            <CardDescription>Total runs</CardDescription>
            <CardTitle className="text-2xl">{counts.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-lg">
          <CardHeader>
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-2xl">{counts.completed}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-lg">
          <CardHeader>
            <CardDescription>Failed</CardDescription>
            <CardTitle className="text-2xl">{counts.failed}</CardTitle>
          </CardHeader>
        </Card>
      </section>

      <Card className="rounded-lg">
        <CardHeader className="border-b">
          <CardTitle>Execution history</CardTitle>
          <CardDescription>Runs charged against your buyer account.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {error ? <p className="p-4 text-sm text-destructive">{error}</p> : null}
          {!error && !executions.length ? (
            <p className="p-4 text-sm text-muted-foreground">
              No executions yet. Choose an agent to run your first one.
            </p>
          ) : null}
          <div className="divide-y">
            {executions.map((execution) => {
              const Icon = statusIcon[execution.status]

              return (
                <div
                  key={execution.id}
                  className="grid gap-3 px-4 py-4 md:grid-cols-[auto_1fr_auto_auto_auto]"
                >
                  <span className="flex size-9 items-center justify-center rounded-md bg-muted">
                    <Icon className="size-4 text-muted-foreground" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      Execution #{execution.id}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Agent #{execution.agent_id}
                    </p>
                  </div>
                  <Badge variant={execution.status === "failed" ? "outline" : "secondary"}>
                    {execution.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {formatNumber(execution.cost)} credits
                  </p>
                  <p className="text-sm text-muted-foreground md:text-right">
                    {formatDateTime(execution.created_at)}
                  </p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-lg">
        <CardHeader className="border-b">
          <CardTitle>Start a new execution</CardTitle>
          <CardDescription>Select an agent and launch the next run.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-md bg-muted">
              <PlayCircle className="size-5 text-muted-foreground" />
            </span>
            <div>
              <p className="font-medium">Agent marketplace</p>
              <p className="text-sm text-muted-foreground">
                Browse active agents and run one from its profile.
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href="/agents">Choose agent</Link>
          </Button>
        </CardContent>
      </Card>
    </>
  )
}
