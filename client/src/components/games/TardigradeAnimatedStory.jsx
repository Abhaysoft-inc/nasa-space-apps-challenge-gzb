'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Cylinder } from '@react-three/drei';
import { gsap } from 'gsap';

// Tardigrade 3D Model Component  
const TardigradeModel = ({ position = [0, 0, 0], scale = 1, animate = false }) => {
  const meshRef = useRef();

  useEffect(() => {
    if (animate && meshRef.current) {
      gsap.to(meshRef.current.rotation, {
        y: Math.PI * 2,
        duration: 8,
        repeat: -1,
        ease: "power2.inOut"
      });
      gsap.to(meshRef.current.position, {
        y: position[1] + 0.4,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }, [animate, position]);

  return (
    <group ref={meshRef} position={position} scale={scale}>
      {/* Tardigrade Body */}
      <Cylinder args={[0.3, 0.4, 1.5, 8]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#4a90e2" roughness={0.3} metalness={0.1} />
      </Cylinder>
      
      {/* Head */}
      <Sphere args={[0.4]} position={[0, 0, 0.8]}>
        <meshStandardMaterial color="#5ba3f5" roughness={0.2} metalness={0.2} />
      </Sphere>
      
      {/* Eyes with glow */}
      <Sphere args={[0.08]} position={[-0.15, 0.1, 1.1]}>
        <meshStandardMaterial color="#ff4444" emissive="#ff2222" emissiveIntensity={0.5} />
      </Sphere>
      <Sphere args={[0.08]} position={[0.15, 0.1, 1.1]}>
        <meshStandardMaterial color="#ff4444" emissive="#ff2222" emissiveIntensity={0.5} />
      </Sphere>
      
      {/* Legs */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 0.5;
        const z = Math.sin(angle) * 0.3;
        const y = -0.7;
        
        return (
          <Cylinder key={i} args={[0.05, 0.03, 0.4]} position={[x, y, z]} rotation={[0, 0, 0]}>
            <meshStandardMaterial color="#3d7bc6" />
          </Cylinder>
        );
      })}
    </group>
  );
};

// Laboratory Scene Component
const LaboratoryScene = ({ visible }) => {
  if (!visible) return null;

  return (
    <group>
      {/* Lab Table */}
      <Box args={[4, 0.2, 2]} position={[0, -1, 0]}>
        <meshStandardMaterial color="#888888" />
      </Box>
      
      {/* Microscope */}
      <Cylinder args={[0.3, 0.3, 0.8]} position={[-1, -0.4, 0]}>
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
      </Cylinder>
      
      {/* Lab Equipment */}
      <Cylinder args={[0.15, 0.15, 0.4]} position={[1, -0.6, 0.5]}>
        <meshStandardMaterial color="#ff6b6b" transparent opacity={0.7} />
      </Cylinder>
      
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.6}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Laboratory Discovery
      </Text>
      
      <Text
        position={[0, 1.8, 0]}
        fontSize={0.25}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
        maxWidth={10}
      >
        Dr. Marina discovers microscopic tardigrades in moss samples.
        These tiny "water bears" show incredible survival abilities.
      </Text>
    </group>
  );
};

// Space Scene Component
const SpaceScene = ({ visible }) => {
  const earthRef = useRef();
  const moonRef = useRef();
  
  useEffect(() => {
    if (visible && earthRef.current && moonRef.current) {
      gsap.to(earthRef.current.rotation, {
        y: Math.PI * 2,
        duration: 15,
        repeat: -1,
        ease: "none"
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <group>
      {/* Earth */}
      <Sphere ref={earthRef} args={[1]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#4a90e2" 
          roughness={0.8}
          metalness={0.1}
        />
      </Sphere>
      
      {/* Moon */}
      <Sphere ref={moonRef} args={[0.3]} position={[3, 0, 0]}>
        <meshStandardMaterial color="#cccccc" roughness={0.9} />
      </Sphere>
      
      {/* Stars */}
      {Array.from({ length: 100 }, (_, i) => (
        <Sphere key={i} args={[0.02]} position={[
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ]}>
          <meshStandardMaterial color="#ffffff" />
        </Sphere>
      ))}
      
      <Text
        position={[0, 3.5, 0]}
        fontSize={0.6}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Space Mission
      </Text>
      
      <Text
        position={[0, 2.8, 0]}
        fontSize={0.25}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
        maxWidth={12}
      >
        Tardigrades are sent to the International Space Station
        to test their survival in the vacuum of space.
      </Text>
    </group>
  );
};

// Mars Scene Component
const MarsScene = ({ visible }) => {
  const rocketRef = useRef();
  
  useEffect(() => {
    if (visible && rocketRef.current) {
      gsap.fromTo(rocketRef.current.position, 
        { y: -5 },
        { y: 2, duration: 4, ease: "power2.out" }
      );
      gsap.to(rocketRef.current.rotation, {
        z: Math.sin(Date.now() * 0.001) * 0.1,
        duration: 3,
        repeat: -1,
        yoyo: true
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <group>
      {/* Mars Surface */}
      <Sphere args={[2]} position={[0, -3, 0]}>
        <meshStandardMaterial color="#cd5c5c" roughness={0.9} />
      </Sphere>
      
      {/* Rocket */}
      <group ref={rocketRef} position={[0, 0, 0]}>
        <Cylinder args={[0.2, 0.2, 2]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#ffffff" metalness={0.8} />
        </Cylinder>
        <Cylinder args={[0.15, 0.25, 0.5]} position={[0, -1.25, 0]}>
          <meshStandardMaterial color="#ff4444" />
        </Cylinder>
        <Cylinder args={[0.1, 0.2, 0.8]} position={[0, -2, 0]}>
          <meshStandardMaterial 
            color="#ffaa00" 
            transparent 
            opacity={0.8}
            emissive="#ff6600"
            emissiveIntensity={0.5}
          />
        </Cylinder>
      </group>
      
      <Text
        position={[0, 4.5, 0]}
        fontSize={0.6}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Mars Colonization
      </Text>
      
      <Text
        position={[0, 3.8, 0]}
        fontSize={0.25}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
        maxWidth={12}
      >
        Tardigrades could help terraform Mars and support
        future human colonies with their extreme resilience.
      </Text>
    </group>
  );
};

// Main Story Component
const TardigradeAnimatedStory = () => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [storyText, setStoryText] = useState('');
  const [showControls, setShowControls] = useState(true);

  const chapters = [
    {
      title: "The Discovery",
      scene: "laboratory",
      narration: "In a small laboratory, Dr. Marina Petrov examined a sample of moss under her microscope. What she discovered would change our understanding of life's limits forever...",
      duration: 10000
    },
    {
      title: "The Water Bear",
      scene: "laboratory",
      narration: "She found microscopic creatures called tardigrades - also known as 'water bears' - that could survive almost anything nature could throw at them.",
      duration: 8000
    },
    {
      title: "Extreme Testing",
      scene: "laboratory", 
      narration: "Laboratory tests revealed these tiny animals could survive temperatures from -273°C to 150°C, pressures six times greater than the deepest ocean, and radiation levels that would kill most life forms.",
      duration: 12000
    },
    {
      title: "Space Mission",
      scene: "space",
      narration: "NASA launched tardigrades to the International Space Station to test if they could survive in the vacuum of space with no protection whatsoever.",
      duration: 10000
    },
    {
      title: "The Ultimate Test",
      scene: "space",
      narration: "Incredibly, the tardigrades not only survived the vacuum of space, but some even reproduced successfully after returning to Earth!",
      duration: 9000
    },
    {
      title: "Mars Dreams",
      scene: "mars",
      narration: "Scientists now believe tardigrades could be key to terraforming Mars and supporting future human colonies on the Red Planet.",
      duration: 10000
    },
    {
      title: "Future Guardians",
      scene: "mars",
      narration: "These microscopic guardians might one day help humanity spread life throughout the solar system, proving that the smallest creatures can have the biggest impact.",
      duration: 11000
    }
  ];

  const currentChapterData = chapters[currentChapter] || chapters[0];

  useEffect(() => {
    if (isPlaying) {
      let i = 0;
      const text = currentChapterData.narration;
      setStoryText('');
      
      const typeWriter = () => {
        if (i < text.length) {
          setStoryText(prev => prev + text.charAt(i));
          i++;
          setTimeout(typeWriter, 100); // Nice readable speed
        }
      };
      
      typeWriter();

      const timer = setTimeout(() => {
        if (currentChapter < chapters.length - 1) {
          setCurrentChapter(prev => prev + 1);
        } else {
          setIsPlaying(false);
          setShowControls(true);
        }
      }, currentChapterData.duration);

      return () => clearTimeout(timer);
    }
  }, [currentChapter, isPlaying, currentChapterData]);

  const startStory = () => {
    setIsPlaying(true);
    setShowControls(false);
    if (currentChapter === 0) setStoryText('');
  };

  const pauseStory = () => {
    setIsPlaying(false);
    setShowControls(true);
  };

  const nextChapter = () => {
    if (currentChapter < chapters.length - 1) {
      setCurrentChapter(prev => prev + 1);
      setStoryText('');
    }
  };

  const prevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(prev => prev - 1);
      setStoryText('');
    }
  };

  const resetStory = () => {
    setCurrentChapter(0);
    setIsPlaying(false);
    setShowControls(true);
    setStoryText('');
  };

  return (
    <div className="h-screen w-full relative bg-black overflow-hidden">
      {/* 3D Scene */}
      <Canvas 
        className="absolute inset-0 w-full h-full" 
        camera={{ position: [0, 0, 8], fov: 75 }}
        style={{ touchAction: 'none' }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={1} />
        
        <TardigradeModel 
          position={currentChapterData.scene === 'space' ? [4, 0, 0] : 
                   currentChapterData.scene === 'mars' ? [2, 1, 0] : [0, 0, 2]} 
          scale={currentChapterData.scene === 'mars' ? 0.3 : 0.5}
          animate={true} 
        />
        
        <LaboratoryScene visible={currentChapterData.scene === 'laboratory'} />
        <SpaceScene visible={currentChapterData.scene === 'space'} />
        <MarsScene visible={currentChapterData.scene === 'mars'} />
        
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
      </Canvas>

      {/* Story UI Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Title */}
        <div className="absolute top-4 md:top-8 left-4 md:left-8 text-white">
          <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Tardigrade Chronicles
          </h1>
          <h2 className="text-lg md:text-xl text-gray-300">
            Chapter {currentChapter + 1}: {currentChapterData.title}
          </h2>
        </div>

        {/* Progress Bar */}
        <div className="absolute top-20 md:top-32 left-4 md:left-8 w-[calc(100%-2rem)] md:w-96">
          <div className="w-full bg-gray-700 rounded-full h-3 shadow-lg border border-gray-600">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-400 h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${((currentChapter + 1) / chapters.length) * 100}%` }}
            />
          </div>
          <p className="text-white text-xs md:text-sm mt-2 font-medium">
            {currentChapter + 1} of {chapters.length} chapters • {Math.round(((currentChapter + 1) / chapters.length) * 100)}% complete
          </p>
        </div>

        {/* Story Text */}
        <div className="absolute bottom-32 left-4 right-4 md:left-8 md:right-8 bg-black bg-opacity-90 p-4 md:p-6 rounded-xl backdrop-blur-sm border border-blue-500/30 shadow-2xl">
          <p className="text-white text-base md:text-lg leading-relaxed font-light min-h-[60px] max-h-[120px] overflow-hidden">
            {storyText}
            {isPlaying && <span className="animate-pulse ml-1 text-blue-400 text-xl">|</span>}
          </p>
        </div>

        {/* Controls */}
        {showControls && (
          <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 pointer-events-auto">
            <div className="flex flex-wrap justify-center gap-2 md:gap-4">
              <button
                onClick={startStory}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 font-medium text-sm md:text-base shadow-lg"
              >
                {currentChapter === 0 ? '▶ Start Story' : '▶ Resume'}
              </button>
              
              {isPlaying && (
                <button
                  onClick={pauseStory}
                  className="bg-gray-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-gray-700 transition-all duration-300 font-medium text-sm md:text-base shadow-lg"
                >
                  ⏸ Pause
                </button>
              )}
              
              <button
                onClick={prevChapter}
                disabled={currentChapter === 0}
                className="bg-gray-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm md:text-base shadow-lg"
              >
                ⏮ Previous
              </button>
              
              <button
                onClick={nextChapter}
                disabled={currentChapter === chapters.length - 1}
                className="bg-gray-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm md:text-base shadow-lg"
              >
                Next ⏭
              </button>
              
              <button
                onClick={resetStory}
                className="bg-red-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-red-700 transition-all duration-300 font-medium text-sm md:text-base shadow-lg"
              >
                🔄 Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading Screen */}
      {!showControls && !isPlaying && (
        <div className="absolute inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-400 mb-4"></div>
            <p className="text-white text-xl font-medium">Loading 3D Story...</p>
            <p className="text-gray-400 text-sm mt-2">Preparing cinematic experience</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TardigradeAnimatedStory;