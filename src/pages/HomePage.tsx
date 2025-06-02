import { CurrentDate } from '../components/CurrentDate';
import { Footer } from '../components/Footer';
import { AdBlockMessage } from '../components/AdBlockMessage';
import { AdContainer } from '../components/AdContainer';
import { useAdBlockDetector } from '../hooks/useAdBlockDetector';
import { useEffect, useState } from 'react';
import { useKeyboard } from '../hooks/useKeyboard';
import { loadAdSenseScript } from '../utils/adsense';
import { CountdownTimer } from '../components/CountdownTimer';
import { TrainingTimer } from '../components/TrainingTimer';
import { DefaultTimer } from '../components/DefaultTimer';
import { LaptopWorkTimer } from '../components/LaptopWorkTimer';
import { motion, AnimatePresence } from 'framer-motion';
import { MeditationTimer } from '../components/MeditationTimer';

type TimerMode = 'default' | 'countdown' | 'training' | 'laptop-work' | 'meditation';

const HomePage = () => {

    const { isAdBlockActive, isChecking } = useAdBlockDetector();
    const [currentMode, setCurrentMode] = useState<TimerMode>('training');

    // Initialize AdSense on app startup
    useEffect(() => {
        loadAdSenseScript();
    }, []);

    // Keyboard shortcuts for timer control
    useKeyboard({
        onSpace: () => {
        // TODO: Connect to active timer's start/pause functionality
        console.log('Space pressed - toggle timer');
        },
        onReset: () => {
        // TODO: Connect to active timer's reset functionality
        console.log('R pressed - reset timer');
        }
    });

  // Render appropriate timer based on current mode
  const renderTimer = () => {
    switch (currentMode) {
      case 'countdown':
        return <CountdownTimer key="countdown" />;
      case 'training':
        return <TrainingTimer key="training" />;
      case 'laptop-work':
        return <LaptopWorkTimer key="laptop-work" />;
      case 'meditation':
        return <MeditationTimer key="meditation" />;
      default:
        return <DefaultTimer key="default" />;
    }
  };

  // Timer mode configurations for the navigation
  const timerModes = [
    {
      key: 'default' as TimerMode,
      label: 'Clock',
      icon: '🕐',
      description: 'Digital clock display'
    },
    {
      key: 'countdown' as TimerMode,
      label: 'Countdown',
      icon: '⏲️',
      description: 'Simple countdown timer'
    },
    {
      key: 'training' as TimerMode,
      label: 'Training',
      icon: '🏋️',
      description: 'Workout intervals'
    },
    {
      key: 'laptop-work' as TimerMode,
      label: 'Laptop Work',
      icon: '💻',
      description: 'Work/break timer for computer users'
    },
    {
      key: 'meditation' as TimerMode,
      label: 'Meditation',
      icon: '🧘',
      description: 'Mindfulness and breathing exercises'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        
        {/* Ad Block Detection Warning */}
        {!isChecking && isAdBlockActive && (
          <div className="w-full max-w-4xl mb-6">
            <AdBlockMessage />
          </div>
        )}
        
        {/* Timer Mode Navigation */}
        <nav className="fixed top-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="nav-glass flex gap-1 p-2 max-w-fit overflow-x-auto">
            {timerModes.map((mode) => (
              <button
                key={mode.key}
                onClick={() => setCurrentMode(mode.key)}
                className={`group relative px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer hover:scale-105 whitespace-nowrap ${
                  currentMode === mode.key
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-black/20'
                }`}
                aria-label={`Switch to ${mode.label} timer - ${mode.description}`}
                title={mode.description}
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">{mode.icon}</span>
                  <span className="hidden sm:inline">{mode.label}</span>
                </span>
                
                {/* Tooltip for mobile */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none sm:hidden">
                  {mode.label}
                </div>
              </button>
            ))}
          </div>
        </nav>

        {/* Main Timer Display Area */}
        <main className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl mt-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="w-full"
            >
              {renderTimer()}
            </motion.div>
          </AnimatePresence>
          
          {/* Current Date Display - only show for default timer */}
          {currentMode === 'default' && (
            <div className="mt-8">
              <CurrentDate />
            </div>
          )}
        </main>

        {/* Timer Mode Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="fixed bottom-4 left-4 glass-card p-4 max-w-xs z-10 hidden lg:block"
        >
          <div className="text-center">
            <div className="text-2xl mb-2">
              {timerModes.find(m => m.key === currentMode)?.icon}
            </div>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {timerModes.find(m => m.key === currentMode)?.label} Timer
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {timerModes.find(m => m.key === currentMode)?.description}
            </div>
          </div>
        </motion.div>

        {/* Keyboard Shortcuts Help */}
        <div className="fixed bottom-4 right-4 glass-card p-3 z-10">
          <div className="text-center">
            <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              ⌨️ Shortcuts
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <div>Space: Start/Pause</div>
              <div>R: Reset</div>
            </div>
          </div>
        </div>
      </div>

      {/* Advertisement Containers */}
      {!isAdBlockActive && (
        <>
          {/* Bottom Banner Ad */}
          <div className="w-full flex justify-center pb-4">
            <AdContainer position="bottom" />
          </div>
          
          {/* Sidebar Ad (Desktop) */}
          <AdContainer position="sidebar" />
        </>
      )}

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default HomePage