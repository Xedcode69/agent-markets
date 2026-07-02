"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bot, Pencil, Trash2 } from "lucide-react"

import {
  deleteAgent,
  formatAgentDate,
  formatAgentPrice,
  getOwnerAgents,
  type Agent,
} from "@/lib/agents"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function SellerAgentList() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    getOwnerAgents()
      .then(setAgents)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unable to load agents.")
      })
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return <p className="px-4 py-6 text-sm text-muted-foreground">Loading agents...</p>
  }

  if (error) {
    return <p className="px-4 py-6 text-sm text-destructive">{error}</p>
  }

  if (!agents.length) {
    return (
      <div className="px-4 py-8 text-sm text-muted-foreground">
        No active agents yet. Create one to publish it to the marketplace.
      </div>
    )
  }

  async function handleDelete(agentId: number) {
    const confirmed = window.confirm("Deactivate this agent?")
    if (!confirmed) {
      return
    }

    setDeletingId(agentId)
    setError(null)

    try {
      await deleteAgent(agentId)
      setAgents((current) => current.filter((agent) => agent.id !== agentId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to deactivate agent.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="divide-y">
      {error ? <p className="px-4 py-3 text-sm text-destructive">{error}</p> : null}
      {agents.map((agent) => (
        <div
          key={agent.id}
          className="grid gap-3 px-4 py-4 lg:grid-cols-[auto_1.2fr_auto_auto_auto_auto_auto]"
        >
          <span className="flex size-9 items-center justify-center rounded-md bg-muted">
            <Bot className="size-4 text-muted-foreground" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium">{agent.name}</p>
            <p className="truncate text-sm text-muted-foreground">
              {agent.endpoint_url}
            </p>
          </div>
          <Badge variant={agent.is_active ? "secondary" : "outline"}>
            {agent.is_active ? "Active" : "Inactive"}
          </Badge>
          <p className="text-sm text-muted-foreground">
            {formatAgentPrice(agent)}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatAgentDate(agent.created_at)}
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/seller/agents/${agent.id}/edit`}>
              <Pencil className="size-4" />
              Edit
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(agent.id)}
            disabled={deletingId === agent.id}
          >
            <Trash2 className="size-4" />
            {deletingId === agent.id ? "Removing..." : "Deactivate"}
          </Button>
        </div>
      ))}
    </div>
  )
}
