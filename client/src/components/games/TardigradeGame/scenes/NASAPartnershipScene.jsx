'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const NASAPartnershipScene = ({ onChoice, gameState }) => {
  const [dialogueStep, setDialogueStep] = useState(0);
  
  const dialogues = [
    {
      speaker: "NASA Director Sarah Chen",
      text: "Dr. Rodriguez, your tardigrade research has caught our attention. We're planning a 6-month Mars mission, and cosmic radiation is our biggest threat.",
      speakerImage: "👩‍🚀"
    },
    {
      speaker: "Dr. Elena Rodriguez",
      text: "The tardigrades survived 10 days in space vacuum. Their survival mechanisms could be revolutionary for astronaut protection.",
      speakerImage: "👩‍🔬"
    },
    {
      speaker: "NASA Director Sarah Chen", 
      text: "Exactly. We need to understand how they resist radiation damage. This could save lives on Mars. Will you lead the research partnership?",
      speakerImage: "👩‍🚀"
    }
  ];

  const nextDialogue = () => {
    if (dialogueStep < dialogues.length - 1) {
      setDialogueStep(dialogueStep + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-black p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <img src="/nasa-logo.svg" alt="NASA" className="w-24 h-24" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
            🚀 NASA Partnership
          </h1>
          <p className="text-xl text-gray-300">
            Chapter 3: Your research has reached the highest levels of space exploration
          </p>
        </motion.div>

        {/* NASA Facility Background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative bg-gradient-to-br from-gray-900 to-blue-900 rounded-xl p-8 mb-8 border border-blue-400/30 overflow-hidden"
        >
          {/* Background elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 right-4 text-6xl">🛰️</div>
            <div className="absolute bottom-4 left-4 text-4xl">🌌</div>
            <div className="absolute top-1/2 left-8 text-3xl">🚀</div>
          </div>

          <div className="relative z-10">
            <h3 className="text-2xl text-blue-400 mb-6 text-center">NASA Ames Research Center - Astrobiology Division</h3>
            
            {/* Video Call Interface */}
            <div className="bg-black/70 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                  <span className="text-gray-400 text-sm">NASA Secure Video Conference</span>
                </div>
                <div className="text-green-400 text-sm">🔒 Encrypted</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* NASA Director */}
                <div className="bg-gradient-to-br from-blue-800 to-indigo-800 rounded-lg p-4 border border-blue-400/30">
                  <div className="text-center mb-3">
                    <div className="text-6xl mb-2">👩‍🚀</div>
                    <h4 className="text-blue-300 font-semibold">NASA Director Sarah Chen</h4>
                    <p className="text-xs text-gray-400">Astrobiology Division</p>
                  </div>
                </div>

                {/* Dr. Rodriguez */}
                <div className="bg-gradient-to-br from-green-800 to-teal-800 rounded-lg p-4 border border-green-400/30">
                  <div className="text-center mb-3">
                    <div className="text-6xl mb-2">👩‍🔬</div>
                    <h4 className="text-green-300 font-semibold">Dr. Elena Rodriguez</h4>
                    <p className="text-xs text-gray-400">Stanford University</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dialogue System */}
            <motion.div
              key={dialogueStep}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-black/80 rounded-lg p-6 mb-6 border border-gray-400/30"
            >
              <div className="flex items-start space-x-4">
                <div className="text-4xl">{dialogues[dialogueStep].speakerImage}</div>
                <div>
                  <h4 className="text-yellow-400 font-semibold mb-2">{dialogues[dialogueStep].speaker}</h4>
                  <p className="text-gray-200 text-lg leading-relaxed">
                    "{dialogues[dialogueStep].text}"
                  </p>
                </div>
              </div>
            </motion.div>

            {dialogueStep < dialogues.length - 1 ? (
              <button
                onClick={nextDialogue}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transform hover:scale-105 transition-all"
              >
                Continue Conversation →
              </button>
            ) : (
              <div className="space-y-4">
                <h4 className="text-xl text-yellow-400 text-center mb-4">Choose Your Research Focus</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => onChoice({
                      id: 'genetics-path',
                      text: 'Study tardigrade DNA for radiation resistance genes',
                      nextScene: 'space-mission',
                      nextChapter: 4,
                      points: 30,
                      path: 'genetics'
                    })}
                    className="group bg-gradient-to-br from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white p-6 rounded-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="text-4xl mb-3">🧬</div>
                    <h5 className="text-lg font-semibold mb-2">Genetic Analysis</h5>
                    <p className="text-sm opacity-90">
                      Sequence tardigrade DNA to identify radiation-resistant genes
                    </p>
                    <div className="mt-3 text-xs bg-black/30 rounded px-2 py-1">
                      Research Focus: Molecular Biology
                    </div>
                  </button>

                  <button
                    onClick={() => onChoice({
                      id: 'engineering-path',
                      text: 'Develop tardigrade-inspired radiation shielding',
                      nextScene: 'space-mission',
                      nextChapter: 4,
                      points: 25,
                      path: 'engineering'
                    })}
                    className="group bg-gradient-to-br from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white p-6 rounded-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="text-4xl mb-3">🛡️</div>
                    <h5 className="text-lg font-semibold mb-2">Bio-Engineering</h5>
                    <p className="text-sm opacity-90">
                      Design spacecraft shielding based on tardigrade biology
                    </p>
                    <div className="mt-3 text-xs bg-black/30 rounded px-2 py-1">
                      Research Focus: Applied Physics
                    </div>
                  </button>

                  <button
                    onClick={() => onChoice({
                      id: 'medical-path',
                      text: 'Create tardigrade protein supplements for astronauts',
                      nextScene: 'space-mission',
                      nextChapter: 4,
                      points: 35,
                      path: 'medical'
                    })}
                    className="group bg-gradient-to-br from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white p-6 rounded-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="text-4xl mb-3">💊</div>
                    <h5 className="text-lg font-semibold mb-2">Medical Research</h5>
                    <p className="text-sm opacity-90">
                      Develop protective treatments using tardigrade proteins
                    </p>
                    <div className="mt-3 text-xs bg-black/30 rounded px-2 py-1">
                      Research Focus: Biochemistry
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Mission Brief */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="bg-gradient-to-br from-red-900/50 to-orange-900/50 rounded-xl p-6 border border-red-400/30"
        >
          <h4 className="text-2xl text-red-400 mb-4 flex items-center">
            <span className="mr-3">🚨</span>
            Mars Mission Challenge
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-lg text-orange-400 mb-2">The Problem</h5>
              <ul className="text-gray-200 space-y-1 text-sm">
                <li>• 6-month journey to Mars</li>
                <li>• Cosmic radiation 100x stronger than Earth</li>
                <li>• Current shielding adds too much weight</li>
                <li>• Crew health at critical risk</li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg text-green-400 mb-2">Tardigrade Solution</h5>
              <ul className="text-gray-200 space-y-1 text-sm">
                <li>• Survived 10 days in open space</li>
                <li>• Natural radiation resistance</li>
                <li>• Unique protein structures</li>
                <li>• Potential for biomimetic applications</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Stats Display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-black/50 rounded-lg p-4 text-center border border-blue-400/30">
            <div className="text-2xl font-bold text-blue-400">{gameState.researchPoints}</div>
            <div className="text-gray-400 text-sm">Research Points</div>
          </div>
          <div className="bg-black/50 rounded-lg p-4 text-center border border-green-400/30">
            <div className="text-2xl font-bold text-green-400">{gameState.discoveries.length}</div>
            <div className="text-gray-400 text-sm">Discoveries Made</div>
          </div>
          <div className="bg-black/50 rounded-lg p-4 text-center border border-purple-400/30">
            <div className="text-2xl font-bold text-purple-400">{gameState.tardigradesSurvived}%</div>
            <div className="text-gray-400 text-sm">Best Survival Rate</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NASAPartnershipScene;