function GlobalHeader({ criticalCount, query, setQuery, onAlertClick }) {
  return (
    <header className="rounded-xl border border-slate-800 bg-panel/90 px-5 py-4 backdrop-blur-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slateText">honeypit AI Command</p>
          <h1 className="text-2xl font-bold text-cyan-100">Threat Console</h1>
        </div>

        <div className="flex w-full items-center gap-3 lg:max-w-3xl">
          <div className="flex-1 rounded-lg border border-cyan-500/30 bg-slate-900/80 px-4 py-3 shadow-neonCyan">
            <p className="mb-1 text-[11px] uppercase tracking-[0.2em] text-cyan-300/70">Chat With Your Logs</p>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent font-mono text-sm text-slate-100 outline-none placeholder:text-slate-500"
              placeholder="e.g., Show me all human attacks probing for AWS keys yesterday..."
            />
          </div>

          <button
            type="button"
            onClick={onAlertClick}
            className={[
              "relative rounded-lg border px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition",
              criticalCount > 0
                ? "animate-pulseRed border-neonRed/80 bg-neonRed/15 text-neonRed shadow-neonRed"
                : "border-slate-700 bg-slate-900 text-slate-400",
            ].join(" ")}
            aria-label="Critical human threat alerts"
          >
            Alerts ({criticalCount})
          </button>
        </div>
      </div>
    </header>
  );
}

export default GlobalHeader;
