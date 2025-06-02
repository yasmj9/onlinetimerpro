import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle,
  showBackButton = true,
  className = '',
  children
}) => {
  let navigate = useNavigate();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 ${className}`}
    >
      {/* Left side - Back button and title */}
      <div className="flex items-center gap-4">
        {showBackButton && (
          <motion.button
            onClick={()=>navigate(-1)}
            className="flex items-center gap-2 p-2 hover:bg-white/10 dark:hover:bg-black/20 rounded-lg transition-colors cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Go back to timer"
          >
            <motion.span 
              className="text-xl group-hover:translate-x-[-2px] transition-transform"
              initial={{ x: 0 }}
              whileHover={{ x: -2 }}
            >
              ←
            </motion.span>
            <span className="text-sm font-medium hidden sm:inline">
              Back to Timer
            </span>
          </motion.button>
        )}
        
        <div>
          <motion.h1 
            className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {title}
          </motion.h1>
          
          {subtitle && (
            <motion.p 
              className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </div>

      {/* Right side - Additional content */}
      {children && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2"
        >
          {children}
        </motion.div>
      )}
    </motion.header>
  );
};

// Breadcrumb component for complex navigation
interface BreadcrumbProps {
  items: Array<{
    label: string;
    onClick?: () => void;
    isActive?: boolean;
  }>;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-4" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="text-gray-400 dark:text-gray-600">→</span>
          )}
          
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className={`hover:text-blue-500 transition-colors cursor-pointer ${
                item.isActive 
                  ? 'text-blue-500 font-medium' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {item.label}
            </button>
          ) : (
            <span className={`${
              item.isActive 
                ? 'text-blue-500 font-medium' 
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// Enhanced PageHeader with breadcrumbs
interface EnhancedPageHeaderProps extends PageHeaderProps {
  breadcrumbs?: BreadcrumbProps['items'];
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

export const EnhancedPageHeader: React.FC<EnhancedPageHeaderProps> = ({
  title,
  subtitle,
  showBackButton = true,
  className = '',
  breadcrumbs,
  icon,
  actions,
  children
}) => {

    let navigate = useNavigate();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mb-8 ${className}`}
    >
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Breadcrumb items={breadcrumbs} />
        </motion.div>
      )}

      {/* Main header content */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left side */}
        <div className="flex items-start gap-4">
          {showBackButton && (
            <motion.button
              onClick={()=>navigate(-1)}
              className="flex items-center gap-2 p-2 hover:bg-white/10 dark:hover:bg-black/20 rounded-lg transition-colors cursor-pointer group mt-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Go back to timer"
            >
              <motion.span 
                className="text-xl group-hover:translate-x-[-2px] transition-transform"
                initial={{ x: 0 }}
                whileHover={{ x: -2 }}
              >
                ←
              </motion.span>
            </motion.button>
          )}
          
          <div className="flex items-start gap-3">
            {icon && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl mt-1"
              >
                {icon}
              </motion.div>
            )}
            
            <div>
              <motion.h1 
                className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {title}
              </motion.h1>
              
              {subtitle && (
                <motion.p 
                  className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base max-w-2xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {subtitle}
                </motion.p>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Actions and additional content */}
        {(actions || children) && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 mt-2 sm:mt-0"
          >
            {actions}
            {children}
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

// Quick action buttons for common page actions
interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const QuickAction: React.FC<QuickActionProps> = ({
  icon,
  label,
  onClick,
  variant = 'secondary',
  size = 'md'
}) => {
  const baseClasses = "flex items-center gap-2 rounded-lg font-medium transition-all cursor-pointer hover:scale-105";
  
  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-white/10 dark:bg-black/20 hover:bg-white/20 dark:hover:bg-black/30",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base"
  };

  return (
    <motion.button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </motion.button>
  );
};

export default PageHeader;