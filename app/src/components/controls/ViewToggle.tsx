import { useGameStore } from '../../store/gameStore';
import clsx from 'clsx';
export function ViewToggle() {
  const { viewAs, toggleViewAs, addIntelEvent } = useGameStore();

  const handleToggle = (newView: 'security' | 'demogorgon') => {
    if (newView === viewAs) return;
    
    toggleViewAs();
    
    // Add a transition effect / log entry
    addIntelEvent({
      timestamp: new Date().toLocaleTimeString(),
      message: `PERSPECTIVE SHIFT: ${newView.toUpperCase()}`,
      type: newView === 'demogorgon' ? 'critical' : 'system'
    });
    
    // Optional: bounce them back to lobby if they were in hero
    // setScreen('lobby'); 
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex bg-void/90 border border-accent-cyan p-1 rounded font-mono text-xs shadow-lg shadow-black/50">
      <button
        onClick={() => handleToggle('security')}
        className={clsx(
          "px-4 py-2 uppercase tracking-widest transition-colors",
          viewAs === 'security' 
            ? "bg-accent-cyan text-black font-bold" 
            : "text-accent-cyan hover:bg-accent-cyan/10"
        )}
      >
        Security
      </button>
      <button
        onClick={() => handleToggle('demogorgon')}
        className={clsx(
          "px-4 py-2 uppercase tracking-widest transition-colors",
          viewAs === 'demogorgon' 
            ? "bg-accent-red text-black font-bold" 
            : "text-accent-red hover:bg-accent-red/10"
        )}
      >
        Predator
      </button>
    </div>
  );
}
