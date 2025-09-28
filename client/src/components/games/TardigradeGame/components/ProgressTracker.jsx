'use client';

import React from 'react';
import { motion } from 'framer-motion';

const ProgressTracker = ({ gameState }) => {
  const chapters = [
    { id: 1, title: "Discovery", icon: "microscope", completed: gameState.chapter > 1 },
    { id: 2, title: "Testing", icon: "flask", completed: gameState.chapter > 2 },
    { id: 3, title: "Partnership", icon: "rocket", completed: gameState.chapter > 3 },
    { id: 4, title: "Space Mission", icon: "satellite", completed: gameState.chapter > 4 },
    { id: 5, title: "Applications", icon: "award", completed: gameState.chapter >= 5 }
  ];

  const getIcon = (iconName, isActive) => {
    const className = `w-6 h-6 ${isActive ? 'text-current' : 'text-gray-400'}`;
    
    switch(iconName) {
      case 'microscope':
        return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 2h8v2H8V2zm0 4h8v1.5l-2 2v4.17c1.16.41 2 1.52 2 2.83s-.84 2.42-2 2.83V20h2v2H8v-2h2v-.67c-1.16-.41-2-1.52-2-2.83s.84-2.42 2-2.83V9.5l-2-2V4z"/><circle cx="12" cy="15" r="3"/></svg>;
      case 'flask':
        return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 2v6h6V2h2v6.17c1.16.41 2 1.52 2 2.83s-.84 2.42-2 2.83V20h2v2H5v-2h2v-6.17c-1.16-.41-2-1.52-2-2.83s.84-2.42 2-2.83V2h2z"/></svg>;
      case 'rocket':
        return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
      case 'satellite':
        return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
      case 'award':
        return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/></svg>;
      default:
        return <div className={className}></div>;
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-black/90 backdrop-blur-sm rounded-full px-6 py-3 border border-purple-400/30">
        <div className="flex items-center space-x-4">
          {chapters.map((chapter, index) => (
            <React.Fragment key={chapter.id}>
              <div className={`flex flex-col items-center ${
                gameState.chapter === chapter.id ? 'scale-110' : 'scale-100'
              } transition-transform duration-300`}>
                <div className={`mb-1 ${
                  chapter.completed ? 'opacity-100' : 
                  gameState.chapter === chapter.id ? 'opacity-100 animate-pulse' : 'opacity-50'
                }`}>
                  {getIcon(chapter.icon, chapter.completed || gameState.chapter === chapter.id)}
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