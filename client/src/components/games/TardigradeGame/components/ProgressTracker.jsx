'use client';

import React from 'react';
import { motion } from 'framer-motion';

const ProgressTracker = ({ gameState }) => {
  const chapters = [
    { id: 1, title: "Discovery", icon: "🔬", completed: gameState.chapter > 1 },
    { id: 2, title: "Testing", icon: "🧪", completed: gameState.chapter > 2 },
    { id: 3, title: "Partnership", icon: "🚀", completed: gameState.chapter > 3 },
    { id: 4, title: "Space Mission", icon: "🛰️", completed: gameState.chapter > 4 },
    { id: 5, title: "Applications", icon: "🏆", completed: gameState.chapter >= 5 }
  ];

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-black/90 backdrop-blur-sm rounded-full px-6 py-3 border border-purple-400/30">
        <div className="flex items-center space-x-4">
          {chapters.map((chapter, index) => (
            <React.Fragment key={chapter.id}>
              <div className={`flex flex-col items-center ${
                gameState.chapter === chapter.id ? 'scale-110' : 'scale-100'
              } transition-transform duration-300`}>
                <div className={`text-2xl mb-1 ${
                  chapter.completed ? 'opacity-100' : 
                  gameState.chapter === chapter.id ? 'opacity-100 animate-pulse' : 'opacity-50'
                }`}>
                  {chapter.icon}
                </div>
                <div className={`text-xs ${
                  chapter.completed ? 'text-green-400' :
                  gameState.chapter === chapter.id ? 'text-yellow-400' : 'text-gray-500'
                }`}>
                  {chapter.title}
                </div>
                {chapter.completed && (
                  <div className="text-xs text-green-400">✓</div>
                )}
              </div>
              
              {index < chapters.length - 1 && (
                <div className={`w-8 h-0.5 ${
                  chapter.completed ? 'bg-green-400' : 'bg-gray-600'
                } transition-colors duration-300`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;