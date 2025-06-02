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
    reset,
    skip
  } = useTrainingTimer();

  const handleStart = () => {
    start({
      exerciseDuration: parseInt(exerciseDuration) || 30,
      restDuration: parseInt(restDuration) || 10,
      numberOfSets: parseInt(numberOfSets) || 5,
      readyDuration: parseInt(readyDuration) || 10,
    });
  };

  const getCurrentPhaseInfo = () => {
    if (isReady) {
      return {
        title: 'GET READY',
        subtitle: 'Prepare for your workout',
        icon: '🚀',
        color: 'yellow',
        bgGradient: 'from-yellow-500 to-orange-600',
        tips: [
          'Take deep breaths',
          'Check your form',
          'Hydrate yourself',
          'Focus on your goals'
        ]
      };
    } else if (isExercise) {
      return {
        title: 'WORK OUT',
        subtitle: 'Push your limits',
        icon: '💪',
        color: 'red',
        bgGradient: 'from-red-500 to-pink-600',
        tips: [
          'Maintain proper form',
          'Breathe consistently',
          'Stay focused',
          'Push through the burn'
        ]
      };
    } else {
      return {
        title: 'REST',
        subtitle: 'Recover and prepare',
        icon: '😤',
        color: 'green',
        bgGradient: 'from-green-500 to-emerald-600',
        tips: [
          'Control your breathing',
          'Stay hydrated',
          'Prepare for next set',
          'Keep moving lightly'
        ]
      };
    }
  };

  // Workout presets
  const workoutPresets = [
    {
      name: 'HIIT Classic',
      icon: '🔥',
      work: 30,
      rest: 30,
      sets: 8,
      ready: 10,
      description: 'High-intensity interval training'
    },
    {
      name: 'Tabata',
      icon: '⚡',
      work: 20,
      rest: 10,
      sets: 8,
      ready: 10,
      description: '4-minute intense workout'
    },
    {
      name: 'Strength',
      icon: '🏋️',
      work: 45,
      rest: 60,
      sets: 6,
      ready: 15,
      description: 'Strength training intervals'
    },
    {
      name: 'Cardio Blast',
      icon: '🏃',
      work: 60,
      rest: 30,
      sets: 5,
      ready: 10,
      description: 'Cardiovascular endurance'
    }
  ];

  if (isComplete) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center space-y-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-6xl"
        >
          🎉
        </motion.div>
        <div className="text-4xl font-bold text-green-500">
          Workout Complete!
        </div>
        <div className="text-xl text-gray-600 dark:text-gray-300">
          {totalSets} sets completed • Great job!
        </div>
        
        {/* Achievement Card */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800 max-w-md mx-auto">
          <h3 className="font-semibold text-green-800 dark:text-green-200 mb-3">
            🏆 Workout Stats
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-green-700 dark:text-green-300">{totalSets}</div>
              <div className="text-green-600 dark:text-green-400">Sets</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-green-700 dark:text-green-300">
                {Math.round(((config?.exerciseDuration || 0) * totalSets + (config?.restDuration || 0) * (totalSets - 1)) / 60)}
              </div>
              <div className="text-green-600 dark:text-green-400">Minutes</div>
            </div>
          </div>
        </div>

        <button
          onClick={reset}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium hover:from-blue-600 hover:to-purple-700 transition-colors cursor-pointer hover:scale-105"
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
        className="text-center space-y-8 max-w-4xl mx-auto"
      >
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
            🏋️ Training Timer
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Create custom workout intervals for HIIT, strength training, and cardio sessions
          </p>
        </div>

        {/* Quick Presets */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            🎯 Quick Start Presets
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {workoutPresets.map((preset, index) => (
              <motion.button
                key={preset.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setExerciseDuration(preset.work.toString());
                  setRestDuration(preset.rest.toString());
                  setNumberOfSets(preset.sets.toString());
                  setReadyDuration(preset.ready.toString());
                }}
                className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-lg p-4 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/30 transition-all duration-300 hover:scale-105 cursor-pointer text-left"
              >
                <div className="text-2xl mb-2">{preset.icon}</div>
                <div className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {preset.name}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {preset.description}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {preset.work}s work • {preset.rest}s rest • {preset.sets} sets
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Custom Configuration */}
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 dark:border-white/10">
          <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
            🛠️ Custom Workout
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-left text-gray-700 dark:text-gray-300">
                  🚀 Get Ready Duration (seconds)
                </label>
                <input
                  type="number"
                  value={readyDuration}
                  onChange={(e) => setReadyDuration(e.target.value)}
                  className="w-full px-4 py-3 text-center text-xl bg-white/10 dark:bg-black/20 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  min="0"
                  max="60"
                />
                <p className="text-xs text-gray-500 mt-1">Countdown before workout starts</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-left text-gray-700 dark:text-gray-300">
                  💪 Exercise Duration (seconds)
                </label>
                <input
                  type="number"
                  value={exerciseDuration}
                  onChange={(e) => setExerciseDuration(e.target.value)}
                  className="w-full px-4 py-3 text-center text-xl bg-white/10 dark:bg-black/20 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  min="1"
                  max="300"
                />
                <p className="text-xs text-gray-500 mt-1">Work period duration</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-left text-gray-700 dark:text-gray-300">
                  😤 Rest Duration (seconds)
                </label>
                <input
                  type="number"
                  value={restDuration}
                  onChange={(e) => setRestDuration(e.target.value)}
                  className="w-full px-4 py-3 text-center text-xl bg-white/10 dark:bg-black/20 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  min="1"
                  max="300"
                />
                <p className="text-xs text-gray-500 mt-1">Recovery period duration</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-left text-gray-700 dark:text-gray-300">
                  🔢 Number of Sets
                </label>
                <input
                  type="number"
                  value={numberOfSets}
                  onChange={(e) => setNumberOfSets(e.target.value)}
                  className="w-full px-4 py-3 text-center text-xl bg-white/10 dark:bg-black/20 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  min="1"
                  max="50"
                />
                <p className="text-xs text-gray-500 mt-1">Total number of exercise sets</p>
              </div>
            </div>
          </div>

          {/* Workout Preview */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              📊 Workout Preview
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-blue-700 dark:text-blue-300">
                  {Math.round(((parseInt(exerciseDuration) || 0) * (parseInt(numberOfSets) || 0) + 
                    (parseInt(restDuration) || 0) * Math.max(0, (parseInt(numberOfSets) || 0) - 1) + 
                    (parseInt(readyDuration) || 0)) / 60)}
                </div>
                <div className="text-blue-600 dark:text-blue-400">Total Minutes</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-700 dark:text-blue-300">
                  {(parseInt(exerciseDuration) || 0) * (parseInt(numberOfSets) || 0)}
                </div>
                <div className="text-blue-600 dark:text-blue-400">Work Seconds</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-700 dark:text-blue-300">
                  {(parseInt(restDuration) || 0) * Math.max(0, (parseInt(numberOfSets) || 0) - 1)}
                </div>
                <div className="text-blue-600 dark:text-blue-400">Rest Seconds</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-700 dark:text-blue-300">
                  {numberOfSets}
                </div>
                <div className="text-blue-600 dark:text-blue-400">Sets</div>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleStart}
            className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg font-medium text-xl hover:from-red-600 hover:to-pink-700 transition-colors cursor-pointer hover:scale-105"
          >
            START TRAINING 🚀
          </button>
        </div>

        {/* Training Tips */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
          <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">
            💡 Training Tips
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-purple-700 dark:text-purple-300">
            <div>
              <h4 className="font-medium mb-2">🏃 During Exercise</h4>
              <ul className="space-y-1 text-xs">
                <li>• Maintain proper form over speed</li>
                <li>• Breathe consistently throughout</li>
                <li>• Listen to your body</li>
                <li>• Stay hydrated</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🧘 During Rest</h4>
              <ul className="space-y-1 text-xs">
                <li>• Keep moving lightly</li>
                <li>• Focus on breathing</li>
                <li>• Prepare mentally for next set</li>
                <li>• Don't sit down completely</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const phaseInfo = getCurrentPhaseInfo();

  return (
    <div className="text-center space-y-8">
      {/* Current Phase Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${isReady ? 'ready' : isExercise ? 'work' : 'rest'}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className={`text-8xl font-black uppercase tracking-wider bg-gradient-to-r ${phaseInfo.bgGradient} bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]`}>
            {phaseInfo.title}
          </div>
          <div className="text-2xl text-gray-600 dark:text-gray-300">
            {phaseInfo.subtitle}
          </div>
          <div className="text-6xl">{phaseInfo.icon}</div>
        </motion.div>
      </AnimatePresence>

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
              className={`bg-gradient-to-r ${phaseInfo.bgGradient} h-3 rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Set Indicators */}
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalSets }, (_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full ${
                  i < currentSet - 1
                    ? 'bg-green-500'
                    : i === currentSet - 1
                    ? `bg-gradient-to-r ${phaseInfo.bgGradient}`
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Training Tips */}
      {phaseInfo.tips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-${phaseInfo.color}-50 dark:bg-${phaseInfo.color}-900/20 rounded-lg p-4 border border-${phaseInfo.color}-200 dark:border-${phaseInfo.color}-800 max-w-md mx-auto`}
        >
          <h3 className={`font-semibold text-${phaseInfo.color}-800 dark:text-${phaseInfo.color}-200 mb-2`}>
            💡 {isReady ? 'Get Ready' : isExercise ? 'Exercise Tips' : 'Rest Tips'}
          </h3>
          <ul className={`text-sm text-${phaseInfo.color}-700 dark:text-${phaseInfo.color}-300 space-y-1`}>
            {phaseInfo.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className={`text-${phaseInfo.color}-500 mt-0.5`}>•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </motion.div>
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
          onClick={skip}
          className="px-6 py-3 bg-yellow-500 text-white rounded-full font-medium hover:bg-yellow-600 transition-colors cursor-pointer hover:scale-105"
        >
          SKIP
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