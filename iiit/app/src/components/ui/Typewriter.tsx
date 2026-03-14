import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface TypewriterProps {
  text: string;
  speed?: number; // ms per character
  className?: string;
  onComplete?: () => void;
  showCursor?: boolean;
}

export function Typewriter({ 
  text, 
  speed = 50, 
  className, 
  onComplete,
  showCursor = true 
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!text) return;
    
    setDisplayedText('');
    setIsTyping(true);
    
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(intervalId);
        setIsTyping(false);
        if (onComplete) {
          onComplete();
        }
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed, onComplete]);

  return (
    <span className={twMerge('inline-block', className)}>
      {displayedText}
      {showCursor && (
        <span 
          className={clsx(
            "ml-1 inline-block w-2 bg-current",
            isTyping ? "animate-pulse h-4" : "animate-bounce h-[2px] translate-y-2 opacity-50"
          )}
        >
          &nbsp;
        </span>
      )}
    </span>
  );
}
