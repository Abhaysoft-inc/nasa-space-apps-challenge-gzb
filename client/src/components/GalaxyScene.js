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

// Real NASA/NCBI Research Papers
const REAL_RESEARCH_PAPERS = [
  // Human Biology & Microgravity Studies
  { title: "Mice in Bion-M 1 space mission: training and selection", category: "Human Biology", year: 2018 },
  { title: "Microgravity induces pelvic bone loss through osteoclastic activity", category: "Human Biology", year: 2019 },
  { title: "Stem Cell Health and Tissue Regeneration in Microgravity", category: "Human Biology", year: 2021 },
  { title: "Microgravity Reduces Differentiation of Embryonic Stem Cells", category: "Cell Biology", year: 2020 },
  { title: "RNA isolation and multiplex PCR on International Space Station", category: "Microbiology", year: 2017 },
  { title: "Spaceflight Modulates Oxidative Stress in Heart", category: "Human Biology", year: 2021 },
  { title: "Ion-Dependent Effects in Space-Like Radiation Response", category: "Radiation Effects", year: 2017 },
  { title: "NASA life sciences translational research for exploration", category: "Human Biology", year: 2017 },
  
  // Plant Biology & Gravitropism
  { title: "AtRabD2b and AtRabD2c in pollen development", category: "Plant Biology", year: 2011 },
  { title: "TNO1 salt tolerance and vacuolar trafficking in Arabidopsis", category: "Plant Biology", year: 2011 },
  { title: "trans-Golgi network SNARE family in Arabidopsis thaliana", category: "Plant Biology", year: 2024 },
  { title: "Root growth movements: Waving and skewing", category: "Gravity Studies", year: 2017 },
  { title: "Gravitropism and lateral root emergence depend on TNO1", category: "Gravity Studies", year: 2015 },
  { title: "TNO1 modulates root skewing in Arabidopsis", category: "Plant Biology", year: 2017 },
  { title: "Regulation of plant gravity sensing by actin cytoskeleton", category: "Gravity Studies", year: 2021 },
  
  // Drosophila & Space Biology
  { title: "Drosophila SUN protein Spag4 cooperates with Yuri Gagarin", category: "Cell Biology", year: 2010 },
  { title: "Toll infection response altered by gravity in Drosophila", category: "Microbiology", year: 2014 },
  { title: "Innate immune responses of Drosophila altered by spaceflight", category: "Microbiology", year: 2020 },
  { title: "Microgravity Reduces Cardiac Contractility in Drosophila", category: "Human Biology", year: 2021 },
  
  // GeneLab & Space Omics
  { title: "Multi-omics analysis reveals lipid dysregulation in mouse liver", category: "Cell Biology", year: 2020 },
  { title: "GeneLab analyses suggest cardiovascular impact via FYN activation", category: "Human Biology", year: 2019 },
  { title: "NASA GeneLab platform for biological response to space radiation", category: "Radiation Effects", year: 2020 },
  { title: "Circulating miRNA spaceflight signature reveals targets", category: "Cell Biology", year: 2021 },
  { title: "Machine learning for ISS surface microbiome antimicrobial resistance", category: "Microbiology", year: 2022 },
  
  // Space Medicine & Cancer
  { title: "Extraterrestrial Gynecology: Cancer Risk in Female Astronauts", category: "Radiation Effects", year: 2022 },
  { title: "Muscle atrophy gene expression during spaceflight", category: "Human Biology", year: 2022 },
  { title: "Chromosomal positioning and DNA methylation from cosmic radiation", category: "Radiation Effects", year: 2024 },
  { title: "Aging and frailty biomarkers altered by spaceflight", category: "Human Biology", year: 2024 },
  { title: "Space radiation damage rescued by miRNA inhibition", category: "Radiation Effects", year: 2024 },
  
  // Tardigrades & Extreme Survival
  { title: "Evidence for horizontal gene transfer in tardigrade genome", category: "Cell Biology", year: 2015 },
  { title: "Tardigrades Use Disordered Proteins to Survive Desiccation", category: "Cell Biology", year: 2024 },
  { title: "Biology of tardigrade disordered proteins in stress tolerance", category: "Cell Biology", year: 2024 },
  { title: "Reactive oxygen species in tardigrade anhydrobiosis", category: "Cell Biology", year: 2022 },
  
  // Bone & Musculoskeletal Studies
  { title: "Partial weight suspension: novel murine model", category: "Human Biology", year: 2013 },
  { title: "Partial reductions in mechanical loading yield bone changes", category: "Human Biology", year: 2014 },
  { title: "Spaceflight and electrical impedance in mouse muscle", category: "Human Biology", year: 2015 },
  { title: "Spaceflight Activates Lipotoxic Pathways in Mouse Liver", category: "Human Biology", year: 2019 },
  
  // Mechanosensitive Channels
  { title: "S. aureus MscL is a pentamer with variable stoichiometries", category: "Microbiology", year: 2010 },
  { title: "Manipulating permeation through MscL nanovalve", category: "Microbiology", year: 2011 },
  { title: "MscS and MscL as microbial emergency release valves", category: "Microbiology", year: 2012 },
  
  // Additional Studies
  { title: "High-precision method for cyclic loading of vertebrae", category: "Human Biology", year: 2018 },
  { title: "Effects of ionizing radiation on mouse vertebrae collagen", category: "Radiation Effects", year: 2018 },
  { title: "Brassinosteroids inhibit root straightening via actin organization", category: "Plant Biology", year: 2020 },
  { title: "Cell type-specific calcium signaling in Arabidopsis roots", category: "Plant Biology", year: 2020 },
  { title: "Microgravity Stress: Bone and Connective Tissue", category: "Human Biology", year: 2024 }
];

