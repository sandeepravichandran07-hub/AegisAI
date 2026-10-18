import { useEffect, useRef } from 'react';
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion';
import logoImage from '../assets/aegisai-logo.png';

/* ------------------------------------------------------------------
 * Timings, in seconds.
 * ------------------------------------------------------------------ */
export const GAS_TIMING = {
  total: 3.8,                                   // onComplete fires after this
  gasRise: { duration: 1.2 },                   // gas builds at both sides
  gasSettle: { delay: 2.8, duration: 1.0 },     // gas thins to a faint haze
  reveal: { delay: 0.7, duration: 1.7 },        // logo opens out of the gas
  sharpen: { delay: 0.9, duration: 1.2 },       // blur clears
  scaleIn: { delay: 0.7, duration: 1.5 },       // logo settles from 1.1x
  flash: { delay: 2.4, duration: 0.7 },         // violet bloom over the logo
};

const EASE_OUT_SOFT = [0.22, 1, 0.36, 1];

/* Soft circular sprite, drawn once and reused for every gas particle */
function makeGasSprite() {
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = 128;
  const ctx = sprite.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(167, 139, 250, 0.9)');
  g.addColorStop(0.4, 'rgba(124, 58, 237, 0.45)');
  g.addColorStop(1, 'rgba(76, 29, 149, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return sprite;
}

/* Violet gas that pours in from the left and right edges and drifts toward the logo.
 * `intensity` is a motion value (0 to 1) that sets how thick the gas is. */
function GasCanvas({ intensity }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const sprite = makeGasSprite();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const particles = [];
    let width = 0;
    let height = 0;
    let last = performance.now();
    let raf = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Emitters sit at the two edges of the canvas; each one pushes gas toward the centre
    const spawn = (side) => {
      const dir = side === 'left' ? 1 : -1;
      particles.push({
        x: side === 'left' ? width * (0.02 + Math.random() * 0.06) : width * (0.92 + Math.random() * 0.06),
        y: height * (0.3 + Math.random() * 0.45),
        vx: dir * width * (0.05 + Math.random() * 0.06),
        vy: -height * (0.01 + Math.random() * 0.015),
        size: width * (0.35 + Math.random() * 0.3),
        life: 0,
        maxLife: 3 + Math.random() * 2,
        rot: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.25,
        phase: Math.random() * Math.PI * 2,
      });
    };

    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const k = intensity.get();

      if (Math.random() < k * dt * 14) spawn('left');
      if (Math.random() < k * dt * 14) spawn('right');

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        // Curl up and down as the gas moves, so it looks like smoke and not sliding blobs
        p.x += p.vx * dt;
        p.y += (p.vy + Math.sin(p.life * 0.8 + p.phase) * height * 0.04) * dt;
        p.rot += p.spin * dt;

        const t = p.life / p.maxLife;
        const alpha = Math.sin(Math.PI * t) * 0.24 * (0.35 + k * 0.65);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = alpha;
        ctx.drawImage(sprite, -p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }

      ctx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-[-20%] top-[-30%] h-[160%] w-[140%]"
    />
  );
}

/**
 * AegisAI logo reveal: violet gas from both sides, then the logo opens out of it.
 *
 * @param {number}   [size=360]        Width in px. Scales down on small screens.
 * @param {string}   [src]             Logo image. Defaults to the bundled PNG.
 * @param {Function} [onComplete]      Called once the reveal finishes.
 * @param {boolean}  [skipAnimation]   Shows the final logo immediately.
 * @param {string}   [className]       Extra classes for the wrapper.
 */
export default function LogoGasReveal({
  size = 360,
  src = logoImage,
  onComplete,
  skipAnimation = false,
  className = '',
}) {
  const reduceMotion = useReducedMotion();
  const instant = skipAnimation || reduceMotion;
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Starting values show the final frame when the animation is skipped
  const gas = useMotionValue(instant ? 0.3 : 0);
  const reveal = useMotionValue(instant ? 1 : 0);
  const blur = useMotionValue(instant ? 0 : 22);
  const scale = useMotionValue(instant ? 1 : 1.1);
  const flash = useMotionValue(0);

  // The mask opens from the centre, so the logo grows out of the gas
  const maskStart = useTransform(reveal, [0, 1], [0, 120]);
  const maskEnd = useTransform(reveal, [0, 1], [22, 142]);
  const maskImage = useMotionTemplate`radial-gradient(ellipse at 50% 50%, #000 ${maskStart}%, transparent ${maskEnd}%)`;
  const logoFilter = useMotionTemplate`blur(${blur}px)`;
  const hazeOpacity = useTransform(gas, [0, 1], [0.25, 0.7]);

  useEffect(() => {
    if (instant) {
      onCompleteRef.current?.();
      return undefined;
    }

    const controls = [
      animate(gas, 1, { duration: GAS_TIMING.gasRise.duration, ease: 'easeOut' }),
      animate(gas, 0.3, {
        delay: GAS_TIMING.gasSettle.delay,
        duration: GAS_TIMING.gasSettle.duration,
        ease: 'easeInOut',
      }),
      animate(reveal, 1, {
        delay: GAS_TIMING.reveal.delay,
        duration: GAS_TIMING.reveal.duration,
        ease: EASE_OUT_SOFT,
      }),
      animate(blur, 0, {
        delay: GAS_TIMING.sharpen.delay,
        duration: GAS_TIMING.sharpen.duration,
        ease: 'easeOut',
      }),
      animate(scale, 1, {
        delay: GAS_TIMING.scaleIn.delay,
        duration: GAS_TIMING.scaleIn.duration,
        ease: EASE_OUT_SOFT,
      }),
      animate(flash, [0, 0.85, 0], {
        delay: GAS_TIMING.flash.delay,
        duration: GAS_TIMING.flash.duration,
        ease: 'easeOut',
      }),
    ];

    const timer = setTimeout(() => onCompleteRef.current?.(), GAS_TIMING.total * 1000);
    return () => {
      controls.forEach((c) => c.stop());
      clearTimeout(timer);
    };
  }, [instant, gas, reveal, blur, scale, flash]);

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, maxWidth: '100%' }}
    >
      {/* Violet haze behind the logo, brighter while the gas is thick */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          opacity: hazeOpacity,
          scale: 1.4,
          background:
            'radial-gradient(closest-side, rgba(124, 58, 237, 0.55), rgba(76, 29, 149, 0.25) 60%, transparent 100%)',
        }}
      />

      {/* Gas only animates when motion is allowed */}
      {!instant && <GasCanvas intensity={gas} />}

      {/* The logo itself, masked, blurred and scaled into place */}
      <motion.img
        src={src}
        alt="AegisAI logo"
        draggable={false}
        className="relative block h-auto w-full select-none"
        style={{
          maskImage,
          WebkitMaskImage: maskImage,
          filter: logoFilter,
          scale,
        }}
      />

      {/* Violet bloom flash over the logo */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: flash,
          background:
            'radial-gradient(closest-side, rgba(167, 139, 250, 0.5), rgba(124, 58, 237, 0.12) 65%, transparent 100%)',
        }}
      />
    </div>
  );
}
