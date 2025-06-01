import React from 'react';
import { motion } from 'framer-motion';
import { useTimer } from '../hooks/useTimer';
import { formatDate } from '../utils/time';

export const CurrentDate: React.FC = () => {
  const time = useTimer();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-8 text-xl text-gray-600 dark:text-gray-300 font-medium"
    >
      {formatDate(time)}
    </motion.div>
  );
};