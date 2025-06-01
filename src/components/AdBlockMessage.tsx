import React from 'react';
import { motion } from 'framer-motion';

export const AdBlockMessage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 m-4"
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <span className="text-2xl">🛡️</span>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Ad Blocker Detected
          </h3>
          <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
            <p>
              We noticed you're using an ad blocker. This free timer app is supported by ads. 
              Please consider disabling your ad blocker or supporting us in other ways.
            </p>
          </div>
          <div className="mt-4">
            <div className="flex space-x-2">
              <button
                onClick={() => window.location.reload()}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm font-medium"
              >
                Refresh Page
              </button>
              <a
                href="#"
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium"
              >
                Support Us ❤️
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};