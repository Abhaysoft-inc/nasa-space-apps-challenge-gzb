'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Filter, X } from 'lucide-react';

export default function SearchInterface({ searchQuery, onSearch }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [suggestions] = useState([
    'bone density studies',
    'plant growth experiments',
    'microgravity effects',
    'radiation protection',
    'cardiovascular research',
    'Mars mission preparation'
  ]);
  const inputRef = useRef();

  const handleSearch = (query) => {
    setLocalQuery(query);
    onSearch(query);
  };

  const handleExpand = () => {
    setIsExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    if (!localQuery) {
      handleSearch('');
    }
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          /* Compact Search Button */
          <motion.button
            key="collapsed"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExpand}
            className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            <Search className="w-5 h-5 text-white" />
          </motion.button>
        ) : (
          /* Compact Expanded Search Interface */
          <motion.div
            key="expanded"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-black/40 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden"
          >
            <div className="p-3">
              {/* Compact Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <h3 className="text-white font-medium text-sm">Search</h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCollapse}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Compact Search Input */}
              <div className="relative mb-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={localQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search papers..."
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
                />
                <div className="absolute right-2 top-2">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Quick Suggestions */}
              {localQuery === '' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3"
                >
                  <div className="flex flex-wrap gap-1">
                    {suggestions.slice(0, 4).map((suggestion) => (
                      <motion.button
                        key={suggestion}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSearch(suggestion)}
                        className="px-2 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-gray-300 text-xs transition-colors"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Compact Search Results */}
              {localQuery && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-1"
                >
                  <div className="text-gray-400 text-xs mb-2">
                    {Math.floor(Math.random() * 50 + 10)} matches found
                  </div>
                  
                  {Array.from({ length: 2 }, (_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                        <div className="flex-1 min-w-0">
                          <div className="text-gray-300 text-xs truncate">
                            Paper about "{localQuery}"
                          </div>
                          <div className="text-gray-500 text-xs">
                            {2020 + i} • {Math.floor(Math.random() * 100)} citations
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}