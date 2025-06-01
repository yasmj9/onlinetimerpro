import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from './components/Layout';
import { DefaultTimer } from './components/DefaultTimer';
import { CountdownTimer } from './components/CountdownTimer';
import { TrainingTimer } from './components/TrainingTimer';
import { CurrentDate } from './components/CurrentDate';
import { Footer } from './components/Footer';
import { PageLayout } from './components/PageLayout';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { AboutUs } from './pages/AboutUs';
import { ContactUs } from './pages/ContactUs';
import { SEOHead } from './components/SEOHead';
import { useKeyboard } from './hooks/useKeyboard';
import { useAdBlockDetector } from './hooks/useAdBlockDetector';
import { useRouter, PageType } from './hooks/useRouter';
import { loadAdSenseScript } from './utils/adsense';
import { AdBlockMessage } from './components/AdBlockMessage';
import { AdContainer } from './components/AdContainer';

type TimerMode = 'default' | 'countdown' | 'training';

function App() {
  const [currentMode, setCurrentMode] = useState<TimerMode>('default');
  const { isAdBlockActive, isChecking } = useAdBlockDetector();
  const { currentPage, navigate } = useRouter();

  // Load AdSense script on app start
  useEffect(() => {
    loadAdSenseScript();
  }, []);

  // Handle browser back/forward buttons and initial URL
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const page = path === '/' ? 'home' : path.slice(1) as PageType;
      navigate(page);
    };

    window.addEventListener('popstate', handlePopState);
    
    // Set initial page based on URL
    const initialPath = window.location.pathname;
    const initialPage = initialPath === '/' ? 'home' : initialPath.slice(1) as PageType;
    if (initialPage !== 'home') {
      navigate(initialPage);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  useKeyboard({
    onSpace: () => {
      // Handle space key for active timer
      // This could be enhanced to actually control the active timer
    },
    onReset: () => {
      // Handle reset for active timer
      // This could be enhanced to actually reset the active timer
    }
  });

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

  const renderHomePage = () => (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        {/* Ad Block Detection Message */}
        {!isChecking && isAdBlockActive && (
          <div className="w-full max-w-4xl mb-6">
            <AdBlockMessage />
          </div>
        )}
        
        {/* Navigation - Fixed position */}
        <nav className="fixed top-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex gap-2 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-full p-2 shadow-lg">
            {(['default', 'countdown', 'training'] as TimerMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setCurrentMode(mode)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer hover:scale-105 ${
                  currentMode === mode
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-white/20'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </nav>

        {/* Timer Display - Centered with proper spacing from nav */}
        <main className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl mt-20">
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
          
          <CurrentDate />
        </main>

        {/* Keyboard Shortcuts Info */}
        <div className="fixed bottom-4 right-4 text-xs text-gray-500 dark:text-gray-400 z-10 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-lg p-2">
          <div className="text-center">
            <div>⌨️ Shortcuts</div>
            <div>Space: Start/Pause</div>
            <div>R: Reset</div>
          </div>
        </div>
      </div>

      {/* Bottom Ad Banner */}
      {!isAdBlockActive && (
        <div className="w-full flex justify-center pb-4">
          <AdContainer position="bottom" />
        </div>
      )}

      {/* Sidebar Ad (Desktop only) */}
      {!isAdBlockActive && (
        <AdContainer position="sidebar" />
      )}

      {/* Floating Ad (appears after 30 seconds, dismissible) */}
      {!isAdBlockActive && (
        <AdContainer 
          position="floating" 
          showAfterDelay={30000}
          dismissible={true}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'privacy':
        return (
          <PageLayout title="Privacy Policy" showBackButton={true}>
            <PrivacyPolicy />
          </PageLayout>
        );
      case 'terms':
        return (
          <PageLayout title="Terms of Service" showBackButton={true}>
            <TermsOfService />
          </PageLayout>
        );
      case 'about':
        return (
          <PageLayout title="About VClock" showBackButton={true}>
            <AboutUs />
          </PageLayout>
        );
      case 'contact':
        return (
          <PageLayout title="Contact Us" showBackButton={true}>
            <ContactUs />
          </PageLayout>
        );
      default:
        return renderHomePage();
    }
  };

  return (
    <Layout>
      {/* SEO Head component for dynamic meta tags */}
      <SEOHead page={currentPage} />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="min-h-screen"
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

export default App;