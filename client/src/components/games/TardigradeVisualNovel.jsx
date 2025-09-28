'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Character sprites data
const characters = {
  marina: {
    name: "Dr. Marina Petrov",
    role: "Microbiologist",
    sprite: "/tardigrade_images/characters/marina_neutral.jpg",
    expressions: {
      neutral: "/tardigrade_images/characters/marina_neutral.jpg",
      excited: "/tardigrade_images/characters/marina_excited.jpg", 
      surprised: "/tardigrade_images/characters/marina_amazed.jpg",
      concerned: "/tardigrade_images/characters/marina_concerned.jpg",
      amazed: "/tardigrade_images/characters/marina_amazed.jpg"
    }
  },
  alex: {
    name: "Dr. Alex Chen",
    role: "NASA Astrobiologist", 
    sprite: "/tardigrade_images/characters/alex_neutral.jpg",
    expressions: {
      neutral: "/tardigrade_images/characters/alex_neutral.jpg",
      excited: "/tardigrade_images/characters/alex_excited.jpg",
      thinking: "/tardigrade_images/characters/alex_thinking.jpg"
    }
  },
  sarah: {
    name: "Dr. Sarah Rodriguez",
    role: "Space Mission Specialist",
    sprite: "/tardigrade_images/characters/sarah_confident.jpg", 
    expressions: {
      neutral: "/tardigrade_images/characters/sarah_confident.jpg",
      confident: "/tardigrade_images/characters/sarah_confident.jpg",
      amazed: "/tardigrade_images/characters/sarah_amazed.jpg"
    }
  }
};

// Background scenes
const backgrounds = {
  laboratory: "/tardigrade_images/backgrounds/university_lab.jpg",
  university: "/tardigrade_images/backgrounds/university_lab.jpg", 
  nasa_center: "/tardigrade_images/backgrounds/nasa_facility.jpg",
  space_station: "/tardigrade_images/backgrounds/space_station.jpg",
  mars_surface: "/tardigrade_images/backgrounds/mars_surface.jpg"
};

// Story script
const storyScript = [
  {
    id: 1,
    background: "laboratory",
    characters: ["marina"],
    speaker: "marina",
    expression: "excited",
    text: "I can't believe what I'm seeing under this microscope! These tiny creatures in the moss sample are incredible!",
    choices: null
  },
  {
    id: 2,
    background: "laboratory", 
    characters: ["marina"],
    speaker: "marina",
    expression: "amazed",
    text: "They look like tiny bears with eight legs. According to my research, these are tardigrades - also called 'water bears'.",
    choices: null
  },
  {
    id: 3,
    background: "laboratory",
    characters: ["marina", "alex"],
    speaker: "alex", 
    expression: "thinking",
    text: "Marina, your discovery could be revolutionary for space exploration. These organisms might hold the key to understanding life's limits.",
    choices: [
      {
        text: "Tell me more about their survival abilities",
        nextScene: 4
      },
      {
        text: "How could they help with space missions?",
        nextScene: 6
      }
    ]
  },
  {
    id: 4,
    background: "laboratory",
    characters: ["marina", "alex"], 
    speaker: "marina",
    expression: "excited",
    text: "They can survive temperatures from -273°C to 150°C! They can withstand pressures six times greater than the deepest ocean trenches!",
    choices: null
  },
  {
    id: 5,
    background: "laboratory",
    characters: ["marina", "alex"],
    speaker: "marina", 
    expression: "amazed",
    text: "And the most incredible part - they can survive radiation levels that would kill almost any other life form on Earth!",
    choices: null,
    next: 7
  },
  {
    id: 6,
    background: "nasa_center",
    characters: ["alex", "sarah"],
    speaker: "sarah",
    expression: "confident", 
    text: "If tardigrades can survive in space, they could help us understand how to protect astronauts during long missions to Mars.",
    choices: null,
    next: 7
  },
  {
    id: 7,
    background: "nasa_center",
    characters: ["marina", "alex", "sarah"],
    speaker: "alex",
    expression: "excited",
    text: "We need to design an experiment to test their survival in actual space conditions. This could change everything we know about life!",
    choices: [
      {
        text: "Let's send them to the International Space Station",
        nextScene: 8
      },
      {
        text: "We should run more Earth-based tests first",
        nextScene: 10
      }
    ]
  },
  {
    id: 8,
    background: "space_station", 
    characters: ["sarah"],
    speaker: "sarah",
    expression: "amazed",
    text: "Mission Control, this is incredible! The tardigrades have been exposed to the vacuum of space for 10 days and they're still alive!",
    choices: null
  },
  {
    id: 9,
    background: "space_station",
    characters: ["sarah"],
    speaker: "sarah", 
    expression: "amazed",
    text: "Not only did they survive, but some of them are actually reproducing! This is beyond our wildest expectations!",
    choices: null,
    next: 11
  },
  {
    id: 10,
    background: "laboratory",
    characters: ["marina"],
    speaker: "marina",
    expression: "concerned",
    text: "You're right. Let's be thorough. We'll test them under controlled extreme conditions first before the space mission.",
    choices: null,
    next: 8
  },
  {
    id: 11,
    background: "mars_surface",
    characters: ["alex", "sarah"],
    speaker: "alex",
    expression: "excited", 
    text: "With this knowledge, we could use tardigrades to help terraform Mars. They could be the key to making the Red Planet habitable!",
    choices: null
  },
  {
    id: 12,
    background: "mars_surface",
    characters: ["marina", "alex", "sarah"],
    speaker: "marina",
    expression: "amazed",
    text: "These tiny water bears might be humanity's greatest allies in exploring the cosmos. The smallest creatures with the biggest impact!",
    choices: null
  }
];

