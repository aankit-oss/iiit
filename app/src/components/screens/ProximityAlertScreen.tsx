import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlitchText } from '../ui/GlitchText';
import { useGameStore } from '../../store/gameStore';

export function ProximityAlertScreen() {
  const { setProximityAlert, setScreen, viewAs } = useGameStore();
  const isDemo = viewAs === 'demogorgon';

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setProximityAlert(false);
      setScreen('lobby');
    }, 5000);
    return () => clearTimeout(timeout);
  }, [setProximityAlert, setScreen]);

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Red flash background */}
      <motion.div
        className="absolute inset-0 bg-accent-red"
        animate={{ opacity: [0.85, 0.4, 0.85, 0.55, 0.85] }}
        transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
      />

      {/* Scanline distortion overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 4px)',
        }}
      />

      {/* Shaking content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-8 text-center px-8"
        animate={{
          x: [0, -8, 8, -6, 6, -4, 4, 0],
          rotate: [0, -0.5, 0.5, -0.3, 0.3, 0],
        }}
        transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut' }}
      >
        <GlitchText
          text={isDemo ? 'PREY LOCATED' : '⚠ ANOMALY BREACH ⚠'}
          glitchIntensity="high"
          className="text-6xl md:text-8xl font-display text-white drop-shadow-[0_0_30px_rgba(239,68,68,1)]"
        />

        <p className="font-mono text-xl text-white/90 max-w-lg leading-relaxed">
          {isDemo
            ? 'BIOMASS SIGNATURE DETECTED AT CLOSE RANGE. INITIATE PREDATION PROTOCOL.'
            : 'HAWKINS LAB — ALL PERSONNEL EVACUATE IMMEDIATELY. ENTITY WITHIN INNER PERIMETER.'}
        </p>

        {/* Countdown bar */}
        <div className="w-64 h-2 bg-black/40 rounded-full overflow-hidden mt-4">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 5, ease: 'linear' }}
          />
        </div>

        <p className="font-mono text-xs text-white/60 uppercase tracking-widest">
          AUTO-DISMISS IN 5 SECONDS
        </p>
      </motion.div>
    </motion.div>
  );
}
