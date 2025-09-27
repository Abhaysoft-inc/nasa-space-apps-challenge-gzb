'use client';

import React from 'react';
import { motion } from 'framer-motion';

const StoryChoice = ({ 
  children, 
  onClick, 
  icon = "", 
  className = "",
  disabled = false 
}) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full p-4 mb-3 bg-gray-800/80 border border-gray-600 rounded-lg 
        hover:bg-gray-700/90 hover:border-blue-500 
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-300 text-left
        ${className}
      `}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <span className="text-2xl flex-shrink-0 mt-1">{icon}</span>
        )}
        <div className="flex-grow">
          {children}
        </div>
      </div>
    </motion.button>
  );
};

export default StoryChoice;