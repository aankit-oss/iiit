import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameCanvas } from '../canvas/GameCanvas';
import { DPadOverlay } from '../canvas/DPadOverlay';
import { useGameStore } from '../../store/gameStore';
import { usePlayerMovement } from '../../hooks/usePlayerMovement';
import type { Direction } from '../../hooks/usePlayerMovement';
import { useSocket } from '../../hooks/useSocket';
import { gpsToWorld } from '../../utils/gpsToWorld';
import { Radar } from '../radar/Radar';
import type { SpriteState } from '../canvas/GameCanvas';
import type { Player } from '../../types/game';
import { clsx } from 'clsx';

/**
 * GameScreen — canvas world with HUD, real-time events and socket integration.
 * Socket is optional: the game works offline (local simulation) if the server
 * is unavailable.
 */
export function GameScreen() {
  const { viewAs, players, demogorgonCoords, selectedAgent, agentCodename, updatePlayerStatus, addIntelEvent } = useGameStore();
  const isDemo = viewAs === 'demogorgon';

  // Sample real-time events that get injected
  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      count++;
      addIntelEvent({
        timestamp: new Date().toLocaleTimeString(),
        message: isDemo 
          ? `Biomass detected at sector ${Math.floor(Math.random()*10)}...`
          : `Disturbance reported in sector ${Math.floor(Math.random()*10)}...`,
        type: isDemo ? 'warning' : 'system'
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [addIntelEvent, isDemo]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Player starts near centre
  const { tx, ty, move } = usePlayerMovement({ initialTx: 20, initialTy: 20 });

  // Socket — gracefully degrades to local simulation if server is down
  const roomCode = 'HAWKINS-DEFAULT';
  const playerId = selectedAgent ?? 'player-local';
  const { emitPosition, emitCatch, emitAccuse } = useSocket({
    roomCode,
    playerId,
    playerName: (agentCodename || selectedAgent || 'UNKNOWN').toUpperCase(),
    role: isDemo ? 'demogorgon' : 'security',
    initialX: demogorgonCoords.x,
    initialY: demogorgonCoords.y,
  });

  // Broadcast our position whenever we move
  const handleMove = (dir: Direction) => {
    move(dir);
    emitPosition(tx, ty);
  };

  // Build other-sprite list from store players + demogorgon
  const demoPos = gpsToWorld(demogorgonCoords.x, demogorgonCoords.y);

  const sprites: SpriteState[] = [
    // Show demogorgon only if player is security
    ...(!isDemo ? [{
      id: 'demogorgon',
      name: 'demogorgon',
      tx: demoPos.tx,
      ty: demoPos.ty,
      isDemogorgon: true,
    }] : []),
    // Other agents (exclude self approximate)
    ...players.map((p, _i) => {
      const wp = gpsToWorld(p.x, p.y);
      return {
        id: p.id,
        name: selectedAgent ?? 'hopper',
        tx: wp.tx,
        ty: wp.ty,
        isDemogorgon: false,
      };
    }),
  ];

  // Measure container for canvas size
  const w = containerRef.current?.clientWidth  || 640;
  const h = containerRef.current?.clientHeight || 480;

  // Distances and logic for Phase 3
  const distToDemo = Math.hypot(tx - demoPos.tx, ty - demoPos.ty);
  const activePlayers = players.filter(p => p.status !== 'caught');
  
  const agentDists = activePlayers.map(p => {
    const wp = gpsToWorld(p.x, p.y);
    return Math.hypot(tx - wp.tx, ty - wp.ty);
  });
  const minAgentDist = agentDists.length ? Math.min(...agentDists) : Infinity;

  const canCatch = isDemo && minAgentDist <= 1.5;
  const isDemoNear = !isDemo && distToDemo <= 3.0;

  // Haptic Feedback for Demo Near
  const [lastVibrated, setLastVibrated] = useState(0);
  useEffect(() => {
    if (isDemoNear) {
      const now = Date.now();
      if (now - lastVibrated > 2000) {
        if ('vibrate' in navigator) navigator.vibrate(200);
        setLastVibrated(now);
      }
    }
  }, [isDemoNear, lastVibrated]);

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState(300);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const mins = Math.floor(timeLeft / 60);
  const secs = (timeLeft % 60).toString().padStart(2, '0');

  const handleAction = () => {
    if (isDemo) {
      if (canCatch) {
        let closestPlayer: Player | null = null;
        let cDist = Infinity;
        activePlayers.forEach(p => {
          const wp = gpsToWorld(p.x, p.y);
          const dist = Math.hypot(tx - wp.tx, ty - wp.ty);
          if (dist < cDist) {
            cDist = dist;
            closestPlayer = p as Player;
          }
        });
        const cp = closestPlayer as Player | null;
        if (cp) {
          // Emit over socket (server will broadcast to room and update all clients)
          emitCatch(cp.id);
          // Also update locally so feedback is instant
          updatePlayerStatus(cp.id, 'caught');
          if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
        }
      }
    } else {
      // Accuse the closest non-self player
      const closestAgent = activePlayers[0];
      if (closestAgent) {
        emitAccuse(closestAgent.id);
      }
      addIntelEvent({
        timestamp: new Date().toLocaleTimeString(),
        message: '⚠ ACCUSATION FILED — awaiting confirmation.',
        type: 'warning',
      });
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className="w-full h-full relative bg-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Canvas fills container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <GameCanvas
          playerTx={tx}
          playerTy={ty}
          playerAgent={selectedAgent ?? 'hopper'}
          isDemogorgon={isDemo}
          sprites={sprites}
          width={w || 640}
          height={h || 480}
        />
      </div>

      {/* Right HUD: Current Target / Actions */}
      <div className="hidden md:flex flex-col space-y-4 w-64 pointer-events-auto">
        <div className="bg-black/60 border border-accent-cyan/30 p-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-cyan to-transparent" />
          <h3 className="font-display tracking-widest text-accent-cyan mb-2">
            {isDemo ? 'AVAILABLE PREY' : 'TEAM STATUS'}
          </h3>
          <div className="space-y-4">
            {/* This section was incomplete in the provided snippet. Keeping it minimal to avoid syntax errors. */}
            {/* You might want to add player status display here based on your design. */}
          </div>
        </div>
      </div>

      {/* Top Bar HUD */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-2 bg-black/80 border-b-2 border-accent-cyan/40 font-mono text-sm pointer-events-none">
        <div className="flex items-center space-x-4">
          <span className={`px-2 py-0.5 rounded text-black font-bold tracking-widest ${isDemo ? 'bg-accent-red' : 'bg-accent-cyan'}`}>
            {isDemo ? 'DEMOGORGON' : 'SECURITY'}
          </span>
          <span className="text-white/70 tracking-widest hidden sm:inline-block">
            {isDemo ? 'HUNT MODE' : `AGENT: ${(agentCodename || selectedAgent || 'UNKNOWN').toUpperCase()}`}
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <span className="text-green-400 tracking-widest">
            ALIVE: {activePlayers.length}
          </span>
          <span className="text-yellow-400 tracking-widest text-lg font-bold">
            {mins}:{secs}
          </span>
        </div>
      </div>

      {/* Alert Banner */}
      <AnimatePresence>
        {isDemoNear && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-14 left-0 right-0 flex justify-center pointer-events-none"
          >
            <div className="bg-red-900/80 border-2 border-red-500 text-white font-bold font-mono tracking-widest px-6 py-2 rounded shadow-[0_0_20px_rgba(239,68,68,0.7)] animate-pulse">
              ⚠ DEMOGORGON NEAR ⚠
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard hint */}
      <div className="absolute bottom-24 left-6 font-mono text-[10px] text-white/20 tracking-widest pointer-events-none">
        WASD / ARROWS + D-PAD TO MOVE
      </div>

      {/* Action Button */}
      <div className="absolute bottom-10 right-36 sm:right-44 z-50 select-none">
        {/* The original button structure was replaced with the new one from the instruction */}
        <motion.button 
          className={clsx(
            "w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 font-bold text-lg sm:text-xl flex items-center justify-center transition-colors shadow-lg",
            isDemo 
              ? (canCatch ? 'bg-red-600 border-red-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.8)]' : 'bg-red-900/50 border-red-900/50 text-red-500/50')
              : "border-cyan-400 bg-cyan-600/80 text-white shadow-[0_0_15px_rgba(6,182,212,0.6)]"
          )}
          onClick={handleAction}
          whileTap={isDemo && canCatch ? { scale: 0.9 } : {}}
          animate={isDemo && canCatch ? { scale: [1, 1.05, 1] } : {}}
          transition={isDemo && canCatch ? { repeat: Infinity, duration: 1 } : {}}
          disabled={isDemo && !canCatch}
        >
          {isDemo ? (canCatch ? 'CATCH' : 'NO TARGET') : 'ACCUSE'}
        </motion.button>
      </div>

      {/* Mini Radar */}
      <div className="absolute bottom-6 right-6 w-24 h-24 sm:w-32 sm:h-32 pointer-events-none opacity-80 z-40">
        <Radar />
      </div>

      {/* D-Pad */}
      <DPadOverlay onMove={handleMove} isDemogorgon={isDemo} />
    </motion.div>
  );
}
