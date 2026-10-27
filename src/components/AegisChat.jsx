import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const SpeechRecognitionAPI =
  typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

/**
 * AegisAI assistant panel. Accepts typed or spoken questions in English or Tamil.
 * Voice is turned into text in the browser; the backend answers with text.
 */
export default function AegisChat() {
  const { lang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => [{ role: 'bot', greeting: true }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [note, setNote] = useState('');
  const recognitionRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  // Stop listening if the panel closes or the page unmounts
  useEffect(() => () => recognitionRef.current?.abort?.(), []);

  async function ask(text) {
    const question = text.trim();
    if (!question || busy) return;

    setMessages((m) => [...m, { role: 'user', text: question }]);
    setInput('');
    setNote('');
    setBusy(true);

    try {
      if (!BACKEND_URL) throw new Error('backend not configured');
      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question, lang }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = await res.json();
      setMessages((m) => [...m, { role: 'bot', text: data.reply, lang: data.lang }]);
    } catch {
      setNote(t('chat.offline'));
    } finally {
      setBusy(false);
    }
  }

  function toggleMic() {
    if (!SpeechRecognitionAPI) {
      setNote(t('chat.noVoice'));
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const said = event.results[0][0].transcript;
      setInput(said);
      ask(said);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }

  function speak(text, msgLang) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = msgLang === 'ta' ? 'ta-IN' : 'en-IN';
    window.speechSynthesis.speak(utterance);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white shadow-lg shadow-violet-900/50 transition hover:bg-violet-500"
        aria-label={t('chat.open')}
        title={t('chat.open')}
      >
        AI
      </button>

      <AnimatePresence>
        {open && (
          <motion.section
            key="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-5 z-50 flex h-[min(70vh,560px)] w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#120b22]/95 shadow-2xl backdrop-blur"
            aria-label={t('chat.title')}
          >
            <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <h2 className="text-sm font-semibold text-white">{t('chat.title')}</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-1 text-xs text-slate-400 hover:bg-white/5 hover:text-white"
              >
                {t('chat.close')}
              </button>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[85%]">
                    <p
                      className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                        m.role === 'user' ? 'bg-violet-600 text-white' : 'bg-white/[0.06] text-slate-200'
                      }`}
                    >
                      {m.greeting ? t('chat.greeting') : m.text}
                    </p>
                    {m.role === 'bot' && (
                      <button
                        type="button"
                        onClick={() => speak(m.greeting ? t('chat.greeting') : m.text, m.lang ?? lang)}
                        className="mt-1 text-xs text-slate-500 hover:text-violetSoft"
                      >
                        🔊 {t('chat.readAloud')}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {busy && <p className="text-xs text-slate-500">{t('chat.thinking')}</p>}
              <div ref={endRef} />
            </div>

            {(note || listening) && (
              <p className="px-4 pb-2 text-xs text-amber-300">{listening ? t('chat.listening') : note}</p>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex items-center gap-2 border-t border-white/10 p-3"
            >
              <button
                type="button"
                onClick={toggleMic}
                aria-pressed={listening}
                aria-label={t('chat.speak')}
                title={t('chat.speak')}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm ring-1 ring-inset transition ${
                  listening
                    ? 'bg-red-500/20 text-red-300 ring-red-400/40'
                    : 'bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10'
                }`}
              >
                🎤
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('chat.placeholder')}
                className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-violet-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="shrink-0 rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-500 disabled:opacity-40"
              >
                {t('chat.send')}
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
