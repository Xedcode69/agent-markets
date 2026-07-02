import { AgentMarketplace } from "@/components/agents/agent-marketplace"
import { BuyerShell } from "@/components/buyer/buyer-shell"
import {
  type Agent,
  getAgents,
} from "@/lib/agents"

export default async function AgentsPage() {
  let agents: Agent[] = []
  let error: string | null = null

  try {
    agents = await getAgents()
  } catch (err) {
    error = err instanceof Error ? err.message : "Unable to load agents."
  }

  return (
    <BuyerShell active="agents" eyebrow="Marketplace" title="Agents">
      <AgentMarketplace agents={agents} error={error} />
    </BuyerShell>
  )
}
