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
          <div className="text-2xl">🐻</div>
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