import { useScenario } from '../hooks/useScenario';
import EventFeed from '../components/EventFeed';
import StatsPanel from '../components/StatsPanel';
import { useLanguage } from '../i18n/LanguageContext';

export default function Dashboard() {
  const { events, running, finished, start, reset, mode } = useScenario();
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-widest text-violetSoft">{t('dash.eyebrow')}</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">{t('dash.title')}</h1>
          <p className="mt-3 text-slate-400">{t('dash.subtitle')}</p>
          <span
            className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ring-1 ring-inset ${
              mode === 'live'
                ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/30'
                : 'bg-white/5 text-slate-400 ring-white/10'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${mode === 'live' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
            {mode === 'live' ? t('dash.live') : t('dash.offline')}
          </span>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={start}
            disabled={running}
            className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {running ? t('dash.running') : finished ? t('dash.again') : t('dash.start')}
          </button>
          <button
            type="button"
            onClick={reset}
            disabled={running || events.length === 0}
            className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t('dash.reset')}
          </button>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EventFeed events={events} />
        </div>
        <StatsPanel events={events} />
      </div>
    </section>
  );
}
