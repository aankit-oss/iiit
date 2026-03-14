import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface GlitchTextProps {
  text: string;
  className?: string;
  glitchIntensity?: 'low' | 'medium' | 'high';
}

export function GlitchText({ text, className, glitchIntensity = 'medium' }: GlitchTextProps) {
  
  // Define animation steps based on intensity
  const getClipAnimations = () => {
    switch(glitchIntensity) {
      case 'low':
        return [
          "inset(20% 0 80% 0)",
          "inset(60% 0 10% 0)",
          "inset(10% 0 50% 0)",
          "inset(80% 0 5% 0)",
          "inset(20% 0 80% 0)"
        ];
      case 'high':
         return [
          "inset(0% 0 90% 0)",
          "inset(90% 0 0% 0)",
          "inset(20% 0 10% 0)",
          "inset(40% 0 50% 0)",
          "inset(10% 0 80% 0)",
          "inset(0% 0 90% 0)"
        ];
      default:
        return [
          "inset(10% 0 60% 0)",
          "inset(80% 0 5% 0)",
          "inset(30% 0 20% 0)",
          "inset(60% 0 10% 0)",
          "inset(10% 0 60% 0)"
        ];
    }
  }

  return (
    <div className={twMerge('relative inline-block', className)}>
      {/* Base text */}
      <span className="relative z-10">{text}</span>
      
      {/* Glitch Layer 1 - Cyan */}
      <motion.span 
        className="absolute top-0 left-[2px] z-0 text-accent-cyan opacity-70"
        aria-hidden="true"
        animate={{
          clipPath: getClipAnimations(),
          x: [-2, 2, -1, 3, -2]
        }}
        transition={{
          duration: glitchIntensity === 'high' ? 0.3 : 0.8,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'linear'
        }}
      >
        {text}
      </motion.span>
      
      {/* Glitch Layer 2 - Red */}
      <motion.span 
        className="absolute top-0 left-[-2px] z-0 text-accent-red opacity-70"
        aria-hidden="true"
        animate={{
          clipPath: [...getClipAnimations()].reverse(),
          x: [2, -2, 1, -3, 2]
        }}
        transition={{
          duration: glitchIntensity === 'high' ? 0.4 : 0.9,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'linear'
        }}
      >
        {text}
      </motion.span>
    </div>
  );
}
