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
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover -z-20"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      >
        <source src="/landing_bg.mp4" type="video/mp4" />
        <source src="/Landing_bg.mp4" type="video/mp4" />
      </video>
  {/* Removed tinted overlay to preserve original video colors */}
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
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          {/* Transparent canvas to show video background */}
          
          {/* Galaxy Scene */}
          <Suspense fallback={<GalaxyLoader />}>
            <GalaxyScene 
              onPaperClick={handlePaperDiscovery}
              currentEra={currentEra}
              selectedCategory={selectedCategory}
              searchTerm={searchTerm}
              selectedPaper={selectedPaper}
              isPlaying={isPlaying}
            />
            
            {/* Cosmic Environment */}
            <Stars 
              raycast={null}
              radius={350} 
              depth={120} 
              count={6000} 
              factor={0.6} 
              saturation={0.0} 
              fade={true} 
              speed={isPlaying ? 0.1 : 0}
            />
            
            {/* Dynamic Lighting (brighter to ensure visibility) */}
            <ambientLight intensity={0.4} color="#f0e7e7" />
            <pointLight position={[50, 50, 50]} intensity={0.8} color="#fda600" />
            <pointLight position={[-50, -50, 50]} intensity={0.6} color="#e77d11" />
            <pointLight position={[0, 0, -100]} intensity={0.4} color="#c1440e" />
            
            {/* Navigation Controls */}
            <OrbitControls
              makeDefault
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={20}
              maxDistance={300}
              autoRotate={!selectedPaper && isPlaying}
              autoRotateSpeed={isPlaying ? 1.0 : 0}
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
            <Stars raycast={null} radius={400} depth={80} count={3000} factor={0.5} fade speed={isPlaying ? 0.05 : 0} />
          </Canvas>
        </div>

        {/* Mission briefing removed per request */}
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