// Research data generator using real papers
const generateResearchGalaxy = (categoriesParam) => {
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
      color: '#FF6B6B', // Coral red gradient
      gradientColor: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
      position: [0, 20, 0],
      description: 'Human physiological adaptation to space environments'
    },
    { 
      name: 'Plant Biology', 
      color: '#4ECDC4', // Turquoise gradient 
      gradientColor: 'linear-gradient(135deg, #4ECDC4 0%, #6FE6DD 100%)',
      position: [30, 10, -20],
      description: 'Botanical research in microgravity conditions'
    },
    { 
      name: 'Microbiology', 
      color: '#45B7D1', // Ocean blue gradient
      gradientColor: 'linear-gradient(135deg, #45B7D1 0%, #68C5E8 100%)',
      position: [-25, 0, 15],
      description: 'Microbial behavior in space environments'
    },
    { 
      name: 'Cell Biology', 
      color: '#96CEB4', // Sage green gradient
      gradientColor: 'linear-gradient(135deg, #96CEB4 0%, #B5DCC7 100%)',
      position: [15, -15, 25],
      description: 'Cellular processes under cosmic radiation'
    },
    { 
      name: 'Radiation Effects', 
      color: '#FECA57', // Golden yellow gradient
      gradientColor: 'linear-gradient(135deg, #FECA57 0%, #FFD77A 100%)',
      position: [-30, -10, -10],
      description: 'Impact of cosmic radiation on biological systems'
    },
    { 
      name: 'Gravity Studies', 
      color: '#FF9FF3', // Pink-purple gradient
      gradientColor: 'linear-gradient(135deg, #FF9FF3 0%, #FFB8F5 100%)',
      position: [5, 25, -30],
      description: 'Gravitational effects on biological processes'
    }
  ];

  const eras = {
    '1990s': { years: [1990, 1999], papers: 8 },
    '2000s': { years: [2000, 2009], papers: 12 },
    '2010s': { years: [2010, 2019], papers: 15 },
    '2020s': { years: [2020, 2024], papers: 10 }
  };

  const papers = [];
  let paperId = 0;

  // Shuffle the real papers and distribute them across eras
  const shuffledPapers = [...REAL_RESEARCH_PAPERS].sort(() => Math.random() - 0.5);
  
  Object.entries(eras).forEach(([era, config]) => {
    for (let i = 0; i < config.papers && paperId < shuffledPapers.length; i++) {
      const realPaper = shuffledPapers[paperId];
      const category = categoriesParam.find(cat => cat.name === realPaper.category) || categoriesParam[0];
      const citations = Math.floor(Math.random() * 150) + 10;
      
      // Position papers in clusters around category centers with more spread
      const clusterSpread = 35;
      const position = [
        category.position[0] + (Math.random() - 0.5) * clusterSpread,
        category.position[1] + (Math.random() - 0.5) * clusterSpread,
        category.position[2] + (Math.random() - 0.5) * clusterSpread
      ];

      papers.push({
        id: paperId++,
        title: realPaper.title,
        authors: generateAuthors(), // Keep generated authors for variety
        year: realPaper.year,
        era,
        category: category.name,
        citations,
        color: category.color,
        gradientColor: category.gradientColor,
        description: category.description,
        position,
        size: Math.max(1.2, Math.log(citations + 10) * 0.6), // Better size scaling
        connections: Math.min(3, Math.floor(citations / 20)), // Limit connections
        abstract: generateAbstract(category.name)
      });
    }
  });

  // Apply spatial relaxation to prevent overlap
  return relaxPositions(papers);
};

