'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Rocket, Award, Target, Users } from 'lucide-react';

export default function SpaceHeader({ explorerStats }) {
  // Ensure explorerStats has proper defaults
  const stats = explorerStats || {
    papersDiscovered: 0,
    connectionsFound: 0,
    erasExplored: new Set()
  };
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute top-0 left-0 right-0 z-40 bg-black/30 backdrop-blur-md border-b border-white/10"
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600/20 to-purple-700/20 rounded-full border border-blue-400/30 flex items-center justify-center backdrop-blur">
              <Rocket className="w-6 h-6 text-blue-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          </motion.div>
          
          <div>
            <h1 className="text-xl font-bold text-white">
              NASA Space Biology Galaxy
            </h1>
            <p className="text-gray-400 text-sm">
              Knowledge Explorer • Research Navigator
            </p>
          </div>
        </div>

        {/* Explorer Stats */}
        <div className="flex items-center gap-6">
          <StatItem 
            icon={Target}
            label="Papers" 
            value={stats.papersDiscovered}
            color="text-blue-400"
          />
          <StatItem 
            icon={Award}
            label="Connections" 
            value={stats.connectionsFound}
            color="text-purple-400"
          />
          <StatItem 
            icon={Users}
            label="Eras" 
            value={stats.erasExplored?.size ?? 0}
            color="text-pink-400"
          />
        </div>

        {/* Mission Controls */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium"
          >
            Mission Log
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800"
          >
            Settings
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}

function StatItem({ icon: Icon, label, value, color }) {
  return (
    <div className="text-center">
      <div className="flex items-center gap-1 justify-center">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className={`text-lg font-bold ${color}`}>{value}</span>
      </div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
}
