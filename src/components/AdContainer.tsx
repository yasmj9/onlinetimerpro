import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdBanner } from './AdBanner';

interface AdContainerProps {
  position: 'top' | 'bottom' | 'sidebar' | 'floating';
  showAfterDelay?: number;
  dismissible?: boolean;
  children?: React.ReactNode;
}

export const AdContainer: React.FC<AdContainerProps> = ({ 
  position, 
  showAfterDelay = 0,
  dismissible = false,
  children 
}) => {
  const [isVisible, setIsVisible] = useState(showAfterDelay === 0);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (showAfterDelay > 0) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, showAfterDelay);

      return () => clearTimeout(timer);
    }
  }, [showAfterDelay]);

  if (isDismissed || !isVisible) return null;

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'w-full mb-4';
      case 'bottom':
        return 'w-full mt-4';
      case 'sidebar':
        return 'fixed right-4 top-1/2 transform -translate-y-1/2 z-10 hidden lg:block';
      case 'floating':
        return 'fixed bottom-4 right-4 z-20';
      default:
        return '';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: position === 'top' ? -20 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: position === 'top' ? -20 : 20 }}
          transition={{ duration: 0.3 }}
          className={`ad-container ${getPositionClasses()}`}
        >
          {dismissible && (
            <button
              onClick={() => setIsDismissed(true)}
              className="absolute top-1 right-1 w-6 h-6 bg-gray-500/50 hover:bg-gray-500/70 rounded-full flex items-center justify-center text-white text-xs z-10"
              aria-label="Close advertisement"
            >
              ×
            </button>
          )}
          
          {children || <AdBanner position={position === 'floating' ? 'sidebar' : position} />}
        </motion.div>
      )}
    </AnimatePresence>
  );
};