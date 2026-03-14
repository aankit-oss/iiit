import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { GlitchText } from '../ui/GlitchText';
import { Typewriter } from '../ui/Typewriter';

export function HeroScreen() {
  const { viewAs, setScreen, addIntelEvent, setProximityAlert, updateDemogorgonCoords } = useGameStore();
  const isDemo = viewAs === 'demogorgon';

  const resetGame = () => {
    // Basic reset
    updateDemogorgonCoords({ x: -40, y: 40 }); // Move away
    setProximityAlert(false);
    addIntelEvent({
      timestamp: new Date().toLocaleTimeString(),
      message: 'SYSTEM REBOOT INITIATED',
      type: 'system'
    });
    setScreen('lobby');
  };

  return (
    <motion.div 
      className="w-full h-full flex flex-col items-center justify-center bg-black relative overflow-hidden"
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Background visual distortion */}
      <motion.div 
        className="absolute inset-0 bg-red-900 mix-blend-multiply opacity-50"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
      
      {/* Particle effect mimicking spores/upside down */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      <div className="z-10 text-center flex flex-col items-center gap-8">
        <GlitchText 
          text={isDemo ? 'TARGET CONSUMED' : 'CONTAINMENT BREACH'} 
          glitchIntensity="high"
          className="text-6xl md:text-8xl font-display text-white text-glow-red"
        />

        <div className="text-accent-red font-mono text-xl max-w-xl text-center leading-relaxed bg-black/50 p-6 border border-red-900 rounded">
           <Typewriter 
             text={isDemo 
               ? "The Biomass has been absorbed. The Upside Down expands. Your hunger remains insatiable." 
               : "CODE RED. The anomaly has breached the inner perimeter. Evacuate all remaining personnel immediately."}
             speed={40}
           />
        </div>

        <motion.button
          onClick={resetGame}
          className="mt-8 px-8 py-3 bg-transparent border-2 border-accent-red text-accent-red font-display uppercase tracking-widest hover:bg-accent-red hover:text-black transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isDemo ? 'HUNT AGAIN' : 'REBOOT SYSTEM'}
        </motion.button>
      </div>
    </motion.div>
  );
}
