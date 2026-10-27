import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { TRANSLATIONS } from './translations';

const LanguageContext = createContext(null);
const STORAGE_KEY = 'aegisai-lang';

/** Holds the current language (en or ta) and gives components a t() lookup. */
export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'ta') return saved;
    } catch {
      /* storage can be blocked; fall back to English */
    }
    return 'en';
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const value = useMemo(() => {
    const dict = TRANSLATIONS[lang];
    const t = (key) => (key in dict ? dict[key] : TRANSLATIONS.en[key] ?? key);
    return { lang, setLang, t };
  }, [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
