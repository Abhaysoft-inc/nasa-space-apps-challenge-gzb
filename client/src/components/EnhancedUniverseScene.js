'use client';

import { useRef, useMemo, useCallback, useState } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import { Sphere, Html, Trail, Sparkles, shaderMaterial, Line } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Custom shader for realistic star glow effect
const StarGlowMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color(0.2, 0.1, 1.0),
    intensity: 1.0,
    pulseSpeed: 1.0,
  },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform float time;
    uniform vec3 color;
    uniform float intensity;
    uniform float pulseSpeed;
    varying vec2 vUv;
    
    void main() {
      vec2 center = vec2(0.5);
      float dist = distance(vUv, center);
      
      float glow = 1.0 - smoothstep(0.0, 0.5, dist);
      glow = pow(glow, 2.0);
      
      float pulse = sin(time * pulseSpeed) * 0.3 + 0.7;
      glow *= pulse;
      
      float core = 1.0 - smoothstep(0.0, 0.1, dist);
      core = pow(core, 4.0);
      
      vec3 finalColor = color * intensity;
      float alpha = glow + core;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
);

extend({ StarGlowMaterial });

// Enhanced realistic paper generation
const generateRealisticPapers = () => {
  const categories = [
    { 
      name: 'Human Biology', 
      color: '#EF4444', 
      glowColor: [0.93, 0.26, 0.26],
      keywords: ['bone density', 'muscle atrophy', 'cardiovascular', 'human physiology'],
    },
    { 
      name: 'Plant Biology', 
      color: '#10B981', 
      glowColor: [0.06, 0.72, 0.50],
      keywords: ['plant growth', 'photosynthesis', 'agriculture', 'botany'],
    },
    { 
      name: 'Microbiology', 
      color: '#3B82F6', 
      glowColor: [0.23, 0.51, 0.96],
      keywords: ['microorganisms', 'bacteria', 'infection', 'immune system'],
    },
    { 
      name: 'Cell Biology', 
      color: '#8B5CF6', 
      glowColor: [0.54, 0.36, 0.96],
      keywords: ['cellular', 'DNA', 'protein synthesis', 'gene expression'],
    },
    { 
      name: 'Radiation Effects', 
      color: '#F59E0B', 
      glowColor: [0.96, 0.62, 0.04],
      keywords: ['cosmic radiation', 'radiation protection', 'exposure effects'],
    },
    { 
      name: 'Gravity Studies', 
      color: '#EC4899', 
      glowColor: [0.92, 0.28, 0.60],
      keywords: ['microgravity', 'weightlessness', 'gravitational effects'],
    }
  ];

  const papers = [];
  const firstNames = ['John', 'Sarah', 'Michael', 'Lisa', 'David', 'Emily', 'Robert', 'Jennifer', 'Christopher', 'Maria'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  
  for (let i = 0; i < 608; i++) {
    const selectedCategory = categories[Math.floor(Math.random() * categories.length)];
    
    // Realistic year distribution
    const yearWeight = Math.random();
    let year;
    if (yearWeight < 0.4) year = 2010 + Math.floor(Math.random() * 15);
    else if (yearWeight < 0.7) year = 2000 + Math.floor(Math.random() * 10);
    else year = 1990 + Math.floor(Math.random() * 10);

    const citations = Math.floor(Math.pow(Math.random(), 2) * 200);
    const connections = Math.floor(Math.random() * 25 + 5);
    
    // 3D clustering for realistic distribution
    const clusterAngle = (i / 608) * Math.PI * 2 * 3; // Multiple spirals
    const clusterRadius = 30 + Math.random() * 60;
    const clusterHeight = (Math.random() - 0.5) * 40;
    
    const position = [
      Math.cos(clusterAngle) * clusterRadius + (Math.random() - 0.5) * 20,
      clusterHeight + (Math.random() - 0.5) * 20,
      Math.sin(clusterAngle) * clusterRadius + (Math.random() - 0.5) * 20
    ];
    
    papers.push({
      id: i,
      title: `${selectedCategory.keywords[Math.floor(Math.random() * selectedCategory.keywords.length)].replace(/^\\w/, c => c.toUpperCase())} Research: Effects in Microgravity`,
      authors: Array.from({ length: Math.floor(Math.random() * 3) + 2 }, () => 
        `Dr. ${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`
      ),
      year,
      category: selectedCategory.name,
      citations,
      connections,
      color: selectedCategory.color,
      glowColor: selectedCategory.glowColor,
      abstract: `This study investigates ${selectedCategory.keywords[0]} in space environments, providing crucial insights for future Mars missions and deep space exploration. Our research reveals significant implications for long-duration spaceflight.`,
      position,
      size: Math.max(0.5, Math.log(citations + 1) * 0.3),
      brightness: Math.max(0.5, (year - 1990) / 34),
      pulsing: citations > 75,
      cluster: Math.floor(i / 100),
      velocity: [
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.005
      ]
    });
  }
  
  return papers;
};

export default function UniverseScene({ 
  onPaperClick, 
  onUniverseInteraction,
  searchQuery,
  selectedCategory,
  timeRange,
  selectedPaper 
}) {
  const groupRef = useRef();
  const { camera, raycaster, mouse } = useThree();
  const [papers] = useState(() => generateRealisticPapers());
  const [hoveredPaper, setHoveredPaper] = useState(null);
  
  // Filter papers
  const filteredPapers = useMemo(() => {
    return papers.filter(paper => {
      const matchesSearch = !searchQuery || 
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || 
        paper.category === selectedCategory;
      
      const matchesTime = paper.year >= timeRange[0] && paper.year <= timeRange[1];
      
      return matchesSearch && matchesCategory && matchesTime;
    });
  }, [papers, searchQuery, selectedCategory, timeRange]);

  // Generate connections
  const connections = useMemo(() => {
    const conns = [];
    filteredPapers.forEach(paper => {
      const numConnections = Math.min(paper.connections, 6);
      for (let i = 0; i < numConnections; i++) {
        const potentialTargets = filteredPapers.filter(p => 
          p.id !== paper.id && 
          p.year <= paper.year && 
          Math.abs(p.year - paper.year) <= 8
        );
        
        if (potentialTargets.length > 0) {
          const targetPaper = potentialTargets[Math.floor(Math.random() * potentialTargets.length)];
          conns.push({
            from: paper.position,
            to: targetPaper.position,
            strength: Math.random() * 0.8 + 0.2,
            fromId: paper.id,
            toId: targetPaper.id,
            color: paper.color
          });
        }
      }
    });
    return conns;
  }, [filteredPapers]);

  // Animation loop
  useFrame((state, delta) => {
    if (groupRef.current && !selectedPaper) {
      groupRef.current.rotation.y += delta * 0.03;
    }

    // Animate paper positions
    filteredPapers.forEach((paper, index) => {
      if (groupRef.current?.children[index]) {
        const paperGroup = groupRef.current.children[index];
        paperGroup.position.x += paper.velocity[0] * delta * 10;
        paperGroup.position.y += paper.velocity[1] * delta * 10;
        paperGroup.position.z += paper.velocity[2] * delta * 10;
        
        // Boundary bounce
        if (Math.abs(paperGroup.position.x) > 100) paper.velocity[0] *= -1;
        if (Math.abs(paperGroup.position.y) > 100) paper.velocity[1] *= -1;
        if (Math.abs(paperGroup.position.z) > 100) paper.velocity[2] *= -1;
      }
    });
  });

  // Enhanced click handling
  const handlePaperClick = useCallback((paper, event) => {
    event.stopPropagation();
    onPaperClick(paper);
    onUniverseInteraction();
    
      // Debug log removed
    
    // Smooth camera movement
    const targetPosition = new THREE.Vector3(...paper.position);
    targetPosition.normalize().multiplyScalar(50);
    
    // Animate camera
    const startPos = camera.position.clone();
    let progress = 0;
    
    const animateCamera = () => {
      progress += 0.02;
      if (progress < 1) {
        camera.position.lerpVectors(startPos, targetPosition, progress);
        camera.lookAt(new THREE.Vector3(...paper.position));
        requestAnimationFrame(animateCamera);
      }
    };
    animateCamera();
  }, [onPaperClick, onUniverseInteraction, camera]);

  return (
    <group ref={groupRef}>
      {/* Enhanced Research Papers */}
      {filteredPapers.map((paper, index) => (
        <EnhancedPaperStar 
          key={paper.id}
          paper={paper}
          isSelected={selectedPaper?.id === paper.id}
          isHighlighted={selectedPaper && connections.some(conn => 
            (conn.fromId === selectedPaper.id && conn.toId === paper.id) ||
            (conn.toId === selectedPaper.id && conn.fromId === paper.id)
          )}
          isHovered={hoveredPaper?.id === paper.id}
          onClick={handlePaperClick}
          onHover={setHoveredPaper}
        />
      ))}

      {/* Connection Lines */}
      {connections.map((connection, index) => (
        <EnhancedCitationLine 
          key={`${connection.fromId}-${connection.toId}-${index}`}
          connection={connection}
          isVisible={!selectedPaper || 
            connection.fromId === selectedPaper?.id || 
            connection.toId === selectedPaper?.id
          }
        />
      ))}

      {/* Cosmic Environment Effects */}
      <Sparkles 
        count={300}
        scale={[200, 200, 200]}
        size={1.5}
        speed={0.4}
        opacity={0.4}
        color="#4FC3F7"
      />
    </group>
  );
}

// Enhanced Paper Star Component
function EnhancedPaperStar({ paper, isSelected, isHighlighted, isHovered, onClick, onHover }) {
  const meshRef = useRef();
  const glowRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      // Pulsing effect
      if (paper.pulsing) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
        meshRef.current.scale.setScalar(scale);
      }
      
      // Gentle rotation
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.003;
      
      // Update shader time
        const uniforms = meshRef.current.material?.uniforms;
        if (uniforms && uniforms.time) {
          uniforms.time.value = state.clock.elapsedTime;
        }
    }
  });

  const baseScale = paper.size * (isSelected ? 2.5 : isHighlighted ? 1.8 : isHovered ? 1.5 : 1.0);
  
  return (
    <group position={paper.position}>
      {/* Trailing Effect */}
      <Trail
        width={paper.size * 0.3}
        length={8}
        color={paper.color}
        attenuation={(width) => width * 0.8}
      >
        {/* Main Star */}
        <mesh 
          ref={meshRef}
          onClick={(e) => {
              // Debug log removed
            onClick(paper, e);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(paper);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            onHover(null);
            document.body.style.cursor = 'auto';
          }}
          scale={[baseScale, baseScale, baseScale]}
        >
          <sphereGeometry args={[1, 24, 24]} />
          <starGlowMaterial
            color={paper.glowColor}
            intensity={paper.brightness * 1.5}
            pulseSpeed={paper.pulsing ? 2.0 : 0.8}
            transparent
          />
        </mesh>
      </Trail>

      {/* Outer Glow */}
      <mesh ref={glowRef} scale={[baseScale * 2.5, baseScale * 2.5, baseScale * 2.5]} raycast={null}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial 
          color={paper.color}
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* High-Impact Corona */}
      {paper.citations > 100 && (
        <mesh scale={[baseScale * 4, baseScale * 4, baseScale * 4]} raycast={null}>
          <ringGeometry args={[0.9, 1.1, 32]} />
          <meshBasicMaterial 
            color={paper.color}
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Info Panel */}
      {(isSelected || isHighlighted || isHovered) && (
        <Html distanceFactor={12} position={[0, baseScale + 2, 0]}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-black/95 backdrop-blur-xl rounded-xl p-4 text-white text-sm max-w-xs pointer-events-none border border-white/30 shadow-2xl"
            style={{ transform: 'translate(-50%, -100%)' }}
          >
            <h3 className="font-bold text-base mb-2 text-blue-300 leading-tight">
              {paper.title}
            </h3>
            <p className="text-gray-300 mb-2 text-xs">
              {paper.authors.slice(0, 2).join(', ')}{paper.authors.length > 2 ? ` +${paper.authors.length - 2} more` : ''}
            </p>
            <p className="text-gray-400 text-xs mb-3">
              {paper.year} • {paper.citations} citations • {paper.connections} connections
            </p>
            <div className="mb-2">
              <span 
                className="inline-block px-2 py-1 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: paper.color + '20', 
                  color: paper.color,
                  border: `1px solid ${paper.color}40`
                }}
              >
                {paper.category}
              </span>
            </div>
            <p className="text-gray-300 text-xs leading-relaxed line-clamp-3">
              {paper.abstract.substring(0, 120)}...
            </p>
          </motion.div>
        </Html>
      )}
    </group>
  );
}

// Enhanced Citation Lines
function EnhancedCitationLine({ connection, isVisible }) {
  const lineRef = useRef();
  
  useFrame((state) => {
    if (lineRef.current && isVisible) {
      const opacity = 0.1 + connection.strength * 0.3 + 
        Math.sin(state.clock.elapsedTime * 1.5 + connection.fromId * 0.1) * 0.05;
      lineRef.current.material.opacity = Math.max(0.05, opacity);
    }
  });

  if (!isVisible) return null;

  return (
    <Line
      ref={lineRef}
      points={[connection.from, connection.to]}
      color={connection.color}
      lineWidth={connection.strength * 2}
      transparent
      opacity={0.2}
      raycast={null}
    />
  );
}