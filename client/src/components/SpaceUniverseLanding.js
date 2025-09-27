'use client';

import { Suspense, useState, useRef, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Text, Html, OrbitControls, Sphere } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Rocket, BookOpen, Users, Target, Timer } from 'lucide-react';
import * as THREE from 'three';
import UniverseScene from './EnhancedUniverseScene';
import NavigationHeader from './NavigationHeader';
import StatsPanel from './StatsPanel';
import PaperDetailPanel from './PaperDetailPanel';
import SearchInterface from './SearchInterface';
import TimelineControl from './TimelineControl';
import CategoryFilter from './CategoryFilter';

export default function SpaceUniverseLanding() {
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [timeRange, setTimeRange] = useState([1990, 2024]);
  const [isExploring, setIsExploring] = useState(false);
  const [explorationStats, setExplorationStats] = useState({
    papersExplored: 0,
    connectionsDiscovered: 0,
    achievementsUnlocked: []
  });

  const handlePaperClick = useCallback((paper) => {
    setSelectedPaper(paper);
    setExplorationStats(prev => ({
      ...prev,
      papersExplored: prev.papersExplored + 1,
      connectionsDiscovered: prev.connectionsDiscovered + paper.connections?.length || 0
    }));
  }, []);

  const handleUniverseInteraction = useCallback(() => {
    setIsExploring(true);
    setTimeout(() => setIsExploring(false), 2000);
  }, []);

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-black via-purple-900/10 to-black overflow-hidden">
      {/* Navigation Header - Fixed positioning */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <NavigationHeader 
          explorationStats={explorationStats}
          onSearch={setSearchQuery}
        />
      </div>

      {/* Main 3D Universe Viewport - Full screen with proper padding */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 80], fov: 75 }}
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
          }}
          onCreated={({ gl }) => {
            gl.setClearColor('#000000', 1);
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }}
        >
          <Suspense fallback={<LoadingUniverse />}>
            {/* Enhanced Universe Scene */}
            <UniverseScene 
              onPaperClick={handlePaperClick}
              onUniverseInteraction={handleUniverseInteraction}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              timeRange={timeRange}
              selectedPaper={selectedPaper}
            />
            
            {/* Enhanced Cosmic Environment */}
            <Stars 
              radius={500} 
              depth={100} 
              count={8000} 
              factor={6} 
              saturation={0.3}
              fade
              speed={0.8}
            />
            
            {/* Enhanced Lighting Setup */}
            <ambientLight intensity={0.15} color="#1a1a2e" />
            <pointLight position={[100, 100, 100]} intensity={0.8} color="#4F46E5" castShadow />
            <pointLight position={[-100, -100, -100]} intensity={0.6} color="#EC4899" />
            <pointLight position={[0, 200, 0]} intensity={0.4} color="#10B981" />
            
            {/* Fog for depth */}
            <fog attach="fog" args={['#000000', 100, 300]} />
            
            {/* Enhanced Camera Controls */}
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={20}
              maxDistance={300}
              autoRotate={!selectedPaper}
              autoRotateSpeed={0.2}
              dampingFactor={0.05}
              enableDamping={true}
            />
          </Suspense>
        </Canvas>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isExploring && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none z-30 bg-black/20"
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full shadow-lg"
                />
                <motion.p 
                  className="text-white text-center mt-6 text-xl font-light"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Navigating through space...
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed Control Panels - Better positioning */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-40">
        <div className="grid grid-cols-12 gap-4 items-end">
          {/* Left Controls - Stats and Categories */}
          <div className="col-span-3 flex flex-col gap-3">
            <StatsPanel explorationStats={explorationStats} />
            <CategoryFilter 
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          {/* Center Timeline - Main control */}
          <div className="col-span-6">
            <TimelineControl 
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
            />
          </div>

          {/* Right Search - Compact */}
          <div className="col-span-3 flex justify-end">
            <SearchInterface 
              searchQuery={searchQuery}
              onSearch={setSearchQuery}
            />
          </div>
        </div>
      </div>

      {/* Paper Detail Panel */}
      <AnimatePresence>
        {selectedPaper && (
          <PaperDetailPanel 
            paper={selectedPaper}
            onClose={() => setSelectedPaper(null)}
          />
        )}
      </AnimatePresence>

      {/* Welcome Message - Better positioning */}
      <AnimatePresence>
        {explorationStats.papersExplored === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-center pointer-events-none z-20"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 leading-tight"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%'],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: '200% 200%' }}
            >
              Explore 30 Years of<br />Space Biology
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-white/20 max-w-2xl mx-auto"
            >
              <motion.p 
                className="text-lg md:text-xl text-gray-200 mb-6 leading-relaxed"
              >
                Navigate through <span className="text-blue-400 font-semibold">608+ NASA research publications</span> as glowing stars in space.
                <br />
                <span className="text-purple-400 font-semibold">Click any star</span> to discover groundbreaking research that shapes our journey to Mars and beyond.
              </motion.p>
              
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="flex items-center justify-center gap-3 text-gray-300"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <p className="text-base">Start by clicking any glowing star above</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Notifications */}
      <AnimatePresence>
        {explorationStats.achievementsUnlocked.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-24 right-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-4 text-white shadow-lg z-20"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                🏆
              </div>
              <div>
                <h3 className="font-bold">{achievement.title}</h3>
                <p className="text-sm opacity-90">{achievement.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Loading component for the 3D universe
function LoadingUniverse() {
  return (
    <Html center>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full"
      />
      <motion.p 
        className="text-white text-center mt-4 text-lg"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Initializing the universe...
      </motion.p>
    </Html>
  );
}