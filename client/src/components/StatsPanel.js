'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users, Calendar, Zap, Globe, Star } from 'lucide-react';

export default function StatsPanel({ explorationStats }) {
  const stats = [
    {
      icon: Globe,
      label: "Papers",
      value: "608",
      color: "from-blue-500 to-cyan-400"
    },
    {
      icon: Calendar,
      label: "Years",
      value: "34",
      color: "from-purple-500 to-pink-400"
    },
    {
      icon: Users,
      label: "Centers",
      value: "15+",
      color: "from-green-500 to-emerald-400"
    },
    {
      icon: Star,
      label: "Studies",
      value: "150+",
      color: "from-yellow-500 to-orange-400"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-black/40 backdrop-blur-xl rounded-xl p-3 border border-white/10 min-w-[220px]"
    >
      <h3 className="text-white font-medium mb-3 flex items-center gap-2 text-sm">
        <TrendingUp className="w-4 h-4 text-blue-400" />
        Universe Stats
      </h3>

      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10 rounded-lg group-hover:opacity-20 transition-opacity`} />
            
            <div className="relative p-2 text-center">
              <stat.icon className={`w-4 h-4 mx-auto mb-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
              
              <div className={`text-lg font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
              
              <div className="text-xs text-gray-300">
                {stat.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Compact Personal Progress */}
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Explored</span>
            <span className="text-blue-400 font-medium">{explorationStats.papersExplored}/608</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5">
            <motion.div 
              className="h-1.5 bg-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(explorationStats.papersExplored / 608) * 100}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProgressBar({ label, value, max, color }) {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{label}</span>
        <span>{value}/{max}</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2">
        <motion.div 
          className={`h-2 ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}