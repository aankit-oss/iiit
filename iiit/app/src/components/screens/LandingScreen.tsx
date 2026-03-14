import { useState } from 'react';
import { motion } from 'framer-motion';
import { Typewriter } from '../ui/Typewriter';
import { useGameStore } from '../../store/gameStore';

export function LandingScreen() {
  const { setScreen, setCodename, agentCodename } = useGameStore();
  const [accessCode, setAccessCode] = useState('');
  const [introComplete, setIntroComplete] = useState(false);
  const [error, setError] = useState('');

  const handleEnter = () => {
    if (!agentCodename.trim()) {
      setError('AGENT CODENAME REQUIRED');
      return;
    }
    setError('');
    setScreen('character-select');
  };

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center bg-void relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Uplink status — top right */}
      <div className="absolute top-6 right-8 flex items-center gap-2 font-mono text-xs text-accent-cyan">
        <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
        UPLINK ACTIVE
      </div>

      {/* Hawkins Lab logo mark */}
      <div className="absolute top-8 left-8">
        <div className="font-display text-xs tracking-[0.4em] text-accent-cyan/40 uppercase">
          U.S. Dept. of Energy
        </div>
        <div className="font-display text-sm tracking-[0.3em] text-accent-cyan/60 uppercase">
          Hawkins National Laboratory
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-lg px-8 flex flex-col gap-8">
        {/* Header typewriter */}
        <div className="text-center">
          <div className="font-terminal text-accent-cyan text-sm mb-3 tracking-widest">
            {introComplete ? (
              <span>CLEARANCE REQUIRED — IDENTIFY YOURSELF</span>
            ) : (
              <Typewriter
                text="HAWKINS NATIONAL LABORATORY — CLEARANCE REQUIRED"
                speed={35}
                onComplete={() => setIntroComplete(true)}
              />
            )}
          </div>
          <motion.h1
            className="font-display text-4xl md:text-5xl text-white tracking-wider"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: introComplete ? 1 : 0, y: introComplete ? 0 : 10 }}
            transition={{ duration: 0.8 }}
          >
            ENTER THE LAB
          </motion.h1>
        </div>

        {/* Input fields */}
        <motion.div
          className="flex flex-col gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: introComplete ? 1 : 0, y: introComplete ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Codename */}
          <div className="flex flex-col gap-1">
            <label className="font-mono text-xs tracking-widest text-accent-cyan/70 uppercase">
              Agent Codename
            </label>
            <input
              type="text"
              value={agentCodename}
              onChange={(e) => setCodename(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEnter()}
              placeholder="e.g. ELEVEN / HOPPER"
              className="bg-transparent border border-accent-cyan/50 text-accent-cyan font-mono text-sm px-4 py-3 rounded focus:outline-none focus:border-accent-cyan placeholder-accent-cyan/20 transition-colors"
            />
          </div>

          {/* Access code */}
          <div className="flex flex-col gap-1">
            <label className="font-mono text-xs tracking-widest text-accent-cyan/70 uppercase">
              Room Access Code
            </label>
            <input
              type="password"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEnter()}
              placeholder="••••••••"
              className="bg-transparent border border-accent-cyan/50 text-accent-cyan font-mono text-sm px-4 py-3 rounded focus:outline-none focus:border-accent-cyan placeholder-accent-cyan/20 transition-colors"
            />
          </div>

          {/* Error */}
          {error && (
            <motion.p
              className="font-mono text-xs text-accent-red animate-pulse tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ⚠ {error}
            </motion.p>
          )}

          {/* CTA */}
          <motion.button
            onClick={handleEnter}
            className="mt-2 w-full py-4 font-display text-lg tracking-widest uppercase text-void bg-accent-cyan border-2 border-accent-cyan hover:bg-transparent hover:text-accent-cyan transition-all duration-300 rounded"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ boxShadow: '0 0 30px rgba(6,182,212,0.4)' }}
          >
            Enter Hawkins Lab
          </motion.button>
        </motion.div>
      </div>

      {/* Bottom classification */}
      <div className="absolute bottom-6 left-0 right-0 text-center font-mono text-[10px] text-accent-cyan/20 tracking-widest">
        TOP SECRET // COMPARTMENTED — UNAUTHORIZED ACCESS PROSECUTED UNDER 18 U.S.C. § 1030
      </div>
    </motion.div>
  );
}
