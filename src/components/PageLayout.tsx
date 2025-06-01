// components/PageLayout.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from './PageHeader';
import { Footer } from './Footer';
import { AdContainer } from './AdContainer';
import { useAdBlockDetector } from '../hooks/useAdBlockDetector';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  showAds?: boolean;
  showFooter?: boolean;
  className?: string;
  children: React.ReactNode;
  headerActions?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  subtitle,
  showBackButton = true,
  showAds = true,
  showFooter = true,
  className = '',
  children,
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
            {children}
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

      {/* Floating Ad (if ads enabled) */}
      {showAds && !isAdBlockActive && (
        <AdContainer 
          position="floating" 
          showAfterDelay={45000} // 45 seconds for pages
          dismissible={true}
        />
      )}
    </div>
  );
};

// Specialized layout for legal pages
interface LegalPageLayoutProps {
  title: string;
  lastUpdated?: Date;
  children: React.ReactNode;
}

export const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({
  title,
  lastUpdated = new Date(),
  children
}) => {
  return (
    <PageLayout
      title={title}
      subtitle={`Last updated: ${lastUpdated.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`}
      maxWidth="lg"
      showAds={true}
    >
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-xl p-8 md:p-12 border border-white/20 dark:border-white/10 shadow-lg"
        >
          {children}
        </motion.div>
      </div>
    </PageLayout>
  );
};

// Specialized layout for forms and interactive pages
interface FormPageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  showProgress?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

export const FormPageLayout: React.FC<FormPageLayoutProps> = ({
  title,
  subtitle,
  children,
  sidebar,
  showProgress = false,
  currentStep = 1,
  totalSteps = 1
}) => {
  return (
    <PageLayout
      title={title}
      subtitle={subtitle}
      maxWidth="xl"
      showAds={false} // No ads on form pages for better UX
    >
      {/* Progress Bar */}
      {showProgress && totalSteps > 1 && (
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: '100%' }}
          className="mb-8"
        >
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}% complete</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
            />
          </div>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className={sidebar ? 'lg:col-span-2' : 'lg:col-span-3'}
        >
          {children}
        </motion.div>

        {/* Sidebar */}
        {sidebar && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-8">
              {sidebar}
            </div>
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
};

// Specialized layout for content-heavy pages like About
interface ContentPageLayoutProps {
  title: string;
  subtitle?: string;
  heroImage?: string;
  children: React.ReactNode;
  tableOfContents?: Array<{ id: string; title: string; level: number }>;
}

export const ContentPageLayout: React.FC<ContentPageLayoutProps> = ({
  title,
  subtitle,
  heroImage,
  children,
  tableOfContents
}) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <PageLayout
      title={title}
      subtitle={subtitle}
      maxWidth="xl"
      showAds={true}
    >
      {/* Hero Image */}
      {heroImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12 rounded-2xl overflow-hidden shadow-2xl"
        >
          <img
            src={heroImage}
            alt={title}
            className="w-full h-64 md:h-80 object-cover"
          />
        </motion.div>
      )}

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Table of Contents */}
        {tableOfContents && tableOfContents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-8">
              <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/20 dark:border-white/10">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Table of Contents
                </h3>
                <nav className="space-y-2">
                  {tableOfContents.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors hover:bg-white/10 dark:hover:bg-black/20 ${
                        item.level === 1 
                          ? 'font-medium text-gray-800 dark:text-gray-200' 
                          : 'text-gray-600 dark:text-gray-400 ml-4'
                      }`}
                    >
                      {item.title}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={tableOfContents ? 'lg:col-span-3' : 'lg:col-span-4'}
        >
          {children}
        </motion.div>
      </div>
    </PageLayout>
  );
};

// Error page layout
interface ErrorPageLayoutProps {
  errorCode: number;
  errorMessage: string;
  description?: string;
  actionButton?: {
    text: string;
    onClick: () => void;
  };
}

export const ErrorPageLayout: React.FC<ErrorPageLayoutProps> = ({
  errorCode,
  errorMessage,
  description,
  actionButton
}) => {
  return (
    <PageLayout
      title={`Error ${errorCode}`}
      showBackButton={true}
      showAds={false}
      maxWidth="md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-16"
      >
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300 dark:text-gray-600 mb-4">
            {errorCode}
          </h1>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            {errorMessage}
          </h2>
          {description && (
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {actionButton && (
          <motion.button
            onClick={actionButton.onClick}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all cursor-pointer hover:scale-105 transform"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {actionButton.text}
          </motion.button>
        )}
      </motion.div>
    </PageLayout>
  );
};

// Loading page layout
export const LoadingPageLayout: React.FC = () => {
  return (
    <PageLayout
      title="Loading..."
      showBackButton={false}
      showAds={false}
      showFooter={false}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center py-32"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Loading page content...
          </p>
        </div>
      </motion.div>
    </PageLayout>
  );
};

export default PageLayout;