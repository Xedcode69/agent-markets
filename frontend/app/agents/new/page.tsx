import { Bot, UploadCloud } from "lucide-react"

import { AgentForm } from "@/components/agents/agent-form"
import { SellerShell } from "@/components/seller/seller-shell"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function NewAgentPage() {
  return (
    <SellerShell
      active="new"
      eyebrow="Create agent"
      title="New agent"
      action={{ href: "/seller/agents", label: "My agents" }}
    >
      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="rounded-lg">
          <CardHeader className="border-b">
            <CardTitle>Publish an agent</CardTitle>
            <CardDescription>
              Define how buyers discover, price, and run this agent.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AgentForm />
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader className="border-b">
            <CardTitle>Publishing checklist</CardTitle>
            <CardDescription>Required before the listing goes live.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 rounded-md border p-3">
              <Bot className="size-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Agent profile</p>
                <p className="text-sm text-muted-foreground">
                  Name, description, and endpoint URL
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-md border p-3">
              <UploadCloud className="size-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Execution template</p>
                <p className="text-sm text-muted-foreground">Inputs, outputs, and credit model</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </SellerShell>
  )
}
