'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Rocket, Award, Target, Users, PanelLeftOpen, PanelLeftClose } from 'lucide-react';

export default function SpaceHeader({ explorerStats, isSidebarOpen = true, onToggleSidebar = () => {} }) {
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
      className="fixed top-0 left-0 right-0 z-40 bg-black/30 backdrop-blur-md border-b border-white/10"
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleSidebar}
            className="p-2 border border-white/20 rounded-lg text-white/90 hover:bg-white/10"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="w-5 h-5" />
            ) : (
              <PanelLeftOpen className="w-5 h-5" />
            )}
          </motion.button>
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center backdrop-blur" style={{backgroundColor:'#c1440e22'}}>
              <Rocket className="w-6 h-6" style={{color:'#fda600'}} />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          </motion.div>
          
          <div>
            <h1 className="text-xl font-bold" style={{color:'#f0e7e7'}}>
              NASA Space Biology Galaxy
            </h1>
            <p className="text-sm" style={{color:'#f0e7e7aa'}}>
              Knowledge Explorer • Research Navigator
            </p>
          </div>
        </div>

        {/* Explorer Stats */}
        <div className="flex items-center gap-6">
          <StatItem icon={Target} label="Papers" value={stats.papersDiscovered} color="#fda600" />
          <StatItem icon={Award} label="Connections" value={stats.connectionsFound} color="#e77d11" />
          <StatItem icon={Users} label="Eras" value={stats.erasExplored?.size ?? 0} color="#c1440e" />
        </div>

        {/* Mission Controls */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-lg font-medium"
            style={{ backgroundColor:'#c1440e', color:'#f0e7e7' }}
          >
            Mission Log
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 border rounded-lg"
            style={{ borderColor:'#f0e7e744', color:'#f0e7e7', backgroundColor:'#00000033' }}
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
        <Icon className="w-4 h-4" style={{color}} />
        <span className="text-lg font-bold" style={{color}}>{value}</span>
      </div>
      <div className="text-xs" style={{color:'#f0e7e7aa'}}>{label}</div>
    </div>
  );
}
