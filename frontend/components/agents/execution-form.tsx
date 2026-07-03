"use client"

import { Code2, PlayCircle } from "lucide-react"
import { useMemo, useState } from "react"

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
import { formatNumber, runAgent } from "@/lib/backend"

type JsonSchema = {
  type?: string | string[]
  title?: string
  description?: string
  format?: string
  enum?: Array<string | number | boolean>
  required?: string[]
  properties?: Record<string, JsonSchema>
  items?: JsonSchema
  default?: unknown
}

type ExecutionFormProps = {
  agentId: number | string
  inputSchema?: Record<string, unknown> | null
  exampleInput?: Record<string, unknown> | null
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function schemaType(schema?: JsonSchema) {
  const type = Array.isArray(schema?.type) ? schema?.type[0] : schema?.type

  if (type) {
    return type
  }

  if (schema?.properties) {
    return "object"
  }

  if (schema?.items) {
    return "array"
  }

  return "string"
}

function labelFor(key: string, schema?: JsonSchema) {
  return (
    schema?.title ||
    key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  )
}

function buildInitialInput(
  schema?: JsonSchema,
  example?: Record<string, unknown> | null
): Record<string, unknown> {
  if (example) {
    return example
  }

  if (!schema?.properties) {
    return { prompt: "Test this agent" }
  }

  return Object.fromEntries(
    Object.entries(schema.properties).map(([key, propertySchema]) => {
      if (propertySchema.default !== undefined) {
        return [key, propertySchema.default]
      }

      if (propertySchema.enum?.length) {
        return [key, propertySchema.enum[0]]
      }

      const type = schemaType(propertySchema)

      if (type === "number" || type === "integer") {
        return [key, 0]
      }

      if (type === "boolean") {
        return [key, false]
      }

      if (type === "array") {
        return [key, []]
      }

      if (type === "object") {
        return [key, buildInitialInput(propertySchema)]
      }

      return [key, ""]
    })
  )
}

function coerceFieldValue(value: string, schema?: JsonSchema) {
  const type = schemaType(schema)

  if (type === "number") {
    return value === "" ? "" : Number(value)
  }

  if (type === "integer") {
    return value === "" ? "" : Math.trunc(Number(value))
  }

  if (type === "array") {
    if (!value.trim()) {
      return []
    }

    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed)
        ? parsed
        : value.split(",").map((item) => item.trim()).filter(Boolean)
    } catch {
      return value.split(",").map((item) => item.trim()).filter(Boolean)
    }
  }

  return value
}

function setNestedValue(
  current: Record<string, unknown>,
  path: string[],
  value: unknown
): Record<string, unknown> {
  const [key, ...rest] = path

  if (!key) {
    return current
  }

  if (rest.length === 0) {
    return {
      ...current,
      [key]: value,
    }
  }

  return {
    ...current,
    [key]: setNestedValue(
      isPlainObject(current[key]) ? current[key] : {},
      rest,
      value
    ),
  }
}

function getNestedValue(current: Record<string, unknown>, path: string[]) {
  return path.reduce<unknown>((value, key) => {
    if (!isPlainObject(value)) {
      return undefined
    }

    return value[key]
  }, current)
}

type SchemaFieldsProps = {
  schema: JsonSchema
  required?: string[]
  value: Record<string, unknown>
  path?: string[]
  onChange: (path: string[], value: unknown) => void
}

