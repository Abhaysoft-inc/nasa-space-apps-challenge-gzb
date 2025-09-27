// Mock NASA Space Biology Research Data
// In production, this would come from the NASA publications API

export const researchCategories = [
  {
    id: 'human-biology',
    name: 'Human Biology',
    color: '#EF4444',
    description: 'Studies on human adaptation to space environments',
    keywords: ['bone density', 'muscle atrophy', 'cardiovascular', 'human physiology', 'astronaut health']
  },
  {
    id: 'plant-biology', 
    name: 'Plant Biology',
    color: '#10B981',
    description: 'Plant growth and development in microgravity',
    keywords: ['plant growth', 'photosynthesis', 'agriculture', 'crop production', 'botany']
  },
  {
    id: 'microbiology',
    name: 'Microbiology', 
    color: '#3B82F6',
    description: 'Microbial behavior and applications in space',
    keywords: ['bacteria', 'microorganisms', 'infection', 'immune system', 'microbial ecology']
  },
  {
    id: 'cell-biology',
    name: 'Cell Biology',
    color: '#8B5CF6', 
    description: 'Cellular processes and responses in space',
    keywords: ['cell division', 'DNA', 'protein synthesis', 'gene expression', 'cellular biology']
  },
  {
    id: 'radiation-effects',
    name: 'Radiation Effects',
    color: '#F59E0B',
    description: 'Impact of cosmic radiation on biological systems',
    keywords: ['cosmic radiation', 'radiation protection', 'DNA damage', 'radiation exposure', 'shielding']
  },
  {
    id: 'gravity-studies',
    name: 'Gravity Studies', 
    color: '#EC4899',
    description: 'Effects of altered gravity on living systems',
    keywords: ['microgravity', 'weightlessness', 'gravitational effects', 'acceleration', 'gravity simulation']
  }
];

export const nasaCenters = [
  'Ames Research Center',
  'Glenn Research Center', 
  'Goddard Space Flight Center',
  'Johnson Space Center',
  'Kennedy Space Center',
  'Langley Research Center',
  'Marshall Space Flight Center'
];

export const missionPrograms = [
  { name: 'International Space Station', acronym: 'ISS', active: true },
  { name: 'Artemis Program', acronym: 'ARTEMIS', active: true },
  { name: 'Mars Exploration Program', acronym: 'MEP', active: true },
  { name: 'Space Shuttle Program', acronym: 'STS', active: false },
  { name: 'Commercial Crew Program', acronym: 'CCP', active: true }
];

// Achievement system for gamification
export const achievements = [
  {
    id: 'first-explorer',
    title: 'Space Explorer',
    description: 'Clicked your first research paper',
    icon: '🚀',
    threshold: 1
  },
  {
    id: 'paper-collector', 
    title: 'Research Collector',
    description: 'Explored 10 research papers',
    icon: '📚',
    threshold: 10
  },
  {
    id: 'connection-finder',
    title: 'Connection Detective', 
    description: 'Discovered 25 research connections',
    icon: '🔗',
    threshold: 25
  },
  {
    id: 'time-traveler',
    title: 'Time Traveler',
    description: 'Explored research across 3 decades',
    icon: '⏰',
    threshold: 3
  },
  {
    id: 'category-master',
    title: 'Research Master',
    description: 'Explored all research categories', 
    icon: '🏆',
    threshold: 6
  },
  {
    id: 'constellation-mapper',
    title: 'Constellation Mapper',
    description: 'Mapped 50 research connections',
    icon: '⭐',
    threshold: 50
  }
];

// Generate realistic research paper metadata
export const generatePaperData = () => {
  const papers = [];
  const baseYear = 1990;
  const currentYear = 2024;
  
  for (let i = 0; i < 608; i++) {
    const category = researchCategories[Math.floor(Math.random() * researchCategories.length)];
    const year = baseYear + Math.floor(Math.random() * (currentYear - baseYear + 1));
    const citations = Math.floor(Math.random() * 200);
    const connections = Math.floor(Math.random() * 30);
    
    // Generate realistic paper titles
    const keyword = category.keywords[Math.floor(Math.random() * category.keywords.length)];
    const studyTypes = ['Effects of', 'Analysis of', 'Investigation into', 'Study on', 'Research on'];
    const studyType = studyTypes[Math.floor(Math.random() * studyTypes.length)];
    const environments = ['microgravity', 'space environment', 'ISS conditions', 'simulated Mars conditions'];
    const environment = environments[Math.floor(Math.random() * environments.length)];
    
    papers.push({
      id: `paper-${i + 1}`,
      title: `${studyType} ${keyword} in ${environment}: Implications for deep space missions`,
      authors: generateAuthors(),
      year,
      category: category.name,
      categoryId: category.id,
      citations,
      connections,
      color: category.color,
      abstract: generateAbstract(category, keyword, environment),
      doi: `10.1000/nasa.${year}.${i + 1}`,
      journal: selectJournal(),
      nasaCenter: nasaCenters[Math.floor(Math.random() * nasaCenters.length)],
      missionProgram: missionPrograms[Math.floor(Math.random() * missionPrograms.length)],
      // 3D universe position
      position: [
        (Math.random() - 0.5) * 300, // Spread papers across larger space
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 300
      ],
      // Visual properties
      size: Math.max(0.3, citations / 150 + Math.random() * 0.7),
      brightness: Math.max(0.3, (currentYear - year + 5) / (currentYear - baseYear + 5)),
      pulsing: citations > 75,
      cluster: Math.floor(i / 40), // Create research clusters
      impactScore: calculateImpactScore(citations, connections, currentYear - year)
    });
  }
  
  return papers;
};

const generateAuthors = () => {
  const firstNames = ['John', 'Sarah', 'Michael', 'Lisa', 'David', 'Maria', 'Robert', 'Jennifer', 'James', 'Emily'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  
  const numAuthors = Math.floor(Math.random() * 4) + 1;
  const authors = [];
  
  for (let i = 0; i < numAuthors; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    authors.push(`Dr. ${firstName} ${lastName}`);
  }
  
  return authors;
};

const generateAbstract = (category, keyword, environment) => {
  const templates = [
    `This study investigates the effects of ${environment} on ${keyword}, providing crucial insights for future Mars missions. Our findings demonstrate significant changes in biological processes that must be considered for long-duration spaceflight.`,
    `We present a comprehensive analysis of ${keyword} under ${environment} conditions. This research contributes to our understanding of biological adaptation mechanisms essential for human space exploration.`,
    `Through extensive experimentation aboard the International Space Station, we examined ${keyword} responses to ${environment}. These results inform mission planning and crew health protocols for deep space exploration.`,
    `This investigation focuses on ${keyword} behavior in ${environment}, revealing important implications for space biology and astronaut safety during extended missions to Mars and beyond.`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
};

const selectJournal = () => {
  const journals = [
    'Gravitational and Space Research',
    'Journal of Space Biology',
    'Microgravity Science and Technology',
    'Astrobiology',
    'Life Sciences in Space Research',
    'NASA Technical Reports',
    'Space Medicine & Medical Engineering'
  ];
  
  return journals[Math.floor(Math.random() * journals.length)];
};

const calculateImpactScore = (citations, connections, age) => {
  // Higher impact for papers with more citations, connections, and recent publications
  const citationScore = Math.min(citations / 10, 10);
  const connectionScore = Math.min(connections / 5, 10); 
  const recencyScore = Math.max(0, 10 - age / 2);
  
  return Math.round((citationScore + connectionScore + recencyScore) / 3);
};