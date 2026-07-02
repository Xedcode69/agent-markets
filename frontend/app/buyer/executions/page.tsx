import { BuyerExecutionsPanel } from "@/components/buyer/buyer-executions-panel"
import { BuyerShell } from "@/components/buyer/buyer-shell"

export default function BuyerExecutionsPage() {
  return (
    <BuyerShell
      active="executions"
      eyebrow="Buyer executions"
      title="Executions"
      action={{ href: "/agents", label: "Run agent" }}
    >
      <BuyerExecutionsPanel />
    </BuyerShell>
  )
}
