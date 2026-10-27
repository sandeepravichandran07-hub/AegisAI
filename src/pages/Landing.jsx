import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/aegisai-logo.png';
import { useLanguage } from '../i18n/LanguageContext';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: 'easeOut' },
};

export default function Landing() {
  const { t } = useLanguage();
  const steps = t('landing.steps');
  const features = t('landing.features');

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-violet-700/20 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-sm uppercase tracking-widest text-violetSoft">{t('landing.eyebrow')}</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-5xl">{t('landing.title')}</h1>
            <p className="mt-6 max-w-xl text-lg text-slate-400">{t('landing.subtitle')}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/dashboard"
                className="rounded-lg bg-violet-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-violet-500"
              >
                {t('landing.cta')}
              </Link>
              <a
                href="#how-it-works"
                className="rounded-lg border border-white/10 px-6 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5"
              >
                {t('landing.how')}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
            className="flex justify-center"
          >
            <img src={logo} alt={t('landing.logoAlt')} className="w-full max-w-md select-none" draggable={false} />
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20">
        <motion.div {...fadeUp}>
          <p className="text-sm uppercase tracking-widest text-violetSoft">{t('landing.howEyebrow')}</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">{t('landing.howTitle')}</h2>
        </motion.div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-6"
            >
              <span className="text-sm text-violetSoft">0{i + 1}</span>
              <h3 className="mt-3 font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.1 }}
              className="rounded-xl border border-white/10 bg-gradient-to-b from-violet-500/10 to-transparent p-8"
            >
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
