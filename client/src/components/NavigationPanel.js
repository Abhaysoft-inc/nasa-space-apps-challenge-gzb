'use client';

import { motion } from 'framer-motion';
import { Search, Filter, SortAsc, RotateCcw, Zap, Target } from 'lucide-react';

export default function NavigationPanel({ 
  searchTerm = '', 
  onSearchChange = () => {}, 
  selectedCategory = 'all', 
  onCategoryChange = () => {},
  explorerStats,
  onResetView = () => {} 
}) {
  // Ensure explorerStats has proper defaults
  const stats = explorerStats || {
    papersDiscovered: 0,
    connectionsFound: 0,
    erasExplored: new Set()
  };
  const categories = [
    { id: 'all', name: 'All Research', color: 'text-white', count: 608 },
    { id: 'Astrobiology', name: 'Astrobiology', color: 'text-green-400', count: 89 },
    { id: 'Plant Biology', name: 'Plant Biology', color: 'text-emerald-400', count: 76 },
    { id: 'Microbiology', name: 'Microbiology', color: 'text-purple-400', count: 92 },
    { id: 'Cell Biology', name: 'Cell Biology', color: 'text-blue-400', count: 83 },
    { id: 'Genetics', name: 'Genetics', color: 'text-red-400', count: 67 },
    { id: 'Physiology', name: 'Physiology', color: 'text-yellow-400', count: 71 },
    { id: 'Biotechnology', name: 'Biotechnology', color: 'text-purple-400', count: 58 },
    { id: 'Ecology', name: 'Ecology', color: 'text-teal-400', count: 72 }
  ];

  return (
    <motion.div
      initial={{ x: -400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -400, opacity: 0 }}
      transition={{ type: 'tween', duration: 0.25 }}
      className="fixed left-0 top-20 h-[calc(100vh-5rem)] w-72 bg-black/30 backdrop-blur-lg border-r border-white/10 z-30 overflow-y-auto pointer-events-auto"
    >
      <div className="p-6">
        {/* Mission Status */}
  <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: 'rgba(4,4,4,0.1)', border: '1px solid #f0e7e733' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold" style={{color:'#f0e7e7'}}>Mission Progress</h3>
              <p className="text-sm" style={{color:'#f0e7e7aa'}}>Space Explorer Status</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold" style={{color:'#fda600'}}>{stats.papersDiscovered}</div>
              <div className="text-xs" style={{color:'#f0e7e7aa'}}>Discovered</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold" style={{color:'#e77d11'}}>{stats.connectionsFound}</div>
              <div className="text-xs" style={{color:'#f0e7e7aa'}}>Connected</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold" style={{color:'#c1440e'}}>{stats.erasExplored.size}</div>
              <div className="text-xs" style={{color:'#f0e7e7aa'}}>Eras</div>
            </div>
          </div>
        </div>

        {/* Search Interface */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-4 h-4 text-gray-400" />
            <h3 className="font-semibold" style={{color:'#f0e7e7'}}>Research Scanner</h3>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search papers, authors, keywords..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none"
              style={{ backgroundColor:'#00000055', border:'1px solid #f0e7e733', color:'#f0e7e7' }}
            />
          </div>

          {searchTerm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-gray-400"
            >
              <span style={{color:'#f0e7e7aa'}}>Scanning galaxy for: </span><span className="font-semibold" style={{color:'#fda600'}}>"{searchTerm}"</span>
            </motion.div>
          )}
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <h3 className="font-semibold" style={{color:'#f0e7e7'}}>Research Categories</h3>
          </div>
          
          <div className="space-y-2">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCategoryChange(category.id)}
                className={`w-full p-3 rounded-lg text-left transition-all ${selectedCategory === category.id ? '' : ''}`}
                style={ selectedCategory === category.id ? { backgroundColor:'rgba(4,4,4,0.1)', border:'1px solid #f0e7e744' } : { backgroundColor:'#00000055', border:'1px solid transparent' } }
                suppressHydrationWarning
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor:'#fda600'}} />
                    <span className={`font-medium ${
                      selectedCategory === category.id ? 'text-white' : ''
                    }`} style={{color:'#f0e7e7'}}>
                      {category.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3" style={{color:'#fda600'}} />
                    <span className="text-sm" style={{color:'#f0e7e7aa'}}>{category.count}</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3" style={{color:'#f0e7e7'}}>Quick Navigation</h3>
          
          <div className="space-y-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onResetView}
              className="w-full p-3 rounded-lg font-medium transition-all"
              style={{ backgroundColor:'rgba(4,4,4,0.1)', border:'1px solid #f0e7e744', color:'#f0e7e7' }}
            >
              <div className="flex items-center gap-2 justify-center">
                <RotateCcw className="w-4 h-4" />
                Reset Galaxy View
              </div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-3 rounded-lg font-medium transition-all"
              style={{ backgroundColor:'#00000055', border:'1px solid #f0e7e733', color:'#f0e7e7' }}
            >
              <div className="flex items-center gap-2 justify-center">
                <SortAsc className="w-4 h-4" />
                Sort by Citations
              </div>
            </motion.button>
          </div>
        </div>

        {/* Explorer Tips */}
  <div className="rounded-xl p-4" style={{ backgroundColor:'#fda60022', border:'1px solid #f0e7e733' }}>
          <h4 className="font-semibold mb-2 flex items-center gap-2" style={{color:'#fda600'}}>
            <Zap className="w-4 h-4" style={{color:'#fda600'}} />
            Explorer Tips
          </h4>
          <div className="space-y-2 text-sm" style={{color:'#f0e7e7'}}>
            <p>• Click stars to explore research papers</p>
            <p>• Follow glowing connections between citations</p>
            <p>• Use timeline to travel through research eras</p>
            <p>• Filter categories to focus your mission</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function getCategoryColor(category) {
  const colors = {
    'Astrobiology': 'bg-green-400',
    'Plant Biology': 'bg-emerald-400',
    'Microbiology': 'bg-purple-400',
    'Cell Biology': 'bg-blue-400',
    'Genetics': 'bg-red-400',
    'Physiology': 'bg-yellow-400',
    'Biotechnology': 'bg-purple-500',
    'Ecology': 'bg-teal-400'
  };
  return colors[category] || 'bg-gray-400';
}