import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import clsx from 'clsx';

const AGENTS = [
  { id: 'eleven',  name: 'ELEVEN',  role: 'Psychic Operative', color: '#ec4899', taken: false },
  { id: 'hopper',  name: 'HOPPER',  role: 'Field Commander',   color: '#06b6d4', taken: true  },
  { id: 'joyce',   name: 'JOYCE',   role: 'Signals Analyst',   color: '#f59e0b', taken: false },
  { id: 'mike',    name: 'MIKE',    role: 'Tactical Lead',     color: '#8b5cf6', taken: false },
  { id: 'dustin',  name: 'DUSTIN',  role: 'Tech Specialist',   color: '#10b981', taken: false },
  { id: 'max',     name: 'MAX',     role: 'Recon Agent',       color: '#ef4444', taken: false },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' as const }
  })
};

export function CharacterSelectScreen() {
  const { setScreen, setAgent, selectedAgent } = useGameStore();
  const [hovered, setHovered] = useState<string | null>(null);

  const handleConfirm = () => {
    if (!selectedAgent) return;
    setScreen('reveal');
  };

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center bg-void relative overflow-hidden p-6 md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Scanline accent at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-accent-cyan/40" />

      {/* Header */}
      <div className="mb-8 text-center">
        <p className="font-mono text-xs tracking-[0.4em] text-accent-cyan/50 mb-2 uppercase">
          Step 01 of 02
        </p>
        <h1 className="font-display text-3xl md:text-4xl text-white tracking-widest uppercase">
          Select Your Agent
        </h1>
        <p className="font-mono text-xs text-accent-cyan/40 mt-2 tracking-widest">
          Choose your operative. Some agents are already in the field.
        </p>
      </div>

      {/* 3x2 Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl">
        {AGENTS.map((agent, i) => {
          const isSelected = selectedAgent === agent.id;
          const isHovered = hovered === agent.id;

          return (
            <motion.div
              key={agent.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              onClick={() => !agent.taken && setAgent(agent.id)}
              onHoverStart={() => !agent.taken && setHovered(agent.id)}
              onHoverEnd={() => setHovered(null)}
              className={clsx(
                'relative border-2 rounded p-5 flex flex-col gap-2 transition-colors duration-200 select-none',
                agent.taken
                  ? 'border-white/10 opacity-40 cursor-not-allowed'
                  : isSelected
                  ? 'cursor-pointer'
                  : 'border-white/10 cursor-pointer hover:border-white/30'
              )}
              style={{
                borderColor: isSelected ? agent.color : isHovered ? `${agent.color}60` : undefined,
                boxShadow: isSelected ? `0 0 20px ${agent.color}40, inset 0 0 20px ${agent.color}10` : 'none',
                backgroundColor: isSelected ? `${agent.color}10` : 'transparent',
              }}
              whileHover={!agent.taken ? { scale: 1.03 } : {}}
              whileTap={!agent.taken ? { scale: 0.97 } : {}}
            >
              {/* TAKEN overlay */}
              {agent.taken && (
                <div className="absolute inset-0 flex items-center justify-center rounded z-10 bg-black/50">
                  <span className="font-display text-white/60 tracking-[0.3em] text-sm border border-white/20 px-3 py-1">
                    TAKEN
                  </span>
                </div>
              )}

              {/* Selected checkmark */}
              {isSelected && (
                <motion.div
                  className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-void text-xs font-bold"
                  style={{ backgroundColor: agent.color }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  ✓
                </motion.div>
              )}

              {/* Avatar circle */}
              <div
                className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-display text-sm font-bold text-void mb-1"
                style={{ borderColor: agent.color, backgroundColor: `${agent.color}30`, color: agent.color }}
              >
                {agent.name[0]}
              </div>

              {/* Info */}
              <div>
                <div className="font-display text-sm tracking-widest uppercase" style={{ color: agent.color }}>
                  {agent.name}
                </div>
                <div className="font-mono text-xs text-white/40 mt-0.5">
                  {agent.role}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Confirm CTA */}
      <motion.div className="mt-8 w-full max-w-2xl flex justify-end">
        <motion.button
          onClick={handleConfirm}
          disabled={!selectedAgent}
          className={clsx(
            'px-10 py-3 font-display text-sm tracking-widest uppercase border-2 transition-all duration-300',
            selectedAgent
              ? 'border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-void'
              : 'border-white/10 text-white/20 cursor-not-allowed'
          )}
          whileHover={selectedAgent ? { scale: 1.03 } : {}}
          whileTap={selectedAgent ? { scale: 0.97 } : {}}
          style={selectedAgent ? { boxShadow: '0 0 20px rgba(6,182,212,0.3)' } : {}}
        >
          Confirm Agent →
        </motion.button>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-accent-cyan/20" />
    </motion.div>
  );
}
