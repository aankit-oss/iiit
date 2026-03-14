import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface CRTOverlayProps {
  children: ReactNode;
  className?: string;
}

export function CRTOverlay({ children, className }: CRTOverlayProps) {
  return (
    <div className={twMerge('relative w-full h-full overflow-hidden bg-void', className)}>
      {/* The actual app content */}
      <div className="relative z-10 w-full h-full">{children}</div>

      {/* ── Scanline stripe pattern ── */}
      <div
        className="pointer-events-none absolute inset-0 z-50 animate-scanline-sweep"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* ── Deep vignette ── */}
      <div
        className="pointer-events-none absolute inset-0 z-[51]"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.82) 100%)',
        }}
      />

      {/* ── Horizontal phosphor bloom at top ── */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-px z-[51]"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.4), transparent)' }}
      />

      {/* ── Subtle random flicker ── */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[52] bg-white"
        animate={{ opacity: [0.008, 0.022, 0.006, 0.018, 0.009, 0.014, 0.008] }}
        transition={{ repeat: Infinity, duration: 0.6, ease: 'linear', repeatType: 'mirror' }}
      />
    </div>
  );
}
