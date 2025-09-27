'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const DiscoveryScene = ({ onChoice, gameState }) => {
  const [showMicroscope, setShowMicroscope] = useState(false);
  const [tardigradeVisible, setTardigradeVisible] = useState(false);

  React.useEffect(() => {
    const timer1 = setTimeout(() => setShowMicroscope(true), 1000);
    const timer2 = setTimeout(() => setTardigradeVisible(true), 2000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            🔬 The Discovery
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            You are Dr. Elena Rodriguez, a microbiologist at Stanford University. 
            Today's routine water sample analysis is about to change everything...
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Lab Scene */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-xl p-6 border border-blue-400/30"
          >
            <h3 className="text-2xl text-blue-400 mb-4">University Biology Lab</h3>
            <div className="relative h-64 bg-black rounded-lg overflow-hidden">
              {/* Lab equipment */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-gray-700">
                {showMicroscope && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="text-6xl">🔬</div>
                  </motion.div>
                )}
                
                {/* Lab atmosphere */}
                <div className="absolute top-4 right-4 text-green-400 text-sm">
                  <div className="bg-black/70 p-2 rounded">
                    <div>Temperature: 22°C</div>
                    <div>Humidity: 65%</div>
                    <div>Sample: Pond Water #247</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Microscope View */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="bg-black rounded-xl p-6 border border-green-400/30"
          >
            <h3 className="text-2xl text-green-400 mb-4">Microscope View (400x)</h3>
            <div className="relative h-64 bg-gradient-to-br from-green-900 to-teal-900 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-radial-gradient from-transparent via-green-500/20 to-transparent">
                {/* Microscope grid */}
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-30">
                  {Array.from({length: 64}).map((_, i) => (
                    <div key={i} className="border border-green-500/20"></div>
                  ))}
                </div>
                
                {/* Tardigrade appears */}
                {tardigradeVisible && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      x: [0, 20, -10, 15, 0],
                      y: [0, -15, 20, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      x: { repeat: Infinity, duration: 4 },
                      y: { repeat: Infinity, duration: 3 }
                    }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="relative">
                      <div className="text-4xl filter drop-shadow-lg">🐻</div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-green-400 whitespace-nowrap bg-black/80 px-2 py-1 rounded">
                        Unknown Microorganism
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Water particles */}
                <div className="absolute inset-0">
                  {Array.from({length: 20}).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-blue-400 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        x: [0, Math.random() * 40 - 20],
                        y: [0, Math.random() * 40 - 20],
                        opacity: [0.3, 0.8, 0.3]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: Math.random() * 3 + 2
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Narrative Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="bg-black/70 rounded-xl p-8 mb-8 border border-purple-400/30"
        >
          <div className="text-center mb-6">
            <h3 className="text-2xl text-purple-400 mb-4">Lab Notes - Day 247</h3>
          </div>
          
          <div className="space-y-4 text-lg text-gray-200 leading-relaxed">
            <p className="text-green-400">
              "Something extraordinary in today's pond sample. Microscopic creature, 
              roughly 0.5mm, eight legs, bear-like appearance..."
            </p>
            <p>
              "Initial tests show remarkable resilience. Subject appears to survive 
              conditions that would kill most life forms. Further investigation required."
            </p>
            <p className="text-yellow-400">
              "Could this be the key to understanding extremophile survival mechanisms?"
            </p>
          </div>
        </motion.div>

        {/* Choice Buttons */}
        {tardigradeVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <button
              onClick={() => onChoice({
                id: 'heat-test',
                text: 'Test with extreme heat',
                nextScene: 'experiment',
                nextChapter: 2,
                points: 15,
                showFact: true,
                factId: 0
              })}
              className="group bg-gradient-to-br from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white p-6 rounded-xl transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-red-400"
            >
              <div className="text-4xl mb-2">🔥</div>
              <h4 className="text-xl font-semibold mb-2">Extreme Heat Test</h4>
              <p className="text-sm opacity-90">
                Subject creature to 120°C to test thermal resistance
              </p>
              <div className="mt-3 text-xs bg-black/30 rounded px-2 py-1">
                Research Points: +15
              </div>
            </button>

            <button
              onClick={() => onChoice({
                id: 'vacuum-test',
                text: 'Test with space-like vacuum',
                nextScene: 'experiment',
                nextChapter: 2,
                points: 20,
                showFact: true,
                factId: 1
              })}
              className="group bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-6 rounded-xl transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-purple-400"
            >
              <div className="text-4xl mb-2">🌌</div>
              <h4 className="text-xl font-semibold mb-2">Vacuum Chamber</h4>
              <p className="text-sm opacity-90">
                Simulate space-like vacuum conditions
              </p>
              <div className="mt-3 text-xs bg-black/30 rounded px-2 py-1">
                Research Points: +20
              </div>
            </button>

            <button
              onClick={() => onChoice({
                id: 'observe-longer',
                text: 'Observe natural behavior',
                nextScene: 'experiment',
                nextChapter: 2,
                points: 10,
                showFact: true,
                factId: 2
              })}
              className="group bg-gradient-to-br from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white p-6 rounded-xl transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-green-400"
            >
              <div className="text-4xl mb-2">🔍</div>
              <h4 className="text-xl font-semibold mb-2">Extended Observation</h4>
              <p className="text-sm opacity-90">
                Study natural behavior patterns first
              </p>
              <div className="mt-3 text-xs bg-black/30 rounded px-2 py-1">
                Research Points: +10
              </div>
            </button>
          </motion.div>
        )}

        {/* Discovery Facts */}
        {tardigradeVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 4 }}
            className="mt-8 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-400/30"
          >
            <h4 className="text-xl text-blue-400 mb-3">Did You Know?</h4>
            <p className="text-gray-200">
              Tardigrades, also known as "water bears," are microscopic animals that can survive 
              in extreme conditions that would be fatal to nearly all other life forms. They were 
              first discovered in 1773 and have fascinated scientists ever since!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DiscoveryScene;