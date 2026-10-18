import { useScenario } from '../hooks/useScenario';
import EventFeed from '../components/EventFeed';
import StatsPanel from '../components/StatsPanel';

export default function Dashboard() {
  const { events, running, finished, start, reset } = useScenario();

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-widest text-violetSoft">Live demo</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Watch an agent get checked</h1>
          <p className="mt-3 text-slate-400">
            An AI agent reads a document that hides an attack. Every action is checked before it runs, and
            every decision is shown here as it happens.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={start}
            disabled={running}
            className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {running ? 'Running…' : finished ? 'Run again' : 'Start demo'}
          </button>
          <button
            type="button"
            onClick={reset}
            disabled={running || events.length === 0}
            className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Reset
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
