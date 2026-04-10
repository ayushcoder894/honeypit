import { useMemo, useState } from "react";
import GlobalHeader from "./components/GlobalHeader";
import SwarmControl from "./components/SwarmControl";
import NodeGraph from "./components/NodeGraph";
import TrafficTicker from "./components/TrafficTicker";
import AttackerProfile from "./components/AttackerProfile";
import LiveAttackMap from "./components/LiveAttackMap";
import ThreatTelemetryFlow from "./components/ThreatTelemetryFlow";
import ThreatIntelligenceExport from "./components/ThreatIntelligenceExport";
import { attackers, swarmNodes, trafficTicker } from "./data/mockData";

function App() {
  const [query, setQuery] = useState("");
  const [selectedAttackerId, setSelectedAttackerId] = useState(attackers[0].id);
  const [telemetryNode4Signal, setTelemetryNode4Signal] = useState(0);

  const highestThreatAttacker = useMemo(() => {
    return attackers.reduce((top, attacker) => {
      return attacker.threatScore > top.threatScore ? attacker : top;
    }, attackers[0]);
  }, []);

  const visibleAttackers = useMemo(() => {
    if (!query.trim()) {
      return attackers;
    }

    const q = query.toLowerCase();
    return attackers.filter((attacker) => {
      return [
        attacker.alias,
        attacker.classification,
        attacker.weapon,
        attacker.sourceIp,
        attacker.timeline.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [query]);

  const selected = useMemo(() => {
    return visibleAttackers.find((attacker) => attacker.id === selectedAttackerId) ?? visibleAttackers[0] ?? attackers[0];
  }, [selectedAttackerId, visibleAttackers]);

  const criticalCount = attackers.filter((a) => a.classification === "Human Hacker").length;

  const handleAlertClick = () => {
    setQuery("");
    setSelectedAttackerId(highestThreatAttacker.id);
  };

  const handleOpenTelemetryFromSwarm = (nodeId) => {
    if (nodeId === "N4") {
      setTelemetryNode4Signal((prev) => prev + 1);
    }
  };

  return (
    <main className="min-h-screen bg-bg px-4 py-5 text-slate-100 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4">
        <GlobalHeader
          criticalCount={criticalCount}
          query={query}
          setQuery={setQuery}
          onAlertClick={handleAlertClick}
        />
        <SwarmControl nodes={swarmNodes} onInspectCompromised={handleOpenTelemetryFromSwarm} />

        <section className="grid gap-4 xl:grid-cols-[2.2fr_1fr]">
          <NodeGraph
            attackers={visibleAttackers}
            selectedId={selected.id}
            onSelect={setSelectedAttackerId}
          />
          <TrafficTicker items={trafficTicker} />
        </section>

        <ThreatTelemetryFlow node4OpenSignal={telemetryNode4Signal} />

        <LiveAttackMap attackers={visibleAttackers} />

        <AttackerProfile attacker={selected} />

        <ThreatIntelligenceExport />
      </div>
    </main>
  );
}

export default App;
