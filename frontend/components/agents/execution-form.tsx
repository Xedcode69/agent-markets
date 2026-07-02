"use client"

import { PlayCircle } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatNumber, runAgent } from "@/lib/backend"

type ExecutionFormProps = {
  agentId: number | string
  exampleInput?: Record<string, unknown> | null
}

export function ExecutionForm({ agentId, exampleInput }: ExecutionFormProps) {
  const [input, setInput] = useState(
    JSON.stringify(exampleInput ?? { prompt: "Test this agent" }, null, 2)
  )
  const [error, setError] = useState("")
  const [result, setResult] = useState<unknown>(null)
  const [meta, setMeta] = useState("")
  const [isRunning, setIsRunning] = useState(false)

  async function handleRun() {
    setError("")
    setResult(null)
    setMeta("")
    setIsRunning(true)

    try {
      const parsedInput = JSON.parse(input)
      const data = await runAgent(agentId, parsedInput)

      setResult(data.output)
      setMeta(
        `${data.status} · ${formatNumber(data.cost)} credits · ${data.responseTime}ms`
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Execution failed")
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="execution-input">Input JSON</Label>
        <Textarea
          id="execution-input"
          className="min-h-36 font-mono text-sm"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button className="w-full" onClick={handleRun} disabled={isRunning}>
        <PlayCircle className="size-4" />
        {isRunning ? "Running..." : "Run agent"}
      </Button>

      {result ? (
        <div className="space-y-2 rounded-md border p-3">
          <p className="text-sm font-medium">Result</p>
          {meta ? <p className="text-xs text-muted-foreground">{meta}</p> : null}
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap text-xs">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      ) : null}
    </div>
  )
}
