"use client"

import { ArrowDownLeft, ArrowUpRight, CircleDollarSign } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  type Transaction,
  type UserProfile,
  formatDateTime,
  formatNumber,
  getMe,
  getMyTransactions,
  purchaseCredits,
} from "@/lib/backend"

export function BuyerCreditsPanel() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [amount, setAmount] = useState("1000")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isPurchasing, setIsPurchasing] = useState(false)

  function refreshCredits() {
    return Promise.all([getMe(), getMyTransactions()]).then(([profile, activity]) => {
      setUser(profile)
      setTransactions(activity)
    })
  }

  useEffect(() => {
    refreshCredits()
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load credits.")
      )
      .finally(() => setIsLoading(false))
  }, [])

  async function handlePurchase(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setMessage("")
    setIsPurchasing(true)

    try {
      const creditAmount = Number(amount)
      if (!Number.isInteger(creditAmount) || creditAmount <= 0) {
        throw new Error("Enter a whole number of credits.")
      }

      const updatedUser = await purchaseCredits(creditAmount)
      await refreshCredits()
      setUser(updatedUser)
      setMessage("Credits added successfully.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add credits.")
    } finally {
      setIsPurchasing(false)
    }
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading credits...</p>
  }

  return (
    <>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-lg lg:col-span-2">
          <CardHeader className="border-b">
            <CardTitle>Credit balance</CardTitle>
            <CardDescription>Available credits for marketplace execution.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="mt-2 text-3xl font-semibold">
                  {formatNumber(user?.credits)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="mt-2 text-3xl font-semibold">
                  {transactions.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account</p>
                <p className="mt-2 text-lg font-semibold">{user?.email ?? "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader className="border-b">
            <CardTitle>Add credits</CardTitle>
            <CardDescription>Top up your buyer balance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-3" onSubmit={handlePurchase}>
              <div className="space-y-2">
                <Label htmlFor="credit-amount">Credits</Label>
                <Input
                  id="credit-amount"
                  min="1"
                  max="100000"
                  step="1"
                  type="number"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                />
              </div>
              <Button className="w-full" type="submit" disabled={isPurchasing}>
                {isPurchasing ? "Adding..." : "Add credits"}
              </Button>
            </form>
            <div className="flex items-center gap-3 rounded-md border p-3">
              <CircleDollarSign className="size-5 text-muted-foreground" />
              <div>
                <p className="font-medium">
                  {user?.is_verified ? "Verified" : "Not verified"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Role: {user?.role ?? "buyer"}
                </p>
              </div>
            </div>
            {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-lg">
        <CardHeader className="border-b">
          <CardTitle>Credit activity</CardTitle>
          <CardDescription>Recent usage and top-ups.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {!transactions.length ? (
            <p className="p-4 text-sm text-muted-foreground">
              No credit activity yet.
            </p>
          ) : null}
          <div className="divide-y">
            {transactions.map((event) => {
              const isTopUp = event.type === "credit_purchase"

              return (
                <div
                  key={event.id}
                  className="grid gap-3 px-4 py-4 sm:grid-cols-[auto_1fr_auto_auto]"
                >
                  <span className="flex size-9 items-center justify-center rounded-md bg-muted">
                    {isTopUp ? (
                      <ArrowDownLeft className="size-4 text-emerald-600" />
                    ) : (
                      <ArrowUpRight className="size-4 text-muted-foreground" />
                    )}
                  </span>
                  <div>
                    <p className="font-medium">
                      {isTopUp ? "Credit purchase" : "Agent usage"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(event.created_at)}
                    </p>
                  </div>
                  <Badge variant={isTopUp ? "secondary" : "outline"}>
                    {event.status}
                  </Badge>
                  <p className="font-medium sm:text-right">
                    {isTopUp ? "+" : "-"}
                    {formatNumber(event.amount)}
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
