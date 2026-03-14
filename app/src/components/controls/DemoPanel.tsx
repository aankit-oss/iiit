import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import clsx from 'clsx';

export function DemoPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { screen, viewAs, setScreen, toggleViewAs, setProximityAlert, addIntelEvent } = useGameStore();

  const triggerAlert = () => {
    setProximityAlert(true);
    addIntelEvent({
      timestamp: new Date().toLocaleTimeString(),
      message: '⚠ PROXIMITY BREACH — ENTITY AT CRITICAL RANGE',
      type: 'critical',
    });
    setScreen('alert');
  };

  const goToScreen = (target: 'boot' | 'landing' | 'character-select' | 'reveal' | 'lobby' | 'hero') => {
    setProximityAlert(false);
    setScreen(target);
    addIntelEvent({
      timestamp: new Date().toLocaleTimeString(),
      message: `DEMO OVERRIDE: JUMPED TO ${target.toUpperCase()} SCREEN`,
      type: 'system',
    });
  };

  const handleToggleView = () => {
    toggleViewAs();
    addIntelEvent({
      timestamp: new Date().toLocaleTimeString(),
      message: `PERSPECTIVE SHIFT → ${viewAs === 'security' ? 'PREDATOR' : 'SECURITY'}`,
      type: viewAs === 'security' ? 'critical' : 'system',
    });
  };

  const buttonBase =
    'w-full text-left font-mono text-xs uppercase tracking-widest px-3 py-2 rounded transition-all duration-150';

  return (
    <div className="fixed bottom-4 left-4 z-[100]">
      {/* Toggle button */}
      <motion.button
        onClick={() => setIsOpen((p) => !p)}
        className="flex items-center gap-2 px-3 py-2 bg-void/90 border border-amber-500/60 text-amber-400 font-mono text-xs uppercase tracking-widest rounded shadow-lg hover:border-amber-400 hover:bg-amber-500/10 transition-colors"
        whileTap={{ scale: 0.95 }}
      >
        <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        DEMO CTRL
        <span className="ml-1">{isOpen ? '▼' : '▲'}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-10 left-0 w-56 bg-void/95 border border-amber-500/40 rounded shadow-2xl shadow-black/80 overflow-hidden"
          >
            {/* Header */}
            <div className="px-3 py-2 border-b border-amber-500/20 text-amber-500 font-mono text-[10px] uppercase tracking-widest">
              HAWKINS LAB — DEMO CONTROLS
            </div>

            <div className="p-2 space-y-1">
              {/* Current state readout */}
              <div className="px-3 py-1.5 bg-black/40 rounded text-[10px] font-mono text-amber-400/70">
                Screen: <span className="text-amber-400 uppercase">{screen}</span> &nbsp;|&nbsp;
                View: <span className="text-amber-400 uppercase">{viewAs}</span>
              </div>

              {/* Jump to screens */}
              <p className="px-3 pt-2 pb-0.5 text-amber-500/50 font-mono text-[9px] uppercase tracking-widest">
                Jump to Screen
              </p>

              <button
                onClick={() => goToScreen('boot')}
                className={clsx(
                  buttonBase,
                  screen === 'boot'
                    ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                )}
              >
                ① Boot Sequence
              </button>
              <button
                onClick={() => goToScreen('landing')}
                className={clsx(
                  buttonBase,
                  screen === 'landing'
                    ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                )}
              >
                ② Landing Screen
              </button>
              <button
                onClick={() => goToScreen('character-select')}
                className={clsx(
                  buttonBase,
                  screen === 'character-select'
                    ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                )}
              >
                ③ Character Select
              </button>
              <button
                onClick={() => goToScreen('reveal')}
                className={clsx(
                  buttonBase,
                  screen === 'reveal'
                    ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                )}
              >
                ④ Role Reveal
              </button>
              <button
                onClick={() => goToScreen('lobby')}
                className={clsx(
                  buttonBase,
                  screen === 'lobby'
                    ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                )}
              >
                ⑤ Lobby / Protocol
              </button>
              <button
                onClick={() => goToScreen('hero')}
                className={clsx(
                  buttonBase,
                  screen === 'hero'
                    ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                )}
              >
                ⑥ Main HUD
              </button>

              {/* Trigger alert */}
              <button
                onClick={triggerAlert}
                className={clsx(
                  buttonBase,
                  screen === 'alert'
                    ? 'bg-accent-red/30 text-accent-red border border-accent-red/40'
                    : 'text-accent-red hover:bg-accent-red/10 hover:text-red-300 border border-transparent hover:border-accent-red/30'
                )}
              >
                ⚠ Trigger Proximity Alert
              </button>

              {/* Toggle perspective */}
              <div className="border-t border-amber-500/20 pt-1 mt-1">
                <button
                  onClick={handleToggleView}
                  className={clsx(
                    buttonBase,
                    viewAs === 'demogorgon'
                      ? 'text-accent-red bg-accent-red/10 border border-accent-red/30'
                      : 'text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/30'
                  )}
                >
                  ⟳ Switch: {viewAs === 'security' ? '→ Predator View' : '→ Security View'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
