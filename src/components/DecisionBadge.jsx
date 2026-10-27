import { useLanguage } from '../i18n/LanguageContext';

const STYLES = {
  allow: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/30',
  redact: 'bg-violet-500/15 text-violetSoft ring-violet-400/30',
  ask: 'bg-amber-500/15 text-amber-300 ring-amber-400/30',
  block: 'bg-red-500/15 text-red-300 ring-red-400/30',
};

export default function DecisionBadge({ decision }) {
  const { t } = useLanguage();

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${STYLES[decision]}`}
    >
      {t(`decision.${decision}`)}
    </span>
  );
}
