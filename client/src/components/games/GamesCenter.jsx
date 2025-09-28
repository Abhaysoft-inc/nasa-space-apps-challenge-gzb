"use client"

import React, { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

export default function GamesCenter(){
  const router = useRouter()
  const pathname = usePathname()
  const search = useSearchParams()
  const initialTab = search.get('tab') || 'stories'
  const [tab, setTab] = useState(initialTab)
  const [expandedCard, setExpandedCard] = useState(null)

  useEffect(()=>{ setTab(initialTab) }, [initialTab])

  const setRouteTab = (t) => {
    const sp = new URLSearchParams(Array.from(search.entries()))
    sp.set('tab', t)
    router.push(`${pathname}?${sp.toString()}`, { scroll: true })
  }

  // NASA-style story missions data
  const storyMissions = [
    {
      id: 'tardigrade',
      title: 'Tardigrade: Ultimate Survivors',
      subtitle: 'Microscopic Life in Extreme Conditions',
      description: 'Discover how the smallest creatures on Earth could be the key to surviving in space. Follow Dr. Marina Petrov as she uncovers the incredible survival abilities of tardigrades.',
      image: '/nasa_games_images/story_cards/tardigrade_mission_card.jpg',
      category: 'Biology',
      difficulty: 'Beginner',
      duration: '15-20 min',
      status: 'Available',
      route: '/games/tardigrade-visual-novel',
      features: ['Interactive Story', 'Voice Acting', 'Scientific Discovery'],
      scientificFacts: [
        'Tardigrades can survive temperatures from -273°C to 150°C',
        'They can withstand radiation 1000x stronger than humans',
        'Can survive in the vacuum of space for up to 30 days'
      ]
    },
    {
      id: 'bion-m1',
      title: 'BION-M1: Space Biology Mission',
      subtitle: 'Russian Space Research Program',
      description: 'Experience the groundbreaking BION-M1 mission that sent mice and other organisms to space to study the effects of microgravity on biological systems.',
      image: '/nasa_games_images/story_cards/bion_m1_mission_card.jpg',
      category: 'Space Research',
      difficulty: 'Intermediate',
      duration: '25-30 min',
      status: 'Available',
      route: '/games/bion-m1',
      features: ['Mission Simulation', 'Scientific Analysis', 'Real NASA Data'],
      scientificFacts: [
        'BION-M1 was launched in April 2013',
        'Carried mice, gerbils, and plant experiments',
        'Studied bone density changes in microgravity'
      ]
    },
    {
      id: 'mars-exploration',
      title: 'Mars: The Next Frontier',
      subtitle: 'Planning Human Missions to Mars',
      description: 'Join NASA scientists as they plan the next phase of Mars exploration. Learn about the challenges of sending humans to the Red Planet.',
      image: '/nasa_games_images/story_cards/mars_exploration_card.jpg',
      category: 'Exploration',
      difficulty: 'Advanced',
      duration: '30-40 min',
      status: 'Coming Soon',
      route: '/games/mars-mission',
      features: ['Mission Planning', 'Resource Management', 'Survival Challenges'],
      scientificFacts: [
        'Mars has a 24.6-hour day, similar to Earth',
        'Surface gravity is 38% of Earth\'s gravity',
        'Atmosphere is 95% carbon dioxide'
      ]
    }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/Landing_bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* NASA-Style Header */}
      <div className="relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center text-white z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
              Games and Interactives
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Immerse yourself in cutting-edge space biology missions. Experience real NASA research through interactive storytelling and scientific discovery.
            </p>
            
            {/* NASA Mission Categories */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {['Biology', 'Space Research', 'Exploration', 'Research', 'Training'].map((category) => (
                <span
                  key={category}
                  className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-medium hover:bg-white/20 transition-all cursor-pointer"
                >
                  {category}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mission Cards Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          <AnimatePresence>
            {storyMissions.map((mission, index) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                index={index}
                isExpanded={expandedCard === mission.id}
                onExpand={() => {
                  setExpandedCard(expandedCard === mission.id ? null : mission.id)
                }}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

// NASA-Style Mission Card Component
function MissionCard({ mission, index, isExpanded, onExpand }) {
  const statusColors = {
    'Available': 'bg-green-500',
    'Coming Soon': 'bg-orange-500',
    'Locked': 'bg-red-500'
  }

  const difficultyColors = {
    'Beginner': 'text-green-400',
    'Intermediate': 'text-yellow-400',
    'Advanced': 'text-red-400'
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isExpanded ? 1.02 : 1,
        zIndex: isExpanded ? 10 : 1
      }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      className={`relative bg-black/20 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-blue-400/50 transition-all duration-300 cursor-pointer hover:bg-black/30 ${
        isExpanded ? 'col-span-full' : ''
      }`}
      onClick={onExpand}
    >
      <div className={`flex ${isExpanded ? 'flex-row' : 'flex-col'}`}>
        {/* Mission Image */}
        <div className={`relative ${isExpanded ? 'w-1/2' : 'w-full h-48'} overflow-hidden`}>
          <img 
            src={mission.image} 
            alt={mission.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium text-white backdrop-blur-sm ${statusColors[mission.status]}`}>
              {mission.status}
            </span>
          </div>
          
          {/* Category Badge */}
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-blue-600/80 backdrop-blur-sm rounded-full text-xs font-medium text-white">
              {mission.category}
            </span>
          </div>
        </div>

        {/* Mission Content */}
        <div className={`p-6 ${isExpanded ? 'w-1/2' : 'w-full'}`}>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
              {mission.title}
            </h3>
            <span className={`text-sm font-medium ${difficultyColors[mission.difficulty]}`}>
              {mission.difficulty}
            </span>
          </div>
          
          <p className="text-cyan-200 text-sm mb-4 font-medium">
            {mission.subtitle}
          </p>
          
          <p className="text-blue-100 text-sm mb-4 leading-relaxed">
            {mission.description}
          </p>

          {/* Mission Stats */}
          <div className="flex items-center gap-4 text-xs text-blue-200 mb-4">
            <span>⏱️ {mission.duration}</span>
            <span>🎯 {mission.features.length} Features</span>
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-white/10 pt-4 mt-4"
              >
                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-cyan-300 mb-2">Mission Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {mission.features.map((feature, idx) => (
                      <span key={idx} className="px-2 py-1 bg-white/10 backdrop-blur-sm text-blue-100 text-xs rounded-md border border-white/20">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Scientific Facts */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-green-300 mb-2">Scientific Facts:</h4>
                  <ul className="space-y-1">
                    {mission.scientificFacts.map((fact, idx) => (
                      <li key={idx} className="text-xs text-blue-100 flex items-start gap-2">
                        <span className="text-cyan-400 mt-0.5">•</span>
                        {fact}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Start Mission Button */}
                {mission.status === 'Available' && (
                  <Link href={mission.route}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-500 hover:to-indigo-500 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/25 border border-white/10"
                    >
                      🚀 Start Mission
                    </motion.button>
                  </Link>
                )}
                
                {mission.status === 'Coming Soon' && (
                  <button
                    disabled
                    className="w-full bg-gray-600/50 backdrop-blur-sm text-gray-300 font-semibold py-3 px-6 rounded-lg cursor-not-allowed border border-white/10"
                  >
                    🔒 Coming Soon
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapsed State Button */}
          {!isExpanded && mission.status === 'Available' && (
            <Link href={mission.route}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-500 hover:to-indigo-500 backdrop-blur-sm text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm border border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                🚀 Start Mission
              </motion.button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}
