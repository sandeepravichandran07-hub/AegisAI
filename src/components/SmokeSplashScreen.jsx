import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LogoGasReveal from './LogoGasReveal';

/**
 * Full-screen gas reveal that fades into the app.
 * Wrap the app's root component with this.
 */
export default function SmokeSplashScreen({ children }) {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#0A0614] p-6"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <LogoGasReveal size={360} onComplete={() => setShowSplash(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </>
  );
}

/*
 * Usage:
 *
 *   import SmokeSplashScreen from './components/SmokeSplashScreen';
 *
 *   export default function App() {
 *     return (
 *       <SmokeSplashScreen>
 *         <MainApp />
 *       </SmokeSplashScreen>
 *     );
 *   }
 *
 * Landing-page header, no animation:
 *
 *   <LogoGasReveal size={220} skipAnimation />
 */
