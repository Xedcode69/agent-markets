import { SellerDashboardPanel } from "@/components/seller/seller-dashboard-panel"
import { SellerShell } from "@/components/seller/seller-shell"

export default function SellerDashboardPage() {
  return (
    <SellerShell
      active="dashboard"
      eyebrow="Seller dashboard"
      title="Publishing overview"
      action={{ href: "/agents/new", label: "Create agent" }}
    >
      <SellerDashboardPanel />
    </SellerShell>
  )
}
