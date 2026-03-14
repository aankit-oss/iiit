import { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Typewriter } from '../ui/Typewriter';
import clsx from 'clsx';

export function LogFeed() {
  const { intelFeed, viewAs } = useGameStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of log
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [intelFeed]);

  const isDemo = viewAs === 'demogorgon';

  return (
    <div className={clsx(
      "w-full h-full flex flex-col font-mono text-sm border p-4 bg-void/80 overflow-hidden",
      isDemo ? "border-accent-maroon/50" : "border-accent-cyan/30"
    )}>
      <div className={clsx("mb-4 border-b pb-2 uppercase tracking-widest", isDemo ? "text-accent-red border-accent-maroon" : "text-accent-cyan border-accent-cyan/30")}>
        {isDemo ? 'HIVE SYNAPSE LOG' : 'SYSTEM INTEL FEED'}
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
        {intelFeed.map((event) => {
          let colorClass = 'text-accent-cyan';
          if (event.type === 'warning') colorClass = 'text-yellow-500';
          if (event.type === 'critical') colorClass = 'text-accent-red';
          
          if (isDemo) {
             // In demo view, tint everything red/maroon
             colorClass = event.type === 'system' ? 'text-accent-maroon' : 'text-accent-red';
          }

          return (
            <div key={event.id} className="flex space-x-3 items-start animate-fade-in">
              <span className="text-gray-500 shrink-0">[{event.timestamp}]</span>
              <span className={colorClass}>
                <Typewriter text={event.message} speed={20} showCursor={false} />
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} className="h-1" />
      </div>
    </div>
  );
}
