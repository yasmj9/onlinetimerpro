import React from 'react';
import { motion } from 'framer-motion';
import { useTimer } from '../hooks/useTimer';
import { formatTime } from '../utils/time';

export const DefaultTimer: React.FC = () => {
  const time = useTimer();

  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-8xl md:text-9xl font-mono font-bold text-gray-900 dark:text-gray-100"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {formatTime(time, 'HH:mm:ss')}
      </motion.div>
      
      <div className="mt-4 text-xl text-gray-600 dark:text-gray-300">
        {time.toLocaleDateString('en-US', { 
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone 
        })}
      </div>
    </div>
  );
};