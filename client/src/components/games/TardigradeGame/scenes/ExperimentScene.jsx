'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TardigradeVisualization from '../components/TardigradeVisualization';

const ExperimentScene = ({ onChoice, gameState, updateGameState }) => {
  const [temperature, setTemperature] = useState(20);
  const [pressure, setPressure] = useState(1);
  const [radiation, setRadiation] = useState(0);
  const [experimentRunning, setExperimentRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const calculateSurvival = (temp, press, rad) => {
    // Realistic survival calculation based on tardigrade research
    let survivalRate = 100;
    
    // Temperature effects
    if (temp < -20 || temp > 60) {
      survivalRate *= 0.95; // Tardigrades are very resilient
    }
    if (temp < -100 || temp > 100) {
      survivalRate *= 0.9;
    }
    if (temp < -200 || temp > 140) {
      survivalRate *= 0.85;
    }
    
    // Pressure effects
    if (press < 0.1 || press > 100) {
      survivalRate *= 0.92;
    }
    if (press === 0) {
      survivalRate *= 0.88; // Space vacuum
    }
    if (press > 1000) {
      survivalRate *= 0.8;
    }
    
    // Radiation effects
    if (rad > 100) {
      survivalRate *= 0.9;
    }
    if (rad > 1000) {
      survivalRate *= 0.75;
    }
    
    return Math.max(Math.round(survivalRate), 20); // Tardigrades are incredibly resilient
  };

  const runExperiment = async () => {
    setExperimentRunning(true);
    setResults(null);
    setShowResults(false);
    
    // Simulate experiment duration
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const survivalRate = calculateSurvival(temperature, pressure, radiation);
    const newResults = {
      survival: survivalRate,
      temperature,
      pressure,
      radiation,
      discoveries: []
    };
    
    // Add discoveries based on extreme conditions
    if (survivalRate > 80 && (temperature < -100 || temperature > 100)) {
      newResults.discoveries.push("Cryptobiosis state activated!");
    }
    if (survivalRate > 70 && pressure === 0) {
      newResults.discoveries.push("Vacuum survival confirmed!");
    }
    if (survivalRate > 60 && radiation > 500) {
      newResults.discoveries.push("Radiation resistance documented!");
    }
    
    setResults(newResults);
    setExperimentRunning(false);
    setShowResults(true);
    
    // Update game state
    updateGameState({
      tardigradesSurvived: survivalRate,
      discoveries: [...gameState.discoveries, ...newResults.discoveries],
      researchPoints: gameState.researchPoints + Math.floor(survivalRate / 10)
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            🧪 Extreme Survival Testing
          </h1>
          <p className="text-xl text-gray-300">
            Chapter 2: Design your experiment to test tardigrade resilience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-gradient-to-br from-black/80 to-gray-900/80 rounded-xl p-8 border border-green-400/30"
          >
            <h3 className="text-2xl text-green-400 mb-6 flex items-center">
              <span className="mr-3">⚡</span>
              Environmental Controls
            </h3>
            
            <div className="space-y-8">
              {/* Temperature Control */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-white text-lg font-semibold">
                    Temperature
                  </label>
                  <div className={`px-3 py-1 rounded-lg text-sm font-mono ${
                    temperature < -100 ? 'bg-blue-600' :
                    temperature > 100 ? 'bg-red-600' :
                    'bg-green-600'
                  }`}>
                    {temperature}°C
                  </div>
                </div>
                <input
                  type="range"
                  min="-272"
                  max="150"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>-272°C (Space)</span>
                  <span>20°C (Room)</span>
                  <span>150°C (Extreme)</span>
                </div>
              </div>
              
              {/* Pressure Control */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-white text-lg font-semibold">
                    Pressure
                  </label>
                  <div className={`px-3 py-1 rounded-lg text-sm font-mono ${
                    pressure === 0 ? 'bg-purple-600' :
                    pressure > 100 ? 'bg-red-600' :
                    'bg-green-600'
                  }`}>
                    {pressure} atm
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="6000"
                  step="1"
                  value={pressure}
                  onChange={(e) => setPressure(Number(e.target.value))}
                  className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>0 atm (Vacuum)</span>
                  <span>1 atm (Sea Level)</span>
                  <span>6000 atm (Deep Ocean)</span>
                </div>
              </div>

              {/* Radiation Control */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-white text-lg font-semibold">
                    Radiation
                  </label>
                  <div className={`px-3 py-1 rounded-lg text-sm font-mono ${
                    radiation > 1000 ? 'bg-red-600' :
                    radiation > 100 ? 'bg-yellow-600' :
                    'bg-green-600'
                  }`}>
                    {radiation} Gy
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="10"
                  value={radiation}
                  onChange={(e) => setRadiation(Number(e.target.value))}
                  className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>0 Gy (None)</span>
                  <span>100 Gy (Lethal)</span>
                  <span>5000 Gy (Extreme)</span>
                </div>
              </div>
            </div>
            
            {/* Run Experiment Button */}
            <button
              onClick={runExperiment}
              disabled={experimentRunning}
              className={`mt-8 w-full py-4 rounded-xl text-white font-bold text-lg transform transition-all duration-300 ${
                experimentRunning
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 hover:scale-105 shadow-lg hover:shadow-red-500/25'
              }`}
            >
              {experimentRunning ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Running Experiment...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="mr-2">🧪</span>
                  Start Experiment
                </div>
              )}
            </button>
            
            {/* Preset Conditions */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => {
                  setTemperature(-272);
                  setPressure(0);
                  setRadiation(1000);
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg text-sm transition-colors"
              >
                🚀 Space Conditions
              </button>
              <button
                onClick={() => {
                  setTemperature(121);
                  setPressure(2);
                  setRadiation(0);
                }}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm transition-colors"
              >
                🔥 Autoclave
              </button>
              <button
                onClick={() => {
                  setTemperature(20);
                  setPressure(1);
                  setRadiation(0);
                }}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm transition-colors"
              >
                🌱 Normal Lab
              </button>
            </div>
          </motion.div>
          
          {/* Visualization Panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="bg-gradient-to-br from-black/80 to-blue-900/80 rounded-xl p-8 border border-blue-400/30"
          >
            <h3 className="text-2xl text-blue-400 mb-6 flex items-center">
              <span className="mr-3">🔬</span>
              Live Monitoring
            </h3>
            
            <TardigradeVisualization 
              temperature={temperature}
              pressure={pressure}
              radiation={radiation}
              survival={calculateSurvival(temperature, pressure, radiation)}
              isExperimentRunning={experimentRunning}
              results={results}
            />
          </motion.div>
        </div>

        {/* Results Panel */}
        {showResults && results && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="bg-gradient-to-br from-green-900/80 to-blue-900/80 rounded-xl p-8 border border-green-400/30 mb-8"
          >
            <h3 className="text-2xl text-green-400 mb-6 flex items-center">
              <span className="mr-3">📊</span>
              Experiment Results
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{results.survival}%</div>
                <div className="text-green-400">Survival Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{results.temperature}°C</div>
                <div className="text-blue-400">Temperature</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{results.pressure}</div>
                <div className="text-purple-400">Pressure (atm)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{results.radiation}</div>
                <div className="text-red-400">Radiation (Gy)</div>
              </div>
            </div>

            {results.discoveries.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xl text-yellow-400 mb-3">🏆 Scientific Discoveries!</h4>
                <div className="space-y-2">
                  {results.discoveries.map((discovery, index) => (
                    <div key={index} className="bg-yellow-900/30 border border-yellow-400/30 rounded-lg p-3">
                      <div className="text-yellow-200">{discovery}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interpretation */}
            <div className="bg-black/50 rounded-lg p-6 mb-6">
              <h4 className="text-lg text-white mb-3">Scientific Interpretation</h4>
              <p className="text-gray-300">
                {results.survival > 90 ? 
                  "Remarkable! The tardigrades have demonstrated extraordinary resilience. This level of survival suggests they've entered cryptobiosis - a state of suspended animation where they can survive almost anything." :
                  results.survival > 70 ?
                  "Impressive survival rate! The tardigrades are showing significant resistance to extreme conditions. This suggests advanced survival mechanisms." :
                  results.survival > 50 ?
                  "Moderate survival observed. The conditions are challenging even for these resilient creatures, but they're still outperforming most life forms." :
                  "Extreme conditions are taking their toll, but the fact that any survive is still remarkable compared to other organisms."
                }
              </p>
            </div>

            {/* Next Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => onChoice({
                  id: 'repeat-experiment',
                  text: 'Run another experiment',
                  points: 10
                })}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transform hover:scale-105 transition-all"
              >
                🔄 Run Another Test
              </button>
              
              <button
                onClick={() => onChoice({
                  id: 'contact-nasa',
                  text: 'Share results with NASA',
                  nextScene: 'nasa-partnership',
                  nextChapter: 3,
                  points: 25,
                  showFact: true,
                  factId: 1
                })}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 px-6 rounded-lg transform hover:scale-105 transition-all"
              >
                🚀 Contact NASA
              </button>
            </div>
          </motion.div>
        )}

        {/* Scientific Context */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-xl p-6 border border-indigo-400/30"
        >
          <h4 className="text-xl text-indigo-400 mb-3">🔬 Real Science Behind the Game</h4>
          <p className="text-gray-200 mb-3">
            This experiment simulates real research conducted on tardigrades. In 2007, the European Space Agency 
            sent tardigrades to space, exposing them to the vacuum of space and solar radiation for 10 days.
          </p>
          <p className="text-gray-200">
            Incredibly, 68% of the tardigrades survived and were able to reproduce normally after being returned to Earth!
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ExperimentScene;