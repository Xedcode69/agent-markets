"use client"

import { CheckCircle2, Clock3, XCircle } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
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
  getSellerExecutions,
} from "@/lib/backend"

const statusIcon = {
  completed: CheckCircle2,
  failed: XCircle,
  pending: Clock3,
}

export function SellerExecutionsPanel() {
  const [executions, setExecutions] = useState<Execution[]>([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getSellerExecutions()
      .then(setExecutions)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load executions.")
      )
      .finally(() => setIsLoading(false))
  }, [])

  const revenue = useMemo(() => {
    return executions.reduce((total, item) => total + Number(item.cost || 0), 0)
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
            <CardTitle className="text-2xl">{executions.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-lg">
          <CardHeader>
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-2xl">
              {executions.filter((item) => item.status === "completed").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-lg">
          <CardHeader>
            <CardDescription>Credits earned</CardDescription>
            <CardTitle className="text-2xl">{formatNumber(revenue)}</CardTitle>
          </CardHeader>
        </Card>
      </section>

      <Card className="rounded-lg">
        <CardHeader className="border-b">
          <CardTitle>Recent executions across owned agents</CardTitle>
          <CardDescription>Monitor buyer runs, credits, and status.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {error ? <p className="p-4 text-sm text-destructive">{error}</p> : null}
          {!error && !executions.length ? (
            <p className="p-4 text-sm text-muted-foreground">
              No executions for your agents yet.
            </p>
          ) : null}
          <div className="divide-y">
            {executions.map((execution) => {
              const Icon = statusIcon[execution.status]

              return (
                <div
                  key={execution.id}
                  className="grid gap-3 px-4 py-4 lg:grid-cols-[auto_1fr_auto_auto_auto]"
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
                  <p className="font-medium">{formatNumber(execution.cost)}</p>
                  <p className="text-sm text-muted-foreground lg:text-right">
                    {formatDateTime(execution.created_at)}
                  </p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
