import { SellerExecutionsPanel } from "@/components/seller/seller-executions-panel"
import { SellerShell } from "@/components/seller/seller-shell"

export default function SellerExecutionsPage() {
  return (
    <SellerShell
      active="executions"
      eyebrow="Seller executions"
      title="Executions"
      action={{ href: "/seller/agents", label: "Manage agents" }}
    >
      <SellerExecutionsPanel />
    </SellerShell>
  )
}
