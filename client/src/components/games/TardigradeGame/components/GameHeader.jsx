'use client';

import React from 'react';
import { motion } from 'framer-motion';

const GameHeader = ({ gameState }) => {
  const getChapterTitle = (chapter) => {
    switch (chapter) {
      case 1: return "Discovery in the Lab";
      case 2: return "Extreme Testing";
      case 3: return "NASA Partnership";
      case 4: return "Space Mission";
      case 5: return "Future Applications";
      default: return "The Tardigrade Story";
    }
  };

  return (
    <div className="bg-black/90 backdrop-blur-sm border-b border-purple-400/30 p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93C7.05 19.44 3 15.08 3 10c0-.55.45-1 1-1s1 .45 1 1c0 3.86 3.14 7 7 7 .55 0 1 .45 1 1s-.45 1-1 1z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Tardigrade: Ultimate Survivors</h2>
            <p className="text-sm text-gray-400">
              Chapter {gameState.chapter}: {getChapterTitle(gameState.chapter)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400">{gameState.researchPoints}</div>
            <div className="text-xs text-gray-400">Research Points</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">{gameState.discoveries.length}</div>
            <div className="text-xs text-gray-400">Discoveries</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-purple-400">{gameState.tardigradesSurvived}%</div>
            <div className="text-xs text-gray-400">Best Survival</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;