import Link from "next/link"
import { Plus } from "lucide-react"

import { SellerAgentList } from "@/components/agents/seller-agent-list"
import { SellerShell } from "@/components/seller/seller-shell"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function SellerAgentsPage() {
  return (
    <SellerShell
      active="agents"
      eyebrow="Seller agents"
      title="My agents"
      action={{ href: "/agents/new", label: "Create agent" }}
    >
      <Card className="rounded-lg">
        <CardHeader className="border-b">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Agent management table</CardTitle>
              <CardDescription>
                Manage listing state, pricing, usage, and edit flows.
              </CardDescription>
            </div>
            <Button asChild>
              <Link href="/agents/new">
                <Plus className="size-4" />
                New agent
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <SellerAgentList />
        </CardContent>
      </Card>
    </SellerShell>
  )
}
