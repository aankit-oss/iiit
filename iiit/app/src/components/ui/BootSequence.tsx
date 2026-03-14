import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Typewriter } from './Typewriter';
import { GlitchText } from './GlitchText';
import { useGameStore } from '../../store/gameStore';

const BOOT_SEQUENCE = [
  'HAWKINS NATIONAL LABORATORY — SECURE TERMINAL',
  'INITIALIZING NEURAL NETWORKS...',
  'ESTABLISHING ENCRYPTED UPLINK...',
  'BYPASSING DOE FIREWALL LAYER 3...',
  'ACCESS GRANTED.',
];

export function BootSequence() {
  const [currentLine, setCurrentLine] = useState(0);
  const [bootComplete, setBootComplete] = useState(false);
  const setScreen = useGameStore((state) => state.setScreen);

  const handleLineComplete = () => {
    if (currentLine < BOOT_SEQUENCE.length - 1) {
      setTimeout(() => { setCurrentLine((p) => p + 1); }, 420);
    } else {
      setTimeout(() => { setBootComplete(true); }, 900);
    }
  };

  useEffect(() => {
    if (bootComplete) {
      const t = setTimeout(() => setScreen('landing'), 1400);
      return () => clearTimeout(t);
    }
  }, [bootComplete, setScreen]);

  return (
    <motion.div
      className="relative w-full h-full flex flex-col items-start justify-end p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: bootComplete ? 0 : 1 }}
      transition={{ duration: 1.2 }}
    >
      {/* ── Background radial glow (Upside Down indigo) ── */}
      <div className="absolute inset-0 bg-void-radial pointer-events-none" />

      {/* ── Centred logo / portal ring ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%]">
        {bootComplete ? (
          <GlitchText
            text="SYSTEM READY"
            className="text-6xl text-white font-display text-glow-cyan"
            glitchIntensity="high"
          />
        ) : (
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Outer portal ring */}
            <div className="absolute inset-0 portal-ring opacity-60 animate-spin-slow" />
            {/* Inner pulse */}
            <div
              className="w-20 h-20 rounded-full border border-accent-indigo/40 animate-amber-pulse"
              style={{ boxShadow: '0 0 30px rgba(91,47,201,0.4), inset 0 0 20px rgba(91,47,201,0.15)' }}
            />
            {/* Centre dot */}
            <div className="absolute w-3 h-3 rounded-full bg-accent-cyan animate-pulse" />
          </div>
        )}
      </div>

      {/* ── Terminal lines panel ── */}
      <div className="relative z-10 w-full max-w-2xl glass-panel-dark p-5">
        {/* Panel header */}
        <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
          <span className="animate-uplink status-orb-safe" />
          <span className="hud-label tracking-[0.35em]">HAWKINS — SECURE UPLINK</span>
        </div>

        {/* Boot lines */}
        <div className="space-y-2 font-terminal text-xl">
          {BOOT_SEQUENCE.slice(0, currentLine + 1).map((line, index) => (
            <div key={index} className="flex gap-3 items-start">
              <span className="text-accent-amber opacity-80 shrink-0">{'>'}</span>
              {index === currentLine && !bootComplete ? (
                <Typewriter
                  text={line}
                  speed={28}
                  onComplete={handleLineComplete}
                />
              ) : (
                <span
                  className={
                    index === BOOT_SEQUENCE.length - 1
                      ? 'text-accent-green text-glow-green'
                      : 'text-accent-amber/80'
                  }
                >
                  {line}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Version stamp ── */}
      <p className="absolute bottom-4 right-6 hud-label">
        MK-III SURVEILLANCE ARRAY v4.2.1
      </p>
    </motion.div>
  );
}
