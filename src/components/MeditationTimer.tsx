import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMeditationTimer } from '../hooks/useMeditationTimer';
import { formatDuration } from '../utils/time';

export const MeditationTimer: React.FC = () => {
  const [meditationDuration, setMeditationDuration] = useState('10');
  const [preparationTime, setPreparationTime] = useState('30');
  const [bellInterval, setBellInterval] = useState('0');
  const [sessionType, setSessionType] = useState<'guided' | 'silent' | 'breathing'>('silent');
  
  const { 
    config,
    currentPhase,
    timeLeft,
    totalDuration,
    isRunning,
    isComplete,
    progress,
    breathingPhase,
    breathingCycle,
    start,
    pause,
    resume,
    reset
  } = useMeditationTimer();

  const handleStart = () => {
    start({
      meditationDuration: parseInt(meditationDuration) || 10,
      preparationTime: parseInt(preparationTime) || 30,
      bellInterval: parseInt(bellInterval) || 0,
      sessionType
    });
  };

  const getCurrentPhaseInfo = () => {
    switch (currentPhase) {
      case 'preparation':
        return {
          title: 'PREPARE',
          subtitle: 'Find your comfortable position',
          icon: '🧘',
          color: 'blue',
          bgGradient: 'from-blue-500 to-indigo-600',
          tips: [
            'Sit comfortably with back straight',
            'Close your eyes or soften your gaze',
            'Take a few deep breaths',
            'Set your intention for this session'
          ]
        };
      case 'meditation':
        if (sessionType === 'breathing') {
          return {
            title: breathingPhase === 'inhale' ? 'BREATHE IN' : breathingPhase === 'hold' ? 'HOLD' : 'BREATHE OUT',
            subtitle: `Breathing cycle ${breathingCycle}`,
            icon: breathingPhase === 'inhale' ? '🌬️' : breathingPhase === 'hold' ? '⏸️' : '🌊',
            color: breathingPhase === 'inhale' ? 'green' : breathingPhase === 'hold' ? 'yellow' : 'blue',
            bgGradient: breathingPhase === 'inhale' 
              ? 'from-green-500 to-emerald-600' 
              : breathingPhase === 'hold'
              ? 'from-yellow-500 to-orange-600'
              : 'from-blue-500 to-cyan-600',
            tips: [
              breathingPhase === 'inhale' ? 'Slowly fill your lungs' : 
              breathingPhase === 'hold' ? 'Hold gently without strain' : 
              'Release completely and relax'
            ]
          };
        }
        return {
          title: 'MEDITATE',
          subtitle: 'Be present in this moment',
          icon: '☯️',
          color: 'purple',
          bgGradient: 'from-purple-500 to-violet-600',
          tips: [
            'Notice your breath naturally',
            'Let thoughts come and go',
            'Return focus to the present',
            'Be kind to yourself'
          ]
        };
      case 'complete':
        return {
          title: 'COMPLETE',
          subtitle: 'Your meditation is finished',
          icon: '✨',
          color: 'green',
          bgGradient: 'from-green-500 to-emerald-600',
          tips: []
        };
      default:
        return {
          title: 'READY',
          subtitle: 'Prepare to begin',
          icon: '🕉️',
          color: 'indigo',
          bgGradient: 'from-indigo-500 to-purple-600',
          tips: []
        };
    }
  };

  // Meditation presets
  const meditationPresets = [
    {
      name: 'Quick Focus',
      icon: '⚡',
      duration: 5,
      prep: 15,
      bell: 0,
      type: 'silent' as const,
      description: 'Short mindfulness session'
    },
    {
      name: 'Daily Practice',
      icon: '🌅',
      duration: 10,
      prep: 30,
      bell: 0,
      type: 'silent' as const,
      description: 'Perfect for daily routine'
    },
    {
      name: 'Deep Session',
      icon: '🌊',
      duration: 20,
      prep: 60,
      bell: 300,
      type: 'silent' as const,
      description: 'Extended mindfulness'
    },
    {
      name: 'Breath Work',
      icon: '🌬️',
      duration: 15,
      prep: 30,
      bell: 0,
      type: 'breathing' as const,
      description: '4-7-8 breathing technique'
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
          ✨
        </motion.div>
        <div className="text-4xl font-bold text-purple-500">
          Session Complete
        </div>
        <div className="text-xl text-gray-600 dark:text-gray-300">
          You meditated for {Math.round((config?.meditationDuration || 0))} minutes
        </div>
        
        {/* Completion Card */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800 max-w-md mx-auto">
          <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">
            🙏 Well Done
          </h3>
          <p className="text-purple-700 dark:text-purple-300 text-sm mb-4">
            You've taken time to nurture your mind and find inner peace. 
            Regular meditation brings clarity, reduces stress, and improves well-being.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-purple-700 dark:text-purple-300">
                {config?.meditationDuration}
              </div>
              <div className="text-purple-600 dark:text-purple-400">Minutes</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-purple-700 dark:text-purple-300">
                {sessionType === 'breathing' ? breathingCycle : '∞'}
              </div>
              <div className="text-purple-600 dark:text-purple-400">
                {sessionType === 'breathing' ? 'Breaths' : 'Mindful'}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={reset}
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full font-medium hover:from-purple-600 hover:to-indigo-700 transition-colors cursor-pointer hover:scale-105"
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
        className="text-center space-y-8 max-w-4xl mx-auto"
      >
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
            🧘 Meditation Timer
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Create peaceful moments of mindfulness, breathing exercises, and inner reflection
          </p>
        </div>

        {/* Session Type Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            🎯 Meditation Style
          </h3>
          <div className="flex justify-center gap-4 mb-6">
            {[
              { key: 'silent', label: 'Silent', icon: '🤫', desc: 'Traditional mindfulness' },
              { key: 'guided', label: 'Guided', icon: '🗣️', desc: 'With gentle guidance' },
              { key: 'breathing', label: 'Breathing', icon: '🌬️', desc: '4-7-8 breath work' }
            ].map((type) => (
              <button
                key={type.key}
                onClick={() => setSessionType(type.key as any)}
                className={`p-4 rounded-lg transition-all cursor-pointer hover:scale-105 ${
                  sessionType === type.key
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/30'
                }`}
              >
                <div className="text-2xl mb-1">{type.icon}</div>
                <div className="font-medium text-sm">{type.label}</div>
                <div className="text-xs opacity-75">{type.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            ⚡ Quick Start
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {meditationPresets.map((preset, index) => (
              <motion.button
                key={preset.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setMeditationDuration(preset.duration.toString());
                  setPreparationTime(preset.prep.toString());
                  setBellInterval(preset.bell.toString());
                  setSessionType(preset.type);
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
                  {preset.duration}min • {preset.type}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Custom Configuration */}
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 dark:border-white/10">
          <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
            🛠️ Custom Session
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-left text-gray-700 dark:text-gray-300">
                  🧘 Meditation Duration (minutes)
                </label>
                <input
                  type="number"
                  value={meditationDuration}
                  onChange={(e) => setMeditationDuration(e.target.value)}
                  className="w-full px-4 py-3 text-center text-xl bg-white/10 dark:bg-black/20 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  min="1"
                  max="120"
                />
                <p className="text-xs text-gray-500 mt-1">Main meditation time</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-left text-gray-700 dark:text-gray-300">
                  🕉️ Preparation Time (seconds)
                </label>
                <input
                  type="number"
                  value={preparationTime}
                  onChange={(e) => setPreparationTime(e.target.value)}
                  className="w-full px-4 py-3 text-center text-xl bg-white/10 dark:bg-black/20 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  min="0"
                  max="300"
                />
                <p className="text-xs text-gray-500 mt-1">Time to settle before meditation</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-left text-gray-700 dark:text-gray-300">
                  🔔 Bell Interval (seconds)
                </label>
                <input
                  type="number"
                  value={bellInterval}
                  onChange={(e) => setBellInterval(e.target.value)}
                  className="w-full px-4 py-3 text-center text-xl bg-white/10 dark:bg-black/20 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  min="0"
                  max="600"
                />
                <p className="text-xs text-gray-500 mt-1">0 = no bells during meditation</p>
              </div>

              {/* Session Preview */}
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                  📊 Session Preview
                </h4>
                <div className="text-sm text-purple-700 dark:text-purple-300">
                  <div>Total Time: {Math.round((parseInt(meditationDuration) || 0) + (parseInt(preparationTime) || 0) / 60)} minutes</div>
                  <div>Style: {sessionType.charAt(0).toUpperCase() + sessionType.slice(1)}</div>
                  {parseInt(bellInterval) > 0 && (
                    <div>Bells: Every {bellInterval} seconds</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleStart}
            className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-medium text-xl hover:from-purple-600 hover:to-indigo-700 transition-colors cursor-pointer hover:scale-105"
          >
            BEGIN MEDITATION 🕉️
          </button>
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-indigo-200 dark:border-indigo-800">
          <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-3">
            🌟 Benefits of Meditation
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-indigo-700 dark:text-indigo-300">
            <div>
              <h4 className="font-medium mb-2">🧠 Mental</h4>
              <ul className="space-y-1 text-xs">
                <li>• Reduces stress and anxiety</li>
                <li>• Improves focus and concentration</li>
                <li>• Enhances emotional well-being</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">💚 Physical</h4>
              <ul className="space-y-1 text-xs">
                <li>• Lowers blood pressure</li>
                <li>• Improves sleep quality</li>
                <li>• Boosts immune system</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">✨ Spiritual</h4>
              <ul className="space-y-1 text-xs">
                <li>• Increases self-awareness</li>
                <li>• Promotes inner peace</li>
                <li>• Develops mindfulness</li>
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
          key={`${currentPhase}-${breathingPhase}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className={`text-8xl font-black uppercase tracking-wider bg-gradient-to-r ${phaseInfo.bgGradient} bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]`}>
            {phaseInfo.title}
          </div>
          <div className="text-2xl text-gray-600 dark:text-gray-300">
            {phaseInfo.subtitle}
          </div>
          <motion.div 
            className="text-6xl"
            animate={sessionType === 'breathing' && currentPhase === 'meditation' ? {
              scale: breathingPhase === 'inhale' ? [1, 1.2] : breathingPhase === 'exhale' ? [1.2, 1] : [1, 1]
            } : {}}
            transition={{ duration: breathingPhase === 'hold' ? 0 : 4, ease: "easeInOut" }}
          >
            {phaseInfo.icon}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Timer Display */}
      <motion.div
        key={currentPhase}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        className="text-6xl font-mono font-bold"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {formatDuration(timeLeft)}
      </motion.div>

      {/* Progress */}
      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="w-full max-w-md mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <motion.div
            className={`bg-gradient-to-r ${phaseInfo.bgGradient} h-3 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="text-lg text-gray-600 dark:text-gray-400">
          {currentPhase === 'preparation' ? 'Preparing...' : 
           currentPhase === 'meditation' ? 
           (sessionType === 'breathing' ? `Cycle ${breathingCycle}` : 'Meditating...') : 
           'Complete'}
        </div>
      </div>

      {/* Meditation Tips */}
      {phaseInfo.tips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-${phaseInfo.color}-50 dark:bg-${phaseInfo.color}-900/20 rounded-lg p-4 border border-${phaseInfo.color}-200 dark:border-${phaseInfo.color}-800 max-w-md mx-auto`}
        >
          <h3 className={`font-semibold text-${phaseInfo.color}-800 dark:text-${phaseInfo.color}-200 mb-2`}>
            💡 {currentPhase === 'preparation' ? 'Getting Ready' : 
                 sessionType === 'breathing' ? 'Breathing Guide' : 
                 'Meditation Guide'}
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
          className="px-6 py-3 bg-purple-500 text-white rounded-full font-medium hover:bg-purple-600 transition-colors cursor-pointer hover:scale-105"
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
        {currentPhase === 'preparation' 
          ? `Preparation: ${formatDuration(timeLeft)}`
          : currentPhase === 'meditation'
          ? sessionType === 'breathing' 
            ? `${breathingPhase}: ${formatDuration(timeLeft)}. Cycle ${breathingCycle}.`
            : `Meditation: ${formatDuration(timeLeft)}`
          : 'Meditation complete'
        }
      </div>
    </div>
  );
};