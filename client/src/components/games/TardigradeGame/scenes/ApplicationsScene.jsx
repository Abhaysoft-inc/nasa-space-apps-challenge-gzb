'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ApplicationsScene = ({ onChoice, gameState }) => {
  const [selectedApplication, setSelectedApplication] = useState(null);
  
  const missionPath = gameState.playerChoices.find(choice => choice.path)?.path || 'genetics';

  const getApplicationIcon = (iconName) => {
    const iconClass = "w-12 h-12 text-current";
    
    switch(iconName) {
      case 'dna':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93C7.05 19.44 3 15.08 3 10c0-.55.45-1 1-1s1 .45 1 1c0 3.86 3.14 7 7 7 .55 0 1 .45 1 1s-.45 1-1 1z"/>
            <path d="M8 8l8 8M16 8l-8 8"/>
          </svg>
        );
      case 'tool':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
        );
      case 'shield':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        );
      case 'refresh':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
        );
      case 'pill':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="10" rx="2" ry="2"/>
            <circle cx="12" cy="5" r="2"/>
            <path d="M12 7v4"/>
            <line x1="8" y1="16" x2="16" y2="16"/>
          </svg>
        );
      case 'medical':
        return (
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            <path d="M12 8v8"/>
            <path d="M8 12h8"/>
          </svg>
        );
      default:
        return <div className={iconClass}></div>;
    }
  };

  const applications = {
    genetics: [
      {
        id: 'gene-therapy',
        title: 'Genetic Enhancement for Astronauts',
        icon: 'dna',
        description: 'Develop gene therapy to give astronauts tardigrade-like radiation resistance',
        impact: 'Could protect Mars crew from 95% of cosmic radiation damage',
        timeline: '10-15 years',
        feasibility: 85
      },
      {
        id: 'dna-repair',
        title: 'Advanced DNA Repair Systems',
        icon: 'tool',
        description: 'Create synthetic DNA repair mechanisms based on tardigrade biology',
        impact: 'Revolutionary treatment for radiation sickness and cancer',
        timeline: '5-8 years',
        feasibility: 92
      }
    ],
    engineering: [
      {
        id: 'bio-shielding',
        title: 'Bio-Inspired Spacecraft Shielding',
        icon: 'shield',
        description: 'Lightweight radiation shielding based on tardigrade body structure',
        impact: '60% weight reduction with 40% better protection',
        timeline: '3-5 years',
        feasibility: 95
      },
      {
        id: 'adaptive-materials',
        title: 'Self-Healing Spacecraft Materials',
        icon: 'refresh',
        description: 'Materials that can repair themselves like tardigrades in cryptobiosis',
        impact: 'Dramatically extend spacecraft lifespan',
        timeline: '7-10 years',
        feasibility: 78
      }
    ],
    medical: [
      {
        id: 'protection-drugs',
        title: 'Tardigrade Protein Supplements',
        icon: 'pill',
        description: 'Protective supplements containing tardigrade proteins for astronauts',
        impact: 'Immediate protection available for Mars missions',
        timeline: '2-3 years',
        feasibility: 88
      },
      {
        id: 'medical-treatment',
        title: 'Radiation Exposure Treatment',
        icon: 'medical',
        description: 'New treatments for radiation poisoning using tardigrade biology',
        impact: 'Save lives from nuclear accidents and space radiation',
        timeline: '4-6 years',
        feasibility: 91
      }
    ]
  };

  const currentApplications = applications[missionPath] || applications.genetics;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
            Future of Space Exploration
          </h1>
          <p className="text-xl text-gray-300">
            Chapter 5: Your discoveries are transforming humanity's journey to Mars
          </p>
        </motion.div>

        {/* Mission Path Summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="bg-gradient-to-br from-black/80 to-purple-900/80 rounded-xl p-8 mb-8 border border-purple-400/30"
        >
          <h3 className="text-2xl text-purple-400 mb-4 text-center">
            Research Path: {missionPath.charAt(0).toUpperCase() + missionPath.slice(1)} Focus
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{gameState.researchPoints}</div>
              <div className="text-gray-300">Total Research Points</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{gameState.discoveries.length}</div>
              <div className="text-gray-300">Scientific Discoveries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{gameState.tardigradesSurvived}%</div>
              <div className="text-gray-300">Peak Survival Rate</div>
            </div>
          </div>
        </motion.div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {currentApplications.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
              className={`bg-gradient-to-br from-gray-900 to-blue-900 rounded-xl p-6 border cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                selectedApplication === app.id
                  ? 'border-yellow-400 shadow-lg shadow-yellow-400/25'
                  : 'border-blue-400/30 hover:border-blue-400/60'
              }`}
              onClick={() => setSelectedApplication(app.id)}
            >
              <div className="text-center mb-4">
                <div className="mb-3">
                  {getApplicationIcon(app.icon)}
                </div>
                <h4 className="text-xl text-blue-400 font-semibold">{app.title}</h4>
              </div>
              
              <p className="text-gray-200 mb-4 text-center">{app.description}</p>
              
              <div className="space-y-3">
                <div className="bg-black/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-green-400 text-sm">Impact:</span>
                  </div>
                  <p className="text-gray-300 text-sm">{app.impact}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/50 rounded-lg p-3">
                    <div className="text-yellow-400 text-sm">Timeline</div>
                    <div className="text-white font-semibold">{app.timeline}</div>
                  </div>
                  <div className="bg-black/50 rounded-lg p-3">
                    <div className="text-purple-400 text-sm">Feasibility</div>
                    <div className="text-white font-semibold">{app.feasibility}%</div>
                  </div>
                </div>
                
                {/* Feasibility Bar */}
                <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      app.feasibility > 90 ? 'bg-green-500' :
                      app.feasibility > 80 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${app.feasibility}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mars Mission Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="bg-gradient-to-br from-red-900/80 to-orange-900/80 rounded-xl p-8 border border-red-400/30 mb-8"
        >
          <h3 className="text-3xl text-red-400 mb-6 text-center flex items-center justify-center">
            <svg className="mr-3 w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" fill="#dc2626"/>
              <circle cx="12" cy="12" r="8" fill="#ef4444" opacity="0.8"/>
              <circle cx="9" cy="10" r="1" fill="#7f1d1d"/>
              <circle cx="15" cy="14" r="1.5" fill="#7f1d1d"/>
            </svg>
            Mars Colonization Initiative 2035
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl text-orange-400 mb-4">Mission Scenario</h4>
              <ul className="text-gray-200 space-y-2">
                <li>• 6 astronauts on 18-month Mars journey</li>
                <li>• Protected by tardigrade-inspired technology</li>
                <li>• Revolutionary radiation shielding reduces weight by 2 tons</li>
                <li>• Crew takes protective protein supplements</li>
                <li>• Emergency treatments available for radiation exposure</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl text-green-400 mb-4">Expected Outcomes</h4>
              <ul className="text-gray-200 space-y-2">
                <li>• 95% reduction in radiation-related health risks</li>
                <li>• Successful Mars colony establishment</li>
                <li>• Technology transferred to Earth medical applications</li>
                <li>• Foundation for interstellar exploration</li>
                <li>• New understanding of life's ultimate limits</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Scientific Legacy */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="bg-gradient-to-br from-green-900/50 to-blue-900/50 rounded-xl p-8 border border-green-400/30 mb-8"
        >
          <h3 className="text-2xl text-green-400 mb-6 text-center">
            🏆 Your Scientific Legacy
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg text-blue-400 mb-3">Discoveries Made</h4>
              <div className="space-y-2">
                {gameState.discoveries.map((discovery, index) => (
                  <div key={index} className="bg-black/50 rounded-lg p-3 border border-blue-400/20">
                    <div className="text-gray-200 text-sm">{discovery}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg text-purple-400 mb-3">Research Impact</h4>
              <div className="space-y-3">
                <div className="bg-black/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">{Math.floor(gameState.researchPoints * 10)}</div>
                  <div className="text-gray-400 text-sm">Lives potentially saved on Mars missions</div>
                </div>
                <div className="bg-black/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">${Math.floor(gameState.researchPoints * 5)}B</div>
                  <div className="text-gray-400 text-sm">Estimated economic impact</div>
                </div>
                <div className="bg-black/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">{gameState.discoveries.length * 5}</div>
                  <div className="text-gray-400 text-sm">Future research projects inspired</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Game Completion */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
          className="text-center space-y-6"
        >
          <div className="bg-gradient-to-br from-yellow-900/80 to-orange-900/80 rounded-xl p-8 border border-yellow-400/30">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 className="text-3xl text-yellow-400 mb-4 text-center">Mission Accomplished</h3>
            <p className="text-xl text-gray-200 mb-6">
              From a tiny water bear in a pond sample to the key that unlocks Mars exploration—
              you've witnessed how fundamental research transforms the future of humanity.
            </p>
            <div className="text-lg text-gray-300">
              The tardigrade's incredible survival abilities are now protecting astronauts 
              as they take humanity's greatest journey to the Red Planet.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => onChoice({
                id: 'play-again',
                text: 'Play again with different choices'
              })}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 px-6 rounded-xl transform hover:scale-105 transition-all"
            >
              🔄 Play Again
            </button>
            
            <button
              onClick={() => onChoice({
                id: 'explore-papers',
                text: 'Read the real research papers'
              })}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-6 rounded-xl transform hover:scale-105 transition-all"
            >
              📚 Read Research
            </button>
            
            <button
              onClick={() => onChoice({
                id: 'other-games',
                text: 'Try other space biology games'
              })}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-4 px-6 rounded-xl transform hover:scale-105 transition-all"
            >
              🎮 More Games
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ApplicationsScene;