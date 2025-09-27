'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SpaceMissionScene = ({ onChoice, gameState, updateGameState }) => {
  const [missionPhase, setMissionPhase] = useState('preparation');
  const [dayCounter, setDayCounter] = useState(0);
  const [missionResults, setMissionResults] = useState(null);
  const [isLaunching, setIsLaunching] = useState(false);

  const missionPath = gameState.playerChoices.find(choice => choice.path)?.path || 'genetics';

  const runSpaceMission = async () => {
    setIsLaunching(true);
    setMissionPhase('launch');
    
    // Simulate mission phases
    for (let day = 1; day <= 10; day++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setDayCounter(day);
    }
    
    // Calculate mission success based on previous choices and path
    const baseSuccess = 75;
    const pathBonus = {
      genetics: 15,
      engineering: 10,
      medical: 20
    };
    
    const survivalBonus = Math.floor(gameState.tardigradesSurvived / 10);
    const researchBonus = Math.floor(gameState.researchPoints / 20);
    
    const totalSuccess = Math.min(95, baseSuccess + pathBonus[missionPath] + survivalBonus + researchBonus);
    
    const results = {
      success: totalSuccess,
      survivedTardigrades: Math.floor(totalSuccess * 0.85),
      path: missionPath,
      discoveries: generateDiscoveries(missionPath, totalSuccess)
    };
    
    setMissionResults(results);
    setMissionPhase('results');
    setIsLaunching(false);
    
    updateGameState({
      researchPoints: gameState.researchPoints + results.success,
      discoveries: [...gameState.discoveries, ...results.discoveries]
    });
  };

  const generateDiscoveries = (path, success) => {
    const discoveries = [];
    
    if (success > 80) {
      switch (path) {
        case 'genetics':
          discoveries.push("Identified DSUP gene responsible for DNA protection");
          discoveries.push("Discovered unique DNA repair mechanisms");
          break;
        case 'engineering':
          discoveries.push("Successfully created bio-inspired radiation shielding");
          discoveries.push("Developed lightweight protection materials");
          break;
        case 'medical':
          discoveries.push("Synthesized protective tardigrade proteins");
          discoveries.push("Proven effectiveness in human cell cultures");
          break;
      }
    }
    
    if (success > 90) {
      discoveries.push("Revolutionary breakthrough in space biology!");
    }
    
    return discoveries;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-purple-900 p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            🛰️ International Space Station Mission
          </h1>
          <p className="text-xl text-gray-300">
            Chapter 4: Testing tardigrade survival in actual space conditions
          </p>
        </motion.div>

        {missionPhase === 'preparation' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            {/* Mission Overview */}
            <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-xl p-8 border border-blue-400/30">
              <h3 className="text-2xl text-blue-400 mb-6 flex items-center">
                <span className="mr-3">📋</span>
                Mission Planning - {missionPath.charAt(0).toUpperCase() + missionPath.slice(1)} Focus
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg text-green-400 mb-3">Experiment Design</h4>
                  {missionPath === 'genetics' && (
                    <ul className="text-gray-200 space-y-2">
                      <li>• 1000 tardigrades in specialized containers</li>
                      <li>• DNA sequencing equipment onboard ISS</li>
                      <li>• Real-time genetic monitoring</li>
                      <li>• Comparative analysis with Earth controls</li>
                    </ul>
                  )}
                  {missionPath === 'engineering' && (
                    <ul className="text-gray-200 space-y-2">
                      <li>• 500 tardigrades in bio-shielding prototypes</li>
                      <li>• Radiation measurement instruments</li>
                      <li>• Material stress testing</li>
                      <li>• Shield effectiveness analysis</li>
                    </ul>
                  )}
                  {missionPath === 'medical' && (
                    <ul className="text-gray-200 space-y-2">
                      <li>• 800 tardigrades for protein extraction</li>
                      <li>• Cell culture experiments</li>
                      <li>• Protein synthesis monitoring</li>
                      <li>• Human cell protection tests</li>
                    </ul>
                  )}
                </div>
                
                <div>
                  <h4 className="text-lg text-yellow-400 mb-3">Mission Parameters</h4>
                  <div className="bg-black/50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Duration</div>
                        <div className="text-white font-mono">10 Days</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Altitude</div>
                        <div className="text-white font-mono">408 km</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Radiation</div>
                        <div className="text-white font-mono">High Cosmic</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Temperature</div>
                        <div className="text-white font-mono">-157°C to +121°C</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <div className="text-center">
              <button
                onClick={runSpaceMission}
                disabled={isLaunching}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-xl font-bold py-6 px-12 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-orange-500/25"
              >
                <div className="flex items-center">
                  <span className="mr-4 text-2xl">🚀</span>
                  Launch Space Mission
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {missionPhase === 'launch' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-center space-y-8"
          >
            {/* Rocket Animation */}
            <div className="relative h-64 overflow-hidden">
              <motion.div
                animate={{ y: [-50, -200], opacity: [1, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute left-1/2 transform -translate-x-1/2 text-8xl"
              >
                🚀
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-orange-600/20 to-transparent pointer-events-none"></div>
            </div>

            <div className="bg-black/80 rounded-xl p-8 border border-orange-400/30">
              <h3 className="text-3xl text-orange-400 mb-4">Mission Day {dayCounter}</h3>
              <div className="text-gray-200 text-lg">
                {dayCounter <= 3 && "Tardigrades adjusting to microgravity environment..."}
                {dayCounter > 3 && dayCounter <= 7 && "Exposure to cosmic radiation in progress..."}
                {dayCounter > 7 && "Monitoring survival and biological responses..."}
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6 bg-gray-700 rounded-full h-4 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                  style={{ width: `${(dayCounter / 10) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {missionPhase === 'results' && missionResults && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            {/* Mission Success */}
            <div className="bg-gradient-to-br from-green-900 to-blue-900 rounded-xl p-8 border border-green-400/30">
              <h3 className="text-3xl text-green-400 mb-6 text-center flex items-center justify-center">
                <span className="mr-3">🎉</span>
                Mission Complete!
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center bg-black/50 rounded-lg p-6">
                  <div className="text-4xl font-bold text-green-400">{missionResults.success}%</div>
                  <div className="text-gray-300">Mission Success</div>
                </div>
                <div className="text-center bg-black/50 rounded-lg p-6">
                  <div className="text-4xl font-bold text-blue-400">{missionResults.survivedTardigrades}%</div>
                  <div className="text-gray-300">Tardigrade Survival</div>
                </div>
                <div className="text-center bg-black/50 rounded-lg p-6">
                  <div className="text-4xl font-bold text-purple-400">{missionResults.discoveries.length}</div>
                  <div className="text-gray-300">New Discoveries</div>
                </div>
              </div>

              {/* Path-specific Results */}
              <div className="bg-black/60 rounded-lg p-6 mb-6">
                <h4 className="text-xl text-yellow-400 mb-4">
                  {missionPath === 'genetics' && '🧬 Genetic Analysis Results'}
                  {missionPath === 'engineering' && '🛡️ Bio-Engineering Results'}
                  {missionPath === 'medical' && '💊 Medical Research Results'}
                </h4>
                
                {missionPath === 'genetics' && (
                  <div className="text-gray-200">
                    <p className="mb-3">
                      DNA sequencing revealed unprecedented insights into tardigrade radiation resistance. 
                      The DSUP (Damage Suppressor) protein showed remarkable activity during space exposure.
                    </p>
                    <p>
                      Genetic markers for radiation resistance have been successfully identified 
                      and could be adapted for human applications.
                    </p>
                  </div>
                )}
                
                {missionPath === 'engineering' && (
                  <div className="text-gray-200">
                    <p className="mb-3">
                      Bio-inspired shielding prototypes demonstrated 40% better radiation protection 
                      while being 60% lighter than conventional materials.
                    </p>
                    <p>
                      The tardigrade-inspired design could revolutionize spacecraft construction 
                      for long-duration missions.
                    </p>
                  </div>
                )}
                
                {missionPath === 'medical' && (
                  <div className="text-gray-200">
                    <p className="mb-3">
                      Tardigrade proteins successfully protected human cells from radiation damage 
                      in space conditions. Protein synthesis remained stable throughout the mission.
                    </p>
                    <p>
                      These results pave the way for protective supplements for astronauts 
                      on Mars missions.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Discoveries */}
            {missionResults.discoveries.length > 0 && (
              <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 rounded-xl p-6 border border-yellow-400/30">
                <h4 className="text-2xl text-yellow-400 mb-4 flex items-center">
                  <span className="mr-3">🏆</span>
                  Scientific Breakthroughs
                </h4>
                <div className="space-y-3">
                  {missionResults.discoveries.map((discovery, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.3 }}
                      className="bg-black/50 border border-yellow-400/30 rounded-lg p-4"
                    >
                      <div className="text-yellow-200">{discovery}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Step */}
            <div className="text-center">
              <button
                onClick={() => onChoice({
                  id: 'view-applications',
                  text: 'Explore practical applications',
                  nextScene: 'applications',
                  nextChapter: 5,
                  points: 50
                })}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xl font-bold py-4 px-8 rounded-xl transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center">
                  <span className="mr-3">🔬</span>
                  Develop Applications for Mars Mission
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SpaceMissionScene;