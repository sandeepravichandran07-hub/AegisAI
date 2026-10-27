import { useLanguage } from '../i18n/LanguageContext';

const CARDS = [
  { key: 'total', label: 'dash.statChecked', tone: 'text-white' },
  { key: 'allow', label: 'dash.statAllowed', tone: 'text-emerald-300' },
  { key: 'redact', label: 'dash.statRedacted', tone: 'text-violetSoft' },
  { key: 'ask', label: 'dash.statApproval', tone: 'text-amber-300' },
  { key: 'block', label: 'dash.statBlocked', tone: 'text-red-300' },
];

export default function StatsPanel({ events }) {
  const { t } = useLanguage();
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
            <p className="text-xs text-slate-500">{t(card.label)}</p>
            <p className={`mt-2 text-2xl font-semibold ${card.tone}`}>{counts[card.key]}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-sm font-semibold text-white">{t('dash.rulesTitle')}</h2>
        <ul className="mt-3 space-y-3 text-sm text-slate-400">
          {t('dash.rules').map(([head, rest], i) => (
            <li key={i}>
              <span className="text-slate-200">{head}</span>
              {rest}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
