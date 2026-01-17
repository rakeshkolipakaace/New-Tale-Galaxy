import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MobileFrameProps {
  children: ReactNode;
  orientation?: 'portrait' | 'landscape';
}

export function MobileFrame({ children, orientation = 'portrait' }: MobileFrameProps) {
  return (
    <div className="w-full h-screen bg-paper overflow-hidden">
      <motion.div
        layout
        className={cn(
          "w-full h-full relative transition-all duration-700 ease-in-out",
          orientation === 'landscape' ? 'flex flex-row' : 'flex flex-col'
        )}
      >
        {/* Screen Content */}
        <div className="w-full h-full overflow-hidden relative">
            {children}
        </div>
      </motion.div>
    </div>
  );
}
