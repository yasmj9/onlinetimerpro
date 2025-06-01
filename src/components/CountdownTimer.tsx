import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCountdown } from '../hooks/useCountdown';
import { formatDuration } from '../utils/time';

export const CountdownTimer: React.FC = () => {
  const [inputHours, setInputHours] = useState('');
  const [inputMinutes, setInputMinutes] = useState('');
  const [inputSeconds, setInputSeconds] = useState('');
  
  const { timeLeft, isRunning, progress, start, pause, resume, reset } = useCountdown();

  const handleStart = () => {
    const totalMs = 
      (parseInt(inputHours) || 0) * 3600000 +
      (parseInt(inputMinutes) || 0) * 60000 +
      (parseInt(inputSeconds) || 0) * 1000;
    
    if (totalMs > 0) {
      start(totalMs);
    }
  };

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <div className="text-center space-y-8">
      {/* Progress Ring */}
      <div className="relative w-80 h-80 mx-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 240 240">
          <circle
            cx="120"
            cy="120"
            r="120"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-gray-200 dark:text-gray-700"
          />
          <motion.circle
            cx="120"
            cy="120"
            r="120"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className="text-blue-500"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
            }}
            transition={{ duration: 0.1 }}
          />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            key={timeLeft}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            className="text-6xl font-mono font-bold"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {formatDuration(timeLeft)}
          </motion.div>
        </div>
      </div>

      {/* Input Form */}
      {timeLeft === 0 && !isRunning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 text-2xl"
        >
          <input
            type="number"
            value={inputHours}
            onChange={(e) => setInputHours(e.target.value)}
            placeholder="00"
            className="w-16 text-center bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 outline-none"
            min="0"
            max="23"
          />
          <span>:</span>
          <input
            type="number"
            value={inputMinutes}
            onChange={(e) => setInputMinutes(e.target.value)}
            placeholder="00"
            className="w-16 text-center bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 outline-none"
            min="0"
            max="59"
          />
          <span>:</span>
          <input
            type="number"
            value={inputSeconds}
            onChange={(e) => setInputSeconds(e.target.value)}
            placeholder="00"
            className="w-16 text-center bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 outline-none"
            min="0"
            max="59"
          />
        </motion.div>
      )}

      {/* Controls */}
      <div className="flex justify-center gap-4">
        {timeLeft === 0 && !isRunning ? (
          <button
            onClick={handleStart}
            className="px-8 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors cursor-pointer hover:scale-105"
          >
            START
          </button>
        ) : (
          <>
            <button
              onClick={isRunning ? pause : resume}
              className="px-6 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors cursor-pointer hover:scale-105"
            >
              {isRunning ? 'PAUSE' : 'RESUME'}
            </button>
            <button
              onClick={reset}
              className="px-6 py-3 bg-gray-500 text-white rounded-full font-medium hover:bg-gray-600 transition-colors cursor-pointer hover:scale-105"
            >
              RESET
            </button>
          </>
        )}
      </div>
    </div>
  );
};