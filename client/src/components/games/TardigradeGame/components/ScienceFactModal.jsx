'use client';

import React from 'react';
import { motion } from 'framer-motion';

const ScienceFactModal = ({ fact, onClose }) => {
  if (!fact) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-gradient-to-br from-purple-900 to-blue-900 p-8 rounded-xl max-w-2xl border-2 border-purple-400/50 shadow-2xl"
      >
        <div className="text-center mb-6">
          <h3 className="text-3xl text-white font-bold mb-2 flex items-center justify-center">
            <span className="mr-3">🔬</span>
            Real Science Fact
          </h3>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full"></div>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-200 text-lg leading-relaxed mb-4">
            {fact.description}
          </p>
        </div>
        
        <div className="bg-black/50 rounded-lg p-6 mb-6 border border-purple-400/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-green-400 text-sm font-semibold mb-1">Research Source:</p>
              <p className="text-gray-300 text-sm">{fact.paperTitle}</p>
            </div>
            <div>
              <p className="text-blue-400 text-sm font-semibold mb-1">Published:</p>
              <p className="text-gray-300 text-sm">{fact.year}</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <span className="mr-2">🚀</span>
            Continue Mission
          </button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 text-purple-400/30 text-2xl">🧬</div>
        <div className="absolute bottom-4 left-4 text-blue-400/30 text-xl">⭐</div>
      </motion.div>
    </div>
  );
};

export default ScienceFactModal;