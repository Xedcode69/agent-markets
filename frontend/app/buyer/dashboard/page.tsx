import { BuyerDashboardPanel } from "@/components/buyer/buyer-dashboard-panel"
import { BuyerShell } from "@/components/buyer/buyer-shell"

export default function BuyerDashboardPage() {
  return (
    <BuyerShell
      active="dashboard"
      eyebrow="Buyer dashboard"
      title="Overview"
      action={{ href: "/agents", label: "Find agents" }}
    >
      <BuyerDashboardPanel />
    </BuyerShell>
  )
}