function SchemaFields({
  schema,
  required = schema.required ?? [],
  value,
  path = [],
  onChange,
}: SchemaFieldsProps) {
  const properties = schema.properties ?? {}

  return (
    <div className="space-y-4">
      {Object.entries(properties).map(([key, propertySchema]) => {
        const fieldPath = [...path, key]
        const fieldValue = getNestedValue(value, fieldPath)
        const type = schemaType(propertySchema)
        const fieldId = `execution-${fieldPath.join("-")}`
        const isRequired = required.includes(key)

        if (type === "object" && propertySchema.properties) {
          return (
            <fieldset key={fieldId} className="space-y-3 rounded-md border p-3">
              <legend className="px-1 text-sm font-medium">
                {labelFor(key, propertySchema)}
              </legend>
              {propertySchema.description ? (
                <p className="text-xs text-muted-foreground">
                  {propertySchema.description}
                </p>
              ) : null}
              <SchemaFields
                schema={propertySchema}
                required={propertySchema.required}
                value={value}
                path={fieldPath}
                onChange={onChange}
              />
            </fieldset>
          )
        }

        return (
          <div key={fieldId} className="space-y-2">
            <Label htmlFor={fieldId}>
              {labelFor(key, propertySchema)}
              {isRequired ? " *" : ""}
            </Label>
            {propertySchema.enum?.length ? (
              <Select
                value={fieldValue === undefined ? "" : String(fieldValue)}
                onValueChange={(nextValue) => {
                  const selectedOption = propertySchema.enum?.find(
                    (option) => String(option) === nextValue
                  )
                  onChange(fieldPath, selectedOption ?? nextValue)
                }}
              >
                <SelectTrigger id={fieldId} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {propertySchema.enum.map((option) => (
                    <SelectItem key={String(option)} value={String(option)}>
                      {String(option)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : type === "boolean" ? (
              <label className="flex h-10 items-center gap-2 rounded-md border px-3 text-sm">
                <input
                  id={fieldId}
                  type="checkbox"
                  checked={Boolean(fieldValue)}
                  onChange={(event) => onChange(fieldPath, event.target.checked)}
                />
                Enabled
              </label>
            ) : type === "array" ? (
              <Textarea
                id={fieldId}
                className="min-h-24 font-mono text-sm"
                value={
                  Array.isArray(fieldValue)
                    ? JSON.stringify(fieldValue, null, 2)
                    : String(fieldValue ?? "")
                }
                onChange={(event) =>
                  onChange(
                    fieldPath,
                    coerceFieldValue(event.target.value, propertySchema)
                  )
                }
              />
            ) : (
              <Input
                id={fieldId}
                type={
                  type === "number" || type === "integer"
                    ? "number"
                    : propertySchema.format === "date"
                      ? "date"
                      : "text"
                }
                value={
                  fieldValue === undefined || fieldValue === null
                    ? ""
                    : String(fieldValue)
                }
                onChange={(event) =>
                  onChange(
                    fieldPath,
                    coerceFieldValue(event.target.value, propertySchema)
                  )
                }
              />
            )}
            {propertySchema.description ? (
              <p className="text-xs text-muted-foreground">
                {propertySchema.description}
              </p>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

export function ExecutionForm({
  agentId,
  inputSchema,
  exampleInput,
}: ExecutionFormProps) {
  const schema = inputSchema as JsonSchema | null
  const initialInput = useMemo(
    () => buildInitialInput(schema ?? undefined, exampleInput),
    [schema, exampleInput]
  )
  const [formInput, setFormInput] = useState<Record<string, unknown>>(initialInput)
  const [input, setInput] = useState(JSON.stringify(initialInput, null, 2))
  const [isAdvanced, setIsAdvanced] = useState(!schema?.properties)
  const [error, setError] = useState("")
  const [result, setResult] = useState<unknown>(null)
  const [meta, setMeta] = useState("")
  const [isRunning, setIsRunning] = useState(false)

  function handleFieldChange(path: string[], value: unknown) {
    setFormInput((current) => {
      const nextInput = setNestedValue(current, path, value)
      setInput(JSON.stringify(nextInput, null, 2))
      return nextInput
    })
  }

  async function handleRun() {
    setError("")
    setResult(null)
    setMeta("")
    setIsRunning(true)

    try {
      const parsedInput = isAdvanced ? JSON.parse(input) : formInput
      const data = await runAgent(agentId, parsedInput)

      setResult(data.output)
      setMeta(
        `${data.status} - ${formatNumber(data.cost)} credits - ${data.responseTime}ms`
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Execution failed")
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="space-y-4">
      {schema?.properties && !isAdvanced ? (
        <SchemaFields
          schema={schema}
          value={formInput}
          onChange={handleFieldChange}
        />
      ) : (
        <div className="space-y-2">
          <Label htmlFor="execution-input">Input JSON</Label>
          <Textarea
            id="execution-input"
            className="min-h-36 font-mono text-sm"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
        </div>
      )}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button className="flex-1" onClick={handleRun} disabled={isRunning}>
          <PlayCircle className="size-4" />
          {isRunning ? "Running..." : "Run agent"}
        </Button>
        {schema?.properties ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setInput(JSON.stringify(formInput, null, 2))
              setIsAdvanced((current) => !current)
            }}
          >
            <Code2 className="size-4" />
            {isAdvanced ? "Use form" : "Advanced JSON"}
          </Button>
        ) : null}
      </div>

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
