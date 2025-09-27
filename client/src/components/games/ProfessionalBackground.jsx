'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ProfessionalBackground = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate random particles
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          delay: Math.random() * 20,
          duration: Math.random() * 10 + 15,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Professional gradient background */}
      <div className="absolute inset-0 professional-bg" />
      
      {/* Scientific grid overlay */}
      <div className="absolute inset-0 data-grid opacity-20" />
      
      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, rgba(59, 130, 246, 0.8), rgba(139, 92, 246, 0.4))`,
          }}
          animate={{
            y: [-20, -100],
            x: [0, Math.sin(particle.id) * 50],
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Scientific constellation lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <linearGradient id="constellationGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        
        {/* Dynamic constellation lines */}
        {Array.from({ length: 15 }, (_, i) => (
          <motion.line
            key={i}
            x1={`${Math.random() * 100}%`}
            y1={`${Math.random() * 100}%`}
            x2={`${Math.random() * 100}%`}
            y2={`${Math.random() * 100}%`}
            stroke="url(#constellationGrad)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: i * 0.2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </svg>
      
      {/* Scientific measurement overlay */}
      <div className="absolute top-4 left-4 text-blue-400 text-xs font-mono opacity-30">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          TARDIGRADE RESEARCH SIMULATION v2.1
        </motion.div>
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, delay: 1, repeat: Infinity }}
        >
          Temperature: {Math.round(Math.random() * 50 - 273)}°C
        </motion.div>
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2.5, delay: 0.5, repeat: Infinity }}
        >
          Pressure: {(Math.random() * 10).toFixed(2)} GPa
        </motion.div>
      </div>
      
      {/* Scientific HUD elements */}
      <div className="absolute bottom-4 right-4 opacity-20">
        <motion.div
          className="w-32 h-32 border border-blue-400 rounded-full relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-2 border border-purple-400 rounded-full">
            <div className="absolute inset-2 border border-cyan-400 rounded-full">
              <div className="absolute inset-4 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full" />
            </div>
          </div>
          
          {/* Scientific markers */}
          {Array.from({ length: 12 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-6 bg-blue-400"
              style={{
                top: '2px',
                left: '50%',
                transformOrigin: '50% 62px',
                transform: `translateX(-50%) rotate(${i * 30}deg)`,
              }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
              }}
            />
          ))}
        </motion.div>
      </div>
      
      {/* DNA helix animation */}
      <div className="absolute top-1/2 left-8 opacity-10">
        <motion.div
          className="w-2 h-96"
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 20 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-8 h-1 bg-gradient-to-r from-blue-400 to-purple-400"
              style={{
                top: `${i * 19}px`,
                left: '-12px',
                transformOrigin: 'center',
              }}
              animate={{
                rotateZ: [0, 360],
                scaleX: [1, 0.5, 1],
              }}
              transition={{
                duration: 8,
                delay: i * 0.1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfessionalBackground;