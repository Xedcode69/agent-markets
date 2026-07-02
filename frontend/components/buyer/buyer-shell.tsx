"use client"

import Link from "next/link"
import {
  Bell,
  CircleDollarSign,
  Home,
  LifeBuoy,
  PlayCircle,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

import { AuthGuard } from "@/components/auth/auth-guard"
import { LogoutButton } from "@/components/auth/logout-button"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

type BuyerShellProps = {
  active: "dashboard" | "credits" | "executions" | "agents"
  eyebrow: string
  title: string
  action?: {
    href: string
    label: string
  }
  children: React.ReactNode
}

const navItems = [
  { id: "dashboard", title: "Dashboard", href: "/buyer/dashboard", icon: Home },
  { id: "credits", title: "Credits", href: "/buyer/credits", icon: CircleDollarSign },
  { id: "executions", title: "Executions", href: "/buyer/executions", icon: PlayCircle, count: "8" },
  { id: "agents", title: "Agents", href: "/agents", icon: Search },
] as const

const accountItems = [
  { title: "Settings", href: "#settings", icon: Settings },
  { title: "Support", href: "#support", icon: LifeBuoy },
]

export function BuyerShell({
  active,
  eyebrow,
  title,
  action,
  children,
}: BuyerShellProps) {
  return (
    <AuthGuard expectedRole="buyer">
      <TooltipProvider>
        <SidebarProvider>
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader className="px-3 py-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild tooltip="Agent Markets">
                  <Link href="/buyer/dashboard">
                    <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                      <Sparkles className="size-4" />
                    </span>
                    <span className="grid flex-1 text-left leading-tight">
                      <span className="truncate font-semibold">Agent Markets</span>
                      <span className="truncate text-xs text-sidebar-foreground/70">
                        Buyer workspace
                      </span>
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Marketplace</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={item.id === active}
                        tooltip={item.title}
                      >
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      {"count" in item ? (
                        <SidebarMenuBadge>{item.count}</SidebarMenuBadge>
                      ) : null}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator />

            <SidebarGroup>
              <SidebarGroupLabel>Account</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {accountItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <div className="rounded-lg border bg-background p-3 group-data-[collapsible=icon]:hidden">
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 size-4 text-emerald-600" />
                <div className="min-w-0">
                  <p className="text-sm font-medium">Verified buyer</p>
                  <p className="text-xs text-muted-foreground">
                    Team controls are active.
                  </p>
                </div>
              </div>
            </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur md:px-6">
            <SidebarTrigger />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted-foreground">{eyebrow}</p>
              <h1 className="truncate text-lg font-semibold">{title}</h1>
            </div>
            <Button variant="ghost" size="icon-sm" aria-label="Notifications">
              <Bell className="size-4" />
            </Button>
            <LogoutButton />
            {action ? (
              <Button asChild>
                <Link href={action.href}>{action.label}</Link>
              </Button>
            ) : null}
          </header>

          <main className="flex-1 space-y-6 p-4 md:p-6">{children}</main>
        </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </AuthGuard>
  )
}
