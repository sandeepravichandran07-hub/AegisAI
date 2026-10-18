import { AnimatePresence, motion } from 'framer-motion';
import DecisionBadge from './DecisionBadge';

const SOURCE_LABELS = {
  user: 'User request',
  document: 'Document content',
  agent: 'AI agent',
};

export default function EventFeed({ events }) {
  if (events.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center rounded-2xl border border-dashed border-white/10 text-slate-500">
        Press “Start demo” to watch the agent run.
      </div>
    );
  }

  return (
    <ul className="space-y-3" aria-live="polite">
      <AnimatePresence initial={false}>
        {events.map((event) => (
          <motion.li
            key={event.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-slate-400">
                  {SOURCE_LABELS[event.source]}
                </span>
                <code className="text-sm text-slate-100">{event.action}</code>
                <span className="text-sm text-slate-500">to {event.target}</span>
              </div>
              <DecisionBadge decision={event.decision} />
            </div>

            <p className="mt-3 text-sm text-slate-400">{event.summary}</p>
            <p className="mt-1 text-sm text-slate-300">
              <span className="text-slate-500">Reason: </span>
              {event.reason}
            </p>

            {event.decision === 'redact' && (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div>
                  <p className="mb-1 text-xs uppercase tracking-wider text-red-300">Before</p>
                  <pre className="whitespace-pre-wrap break-words rounded-lg bg-red-950/40 p-3 text-xs text-red-100">
                    {event.before}
                  </pre>
                </div>
                <div>
                  <p className="mb-1 text-xs uppercase tracking-wider text-violetSoft">After</p>
                  <pre className="whitespace-pre-wrap break-words rounded-lg bg-violet-950/40 p-3 text-xs text-violet-100">
                    {event.after}
                  </pre>
                </div>
              </div>
            )}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
