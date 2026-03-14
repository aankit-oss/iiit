import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import clsx from 'clsx';

const MAP_MAX = 50;

const mapCoordinateToPercent = (val: number) => {
  // val is between -MAP_MAX and MAP_MAX
  // we want to map it to 0% - 100%
  const clamped = Math.max(-MAP_MAX, Math.min(MAP_MAX, val));
  return ((clamped + MAP_MAX) / (MAP_MAX * 2)) * 100;
};

export function Radar() {
  const { players, demogorgonCoords, viewAs, proximityAlertActive } = useGameStore();

  const isDemo = viewAs === 'demogorgon';
  const radarColorSolid = isDemo ? '#ef4444' : '#06b6d4';
  const sweepGradient = isDemo 
    ? 'conic-gradient(from 0deg, transparent 70%, rgba(239, 68, 68, 0.6) 100%)' 
    : 'conic-gradient(from 0deg, transparent 70%, rgba(6, 182, 212, 0.6) 100%)';

  return (
    <div className="relative w-full max-w-lg aspect-square rounded-full overflow-hidden border-2 bg-void/90 flex items-center justify-center p-4 transition-colors duration-1000"
         style={{ borderColor: radarColorSolid }}>
      
      {/* Pulse effect if proximity alert */}
      {proximityAlertActive && !isDemo && (
        <motion.div 
          className="absolute inset-0 rounded-full border-[4px] border-accent-red"
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      )}

      {/* Grid: Concentric Circles */}
      <div className="absolute inset-4 rounded-full border border-dashed opacity-30" style={{ borderColor: radarColorSolid }} />
      <div className="absolute inset-16 rounded-full border border-dashed opacity-30" style={{ borderColor: radarColorSolid }} />
      <div className="absolute inset-32 rounded-full border border-dashed opacity-30" style={{ borderColor: radarColorSolid }} />
      
      {/* Grid: Crosshairs */}
      <div className="absolute w-full h-[1px] opacity-30" style={{ backgroundColor: radarColorSolid }} />
      <div className="absolute h-full w-[1px] opacity-30" style={{ backgroundColor: radarColorSolid }} />

      {/* Sweeping Line */}
      <motion.div 
        className="absolute w-full h-full rounded-full mix-blend-screen"
        style={{ background: sweepGradient }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute top-0 left-1/2 w-[2px] h-1/2 origin-bottom transform -translate-x-1/2" style={{ backgroundColor: radarColorSolid, boxShadow: `0 0 10px ${radarColorSolid}` }} />
      </motion.div>

      {/* Players */}
      {players.map(player => {
        // Exclude Unknown Entity for cleaner look, or style differently
        if (player.name === 'Unknown Entity' && !isDemo) return null;

        const left = `${mapCoordinateToPercent(player.x)}%`;
        const top = `${mapCoordinateToPercent(player.y)}%`;
        
        // Use a stable animation duration derived from id to avoid Math.random() in JSX
        const idHash = player.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
        const blinkDuration = 1.5 + (idHash % 10) * 0.15;
        
        // Status styling
        let dotColor = 'bg-accent-cyan';
        if (isDemo) {
          dotColor = 'bg-white'; // Prey is white or gray
        } else {
          if (player.status === 'danger') dotColor = 'bg-accent-red';
          if (player.status === 'unknown') dotColor = 'bg-yellow-500';
        }

        return (
          <div 
            key={player.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10"
            style={{ left, top }}
          >
            <motion.div 
              className={clsx('w-3 h-3 rounded-full relative', dotColor)}
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: blinkDuration }}
            >
              <div className={clsx('absolute inset-0 rounded-full animate-ping opacity-75', dotColor)} />
            </motion.div>
            
            <span className={clsx("text-xs mt-1 bg-void/80 px-1 rounded whitespace-nowrap", isDemo ? "text-gray-400" : "text-accent-cyan")}>
              {isDemo ? 'PREY' : player.name}
            </span>
          </div>
        );
      })}

      {/* The Demogorgon */}
      <div 
        className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20"
        style={{ 
          left: `${mapCoordinateToPercent(demogorgonCoords.x)}%`, 
          top: `${mapCoordinateToPercent(demogorgonCoords.y)}%`,
          transition: 'all 2s linear'
        }}
      >
        <motion.div 
            className={clsx('w-4 h-4 rounded-full relative', isDemo ? 'bg-accent-maroon' : 'bg-accent-red')}
          >
            <div className={clsx('absolute inset-0 rounded-full animate-ping opacity-90', isDemo ? 'bg-accent-maroon' : 'bg-accent-red')} />
        </motion.div>
        <span className={clsx("text-xs font-bold mt-1 bg-void/80 px-1 rounded whitespace-nowrap text-glow-red text-accent-red")}>
          {isDemo ? 'YOU' : 'ANOMALY'}
        </span>
      </div>

    </div>
  );
}
