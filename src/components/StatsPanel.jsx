const CARDS = [
  { key: 'total', label: 'Actions checked', tone: 'text-white' },
  { key: 'allow', label: 'Allowed', tone: 'text-emerald-300' },
  { key: 'redact', label: 'Redacted', tone: 'text-violetSoft' },
  { key: 'ask', label: 'Needs approval', tone: 'text-amber-300' },
  { key: 'block', label: 'Blocked', tone: 'text-red-300' },
];

export default function StatsPanel({ events }) {
  const counts = {
    total: events.length,
    allow: events.filter((e) => e.decision === 'allow').length,
    redact: events.filter((e) => e.decision === 'redact').length,
    ask: events.filter((e) => e.decision === 'ask').length,
    block: events.filter((e) => e.decision === 'block').length,
  };

  return (
    <aside className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        {CARDS.map((card) => (
          <div key={card.key} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-slate-500">{card.label}</p>
            <p className={`mt-2 text-2xl font-semibold ${card.tone}`}>{counts[card.key]}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-sm font-semibold text-white">How decisions are made</h2>
        <ul className="mt-3 space-y-3 text-sm text-slate-400">
          <li>
            <span className="text-slate-200">Your requests are allowed</span> when they fit the task you gave the agent.
          </li>
          <li>
            <span className="text-slate-200">Instructions found inside documents are blocked</span> if they try to send data or change things.
          </li>
          <li>
            <span className="text-slate-200">Sending data outside the company needs approval.</span>
          </li>
          <li>
            <span className="text-slate-200">Secrets and personal details are hidden</span> before anything leaves the system.
          </li>
        </ul>
      </div>
    </aside>
  );
}
