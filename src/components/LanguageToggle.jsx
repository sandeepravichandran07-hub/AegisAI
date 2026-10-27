import { useLanguage } from '../i18n/LanguageContext';

const OPTIONS = [
  { code: 'en', label: 'EN' },
  { code: 'ta', label: 'தமிழ்' },
];

export default function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div role="group" aria-label={t('lang.label')} className="inline-flex rounded-full border border-white/10 p-0.5 text-xs">
      {OPTIONS.map((option) => (
        <button
          key={option.code}
          type="button"
          onClick={() => setLang(option.code)}
          aria-pressed={lang === option.code}
          className={`rounded-full px-3 py-1 transition ${
            lang === option.code ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
