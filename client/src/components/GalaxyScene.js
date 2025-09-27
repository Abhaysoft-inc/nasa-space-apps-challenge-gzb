'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
// Removed Sphere and Line from drei – keep only Html
import { Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Unified color palette for the whole page
const PALETTE = {
  light: '#f0e7e7', // text/accents on dark
  dark: '#451804',  // deep background brown
  accent1: '#c1440e', // brick orange
  accent2: '#e77d11', // warm orange
  accent3: '#fda600', // amber
};

// Research data generator - realistic NASA papers
const generateResearchGalaxy = () => {
  // Fallback patterns as data URIs for when external images fail
  const fallbackPatterns = {
    'Human Biology': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTUiIGZpbGw9IiNFRjQ0NDQiIGZpbGwtb3BhY2l0eT0iMC4zIi8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjgiIGZpbGw9IiNFRjQ0NDQiIGZpbGwtb3BhY2l0eT0iMC42Ii8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjMiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+',
    'Plant Biology': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDVMMjUgMTVIMTVMMjAgNVoiIGZpbGw9IiMxMEI5ODEiIGZpbGwtb3BhY2l0eT0iMC43Ii8+CjxwYXRoIGQ9Ik0yMCAzNUwxNSAyNUgyNUwyMCAzNVoiIGZpbGw9IiMxMEI5ODEiIGZpbGwtb3BhY2l0eT0iMC43Ii8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjMiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+',
    'Microbiology': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iNCIgZmlsbD0iIzNCODJGNiIgZmlsbC1vcGFjaXR5PSIwLjgiLz4KPGNpcmNsZSBjeD0iMjgiIGN5PSIxNSIgcj0iMyIgZmlsbD0iIzNCODJGNiIgZmlsbC1vcGFjaXR5PSIwLjYiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyOCIgcj0iNSIgZmlsbD0iIzNCODJGNiIgZmlsbC1vcGFjaXR5PSIwLjciLz4KPC9zdmc+',
    'Cell Biology': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGVsbGlwc2UgY3g9IjIwIiBjeT0iMjAiIHJ4PSIxNSIgcnk9IjEwIiBmaWxsPSIjOEI1Q0Y2IiBmaWxsLW9wYWNpdHk9IjAuMyIvPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSI2IiBmaWxsPSIjOEI1Q0Y2IiBmaWxsLW9wYWNpdHk9IjAuNyIvPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyIiBmaWxsPSIjRkZGRkZGIi8+Cjwvc3ZnPg==',
    'Radiation Effects': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDVMMjIgMThIMThMMjAgNVoiIGZpbGw9IiNGNTlFMEIiLz4KPHBhdGggZD0iTTM1IDIwTDIyIDIyTDIyIDE4TDM1IDIwWiIgZmlsbD0iI0Y1OUUwQiIvPgo8cGF0aCBkPSJNMjAgMzVMMTggMjJIMjJMMjAgMzVaIiBmaWxsPSIjRjU5RTBCIi8+CjxwYXRoIGQ9Ik01IDIwTDE4IDE4TDE4IDIyTDUgMjBaIiBmaWxsPSIjRjU5RTBCIi8+Cjwvc3ZnPg==',
    'Gravity Studies': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iNSIgeT0iMTgiIHdpZHRoPSIzMCIgaGVpZ2h0PSI0IiBmaWxsPSIjRUM0ODk5IiBmaWxsLW9wYWNpdHk9IjAuNyIvPgo8Y2lyY2xlIGN4PSIxMCIgY3k9IjIwIiByPSIzIiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjMwIiBjeT0iMjAiIHI9IjMiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+'
  };

  const categories = [
    { 
      name: 'Human Biology', 
      color: PALETTE.accent3, 
      position: [0, 20, 0],
      imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=512&q=60',
      fallbackUrl: fallbackPatterns['Human Biology'],
      texture: 'DNA_HELIX',
      description: 'Human physiological adaptation to space environments'
    },
    { 
      name: 'Plant Biology', 
      color: PALETTE.accent3, 
      position: [30, 10, -20],
      imageUrl: 'https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=512&q=60',
      fallbackUrl: fallbackPatterns['Plant Biology'],
      texture: 'PLANT_CELLS',
      description: 'Botanical research in microgravity conditions'
    },
    { 
      name: 'Microbiology', 
      color: PALETTE.accent3, 
      position: [-25, 0, 15],
      imageUrl: 'https://images.unsplash.com/photo-1559757175-0eb30cd92a79?auto=format&fit=crop&w=512&q=60',
      fallbackUrl: fallbackPatterns['Microbiology'],
      texture: 'BACTERIA',
      description: 'Microbial behavior in space environments'
    },
    { 
      name: 'Cell Biology', 
      color: PALETTE.accent3, 
      position: [15, -15, 25],
      imageUrl: 'https://images.unsplash.com/photo-1581091870622-7c77c9c1cf3f?auto=format&fit=crop&w=512&q=60',
      fallbackUrl: fallbackPatterns['Cell Biology'],
      texture: 'CELL_STRUCTURE',
      description: 'Cellular processes under cosmic radiation'
    },
    { 
      name: 'Radiation Effects', 
      color: PALETTE.accent3, 
      position: [-30, -10, -10],
      imageUrl: 'https://images.unsplash.com/photo-1529257414771-1960e7e0d8a5?auto=format&fit=crop&w=512&q=60',
      fallbackUrl: fallbackPatterns['Radiation Effects'],
      texture: 'COSMIC_RAYS',
      description: 'Impact of cosmic radiation on biological systems'
    },
    { 
      name: 'Gravity Studies', 
      color: PALETTE.accent3, 
      position: [5, 25, -30],
      imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=512&q=60',
      fallbackUrl: fallbackPatterns['Gravity Studies'],
      texture: 'SPACE_STATION',
      description: 'Gravitational effects on biological processes'
    }
  ];

  const eras = {
    '1990s': { years: [1990, 1999], papers: 45 },
    '2000s': { years: [2000, 2009], papers: 120 },
    '2010s': { years: [2010, 2019], papers: 280 },
    '2020s': { years: [2020, 2024], papers: 163 }
  };

  const papers = [];
  let paperId = 0;

  Object.entries(eras).forEach(([era, config]) => {
    for (let i = 0; i < config.papers; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const year = config.years[0] + Math.floor(Math.random() * (config.years[1] - config.years[0] + 1));
      const citations = Math.floor(Math.random() * 150) + 5;
      
      // Position papers in clusters around category centers
      const clusterSpread = 15;
      const position = [
        category.position[0] + (Math.random() - 0.5) * clusterSpread,
        category.position[1] + (Math.random() - 0.5) * clusterSpread,
        category.position[2] + (Math.random() - 0.5) * clusterSpread
      ];

      papers.push({
        id: paperId++,
        title: `${category.name} Research: ${generateResearchTitle(category.name)}`,
        authors: generateAuthors(),
        year,
        era,
        category: category.name,
        citations,
        color: category.color,
        imageUrl: category.imageUrl,
        fallbackUrl: category.fallbackUrl,
        texture: category.texture,
        description: category.description,
        position,
        size: Math.max(0.8, Math.log(citations + 1) * 0.4),
        connections: Math.floor(citations / 10),
        abstract: generateAbstract(category.name)
      });
    }
  });

  return papers;
};

// Simple spatial relaxation to reduce bubble overlaps (fast grid-based)
function relaxPositions(papers, {
  iterations = 6,
  cellSize = 4,
  padding = 0.3,
  bounds = 80
} = {}) {
  const getRadius = (p) => 1.6 * p.size; // account for ring radius visually

  for (let iter = 0; iter < iterations; iter++) {
    // Spatial hash grid
    const grid = new Map();
    const keyFor = (x, y, z) => `${Math.floor(x/cellSize)},${Math.floor(y/cellSize)},${Math.floor(z/cellSize)}`;

    papers.forEach((p, i) => {
      const [x,y,z] = p.position;
      const key = keyFor(x,y,z);
      const bucket = grid.get(key);
      if (bucket) bucket.push(i); else grid.set(key, [i]);
    });

    // Check neighbors in 27 surrounding cells
    const neighborOffsets = [];
    for (let dx=-1; dx<=1; dx++) for (let dy=-1; dy<=1; dy++) for (let dz=-1; dz<=1; dz++) neighborOffsets.push([dx,dy,dz]);

    papers.forEach((p, i) => {
      const r1 = getRadius(p);
      const pos = new THREE.Vector3(...p.position);
      const baseKey = keyFor(pos.x, pos.y, pos.z);

      neighborOffsets.forEach(([dx,dy,dz]) => {
        const [bx,by,bz] = baseKey.split(',').map(Number);
        const key = `${bx+dx},${by+dy},${bz+dz}`;
        const bucket = grid.get(key);
        if (!bucket) return;
        for (const j of bucket) {
          if (j <= i) continue; // avoid double work
          const q = papers[j];
          const r2 = getRadius(q);
          const pos2 = new THREE.Vector3(...q.position);
          const dir = pos2.clone().sub(pos);
          const dist = Math.max(0.0001, dir.length());
          const minDist = r1 + r2 + padding;
          if (dist < minDist) {
            // Push both apart
            const overlap = (minDist - dist) * 0.5;
            const n = dir.normalize();
            pos.addScaledVector(n, -overlap);
            pos2.addScaledVector(n, overlap);
            // write back
            p.position = [
              THREE.MathUtils.clamp(pos.x, -bounds, bounds),
              THREE.MathUtils.clamp(pos.y, -bounds, bounds),
              THREE.MathUtils.clamp(pos.z, -bounds, bounds)
            ];
            q.position = [
              THREE.MathUtils.clamp(pos2.x, -bounds, bounds),
              THREE.MathUtils.clamp(pos2.y, -bounds, bounds),
              THREE.MathUtils.clamp(pos2.z, -bounds, bounds)
            ];
          }
        }
      });
    });
  }
  return papers;
}

const generateResearchTitle = (category) => {
  const titles = {
    'Human Biology': ['Bone Density Changes in Microgravity', 'Cardiovascular Adaptation to Space', 'Muscle Atrophy Prevention'],
    'Plant Biology': ['Plant Growth in Space Environments', 'Photosynthesis Under Cosmic Radiation', 'Crop Cultivation for Mars'],
    'Microbiology': ['Bacterial Behavior in Microgravity', 'Immune System Response in Space', 'Pathogen Studies Aboard ISS'],
    'Cell Biology': ['Cellular Adaptation to Space', 'DNA Repair in Cosmic Radiation', 'Protein Expression Changes'],
    'Radiation Effects': ['Cosmic Ray Impact on Biology', 'Radiation Shielding Research', 'Long-term Exposure Studies'],
    'Gravity Studies': ['Gravitational Biology Effects', 'Spatial Orientation in Zero-G', 'Balance System Research']
  };
  return titles[category][Math.floor(Math.random() * titles[category].length)];
};

const generateAuthors = () => {
  const names = ['Dr. Sarah Chen', 'Dr. Michael Rodriguez', 'Dr. Emily Johnson', 'Dr. David Kim', 'Dr. Lisa Anderson'];
  const count = Math.floor(Math.random() * 3) + 2;
  return Array.from({ length: count }, () => names[Math.floor(Math.random() * names.length)]);
};

const generateAbstract = (category) => {
  return `This groundbreaking study examines ${category.toLowerCase()} in space environments, providing critical insights for future Mars missions and long-duration spaceflight. Our research reveals significant implications for astronaut health and mission success.`;
};

export default function GalaxyScene({ onPaperClick, currentEra, selectedCategory, searchTerm, selectedPaper, isPlaying = true }) {
  const groupRef = useRef();
  const [hoveredPaper, setHoveredPaper] = useState(null);
  const { camera } = useThree();
  
  // Generate research papers
  const allPapers = useMemo(() => generateResearchGalaxy(), []);
  
  // Filter papers based on era and category
  const visiblePapers = useMemo(() => {
    return allPapers.filter(paper => {
      const matchesEra = currentEra === 'all' || paper.era === currentEra;
      const matchesFilter = selectedCategory === 'all' || paper.category === selectedCategory;
      return matchesEra && matchesFilter;
    });
  }, [allPapers, currentEra, selectedCategory]);

  // Generate connections between papers
  const connections = useMemo(() => {
    const conns = [];
    visiblePapers.forEach(paper => {
      const connectionCount = Math.min(paper.connections, 4);
      for (let i = 0; i < connectionCount; i++) {
        const targetPaper = visiblePapers[Math.floor(Math.random() * visiblePapers.length)];
        if (targetPaper.id !== paper.id && targetPaper.year <= paper.year) {
          conns.push({
            from: paper.position,
            to: targetPaper.position,
            fromId: paper.id,
            toId: targetPaper.id,
            color: paper.color
          });
        }
      }
    });
    return conns;
  }, [visiblePapers]);

  // Auto-rotate galaxy (pause when not playing)
  useFrame((state, delta) => {
    if (groupRef.current && !selectedPaper && isPlaying) {
      groupRef.current.rotation.y += delta * 0.06;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Research Papers as Stars */}
      {visiblePapers.map((paper) => (
        <ResearchStar
          key={paper.id}
          paper={paper}
          isSelected={selectedPaper?.id === paper.id}
          isHovered={hoveredPaper?.id === paper.id}
          isHighlighted={selectedPaper && connections.some(conn => 
            (conn.fromId === selectedPaper.id && conn.toId === paper.id) ||
            (conn.toId === selectedPaper.id && conn.fromId === paper.id)
          )}
          onClick={() => onPaperClick(paper)}
          onHover={setHoveredPaper}
          isPlaying={isPlaying}
        />
      ))}

      {/* Citation Connections */}
      {connections.map((conn, index) => (
        <CitationLink
          key={`${conn.fromId}-${conn.toId}-${index}`}
          connection={conn}
          isVisible={!selectedPaper || 
            conn.fromId === selectedPaper?.id || 
            conn.toId === selectedPaper?.id
          }
          isPlaying={isPlaying}
        />
      ))}

      {/* Category Centers - subtle indicators (recolor to palette and dim) */}
      {['Human Biology', 'Plant Biology', 'Microbiology', 'Cell Biology', 'Radiation Effects', 'Gravity Studies'].map((category, index) => {
        const positions = [[0, 20, 0], [30, 10, -20], [-25, 0, 15], [15, -15, 25], [-30, -10, -10], [5, 25, -30]];
        return (
          <mesh key={category} position={positions[index]} raycast={null}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshBasicMaterial 
              color={PALETTE.light}
              transparent 
              opacity={selectedCategory === category ? 0.18 : 0.08}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Scientific Research Visual Component with Real Imagery
function ResearchStar({ paper, isSelected, isHovered, isHighlighted, onClick, onHover, isPlaying }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const [texture, setTexture] = useState(null);

  // Load texture from URL
  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);
  
  // Load image texture with better error handling and fallback
  useEffect(() => {
    let cancelled = false;
    let loadedTexture = null;

    const loadTexture = (url, isFallback = false) => {
      if (!url) return;

      textureLoader.crossOrigin = 'anonymous';
      textureLoader.load(
        url,
        (tex) => {
          if (cancelled) return;
          loadedTexture = tex;
          tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = false;
          tex.anisotropy = 8;
          // use .colorSpace for modern three, ignore if older (no-op)
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.flipY = false;
          setTexture(tex);
        },
        undefined,
        () => {
          if (!isFallback && paper.fallbackUrl) {
            loadTexture(paper.fallbackUrl, true);
          } else {
            setTexture(null);
          }
        }
      );
    };

    if (paper.imageUrl) {
      loadTexture(paper.imageUrl);
    } else if (paper.fallbackUrl) {
      loadTexture(paper.fallbackUrl, true);
    }

    return () => {
      cancelled = true;
      if (loadedTexture) {
        loadedTexture.dispose?.();
      }
    };
  }, [paper.imageUrl, paper.fallbackUrl, textureLoader]);

  // Animation loop (paused when not playing)
  useFrame((state) => {
    if (meshRef.current) {
      if (isPlaying) {
        // Very gentle rotation
        meshRef.current.rotation.y += 0.002;
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2 + paper.id * 0.1) * 0.02;
        // Very subtle floating
        meshRef.current.position.y = paper.position[1] + Math.sin(state.clock.elapsedTime * 0.4 + paper.id * 0.2) * 0.03;
      } else {
        meshRef.current.position.y = paper.position[1];
      }
    }

    if (glowRef.current) {
      if (isPlaying) {
        // Tiny subtle glow
        const glowIntensity = 0.08 + Math.sin(state.clock.elapsedTime * 0.6 + paper.id * 0.05) * 0.05;
        glowRef.current.material.opacity = glowIntensity;
      } else {
        glowRef.current.material.opacity = 0.12; // steady glow
      }
    }
  });

  // Make all bubbles tiny; enlarge a bit on hover
  const STAR_SIZE = 0.14;
  const scaleFactor = isHovered ? 1.6 : 1.0;
  const scale = STAR_SIZE * scaleFactor;
  const opacity = 0.95;

  return (
    <group position={paper.position}>
      {/* Main Scientific Sphere */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
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
        scale={[scale, scale, scale]}
      >
        <sphereGeometry args={[1.0, 16, 16]} />
        {/* Core dot: black fill */}
        <meshBasicMaterial color="#000000" transparent opacity={opacity} />
      </mesh>

      {/* Star border: thin white ring slightly larger than core */}
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={[scale, scale, 1]} raycast={null}>
        <ringGeometry args={[1.1, 1.35, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* Shine glow: soft additive white spheres for a star-like blur */}
      <mesh ref={glowRef} scale={[scale * 1.7, scale * 1.7, scale * 1.7]} raycast={null}>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.16} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh scale={[scale * 2.2, scale * 2.2, scale * 2.2]} raycast={null}>
        <sphereGeometry args={[0.9, 12, 12]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Removed yellow/orange indicator meshes for a cleaner star-only look */}

      {/* Research Info Display */}
      {(isSelected || isHovered) && (
        // Fixed-size, stable pop-up (no distance-based scaling)
        <Html position={[0, scale + 2.5, 0]}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#451804]/95 backdrop-blur-lg rounded-lg p-4 text-[#f0e7e7] text-sm w-80 h-48 overflow-hidden border border-[#f0e7e7]/20 pointer-events-none shadow-2xl"
            style={{ transform: 'translate(-50%, -100%)' }}
          >
            <h3 className="font-bold mb-2 leading-tight" style={{color: PALETTE.accent2}}>{paper.title}</h3>
            <p className="text-xs mb-2" style={{color: '#f0e7e7'}}>{paper.authors.slice(0, 2).join(', ')}</p>
            
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="opacity-80">{paper.year} • {paper.era}</span>
              <span className="font-semibold" style={{color: PALETTE.accent3}}>{paper.citations} citations</span>
            </div>
            
            {paper.description && (
              <p className="text-xs mb-3 border-t pt-2 leading-relaxed" style={{borderColor: '#f0e7e733'}}>
                {paper.description}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <span 
                className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: '#f0e7e71f', color: PALETTE.accent2, border: `1px solid ${PALETTE.accent2}66` }}
              >
                {paper.category}
              </span>
              
              <div className="text-xs opacity-80">
                {paper.texture}
              </div>
            </div>
          </motion.div>
        </Html>
      )}
    </group>
  );
}

// Citation Connection Lines
function CitationLink({ connection, isVisible, isPlaying = true }) {
  const meshRef = useRef();

  // Compute cylinder transform to connect two points
  const { mid, length, quat } = useMemo(() => {
    const a = new THREE.Vector3(...connection.from);
    const b = new THREE.Vector3(...connection.to);
    const dir = new THREE.Vector3().subVectors(b, a);
    const len = dir.length() || 0.0001;
    const midpoint = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize()
    );
    return { mid: midpoint, length: len, quat: q };
  }, [connection.from, connection.to]);

  useFrame((state) => {
    if (!isVisible || !meshRef.current) return;
    const mat = meshRef.current.material;
    if (!mat) return;
    if (isPlaying) {
      const t = state.clock.elapsedTime;
      const a = 0.15 + Math.sin(t * 0.8 + connection.fromId * 0.1) * 0.1;
      mat.opacity = Math.max(0.08, a);
    } else {
      mat.opacity = 0.2;
    }
  });

  if (!isVisible) return null;

  return (
    <mesh
      ref={meshRef}
      position={mid}
      quaternion={quat}
      scale={[1, length, 1]}
      frustumCulled={true}
      raycast={null}
    >
      {/* Unit-height slim cylinder aligned on Y, scaled to length */}
      <cylinderGeometry args={[0.03, 0.03, 1, 16]} />
      <meshStandardMaterial 
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={0.25}
        metalness={0.8}
        roughness={0.2}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}