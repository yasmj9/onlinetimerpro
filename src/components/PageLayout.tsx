// components/PageLayout.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from './PageHeader';
import { Footer } from './Footer';
import { AdContainer } from './AdContainer';
import { useAdBlockDetector } from '../hooks/useAdBlockDetector';
import { Outlet } from 'react-router';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  showAds?: boolean;
  showFooter?: boolean;
  className?: string;
  headerActions?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  title='test',
  subtitle,
  showBackButton = true,
  showAds = false,
  showFooter = true,
  className = '',
  headerActions,
  maxWidth = '2xl'
}) => {
  const { isAdBlockActive } = useAdBlockDetector();

  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case 'sm': return 'max-w-2xl';
      case 'md': return 'max-w-4xl';
      case 'lg': return 'max-w-6xl';
      case 'xl': return 'max-w-7xl';
      case '2xl': return 'max-w-screen-2xl';
      case 'full': return 'max-w-full';
      default: return 'max-w-4xl';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900">
      {/* Top Ad Banner */}
      {showAds && !isAdBlockActive && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full flex justify-center py-4 bg-white/5 dark:bg-black/5 backdrop-blur-sm"
        >
          <AdContainer position="top" />
        </motion.div>
      )}

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={`flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 ${getMaxWidthClass()} ${className}`}
        >
          {/* Page Header */}
          <PageHeader
            title={title}
            subtitle={subtitle}
            showBackButton={showBackButton}
          >
            {headerActions}
          </PageHeader>

          {/* Main Content */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex-1"
            role="main"
            aria-labelledby="page-title"
          >
            <Outlet />
          </motion.main>
        </motion.div>
      </div>

      {/* Sidebar Ad (Desktop only) */}
      {showAds && !isAdBlockActive && (
        <AdContainer position="sidebar" />
      )}

      {/* Bottom Ad Banner */}
      {showAds && !isAdBlockActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="w-full flex justify-center py-4 bg-white/5 dark:bg-black/5 backdrop-blur-sm"
        >
          <AdContainer position="bottom" />
        </motion.div>
      )}

      {/* Footer */}
      {showFooter && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Footer />
        </motion.div>
      )}

    </div>
  );
};

export default PageLayout;