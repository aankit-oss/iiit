import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

/* ── Types ──────────────────────────────────────────────────────────────── */

interface FateRow {
  name: string;
  status: string;
}

/* ── Sub-components ─────────────────────────────────────────────────────── */

function ParticleBurst({ winner }: { winner: 'demogorgon' | 'security' }) {
  const color = winner === 'security' ? '#00f5d4' : '#c0392b';
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: color,
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          initial={{ opacity: 1, scale: 0, y: 0 }}
          animate={{
            opacity: [1, 1, 0],
            scale: [0, 1.5, 1],
            y: [0, -(60 + Math.random() * 120)],
          }}
          transition={{
            duration: 1.4 + Math.random() * 0.8,
            delay: Math.random() * 0.6,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

function FateItem({ fate, index }: { fate: FateRow; index: number }) {
  const survived = fate.status !== 'caught';
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 + index * 0.12 }}
      className="flex items-center justify-between border-b border-white/10 py-2 px-3"
    >
      <span className="font-mono text-sm tracking-widest text-white/80 uppercase">
        {fate.name}
      </span>
      <span
        className={`font-mono text-xs font-bold tracking-widest ${
          survived ? 'text-accent-cyan' : 'text-accent-red'
        }`}
      >
        {survived ? '✓ SURVIVED' : '✗ CAUGHT'}
      </span>
    </motion.div>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */

export function GameOverScreen() {
  const { gameResult, viewAs, selectedAgent, agentCodename, resetGame } = useGameStore();

  const winner = gameResult?.winner ?? 'security';
  const fates: FateRow[] = gameResult?.fates ?? [];
  const isDemoWin = winner === 'demogorgon';
  const accentColor = isDemoWin ? 'text-accent-red' : 'text-accent-cyan';
  const shadowColor = isDemoWin
    ? 'rgba(192,57,43,0.8)'
    : 'rgba(0,245,212,0.7)';
  const borderColor = isDemoWin ? 'border-accent-red/40' : 'border-accent-cyan/40';
  const headline = isDemoWin ? 'CONSUMED' : 'ESCAPED';
  const subline = isDemoWin
    ? 'The demogorgon claimed them all.'
    : 'Agents survived the Upside Down.';

  // Provide the demogorgon's identity for the final reveal
  const demogorgonName =
    viewAs === 'demogorgon'
      ? (agentCodename || selectedAgent || 'UNKNOWN').toUpperCase()
      : '[ CLASSIFIED ]';

  // CRT static flicker on mount
  useEffect(() => {
    if ('vibrate' in navigator) navigator.vibrate([50, 30, 50, 30, 200]);
  }, []);

  return (
    <motion.div
      className="relative w-full h-full flex flex-col items-center justify-center bg-black overflow-hidden select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* ── Particle burst ── */}
      <ParticleBurst winner={winner} />

      {/* ── CRT noise overlay ── */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

      {/* ── Scanlines ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
        }}
      />

      {/* ── Content card ── */}
      <motion.div
        className={`relative z-10 border ${borderColor} bg-black/80 px-10 py-8 max-w-md w-full mx-4 flex flex-col gap-6`}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Glowing top bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, transparent, ${shadowColor}, transparent)` }}
        />

        {/* ── Headline ── */}
        <div className="text-center">
          <motion.p
            className="font-mono text-xs tracking-[0.4em] text-white/40 mb-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            HAWKINS NATIONAL LABORATORY
          </motion.p>
          <motion.h1
            className={`font-display text-6xl font-black tracking-widest ${accentColor}`}
            style={{ textShadow: `0 0 40px ${shadowColor}` }}
            initial={{ scale: 1.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6, type: 'spring' }}
          >
            {headline}
          </motion.h1>
          <motion.p
            className="font-mono text-sm text-white/50 tracking-widest mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
          >
            {subline}
          </motion.p>
        </div>

        {/* ── Agent fates ── */}
        {fates.length > 0 && (
          <motion.div
            className="border border-white/10 bg-white/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="font-mono text-[10px] tracking-[0.3em] text-white/30 px-3 pt-2 pb-1">
              AGENT FATES
            </p>
            {fates.map((f, i) => (
              <FateItem key={f.name} fate={f} index={i} />
            ))}
          </motion.div>
        )}

        {/* ── Demogorgon reveal ── */}
        <motion.div
          className="border border-accent-red/30 bg-accent-red/5 px-4 py-3 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 + fates.length * 0.12 }}
        >
          <p className="font-mono text-[10px] tracking-[0.3em] text-white/30 mb-1">
            THE DEMOGORGON WAS
          </p>
          <motion.p
            className="font-display text-2xl tracking-widest text-accent-red"
            style={{ textShadow: '0 0 20px rgba(192,57,43,0.9)' }}
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          >
            {demogorgonName}
          </motion.p>
        </motion.div>

        {/* ── Play Again ── */}
        <motion.button
          className="w-full py-3 font-display tracking-[0.3em] text-sm border border-white/20 text-white/60 hover:border-accent-cyan hover:text-accent-cyan transition-all"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={resetGame}
        >
          PLAY AGAIN
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
