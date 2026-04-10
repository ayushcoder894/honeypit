import { useEffect, useRef, useState } from "react";
import { Activity, Brain, Hourglass, Terminal, Zap } from "lucide-react";

const MODE_IDLE = "idle";
const MODE_NODE4 = "node4";
const MODE_NODE3 = "node3";

const node4Command = "root@target:~# cat /etc/kubernetes/admin.conf";
const node4Yaml = `apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LS0tLS1CRUdJTiBGQUtFLUNFUlQtREFUQS0tLS0t
    server: https://10.220.14.88:6443
  name: prod-simulated-cluster
contexts:
- context:
    cluster: prod-simulated-cluster
    user: admin-sim
    namespace: kube-system
  name: admin@prod-simulated
current-context: admin@prod-simulated
kind: Config
users:
- name: admin-sim
  user:
    token: eyJhbGciOiJSUzI1NiIsImtpZCI6InNpbXVsYXRlZC10b2tlbiJ9.fake.payload.signature`;

function formatDuration(totalSeconds) {
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function ThreatTelemetryFlow({ node4OpenSignal = 0 }) {
  const [mode, setMode] = useState(MODE_IDLE);
  const [node4TypedCommand, setNode4TypedCommand] = useState("");
  const [node4SystemMessage, setNode4SystemMessage] = useState("");
  const [node4TypedYaml, setNode4TypedYaml] = useState("");
  const [node4Delivered, setNode4Delivered] = useState(false);

  const [node3CommandVisible, setNode3CommandVisible] = useState(false);
  const [node3Progress, setNode3Progress] = useState(0);
  const [node3Speed, setNode3Speed] = useState("120.000 KB/s");
  const [node3WastedTime, setNode3WastedTime] = useState(195);

  const timersRef = useRef([]);

  useEffect(() => {
    if (node4OpenSignal > 0) {
      setMode(MODE_NODE4);
    }
  }, [node4OpenSignal]);

  useEffect(() => {
    timersRef.current.forEach((t) => {
      clearTimeout(t);
      clearInterval(t);
    });
    timersRef.current = [];

    setNode4TypedCommand("");
    setNode4SystemMessage("");
    setNode4TypedYaml("");
    setNode4Delivered(false);
    setNode3CommandVisible(false);
    setNode3Progress(0);
    setNode3Speed("120.000 KB/s");
    setNode3WastedTime(195);

    if (mode === MODE_NODE4) {
      const start = window.setTimeout(() => {
        let idx = 0;
        const cmdTimer = window.setInterval(() => {
          idx += 1;
          setNode4TypedCommand(node4Command.slice(0, idx));
          if (idx >= node4Command.length) {
            clearInterval(cmdTimer);
            const systemPause = window.setTimeout(() => {
              setNode4SystemMessage("[System] Request intercepted. Constructing prompt...");
              const yamlPause = window.setTimeout(() => {
                let y = 0;
                const yamlTimer = window.setInterval(() => {
                  y += 2;
                  setNode4TypedYaml(node4Yaml.slice(0, y));
                  if (y >= node4Yaml.length) {
                    clearInterval(yamlTimer);
                    setNode4Delivered(true);
                  }
                }, 14);
                timersRef.current.push(yamlTimer);
              }, 700);
              timersRef.current.push(yamlPause);
            }, 500);
            timersRef.current.push(systemPause);
          }
        }, 28);
        timersRef.current.push(cmdTimer);
      }, 350);
      timersRef.current.push(start);
    }

    if (mode === MODE_NODE3) {
      const commandPause = window.setTimeout(() => {
        setNode3CommandVisible(true);
      }, 320);
      timersRef.current.push(commandPause);

      const progressPause = window.setTimeout(() => {
        const progressTimer = window.setInterval(() => {
          setNode3Progress((prev) => {
            if (prev >= 99.2) {
              setNode3Speed("0.002 KB/s");
              return prev;
            }

            let next = prev;
            if (prev < 70) {
              next += 2.2;
              setNode3Speed("84.120 KB/s");
            } else if (prev < 90) {
              next += 0.85;
              setNode3Speed("19.540 KB/s");
            } else if (prev < 98) {
              next += 0.24;
              setNode3Speed("1.240 KB/s");
            } else {
              next += 0.02;
              setNode3Speed("0.002 KB/s");
            }

            return Math.min(99.2, next);
          });
        }, 140);

        timersRef.current.push(progressTimer);
      }, 980);
      timersRef.current.push(progressPause);

      const wastedTimer = window.setInterval(() => {
        setNode3WastedTime((prev) => prev + 1);
      }, 1000);
      timersRef.current.push(wastedTimer);
    }

    return () => {
      timersRef.current.forEach((t) => {
        clearTimeout(t);
        clearInterval(t);
      });
      timersRef.current = [];
    };
  }, [mode]);

  const title =
    mode === MODE_NODE4
      ? "Node-AI-04: Generative Deception"
      : mode === MODE_NODE3
        ? "Node-FTP-03: Algorithmic Tarpit"
        : "Interactive AI Honeypot Flow";

  const badgeText = mode === MODE_NODE4 ? "LLM Active" : mode === MODE_NODE3 ? "Tarpit Engaged" : "Idle";

  const badgeClass =
    mode === MODE_NODE4
      ? "border-cyan-400/60 bg-cyan-500/10 text-cyan-100 shadow-neonCyan"
      : mode === MODE_NODE3
        ? "border-botYellow/70 bg-botYellow/15 text-yellow-200"
        : "border-slate-600 bg-slate-800/70 text-slate-300";

  return (
    <section>
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode(MODE_NODE4)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-500 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white"
        >
          <Activity className="h-4 w-4" />
          Simulate Node-AI-04 Attack
        </button>
        <button
          type="button"
          onClick={() => setMode(MODE_NODE3)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-500 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white"
        >
          <Zap className="h-4 w-4" />
          Simulate Node-FTP-03 Attack
        </button>
        <button
          type="button"
          onClick={() => setMode(MODE_IDLE)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-400"
        >
          <Hourglass className="h-4 w-4" />
          Reset
        </button>
      </div>

      <div className="rounded-xl border border-slate-700 bg-panel/95 p-4">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slateText">Threat Telemetry</p>
            <h2 className="text-xl font-bold text-slate-100">{title}</h2>
          </div>
          <span className={["rounded border px-2 py-1 font-mono text-xs", badgeClass].join(" ")}>[{badgeText}]</span>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-950/75 p-4">
          {mode === MODE_IDLE && (
            <p className="text-sm text-slate-300">
              Click compromised Node-AI-04 in Deployment Ops above to initialize live telemetry.
            </p>
          )}

          {mode === MODE_NODE4 && (
            <div className="space-y-3">
              <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-3">
                <p className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-slate-400">
                  <Terminal className="h-4 w-4" />
                  Attacker Input
                </p>
                <pre className="whitespace-pre-wrap font-mono text-sm text-slate-100">
                  {node4TypedCommand}
                  {node4TypedCommand.length < node4Command.length && <span className="animate-pulse">_</span>}
                </pre>
              </div>

              <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-slate-300">
                    <Brain className="h-4 w-4" />
                    Generative Deception Engine
                  </p>
                  {node4Delivered && (
                    <span className="rounded border border-cyan-400/60 bg-cyan-500/10 px-2 py-1 font-mono text-[11px] text-cyan-100">
                      Payload Delivered
                    </span>
                  )}
                </div>

                {node4SystemMessage && <p className="mb-2 font-mono text-xs text-slate-300">{node4SystemMessage}</p>}

                <pre className="min-h-40 whitespace-pre-wrap font-mono text-xs leading-relaxed text-cyan-200">
                  {node4TypedYaml}
                  {!node4Delivered && node4TypedYaml.length > 0 && <span className="animate-pulse">_</span>}
                </pre>
              </div>
            </div>
          )}

          {mode === MODE_NODE3 && (
            <div className="space-y-3">
              {node3CommandVisible && (
                <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-3">
                  <p className="mb-1 font-mono text-xs uppercase tracking-[0.14em] text-slate-400">Attacker Request</p>
                  <p className="font-mono text-sm text-slate-100">GET production_db_dump.zip (8.5GB)</p>
                </div>
              )}

              <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-3">
                <p className="mb-2 text-xs uppercase tracking-[0.14em] text-slate-400">Transfer Progress</p>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-slate-300 via-slate-200 to-white transition-all"
                    style={{ width: `${node3Progress}%` }}
                  />
                </div>
                <p className="mt-2 font-mono text-xs text-slate-300">{node3Progress.toFixed(2)}%</p>
              </div>

              <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-3">
                <p className="font-mono text-xs text-slate-200">
                  Throttling connection... | Speed: {node3Speed} | Time Wasted: {formatDuration(node3WastedTime)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ThreatTelemetryFlow;
