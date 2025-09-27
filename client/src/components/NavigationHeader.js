'use client';

import { motion } from 'framer-motion';
import { Search, Rocket, Award, BookOpen, Users, Target } from 'lucide-react';
import Image from 'next/image';

export default function NavigationHeader({ explorationStats, onSearch }) {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="absolute top-0 left-0 right-0 z-20 bg-black/20 backdrop-blur-md border-b border-white/10"
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* NASA Logo and Project Title */}
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg border border-blue-500/30 flex items-center justify-center backdrop-blur-sm">
              <Image 
                src="/nasa-logo.svg" 
                alt="NASA Space Biology Engine" 
                width={32} 
                height={32}
                className="drop-shadow-lg"
              />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          </motion.div>
          
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              NASA Space Biology Engine
            </h1>
            <p className="text-gray-400 text-sm">
              Explore • Discover • Connect
            </p>
          </div>
        </div>

        {/* Center Stats Display */}
        <div className="flex items-center gap-8">
          <StatsDisplay 
            icon={BookOpen}
            label="Papers Explored" 
            value={explorationStats.papersExplored}
            color="text-blue-400"
          />
          <StatsDisplay 
            icon={Target}
            label="Connections Found" 
            value={explorationStats.connectionsDiscovered}
            color="text-purple-400"
          />
          <StatsDisplay 
            icon={Award}
            label="Achievements" 
            value={explorationStats.achievementsUnlocked.length}
            color="text-yellow-400"
          />
        </div>

        {/* Right Navigation */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-medium hover:shadow-lg transition-shadow"
          >
            Dashboard
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
          >
            About
          </motion.button>

          {/* User Profile */}
          <div className="flex items-center gap-2 text-gray-300">
            <Users className="w-5 h-5" />
            <span className="text-sm">Explorer</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

function StatsDisplay({ icon: Icon, label, value, color }) {
  return (
    <motion.div 
      className="flex items-center gap-2"
      whileHover={{ scale: 1.05 }}
    >
      <Icon className={`w-5 h-5 ${color}`} />
      <div className="text-center">
        <div className={`text-lg font-bold ${color}`}>
          {value.toLocaleString()}
        </div>
        <div className="text-xs text-gray-400">
          {label}
        </div>
      </div>
    </motion.div>
  );
}