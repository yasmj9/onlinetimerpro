import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLaptopWorkTimer } from '../hooks/useLaptopWorkTimer';
import { formatDuration } from '../utils/time';

export const LaptopWorkTimer: React.FC = () => {
  const [workDuration, setWorkDuration] = useState('25');
  const [shortBreakDuration, setShortBreakDuration] = useState('5');
  const [longBreakDuration, setLongBreakDuration] = useState('15');
  const [sessionsUntilLongBreak, setSessionsUntilLongBreak] = useState('4');
  
  const {
    config,
    currentSession,
    totalSessions,
    completedSessions,
    isWork,
    isShortBreak,
    isLongBreak,
    timeLeft,
    isRunning,
    isComplete,
    progress,
    start,
    pause,
    resume,
    reset,
    skip
  } = useLaptopWorkTimer();

  const handleStart = () => {
    start({
      workDuration: parseInt(workDuration) || 25,
      shortBreakDuration: parseInt(shortBreakDuration) || 5,
      longBreakDuration: parseInt(longBreakDuration) || 15,
      sessionsUntilLongBreak: parseInt(sessionsUntilLongBreak) || 4,
    });
  };

  const getCurrentPhaseInfo = () => {
    if (isWork) {
      return {
        title: 'WORK TIME',
        subtitle: 'Focus on your tasks',
        icon: '💻',
        color: 'blue',
        bgGradient: 'from-blue-500 to-indigo-600',
        tips: [
          'Keep your back straight',
          'Eyes 20 inches from screen',
          'Take micro-breaks to blink',
          'Stay hydrated'
        ]
      };
    } else if (isShortBreak) {
      return {
        title: 'SHORT BREAK',
        subtitle: 'Rest your eyes and stretch',
        icon: '☕',
        color: 'green',
        bgGradient: 'from-green-500 to-emerald-600',
        tips: [
          'Look at something 20 feet away',
          'Stretch your neck and shoulders',
          'Stand up and walk around',
          'Do some deep breathing'
        ]
      };
    } else if (isLongBreak) {
      return {
        title: 'LONG BREAK',
        subtitle: 'Take a proper rest',
        icon: '🧘',
        color: 'purple',
        bgGradient: 'from-purple-500 to-violet-600',
        tips: [
          'Step away from your workspace',
          'Get some fresh air if possible',
          'Do light exercises or stretches',
          'Grab a healthy snack'
        ]
      };
    }
    return {
      title: 'READY',
      subtitle: 'Prepare to start working',
      icon: '🚀',
      color: 'yellow',
      bgGradient: 'from-yellow-500 to-orange-600',
      tips: []
    };
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
          Work Session Complete!
        </div>
        <div className="text-xl text-gray-600 dark:text-gray-300">
          You completed {completedSessions} work sessions
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
          <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
            Great job! 👏
          </h3>
          <p className="text-green-700 dark:text-green-300 text-sm">
            You've been productive while taking care of your health. 
            Regular breaks help maintain focus and prevent eye strain.
          </p>
        </div>
        <button
          onClick={reset}
          className="px-8 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors cursor-pointer hover:scale-105"
        >
          START NEW SESSION
        </button>
      </motion.div>
    );
  }

  if (!config) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8 max-w-2xl mx-auto"
      >
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            💻 Laptop Work Timer
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Designed to help laptop users maintain productivity while protecting their health through regular breaks
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-left">
                💼 Work Duration (minutes)
              </label>
              <input
                type="number"
                value={workDuration}
                onChange={(e) => setWorkDuration(e.target.value)}
                className="w-full px-4 py-3 text-center text-xl bg-white/10 dark:bg-black/20 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                min="1"
                max="60"
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: 25-45 minutes</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-left">
                ☕ Short Break (minutes)
              </label>
              <input
                type="number"
                value={shortBreakDuration}
                onChange={(e) => setShortBreakDuration(e.target.value)}
                className="w-full px-4 py-3 text-center text-xl bg-white/10 dark:bg-black/20 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                min="1"
                max="30"
              />
              <p className="text-xs text-gray-500 mt-1">Quick eye and posture break</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-left">
                🧘 Long Break (minutes)
              </label>
              <input
                type="number"
                value={longBreakDuration}
                onChange={(e) => setLongBreakDuration(e.target.value)}
                className="w-full px-4 py-3 text-center text-xl bg-white/10 dark:bg-black/20 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                min="1"
                max="60"
              />
              <p className="text-xs text-gray-500 mt-1">Extended rest period</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-left">
                🔢 Work Sessions Until Long Break
              </label>
              <input
                type="number"
                value={sessionsUntilLongBreak}
                onChange={(e) => setSessionsUntilLongBreak(e.target.value)}
                className="w-full px-4 py-3 text-center text-xl bg-white/10 dark:bg-black/20 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                min="1"
                max="10"
              />
              <p className="text-xs text-gray-500 mt-1">Cycles before extended break</p>
            </div>
          </div>
        </div>

        {/* Health Tips */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
            💡 Why Use This Timer?
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
            <div>
              <h4 className="font-medium mb-2">👀 Eye Health</h4>
              <ul className="space-y-1 text-xs">
                <li>• Prevents digital eye strain</li>
                <li>• Reduces dry eyes</li>
                <li>• Follows 20-20-20 rule</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🏃 Physical Health</h4>
              <ul className="space-y-1 text-xs">
                <li>• Prevents neck/back pain</li>
                <li>• Improves circulation</li>
                <li>• Reduces repetitive strain</li>
              </ul>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleStart}
          className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium text-xl hover:from-blue-600 hover:to-purple-700 transition-colors cursor-pointer hover:scale-105"
        >
          START WORK SESSION
        </button>
      </motion.div>
    );
  }

  const phaseInfo = getCurrentPhaseInfo();

  return (
    <div className="text-center space-y-8">
      {/* Current Phase Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${isWork ? 'work' : isShortBreak ? 'short' : 'long'}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className={`text-8xl font-black uppercase tracking-wider bg-gradient-to-r ${phaseInfo.bgGradient} bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]`}>
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
        key={`${currentSession}-${isWork ? 'work' : isShortBreak ? 'short' : 'long'}`}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        className="text-6xl font-mono font-bold"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {formatDuration(timeLeft)}
      </motion.div>

      {/* Session Progress */}
      <div className="space-y-4">
        <div className="text-xl font-medium">
          Session {currentSession} of {totalSessions}
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

        {/* Session Indicators */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalSessions }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < completedSessions
                  ? 'bg-green-500'
                  : i === currentSession - 1
                  ? `bg-gradient-to-r ${phaseInfo.bgGradient}`
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Health Tips */}
      {phaseInfo.tips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-${phaseInfo.color}-50 dark:bg-${phaseInfo.color}-900/20 rounded-lg p-4 border border-${phaseInfo.color}-200 dark:border-${phaseInfo.color}-800 max-w-md mx-auto`}
        >
          <h3 className={`font-semibold text-${phaseInfo.color}-800 dark:text-${phaseInfo.color}-200 mb-2`}>
            💡 {isWork ? 'Work Tips' : 'Break Tips'}
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
        {isWork 
          ? `Work time: ${formatDuration(timeLeft)}. Session ${currentSession} of ${totalSessions}.`
          : `${isShortBreak ? 'Short break' : 'Long break'}: ${formatDuration(timeLeft)}. Session ${currentSession} of ${totalSessions}.`
        }
      </div>
    </div>
  );
};