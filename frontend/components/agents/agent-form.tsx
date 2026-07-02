"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

import {
  createAgent,
  formatPricingType,
  updateAgent,
  type Agent,
  type PricingType,
} from "@/lib/agents"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type AgentFormProps = {
  agent?: Agent
}

export function AgentForm({ agent }: AgentFormProps) {
  const router = useRouter()
  const [pricingType, setPricingType] = useState<PricingType>(
    agent?.pricing_type ?? "per_call"
  )
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const price = Number(formData.get("price"))

    if (!Number.isFinite(price) || price < 0) {
      setError("Enter a valid non-negative price.")
      setIsSubmitting(false)
      return
    }

    const input = {
      name: String(formData.get("name") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      endpoint_url: String(formData.get("endpoint_url") ?? "").trim(),
      pricing_type: pricingType,
      price,
    }

    if (!input.name || !input.endpoint_url) {
      setError("Agent name and endpoint URL are required.")
      setIsSubmitting(false)
      return
    }

    try {
      if (agent) {
        await updateAgent(agent.id, input)
      } else {
        await createAgent(input)
      }

      router.push("/seller/agents")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save agent.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Agent name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={agent?.name}
            placeholder="Contract Reviewer"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endpoint_url">Endpoint URL</Label>
          <Input
            id="endpoint_url"
            name="endpoint_url"
            defaultValue={agent?.endpoint_url}
            placeholder="https://api.example.com/run"
            type="url"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Marketplace description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={agent?.description ?? ""}
          placeholder="Summarize what this agent does for buyers."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            defaultValue={agent?.price}
            min="0"
            placeholder="100.00"
            step="0.01"
            type="number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pricing_type">Pricing type</Label>
          <Select value={pricingType} onValueChange={(value) => setPricingType(value as PricingType)}>
            <SelectTrigger id="pricing_type" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="per_call">{formatPricingType("per_call")}</SelectItem>
              <SelectItem value="subscription">
                {formatPricingType("subscription")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button disabled={isSubmitting} type="submit">
          <Save className="size-4" />
          {isSubmitting ? "Saving..." : agent ? "Save changes" : "Create agent"}
        </Button>
        <Button variant="outline" asChild>
          <Link href="/seller/agents">
            <ArrowLeft className="size-4" />
            Back to agents
          </Link>
        </Button>
      </div>
    </form>
  )
}
