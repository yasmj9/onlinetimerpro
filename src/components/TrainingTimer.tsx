import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrainingTimer } from '../hooks/useTrainingTimer';
import { formatDuration } from '../utils/time';

export const TrainingTimer: React.FC = () => {
  const [exerciseDuration, setExerciseDuration] = useState('30');
  const [restDuration, setRestDuration] = useState('10');
  const [numberOfSets, setNumberOfSets] = useState('5');
  const [readyDuration, setReadyDuration] = useState('10');
  
  const {
    config,
    currentSet,
    totalSets,
    isExercise,
    isReady,
    timeLeft,
    isRunning,
    isComplete,
    progress,
    start,
    pause,
    resume,
    reset
  } = useTrainingTimer();

  const handleStart = () => {
    start({
      exerciseDuration: parseInt(exerciseDuration) || 30,
      restDuration: parseInt(restDuration) || 10,
      numberOfSets: parseInt(numberOfSets) || 5,
      readyDuration: parseInt(readyDuration) || 10,
    });
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center space-y-8"
      >
        <div className="text-6xl">🎉</div>
        <div className="text-4xl font-bold text-green-500">
          Workout Complete!
        </div>
        <div className="text-xl text-gray-600 dark:text-gray-300">
          {totalSets} sets completed
        </div>
        <button
          onClick={reset}
          className="px-8 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors cursor-pointer hover:scale-105"
        >
          START NEW WORKOUT
        </button>
      </motion.div>
    );
  }

  if (!config) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8 max-w-md mx-auto"
      >
        <h2 className="text-3xl font-bold mb-8">Training Timer</h2>       
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              🏃‍♀️ Get Ready Duration (seconds)
            </label>
            <input
              type="number"
              value={readyDuration}
              onChange={(e) => setReadyDuration(e.target.value)}
              className="w-full px-4 py-3 text-center text-xl bg-white/10 dark:bg-black/20 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">Countdown before workout starts</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              💪 Exercise Duration (seconds)
            </label>
            <input
              type="number"
              value={exerciseDuration}
              onChange={(e) => setExerciseDuration(e.target.value)}
              className="w-full px-4 py-3 text-center text-xl bg-white/10 dark:bg-black/20 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              min="1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              😮‍💨 Rest Duration (seconds)
            </label>
            <input
              type="number"
              value={restDuration}
              onChange={(e) => setRestDuration(e.target.value)}
              className="w-full px-4 py-3 text-center text-xl bg-white/10 dark:bg-black/20 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              min="1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              🔢 Number of Sets
            </label>
            <input
              type="number"
              value={numberOfSets}
              onChange={(e) => setNumberOfSets(e.target.value)}
              className="w-full px-4 py-3 text-center text-xl bg-white/10 dark:bg-black/20 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              min="1"
            />
          </div>
        </div>
        
        <button
          onClick={handleStart}
          className="w-full px-8 py-4 bg-blue-500 text-white rounded-lg font-medium text-xl hover:bg-blue-600 transition-colors cursor-pointer hover:scale-105"
        >
          START TRAINING
        </button>
      </motion.div>
    );
  }

  return (
    <div className="text-center space-y-8">
      {/* Ready Phase Display */}
      {isReady && (
        <AnimatePresence mode="wait">
          <motion.div
            key="ready"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-8xl font-black uppercase tracking-wider text-yellow-500 drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]"
          >
            GET READY
          </motion.div>
        </AnimatePresence>
      )}

      {/* Current Phase Display */}
      {!isReady && (
        <AnimatePresence mode="wait">
          <motion.div
            key={isExercise ? 'work' : 'rest'}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`text-8xl font-black uppercase tracking-wider ${
              isExercise 
                ? 'text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]' 
                : 'text-green-500 drop-shadow-[0_0_30px_rgba(34,197,94,0.5)]'
            }`}
          >
            {isExercise ? 'WORK' : 'REST'}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Timer Display */}
      <motion.div
        key={`${currentSet}-${isReady ? 'ready' : isExercise ? 'work' : 'rest'}`}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        className="text-6xl font-mono font-bold"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {formatDuration(timeLeft)}
      </motion.div>

      {/* Set Progress */}
      {!isReady && (
        <div className="space-y-4">
          <div className="text-2xl font-medium">
            Set {currentSet} of {totalSets}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <motion.div
              className="bg-blue-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-center gap-4">
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
      </div>

      {/* Live Region for Screen Readers */}
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {isReady 
          ? `Get ready: ${formatDuration(timeLeft)}`
          : `${isExercise ? 'Exercise' : 'Rest'} time: ${formatDuration(timeLeft)}. Set ${currentSet} of ${totalSets}.`
        }
      </div>
    </div>
  );
};