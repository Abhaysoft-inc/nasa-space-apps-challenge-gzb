'use client';

'use client';

import { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import { Sphere, Text, Line, Html, Trail, Sparkles, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// Custom shader for realistic star glow effect
const StarGlowMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color(0.2, 0.1, 1.0),
    intensity: 1.0,
    pulseSpeed: 1.0,
  },
  // vertex shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
  `
    uniform float time;
    uniform vec3 color;
    uniform float intensity;
    uniform float pulseSpeed;
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vec2 center = vec2(0.5, 0.5);
      float dist = distance(vUv, center);
      
      // Create glow effect
      float glow = 1.0 - smoothstep(0.0, 0.5, dist);
      glow = pow(glow, 2.0);
      
      // Add pulsing effect
      float pulse = sin(time * pulseSpeed) * 0.3 + 0.7;
      glow *= pulse;
      
      // Core bright center
      float core = 1.0 - smoothstep(0.0, 0.1, dist);
      core = pow(core, 4.0);
      
      vec3 finalColor = color * intensity;
      float alpha = glow + core;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
);

extend({ StarGlowMaterial });
import { generatePaperData, researchCategories } from '@/data/mockData';

export default function UniverseScene({ 
  onPaperClick, 
  onUniverseInteraction,
  searchQuery,
  selectedCategory,
  timeRange,
  selectedPaper 
}) {
  const groupRef = useRef();
  const { camera } = useThree();
  
  const papers = useMemo(() => generatePaperData(), []);
  
  // Filter papers based on current filters
  const filteredPapers = useMemo(() => {
    return papers.filter(paper => {
      const matchesSearch = !searchQuery || 
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.abstract.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
        paper.category === selectedCategory;
      
      const matchesTime = paper.year >= timeRange[0] && paper.year <= timeRange[1];
      
      return matchesSearch && matchesCategory && matchesTime;
    });
  }, [papers, searchQuery, selectedCategory, timeRange]);

  // Generate citation connections between papers
  const connections = useMemo(() => {
    const conns = [];
    filteredPapers.forEach(paper => {
      const numConnections = Math.min(paper.connections, 5); // Limit connections for performance
      for (let i = 0; i < numConnections; i++) {
        const targetPaper = filteredPapers[Math.floor(Math.random() * filteredPapers.length)];
        if (targetPaper.id !== paper.id && targetPaper.year <= paper.year) {
          conns.push({
            from: paper.position,
            to: targetPaper.position,
            strength: Math.random(),
            fromId: paper.id,
            toId: targetPaper.id
          });
        }
      }
    });
    return conns;
  }, [filteredPapers]);

  // Auto-rotation when no paper is selected
  useFrame((state, delta) => {
    if (groupRef.current && !selectedPaper) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  // Handle paper click with camera animation
  const handlePaperClick = useCallback((paper, event) => {
    event.stopPropagation();
    onPaperClick(paper);
    onUniverseInteraction();
    
    // Smoothly move camera towards the paper
    const targetPosition = new THREE.Vector3(...paper.position);
    targetPosition.multiplyScalar(1.5); // Move a bit closer
    
    // Animate camera (simplified - in real implementation use tweening library)
    camera.position.lerp(targetPosition, 0.1);
  }, [onPaperClick, onUniverseInteraction, camera]);

  return (
    <group ref={groupRef}>
      {/* Research Papers as Glowing Orbs/Stars */}
      {filteredPapers.map((paper) => (
        <PaperStar 
          key={paper.id}
          paper={paper}
          isSelected={selectedPaper?.id === paper.id}
          isHighlighted={selectedPaper && connections.some(conn => 
            (conn.fromId === selectedPaper.id && conn.toId === paper.id) ||
            (conn.toId === selectedPaper.id && conn.fromId === paper.id)
          )}
          onClick={handlePaperClick}
        />
      ))}

      {/* Citation Connection Lines */}
      {connections.map((connection, index) => (
        <CitationLine 
          key={index}
          connection={connection}
          isVisible={!selectedPaper || 
            connection.fromId === selectedPaper?.id || 
            connection.toId === selectedPaper?.id
          }
        />
      ))}

      {/* Research Cluster Groupings */}
      {Array.from(new Set(filteredPapers.map(p => p.cluster))).map(clusterId => (
        <ResearchCluster 
          key={clusterId}
          papers={filteredPapers.filter(p => p.cluster === clusterId)}
          clusterId={clusterId}
        />
      ))}
    </group>
  );
}

// Individual paper visualization as a glowing star/orb
function PaperStar({ paper, isSelected, isHighlighted, onClick }) {
  const meshRef = useRef();
  const glowRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle pulsing for high-impact papers
      if (paper.pulsing) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
        meshRef.current.scale.setScalar(scale);
      }
      
      // Rotation for visual appeal
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.005;
    }
    
    // Glow effect
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  const opacity = isSelected ? 1 : isHighlighted ? 0.8 : 0.7;
  const scale = isSelected ? 1.5 : isHighlighted ? 1.2 : 1;

  return (
    <group position={paper.position}>
      {/* Main paper sphere */}
      <mesh 
        ref={meshRef}
        onClick={(e) => onClick(paper, e)}
        scale={[paper.size * scale, paper.size * scale, paper.size * scale]}
      >
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial 
          color={paper.color}
          emissive={paper.color}
          emissiveIntensity={paper.brightness * 0.3}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Glow effect */}
      <mesh ref={glowRef} scale={[paper.size * scale * 2, paper.size * scale * 2, paper.size * scale * 2]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial 
          color={paper.color}
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Paper info on hover/selection */}
      {(isSelected || isHighlighted) && (
        <Html distanceFactor={10}>
          <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white text-xs max-w-xs pointer-events-none">
            <h3 className="font-bold text-sm mb-1">{paper.title}</h3>
            <p className="text-gray-300">{paper.authors.join(', ')}</p>
            <p className="text-gray-400">{paper.year} • {paper.citations} citations</p>
            <div className="mt-2">
              <span 
                className="inline-block px-2 py-1 rounded text-xs"
                style={{ backgroundColor: paper.color + '40', color: paper.color }}
              >
                {paper.category}
              </span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Citation connection lines between papers
function CitationLine({ connection, isVisible }) {
  const lineRef = useRef();
  
  useFrame((state) => {
    if (lineRef.current && isVisible) {
      // Animate line opacity based on connection strength
      lineRef.current.material.opacity = 0.1 + connection.strength * 0.3 + 
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  if (!isVisible) return null;

  return (
    <Line
      ref={lineRef}
      points={[connection.from, connection.to]}
      color="#4FC3F7"
      lineWidth={connection.strength * 2}
      transparent
      opacity={0.2}
    />
  );
}

// Research cluster visualization (constellation-like groupings)
function ResearchCluster({ papers, clusterId }) {
  if (papers.length < 3) return null;

  // Calculate cluster center
  const center = papers.reduce(
    (acc, paper) => [
      acc[0] + paper.position[0] / papers.length,
      acc[1] + paper.position[1] / papers.length,
      acc[2] + paper.position[2] / papers.length
    ],
    [0, 0, 0]
  );

  return (
    <group>
      {/* Cluster connection web */}
      {papers.slice(0, 5).map((paper, index) => (
        <Line
          key={`cluster-${clusterId}-${index}`}
          points={[center, paper.position]}
          color="#9C27B0"
          lineWidth={0.5}
          transparent
          opacity={0.1}
        />
      ))}
      
      {/* Cluster center indicator */}
      <mesh position={center}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshBasicMaterial 
          color="#9C27B0"
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  );
}