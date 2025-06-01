import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.div
      className="fixed top-4 right-4 z-20"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-full border border-white/20 dark:border-white/10 p-1">
        <button
          onClick={toggleTheme}
          className="relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
          style={{
            backgroundColor: isDark ? '#374151' : '#f3f4f6'
          }}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          {/* Switch Toggle */}
          <motion.div
            className="h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 flex items-center justify-center"
            animate={{
              x: isDark ? 32 : 2
            }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
          </motion.div>
          
          {/* Background Icons */}
          <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
            <span className={`text-xs transition-opacity duration-300 ${!isDark ? 'opacity-100' : 'opacity-40'}`}>
              ☀️
            </span>
            <span className={`text-xs transition-opacity duration-300 ${isDark ? 'opacity-100' : 'opacity-40'}`}>
              🌙
            </span>
          </div>
        </button>
        
        {/* Label */}
        <div className="text-xs text-center mt-1 text-gray-600 dark:text-gray-400 font-medium">
          {isDark ? 'Dark' : 'Light'}
        </div>
      </div>
    </motion.div>
  );
};

export default ThemeToggle;