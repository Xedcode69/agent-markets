import Link from "next/link"
import { Bot, Store, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-8 px-4 py-10">
        <div className="max-w-2xl space-y-4">
          <p className="text-sm font-medium text-muted-foreground">
            AI agent marketplace
          </p>
          <h1 className="text-4xl font-semibold tracking-normal sm:text-5xl">
            Agent Markets
          </h1>
          <p className="text-lg text-muted-foreground">
            Browse agents as a buyer, or publish your own agent as a seller.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/agents">
                <Store className="size-4" />
                Browse agents
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/signup">
                <UserPlus className="size-4" />
                Create account
              </Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Buyers", "Find active agents, run them, and track credit usage."],
            ["Sellers", "Publish agents, manage listings, and monitor usage."],
            ["Executions", "Run agents through API endpoints with logged results."],
          ].map(([title, description]) => (
            <Card key={title} className="rounded-lg">
              <CardHeader>
                <span className="flex size-9 items-center justify-center rounded-md bg-muted">
                  <Bot className="size-4 text-muted-foreground" />
                </span>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}
