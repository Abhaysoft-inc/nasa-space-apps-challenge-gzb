'use client';

import { Suspense, useState, useCallback, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import GalaxyScene from './GalaxyScene';
import SpaceHeader from './SpaceHeader';
import ResearchPanel from './ResearchPanel';
import TimelineExplorer from './TimelineExplorer';
import NavigationPanel from './NavigationPanel';

export default function SpaceExplorationLanding() {
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [currentEra, setCurrentEra] = useState('2020s');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const mainCanvasContainerRef = useRef(null);
  const [explorerStats, setExplorerStats] = useState({
    papersDiscovered: 0,
    connectionsFound: 0,
    erasExplored: new Set(),
    achievements: []
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Auto-dismiss welcome message after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (explorerStats.papersDiscovered === 0) {
        setExplorerStats(prev => ({...prev, papersDiscovered: 1}));
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [explorerStats.papersDiscovered]);

  const handlePaperDiscovery = useCallback((paper) => {
    setSelectedPaper(paper);
    setExplorerStats(prev => ({
      ...prev,
      papersDiscovered: prev.papersDiscovered + 1,
      connectionsFound: prev.connectionsFound + (paper.citations?.length || 0)
    }));
  }, []);

  const handleEraChange = useCallback((era) => {
    setCurrentEra(era);
    setExplorerStats(prev => ({
      ...prev,
      erasExplored: new Set([...prev.erasExplored, era])
    }));
  }, []);

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-slate-900 via-purple-900/20 to-black overflow-hidden">
      {/* Space Header */}
      <SpaceHeader 
        explorerStats={explorerStats}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((v) => !v)}
      />
      
      {/* Main 3D Galaxy */}
      <div ref={mainCanvasContainerRef} className="absolute inset-0 z-10">
        <Canvas
          eventSource={mainCanvasContainerRef}
          eventPrefix="client"
          camera={{ position: [0, 0, 60], fov: 70 }}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        >
          <color attach="background" args={['#000014']} />
          {/* Depth fog for better spatial perception */}
          <fog attach="fog" args={["#000014", 50, 300]} />
          
          {/* Galaxy Scene */}
          <Suspense fallback={<GalaxyLoader />}>
            <GalaxyScene 
              onPaperClick={handlePaperDiscovery}
              currentEra={currentEra}
              selectedCategory={selectedCategory}
              searchTerm={searchTerm}
              selectedPaper={selectedPaper}
            />
            
            {/* Cosmic Environment */}
            <Stars 
              raycast={null}
              radius={350} 
              depth={120} 
              count={12000} 
              factor={8} 
              saturation={1.0} 
              fade={true} 
              speed={0.6}
            />
            
            {/* Dynamic Lighting (brighter to ensure visibility) */}
            <ambientLight intensity={0.5} color="#1a1a3e" />
            <pointLight position={[50, 50, 50]} intensity={1.2} color="#4F46E5" />
            <pointLight position={[-50, -50, 50]} intensity={0.9} color="#EC4899" />
            <pointLight position={[0, 0, -100]} intensity={0.6} color="#10B981" />
            
            {/* Navigation Controls */}
            <OrbitControls
              makeDefault
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={20}
              maxDistance={300}
              autoRotate={!selectedPaper}
              autoRotateSpeed={1.0}
              dampingFactor={0.08}
              enableDamping={true}
              rotateSpeed={0.8}
              zoomSpeed={1.2}
              panSpeed={0.8}
            />
          </Suspense>
        </Canvas>
        {/* Always-on starfield behind – must NOT capture pointer events */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <Canvas
            className="pointer-events-none"  
            camera={{ position: [0, 0, 60], fov: 70 }}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          >
            <Stars raycast={null} radius={400} depth={80} count={4000} factor={2.5} fade speed={0.2} />
          </Canvas>
        </div>

        {/* Compact Welcome Message */}
        <AnimatePresence>
          {explorerStats.papersDiscovered === 0 && (
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.5 }}
              className="absolute top-24 left-6 z-20 max-w-sm"
            >
              <div className="bg-black/70 backdrop-blur-md rounded-xl p-4 border border-blue-400/40">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-blue-400">🚀 Mission Briefing</h3>
                  <button
                    onClick={() => setExplorerStats(prev => ({...prev, papersDiscovered: 1}))}
                    className="text-gray-400 hover:text-white text-sm"
                    suppressHydrationWarning
                  >
                    ✕
                  </button>
                </div>
                
                <p className="text-sm text-gray-200 mb-3 leading-relaxed">
                  Navigate the <span className="text-blue-400 font-medium">3D galaxy</span> where each 
                  glowing star is NASA research. Click stars to explore!
                </p>
                
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>Drag to rotate • Scroll to zoom • Click stars to explore</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Panel - Fixed Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <NavigationPanel 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            explorerStats={explorerStats}
            onResetView={() => {
              setSelectedPaper(null);
              setCurrentEra('2020s');
              setSelectedCategory('all');
              setSearchTerm('');
            }}
          />
        )}
      </AnimatePresence>

      {/* Timeline Explorer - Fixed Bottom */}
      <TimelineExplorer 
        currentEra={currentEra}
        onEraChange={handleEraChange}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        explorerStats={explorerStats}
      />

      {/* Research Detail Panel */}
      <AnimatePresence>
        {selectedPaper && (
          <ResearchPanel 
            selectedPaper={selectedPaper}
            onClose={() => setSelectedPaper(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Loading component for 3D Galaxy
function GalaxyLoader() {
  return (
    <mesh>
      <sphereGeometry args={[2, 32, 32]} />
      <meshBasicMaterial color="#4F46E5" opacity={0.6} transparent />
    </mesh>
  );
}