const TardigradeVisualNovel = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [history, setHistory] = useState([]);
  
  const scene = storyScript[currentScene];
  const typewriterSpeed = 50;

  // Typewriter effect
  useEffect(() => {
    if (!scene) return;
    
    setIsTyping(true);
    setShowChoices(false);
    setTextIndex(0);
    setDisplayText('');
    
    const fullText = scene.text;
    let currentIndex = 0;
    
    const typeWriter = () => {
      if (currentIndex < fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex + 1));
        setTextIndex(currentIndex + 1);
        currentIndex++;
        setTimeout(typeWriter, typewriterSpeed);
      } else {
        setIsTyping(false);
        if (scene.choices) {
          setTimeout(() => setShowChoices(true), 500);
        }
        
        // Auto advance if no choices and auto mode is on
        if (!scene.choices && autoMode) {
          setTimeout(() => {
            if (scene.next) {
              advanceScene(scene.next);
            } else if (currentScene < storyScript.length - 1) {
              advanceScene(currentScene + 1);
            }
          }, 2000);
        }
      }
    };
    
    typeWriter();
  }, [currentScene, autoMode]);

  const skipText = () => {
    if (isTyping) {
      setDisplayText(scene.text);
      setIsTyping(false);
      if (scene.choices) {
        setShowChoices(true);
      }
    } else if (!scene.choices) {
      // Advance to next scene
      if (scene.next !== undefined) {
        advanceScene(scene.next);
      } else if (currentScene < storyScript.length - 1) {
        setCurrentScene(currentScene + 1);
      } else {
        // Story finished
        console.log('Story completed!');
      }
    }
  };

  const advanceScene = (nextSceneId) => {
    setHistory(prev => [...prev, currentScene]);
    
    if (typeof nextSceneId === 'number') {
      // If it's a direct scene index
      if (nextSceneId < storyScript.length) {
        setCurrentScene(nextSceneId);
      }
    } else {
      // If it's a scene ID, find the corresponding index
      const nextIndex = storyScript.findIndex(s => s.id === nextSceneId);
      if (nextIndex !== -1) {
        setCurrentScene(nextIndex);
      }
    }
  };

  const handleChoice = (choice) => {
    setShowChoices(false);
    advanceScene(choice.nextScene);
  };

  const goBack = () => {
    if (history.length > 0) {
      const previousScene = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setCurrentScene(previousScene);
    }
  };

  if (!scene) return null;

  return (
    <div className="h-screen w-full relative overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0">
        <img 
          src={backgrounds[scene.background]} 
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Characters */}
      <div className="absolute inset-0 flex items-end justify-center pb-60">
        <AnimatePresence>
          {scene.characters.map((charKey, index) => {
            const char = characters[charKey];
            const isActive = scene.speaker === charKey;
            
            return (
              <motion.div
                key={charKey}
                initial={{ opacity: 0, y: 100, scale: 0.8 }}
                animate={{ 
                  opacity: isActive ? 1 : 0.7,
                  y: 0, 
                  scale: isActive ? 1 : 0.9,
                  x: scene.characters.length === 1 ? 0 : 
                     scene.characters.length === 2 ? (index === 0 ? -200 : 200) :
                     index === 0 ? -250 : index === 1 ? 0 : 250
                }}
                exit={{ opacity: 0, y: 100, scale: 0.8 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute"
              >
                {/* Real Character Image */}
                <div className="w-72 h-96 relative">
                  <img 
                    src={char.expressions[scene.expression] || char.sprite}
                    alt={char.name}
                    className="w-full h-full object-cover rounded-xl shadow-2xl border-4 border-white/10"
                    style={{
                      filter: isActive ? 'brightness(1.1) saturate(1.2) contrast(1.1)' : 'brightness(0.6) saturate(0.7) contrast(0.9)',
                      transition: 'all 0.5s ease',
                      objectPosition: 'center top'
                    }}
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(char.name)}&size=400&background=random&color=ffffff&format=png&rounded=true`;
                    }}
                  />
                  
                  {/* Character name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
                    <h3 className="font-bold text-lg text-white">{char.name}</h3>
                    <p className="text-sm text-gray-300">{char.role}</p>
                  </div>
                  
                  {/* Active speaker glow effect */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-lg shadow-lg ring-4 ring-blue-400/50 ring-opacity-75" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Dialogue Box */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-blue-500/30"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6">
          {/* Speaker Name */}
          <motion.div 
            className="mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={scene.speaker}
          >
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-full text-white font-semibold text-lg">
              {characters[scene.speaker]?.name}
            </span>
          </motion.div>

          {/* Dialogue Text */}
          <div className="mb-6 min-h-[4rem]">
            <p className="text-white text-xl leading-relaxed">
              {displayText}
              {isTyping && <span className="animate-pulse ml-1 text-blue-400">|</span>}
            </p>
          </div>

          {/* Choices */}
          <AnimatePresence>
            {showChoices && scene.choices && (
              <motion.div 
                className="space-y-3 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {scene.choices.map((choice, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleChoice(choice)}
                    className="w-full p-4 bg-blue-600/20 border border-blue-500/50 rounded-lg hover:bg-blue-600/40 hover:border-blue-400 transition-all duration-300 text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-white text-lg">→ {choice.text}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 right-4 flex gap-3">
          <button
            onClick={goBack}
            disabled={history.length === 0}
            className="px-4 py-2 bg-gray-600/80 hover:bg-gray-600 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            ← Back
          </button>
          
          <button
            onClick={() => setAutoMode(!autoMode)}
            className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 ${
              autoMode ? 'bg-green-600/80 hover:bg-green-600' : 'bg-gray-600/80 hover:bg-gray-600'
            }`}
          >
            Auto {autoMode ? 'ON' : 'OFF'}
          </button>
          
          {!showChoices && (
            <button
              onClick={skipText}
              className="px-4 py-2 bg-blue-600/80 hover:bg-blue-600 rounded-lg text-white font-medium transition-all duration-300"
            >
              {isTyping ? 'Skip' : 'Next →'}
            </button>
          )}
        </div>
      </motion.div>

      {/* Progress indicator */}
      <div className="absolute top-4 left-4 right-4">
        <div className="flex items-center justify-between text-white text-sm">
          <span>Scene {currentScene + 1} / {storyScript.length}</span>
          <div className="flex-1 mx-4 bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentScene + 1) / storyScript.length) * 100}%` }}
            />
          </div>
          <span>{Math.round(((currentScene + 1) / storyScript.length) * 100)}%</span>
        </div>
      </div>

      {/* Click to continue indicator */}
      {!isTyping && !showChoices && (
        <motion.div
          className="absolute bottom-20 right-8"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-white text-sm bg-black/50 px-3 py-1 rounded-full">
            Click to continue...
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TardigradeVisualNovel;