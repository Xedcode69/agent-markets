import { BuyerCreditsPanel } from "@/components/buyer/buyer-credits-panel"
import { BuyerShell } from "@/components/buyer/buyer-shell"

export default function BuyerCreditsPage() {
  return (
    <BuyerShell
      active="credits"
      eyebrow="Buyer credits"
      title="Credits"
      action={{ href: "/buyer/executions", label: "View usage" }}
    >
      <BuyerCreditsPanel />
    </BuyerShell>
  )
}
