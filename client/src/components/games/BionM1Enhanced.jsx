"use client"

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function BionM1RenJS() {
  const [currentScene, setCurrentScene] = useState(0)
  const [currentDialogue, setCurrentDialogue] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [showChoices, setShowChoices] = useState(false)
  const [gameState, setGameState] = useState({
    scientificAccuracy: 0,
    breakthroughPoints: 0,
    choices: []
  })
  const [displayedText, setDisplayedText] = useState('')
  const audioRef = useRef(null)

  // Story data with improved animations and storytelling
  const storyData = [
    {
      id: 'preparation',
      background: '/backgrounds/nasa-ames-lab.jpg',
      backgroundFallback: '/biology.jpeg',
      title: 'Mission Preparation - NASA Ames Research Center',
      character: {
        name: 'Dr. Sarah Chen',
        sprite: '/characters/dr-sarah-chen_PROMPT.txt',
        spriteFallback: '/nasa-logo.svg',
        position: { x: 300, y: 400 },
        mood: 'confident'
      },
      dialogues: [
        "Six months before Bion-M1 launch.",
        "We are preparing the most comprehensive study of biological adaptation to spaceflight.",
        "Forty-five mice will spend 30 days in orbit, helping us understand bone loss in microgravity.",
        "Every decision we make now will determine the success of this historic mission."
      ],
      animation: 'lab-preparation',
      choices: [
        {
          id: 'c57bl6',
          text: 'Select C57BL/6 strain mice for consistent bone density data',
          effects: { scientificAccuracy: 15, breakthroughPoints: 10 },
          response: 'Excellent choice! C57BL/6 mice provide reliable, consistent results for bone density research.'
        },
        {
          id: 'balbc',
          text: 'Choose BALB/c strain for immune system research focus',
          effects: { scientificAccuracy: 8, breakthroughPoints: 5 },
          response: 'Good for immune studies, but bone data may be less consistent than C57BL/6.'
        },
        {
          id: 'mixed',
          text: 'Use mixed population for genetic diversity analysis',
          effects: { scientificAccuracy: 10, breakthroughPoints: 7 },
          response: 'Smart thinking - genetic diversity reveals individual variations in adaptation.'
        }
      ]
    },
    {
      id: 'launch',
      background: '/backgrounds/baikonur-launch.jpg', // Using improved background
      title: 'Launch Day - Baikonur Cosmodrome',
      character: {
        name: 'Mission Director',
        sprite: '/characters/mission-director_PROMPT.txt',
        spriteFallback: '/nasa-logo.svg',
        position: { x: 250, y: 400 },
        mood: 'authoritative'
      },
      dialogues: [
        "Launch Day has arrived. All systems are go.",
        "Biological payload secured in pressurized habitat modules.",
        "Forty-five mice ready for their journey to advance human spaceflight.",
        "Initiating launch sequence in T-minus 10 seconds..."
      ],
      animation: 'rocket-launch',
      autoAdvance: true,
      choices: [
        {
          id: 'launch-proceed',
          text: 'Continue with launch sequence',
          effects: { breakthroughPoints: 5 },
          response: 'All systems green! Bion-M1 is now in orbit!'
        }
      ]
    },
    {
      id: 'orbit-adaptation',
      background: '/backgrounds/space-station-interior.jpg', // Space station interior
      title: 'Day 5 in Orbit - Microgravity Adaptation',
      character: {
        name: 'Dr. Sarah Chen',
        sprite: '/characters/dr-sarah-chen_PROMPT.txt',
        spriteFallback: '/nasa-logo.svg',
        position: { x: 300, y: 400 },
        mood: 'concerned'
      },
      dialogues: [
        "Five days into the mission, telemetry shows interesting patterns.",
        "Heart rates are elevated but stabilizing as expected.",
        "However, Subject #23 shows unusual spinning motions and reduced feeding behavior.",
        "This could be a critical finding for understanding microgravity adaptation."
      ],
      animation: 'floating-mice',
      choices: [
        {
          id: 'vestibular',
          text: 'Vestibular system disruption - inner ear affected by microgravity',
          effects: { scientificAccuracy: 20, breakthroughPoints: 15 },
          response: 'Correct! Vestibular system disruption causes spatial disorientation in microgravity.'
        },
        {
          id: 'stress',
          text: 'Psychological stress from confined environment',
          effects: { scientificAccuracy: 5 },
          response: 'Possible factor, but telemetry indicates vestibular disruption is primary cause.'
        },
        {
          id: 'malfunction',
          text: 'Equipment malfunction in habitat system',
          effects: { scientificAccuracy: 0 },
          response: 'All systems are functioning normally. This is biological adaptation.'
        }
      ]
    },
    {
      id: 'bone-discovery',
      background: '/backgrounds/mission-control-room.jpg', // Mission control room
      title: 'Day 15 - Critical Bone Density Discovery',
      character: {
        name: 'Control Officer',
        sprite: '/characters/control-officer_PROMPT.txt',
        spriteFallback: '/nasa-logo.svg',
        position: { x: 350, y: 400 },
        mood: 'excited'
      },
      dialogues: [
        "Day 15 micro-CT scan results are extraordinary!",
        "Weight-bearing bones show 21% density loss already.",
        "But non-weight-bearing bones only show 8% loss.",
        "This differential pattern reveals something crucial about bone physiology in space."
      ],
      animation: 'bone-analysis',
      choices: [
        {
          id: 'mechanical-loading',
          text: 'Mechanical loading is critical - gravity provides essential bone stress',
          effects: { scientificAccuracy: 25, breakthroughPoints: 30 },
          response: 'BREAKTHROUGH! Mechanical loading is absolutely critical for maintaining bone health!'
        },
        {
          id: 'blood-flow',
          text: 'Blood flow changes affect bone formation patterns',
          effects: { scientificAccuracy: 10, breakthroughPoints: 5 },
          response: 'Blood flow matters, but the pattern clearly indicates mechanical loading is key.'
        },
        {
          id: 'calcium',
          text: 'Calcium metabolism disruption in microgravity',
          effects: { scientificAccuracy: 8 },
          response: 'Related factor, but mechanical stress absence is the primary cause.'
        }
      ]
    },
    {
      id: 'mission-completion',
      background: '/backgrounds/recovery-landing.jpg', // Recovery site
      title: 'Day 30 - Mission Completion & Future Impact',
      character: {
        name: 'Dr. Sarah Chen',
        sprite: '/characters/dr-sarah-chen_PROMPT.txt',
        spriteFallback: '/nasa-logo.svg',
        position: { x: 300, y: 400 },
        mood: 'triumphant'
      },
      dialogues: [
        "Thirty days completed successfully. All subjects recovered safely.",
        "Our data revolutionizes understanding of bone loss in space.",
        "This research directly informs exercise protocols for Mars missions.",
        "From tiny mice to human space exploration - science advances step by step."
      ],
      animation: 'mission-success',
      isEnd: true,
      choices: [
        {
          id: 'view-results',
          text: 'View final mission results and impact',
          effects: { breakthroughPoints: 10 },
          response: 'Mission accomplished! This research shapes the future of human spaceflight.'
        }
      ]
    }
  ]

  // Typewriter effect
  const typeText = async (text) => {
    setIsTyping(true)
    setDisplayedText('')
    
    for (let i = 0; i <= text.length; i++) {
      setDisplayedText(text.slice(0, i))
      await new Promise(resolve => setTimeout(resolve, 30))
    }
    
    setIsTyping(false)
  }

  // Handle dialogue progression
  const nextDialogue = () => {
    const scene = storyData[currentScene]
    if (currentDialogue < scene.dialogues.length - 1) {
      setCurrentDialogue(currentDialogue + 1)
    } else {
      setShowChoices(true)
    }
  }

  // Handle choice selection
  const selectChoice = (choice) => {
    setGameState(prev => ({
      scientificAccuracy: prev.scientificAccuracy + (choice.effects.scientificAccuracy || 0),
      breakthroughPoints: prev.breakthroughPoints + (choice.effects.breakthroughPoints || 0),
      choices: [...prev.choices, { scene: currentScene, choice: choice.id }]
    }))

    // Show response
    setDisplayedText(choice.response)
    setShowChoices(false)
    
    // Auto advance to next scene after response
    setTimeout(() => {
      if (currentScene < storyData.length - 1) {
        setCurrentScene(currentScene + 1)
        setCurrentDialogue(0)
        setShowChoices(false)
      }
    }, 3000)
  }

  // Initialize first dialogue
  useEffect(() => {
    if (storyData[currentScene]) {
      typeText(storyData[currentScene].dialogues[currentDialogue])
    }
  }, [currentScene, currentDialogue])

  const currentSceneData = storyData[currentScene]
  if (!currentSceneData) return null

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Background */}
      <motion.div
        key={`bg-${currentScene}`}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0"
      >
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${currentSceneData.backgroundFallback || currentSceneData.background})`,
            filter: 'brightness(0.7)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
      </motion.div>

      {/* Character */}
      <AnimatePresence>
        {currentSceneData.character && (
          <motion.div
            key={`char-${currentScene}`}
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: currentSceneData.character.position.x - 100, opacity: 0.9 }}
            exit={{ x: -200, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute bottom-0 z-20"
            style={{ left: currentSceneData.character.position.x - 100 }}
          >
            <div className="relative">
              {/* Character nameplate */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-cyan-500/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-cyan-300"
              >
                <p className="text-white font-semibold text-sm whitespace-nowrap">
                  {currentSceneData.character.name}
                </p>
              </motion.div>
              
              {/* Character sprite placeholder */}
              <div className="w-32 h-48 bg-gradient-to-t from-cyan-500/30 to-blue-500/30 rounded-lg border border-cyan-300/50 flex items-center justify-center">
                <svg className="w-16 h-16 text-cyan-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9C15 12.3 12.3 15 9 15V16L7 16V22H9V16H15V22H17V16H21V14H15V12L21 9Z"/>
                </svg>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title */}
      <motion.div
        key={`title-${currentScene}`}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute top-8 left-8 right-8 z-30"
      >
        <div className="bg-black/70 backdrop-blur-sm rounded-xl border border-green-500/30 px-6 py-4">
          <h1 className="text-2xl font-bold text-green-400 text-center">
            {currentSceneData.title}
          </h1>
        </div>
      </motion.div>

      {/* Game Stats */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="absolute top-8 right-8 z-30"
      >
        <div className="bg-black/80 backdrop-blur-sm rounded-lg border border-cyan-500/30 px-4 py-3 space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-blue-400 text-sm font-semibold">
              Scientific Accuracy: {gameState.scientificAccuracy}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-semibold">
              Breakthrough Points: {gameState.breakthroughPoints}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Scene Animations */}
      <AnimatePresence>
        {currentSceneData.animation === 'rocket-launch' && (
          <div className="absolute inset-0 z-10">
            {/* Rocket */}
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.5 }}
              animate={{ y: -200, opacity: 1, scale: 1 }}
              exit={{ y: -400, opacity: 0 }}
              transition={{ duration: 4, ease: "easeOut" }}
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
            >
              <div className="relative">
                <div className="text-6xl">🚀</div>
                {/* Enhanced exhaust particles */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.5, 1.2, 1.8, 1], 
                    opacity: [0.9, 0.4, 0.7, 0.2, 0.9] 
                  }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                  className="absolute -bottom-6 left-1/2 transform -translate-x-1/2"
                >
                  <div className="w-12 h-20 bg-gradient-to-t from-orange-500 via-yellow-400 to-red-500 rounded-full opacity-80 blur-sm"></div>
                </motion.div>
                {/* Secondary exhaust */}
                <motion.div
                  animate={{ 
                    scale: [0.8, 1.2, 0.9, 1.4, 0.8], 
                    opacity: [0.6, 0.2, 0.8, 0.1, 0.6] 
                  }}
                  transition={{ duration: 0.4, repeat: Infinity, delay: 0.1 }}
                  className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
                >
                  <div className="w-8 h-16 bg-gradient-to-t from-yellow-300 via-orange-300 to-transparent rounded-full opacity-60"></div>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Launch smoke clouds */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1.5, 2],
                  opacity: [0, 0.6, 0],
                  x: [0, (i - 2.5) * 40, (i - 2.5) * 80],
                  y: [0, -20, -40]
                }}
                transition={{ 
                  duration: 3, 
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
              >
                <div className="w-16 h-16 bg-gray-400 rounded-full opacity-40 blur-md"></div>
              </motion.div>
            ))}
          </div>
        )}

        {currentSceneData.animation === 'floating-mice' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  y: [0, -30, 10, -20, 0],
                  x: [0, 15, -10, 20, 0],
                  rotate: [0, 10, -15, 8, 0]
                }}
                transition={{ 
                  duration: 3 + i * 0.4, 
                  repeat: Infinity,
                  delay: i * 0.8,
                  ease: "easeInOut"
                }}
                className={`absolute text-3xl`}
                style={{
                  left: `${(i - 2) * 60}px`,
                  top: `${(i % 2) * 40 - 20}px`
                }}
              >
                🐭
                {/* Floating sparkles around mice */}
                <motion.div
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                  className="absolute -top-2 -right-2 text-sm"
                >
                  ✨
                </motion.div>
              </motion.div>
            ))}
            
            {/* Zero-g indicator */}
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-20 left-1/2 transform -translate-x-1/2 text-cyan-400 text-sm font-semibold"
            >
              ZERO GRAVITY ENVIRONMENT
            </motion.div>
          </div>
        )}

        {currentSceneData.animation === 'bone-analysis' && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
          >
            <div className="relative">
              {/* Scanning rings */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: 360 }}
                  transition={{ 
                    duration: 4 + i, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: i * 0.5 
                  }}
                  className={`absolute w-${32 + i * 16} h-${32 + i * 16} border-2 border-cyan-400 rounded-full border-dashed opacity-${60 - i * 15}`}
                  style={{
                    width: `${8 + i * 4}rem`,
                    height: `${8 + i * 4}rem`,
                    top: `${-4 - i * 2}rem`,
                    left: `${-4 - i * 2}rem`
                  }}
                />
              ))}
              
              {/* Central bone icon */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0] 
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl"
                >
                  🦴
                </motion.div>
                
                {/* Data points */}
                {['21%', '8%', '15%'].map((percentage, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 + i * 0.3 }}
                    className={`absolute text-xs font-bold px-2 py-1 rounded bg-red-500/80 text-white`}
                    style={{
                      top: `${20 + i * 25}%`,
                      right: i % 2 === 0 ? '-60px' : 'auto',
                      left: i % 2 === 1 ? '-60px' : 'auto'
                    }}
                  >
                    -{percentage}
                  </motion.div>
                ))}
              </div>
              
              {/* Analysis label */}
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-cyan-400 text-sm font-semibold text-center"
              >
                BONE DENSITY ANALYSIS
                <div className="text-xs text-gray-400 mt-1">Micro-CT Scanning</div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {currentSceneData.animation === 'mission-success' && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            {/* Success particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  scale: 0, 
                  opacity: 0,
                  x: (i % 10) * 120,
                  y: Math.floor(i / 10) * 300 + 100
                }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  y: [0, -100]
                }}
                transition={{ 
                  duration: 3,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className="absolute text-2xl"
              >
                {i % 4 === 0 ? '🎉' : i % 4 === 1 ? '✨' : i % 4 === 2 ? '🌟' : '🎊'}
              </motion.div>
            ))}
            
            {/* Success message */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute top-1/3 left-1/2 transform -translate-x-1/2 text-center"
            >
              <div className="text-6xl mb-4">🏆</div>
              <div className="text-2xl font-bold text-green-400">MISSION SUCCESS</div>
              <div className="text-sm text-gray-300 mt-2">All objectives completed</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dialogue Box */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 left-8 right-8 z-40"
      >
        <div className="bg-black/90 backdrop-blur-md rounded-2xl border border-cyan-500/40 p-6 shadow-2xl">
          <div className="space-y-4">
            <p className="text-white text-lg leading-relaxed min-h-[3rem]">
              {displayedText}
            </p>
            
            {/* Continue indicator */}
            {!isTyping && !showChoices && !currentSceneData.isEnd && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="flex justify-end"
              >
                <button
                  onClick={nextDialogue}
                  className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/40 rounded-lg border border-cyan-400/50 text-cyan-300 text-sm transition-colors"
                >
                  Continue →
                </button>
              </motion.div>
            )}
            
            {/* Choices */}
            <AnimatePresence>
              {showChoices && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 mt-6"
                >
                  {currentSceneData.choices.map((choice, index) => (
                    <motion.button
                      key={choice.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => selectChoice(choice)}
                      className="w-full p-4 bg-gradient-to-r from-blue-900/50 to-cyan-900/50 hover:from-blue-800/60 hover:to-cyan-800/60 rounded-xl border border-cyan-500/30 hover:border-cyan-400/60 text-left text-white transition-all duration-300"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-cyan-500/30 rounded-full flex items-center justify-center text-cyan-300 text-sm font-semibold flex-shrink-0 mt-1">
                          {index + 1}
                        </div>
                        <p className="text-sm leading-relaxed">{choice.text}</p>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mission Complete */}
            {currentSceneData.isEnd && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 text-center"
              >
                <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-xl border border-green-400/30 p-6">
                  <h3 className="text-xl font-bold text-green-400 mb-2">🎉 Mission Accomplished!</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Final Score: {gameState.scientificAccuracy} Scientific Accuracy, {gameState.breakthroughPoints} Breakthrough Points
                  </p>
                  <div className="space-y-2 text-sm text-gray-400">
                    <p>• Advanced understanding of microgravity bone loss</p>
                    <p>• Informed exercise protocols for Mars missions</p>
                    <p>• Contributed to astronaut health and safety</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}