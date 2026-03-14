import { useGameStore } from '../../store/gameStore';
import { Radar } from '../radar/Radar';
import { LogFeed } from '../radar/LogFeed';

import clsx from 'clsx';
import { motion } from 'framer-motion';

export function LobbyScreen() {
  const { viewAs, players, proximityAlertActive, setScreen } = useGameStore();

  const isDemo = viewAs === 'demogorgon';

  // For Demo view, maybe we flash screen or change state when alert is active
  if (proximityAlertActive && isDemo) {
    // Optionally trigger hero screen after a delay or user click
  }

  return (
    <div className={clsx(
      "w-full h-full p-4 md:p-8 flex flex-col transition-colors duration-1000",
      isDemo ? "bg-void text-accent-maroon" : "bg-void text-accent-cyan"
    )}>
      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b pb-4" style={{ borderColor: isDemo ? 'rgba(127,29,29,0.5)' : 'rgba(6,182,212,0.3)' }}>
        <h1 className="text-2xl font-display tracking-widest">
          {isDemo ? 'HIVE MIND NEURAL LINK' : 'HAWKINS LAB SECUR/OS v4.2'}
        </h1>
        <div className="text-sm font-mono flex items-center gap-4">
          <span className={clsx("animate-pulse", proximityAlertActive ? "text-accent-red" : "")}>
            STATUS: {proximityAlertActive ? 'CRITICAL PROXIMITY' : 'NOMINAL'}
          </span>
          <div className="flex gap-2 items-center">
            <span>VIEW:</span>
            <span className={clsx("px-2 py-1 rounded font-bold border", isDemo ? "border-accent-maroon text-accent-red" : "border-accent-cyan text-accent-cyan")}>
              {isDemo ? 'PREDATOR' : 'SECURITY'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 overflow-hidden">
        
        {/* Left Col: Roster (if security) / Targets (if demo) */}
        <div className="col-span-1 border p-4 flex flex-col overflow-hidden" style={{ borderColor: isDemo ? 'rgba(127,29,29,0.3)' : 'rgba(6,182,212,0.3)' }}>
          <h2 className="mb-4 uppercase tracking-widest border-b pb-2" style={{ borderColor: isDemo ? 'rgba(127,29,29,0.5)' : 'rgba(6,182,212,0.3)' }}>
            {isDemo ? 'AVAILABLE BIOMASS' : 'PERSONNEL TRACKING'}
          </h2>
          <div className="flex-1 overflow-y-auto space-y-4 font-mono text-sm">
            {players.filter(p => !isDemo || p.name !== 'Unknown Entity').map(player => (
              <div key={player.id} className="flex justify-between items-center p-2 rounded" style={{ backgroundColor: isDemo ? 'rgba(127,29,29,0.1)' : 'rgba(6,182,212,0.05)' }}>
                <span>{player.name}</span>
                <span className={clsx(
                  "text-xs px-2 py-1 rounded border",
                  player.status === 'safe' && !isDemo ? 'border-accent-cyan text-accent-cyan' :
                  player.status === 'danger' || isDemo ? 'border-accent-red text-accent-red animate-pulse' :
                  'border-yellow-500 text-yellow-500'
                )}>
                  {isDemo ? 'TARGET' : player.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          {/* Action Button for Deployment */}
          <motion.button 
            className={clsx(
              "mt-4 p-4 font-display text-xl uppercase tracking-wider border-2 transition-all",
              isDemo ? "border-accent-red bg-accent-red/20 text-white hover:bg-accent-red/40" 
                     : "border-accent-cyan bg-accent-cyan/20 text-white hover:bg-accent-cyan/40"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setScreen('game')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isDemo ? 'ENTER THE UPSIDE DOWN' : 'DEPLOY TO THE FIELD'}
          </motion.button>
        </div>

        {/* Center Col: Radar */}
        <div className="col-span-1 md:col-span-1 flex items-center justify-center">
          <Radar />
        </div>

        {/* Right Col: Intel Feed */}
        <div className="col-span-1 h-full">
          <LogFeed />
        </div>

      </div>
    </div>
  );
}