// Simple spatial relaxation to reduce bubble overlaps (fast grid-based)
function relaxPositions(papers, {
  iterations = 8,
  cellSize = 8,
  padding = 1.5, // More padding for larger bubbles
  bounds = 120 // Larger bounds for spread
} = {}) {
  const getRadius = (p) => 3.0 * (p.size || 1); // account for larger bubble sizes

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
  
  // Define categories inside component to avoid scope issues
  const categories = useMemo(() => [
    { 
      name: 'Human Biology', 
      color: '#FF6B6B', // Coral red gradient
      gradientColor: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
      position: [0, 20, 0],
      description: 'Human physiological adaptation to space environments'
    },
    { 
      name: 'Plant Biology', 
      color: '#4ECDC4', // Turquoise gradient 
      gradientColor: 'linear-gradient(135deg, #4ECDC4 0%, #6FE6DD 100%)',
      position: [30, 10, -20],
      description: 'Botanical research in microgravity conditions'
    },
    { 
      name: 'Microbiology', 
      color: '#45B7D1', // Ocean blue gradient
      gradientColor: 'linear-gradient(135deg, #45B7D1 0%, #68C5E8 100%)',
      position: [-25, 0, 15],
      description: 'Microbial behavior in space environments'
    },
    { 
      name: 'Cell Biology', 
      color: '#96CEB4', // Sage green gradient
      gradientColor: 'linear-gradient(135deg, #96CEB4 0%, #B5DCC7 100%)',
      position: [15, -15, 25],
      description: 'Cellular processes under cosmic radiation'
    },
    { 
      name: 'Radiation Effects', 
      color: '#FECA57', // Golden yellow gradient
      gradientColor: 'linear-gradient(135deg, #FECA57 0%, #FFD77A 100%)',
      position: [-30, -10, -10],
      description: 'Impact of cosmic radiation on biological systems'
    },
    { 
      name: 'Gravity Studies', 
      color: '#FF9FF3', // Pink-purple gradient
      gradientColor: 'linear-gradient(135deg, #FF9FF3 0%, #FFB8F5 100%)',
      position: [5, 25, -30],
      description: 'Gravitational effects on biological processes'
    }
  ], []);
  
  // Generate research papers using categories
  const allPapers = useMemo(() => {
    return generateResearchGalaxy(categories);
  }, [categories]);
  
  // Filter papers based on era and category
  const visiblePapers = useMemo(() => {
    return allPapers.filter(paper => {
      const matchesEra = currentEra === 'all' || paper.era === currentEra;
      const matchesFilter = selectedCategory === 'all' || paper.category === selectedCategory;
      return matchesEra && matchesFilter;
    });
  }, [allPapers, currentEra, selectedCategory]);

  // Generate meaningful connections between papers
  const connections = useMemo(() => {
    const conns = [];
    visiblePapers.forEach(paper => {
      // Limit connections to prevent clutter
      const connectionCount = Math.min(paper.connections, 2);
      
      // Connect to papers in same category or similar time period
      const candidates = visiblePapers.filter(target => 
        target.id !== paper.id && 
        target.year <= paper.year &&
        (target.category === paper.category || Math.abs(target.year - paper.year) <= 5)
      );
      
      for (let i = 0; i < Math.min(connectionCount, candidates.length); i++) {
        const targetPaper = candidates[Math.floor(Math.random() * candidates.length)];
        // Avoid duplicate connections
        const isDuplicate = conns.some(conn => 
          (conn.fromId === paper.id && conn.toId === targetPaper.id) ||
          (conn.fromId === targetPaper.id && conn.toId === paper.id)
        );
        
        if (!isDuplicate) {
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

      {/* Category Centers - vibrant indicators with gradient colors */}
      {categories.map((category, index) => {
        return (
          <mesh key={category.name} position={category.position} raycast={null}>
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshBasicMaterial 
              color={category.color}
              transparent 
              opacity={selectedCategory === category.name ? 0.25 : 0.12}
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
        // Very gentle rotation for sphere only
        meshRef.current.rotation.y += 0.002;
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2 + paper.id * 0.1) * 0.02;
      }
    }

    if (glowRef.current) {
      if (isPlaying) {
        // Very subtle glow animation
        const glowIntensity = 0.06 + Math.sin(state.clock.elapsedTime * 0.4 + paper.id * 0.05) * 0.02;
        glowRef.current.material.opacity = glowIntensity;
      } else {
        glowRef.current.material.opacity = 0.06; // gentle steady glow
      }
    }
  });

  // Make bubbles properly sized and visible
  const STAR_SIZE = 3.5; // Larger size to fit text inside
  const scaleFactor = isHovered ? 1.3 : 1.0;
  const scale = STAR_SIZE * scaleFactor;
  const opacity = 0.85; // Slightly more transparent to see text better

  return (
    <group position={paper.position}>
      {/* Main Scientific Sphere - rotates independently */}
      <group>
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
          <sphereGeometry args={[1.0, 32, 32]} />
          {/* Core sphere: vibrant gradient colors */}
          <meshLambertMaterial 
            color={paper.color || '#FF6B6B'} 
            transparent 
            opacity={isSelected || isHovered ? 1.0 : 0.9}
            emissive={paper.color || '#FF6B6B'}
            emissiveIntensity={isSelected || isHovered ? 0.2 : 0.1}
          />
        </mesh>

        {/* Star border: contrasting ring slightly larger than core */}
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={[scale, scale, 1]} raycast={null}>
          <ringGeometry args={[1.05, 1.25, 64]} />
          <meshBasicMaterial 
            color={isSelected ? "#ffffff" : "#f0e7e7"} 
            transparent 
            opacity={isSelected || isHovered ? 0.9 : 0.6} 
            side={THREE.DoubleSide} 
          />
        </mesh>

        {/* Subtle glow effect */}
        <mesh ref={glowRef} scale={[scale * 1.3, scale * 1.3, scale * 1.3]} raycast={null}>
          <sphereGeometry args={[0.9, 16, 16]} />
          <meshBasicMaterial 
            color={paper.color || '#FF6B6B'} 
            transparent 
            opacity={0.08} 
            blending={THREE.AdditiveBlending} 
            depthWrite={false} 
          />
        </mesh>
        {/* Text inside sphere - very short and centered */}
        <Html center position={[0, 0, 0]} zIndexRange={[1000, 0]}>
          <div 
            className="pointer-events-none text-center font-bold select-none"
            style={{ 
              fontSize: `${Math.max(10, scale * 2)}px`,
              lineHeight: '1.1',
              maxWidth: `${Math.max(50, scale * 15)}px`,
              wordWrap: 'break-word',
              color: '#ffffff',
              textShadow: '2px 2px 8px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.8)',
              fontWeight: '900',
              letterSpacing: '0.02em',
              transform: 'translateZ(0)',
              filter: 'contrast(1.3)',
              WebkitTextStroke: '0.5px rgba(0,0,0,0.5)'
            }}
          >
            {/* Show very short title - max 12 chars for better fit */}
            {paper.title.length > 12 
              ? paper.title.substring(0, 12).replace(/\s+\S*$/, '') + '...' 
              : paper.title
            }
          </div>
        </Html>
      </group>

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
                NCBI Research
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
      {/* Thinner connection line */}
      <cylinderGeometry args={[0.015, 0.015, 1, 8]} />
      <meshBasicMaterial 
        color="#ffffff"
        transparent
        opacity={0.2}
      />
    </mesh>
  );
}