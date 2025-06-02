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
import { motion, AnimatePresence } from 'framer-motion';

type TimerMode = 'default' | 'countdown' | 'training';

const HomePage = () => {

    const { isAdBlockActive, isChecking } = useAdBlockDetector();
    const [currentMode, setCurrentMode] = useState<TimerMode>('default');

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
      default:
        return <DefaultTimer key="default" />;
    }
  };

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
          <div className="nav-glass flex gap-2 p-2">
            {(['default', 'countdown', 'training'] as TimerMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setCurrentMode(mode)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer hover:scale-105 ${
                  currentMode === mode
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-black/20'
                }`}
                aria-label={`Switch to ${mode} timer`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
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
          
          {/* Current Date Display */}
          <div className="mt-8">
            <CurrentDate />
          </div>
        </main>

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
