import { motion } from 'framer-motion';
import type { Direction } from '../../hooks/usePlayerMovement';

interface DPadOverlayProps {
  onMove: (dir: Direction) => void;
  isDemogorgon: boolean;
}

const PAD = [
  { dir: 'up'    as Direction, label: '▲', col: 2, row: 1 },
  { dir: 'left'  as Direction, label: '◀', col: 1, row: 2 },
  { dir: 'right' as Direction, label: '▶', col: 3, row: 2 },
  { dir: 'down'  as Direction, label: '▼', col: 2, row: 3 },
];

export function DPadOverlay({ onMove, isDemogorgon }: DPadOverlayProps) {
  const accent = isDemogorgon ? '#ef4444' : '#06b6d4';

  return (
    <div className="fixed bottom-6 left-6 z-50 select-none touch-none">
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: 'repeat(3, 3rem)', gridTemplateRows: 'repeat(3, 3rem)' }}
      >
        {PAD.map(({ dir, label, col, row }) => (
          <motion.button
            key={dir}
            className="w-12 h-12 rounded-lg flex items-center justify-center font-display text-xl bg-black/70 border-2 backdrop-blur-sm"
            style={{
              gridColumn: col,
              gridRow: row,
              borderColor: `${accent}60`,
              color: accent,
            } as React.CSSProperties}
            onPointerDown={(e) => {
              e.preventDefault();
              onMove(dir);
            }}
            whileTap={{ scale: 0.87 }}
            whileHover={{ borderColor: accent }}
          >
            {label}
          </motion.button>
        ))}
        {/* Centre dot */}
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ gridColumn: 2, gridRow: 2 }}
        >
          <div className="w-2 h-2 rounded-full opacity-40" style={{ backgroundColor: accent }} />
        </div>
      </div>
    </div>
  );
}
