import { useInterval } from 'react-use';
import { useGameStore } from '../store/gameStore';

const PROXIMITY_THRESHOLD = 15;

export const useGameSimulation = () => {
  const { 
    demogorgonCoords, 
    players, 
    updateDemogorgonCoords, 
    setProximityAlert,
    addIntelEvent
  } = useGameStore();

  useInterval(() => {
    // Pick a random player to move towards 
    // Usually targeting one that isn't the 'Unknown Entity'
    const validTargets = players.filter(p => p.name !== 'Unknown Entity');
    if (validTargets.length === 0) return;

    const target = validTargets[Math.floor(Math.random() * validTargets.length)];
    
    // Move Demogorgon incrementally towards target
    const dx = target.x - demogorgonCoords.x;
    const dy = target.y - demogorgonCoords.y;
    
    // Normalize and step
    const distanceToTarget = Math.sqrt(dx * dx + dy * dy);
    
    if (distanceToTarget > 0) {
      const step = 2; // speed
      const newX = demogorgonCoords.x + (dx / distanceToTarget) * step;
      const newY = demogorgonCoords.y + (dy / distanceToTarget) * step;
      
      updateDemogorgonCoords({ x: newX, y: newY });

      // Check for proximity alert
       let minDistance = Infinity;
      
      for (const p of validTargets) {
        const pdx = p.x - newX;
        const pdy = p.y - newY;
        const distance = Math.sqrt(pdx * pdx + pdy * pdy);
        if (distance < minDistance) {
          minDistance = distance;
        }
      }

      // Find if we cross the threshold into danger
      if (minDistance <= PROXIMITY_THRESHOLD) {
        setProximityAlert(true);
        // We could also trigger intel feed logs randomly
        if (Math.random() > 0.8) {
           addIntelEvent({
              timestamp: new Date().toLocaleTimeString(),
              message: `WARNING: Entity approaching proximate vector.`,
              type: 'warning'
           });
        }
      } else {
        setProximityAlert(false);
      }
    }
  }, 2000); // Trigger every 2 seconds
};
