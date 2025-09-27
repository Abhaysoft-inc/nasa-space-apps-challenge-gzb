'use client';

import { motion } from 'framer-motion';
import { Filter, Heart, Leaf, Microscope, Dna, Zap, Globe } from 'lucide-react';
import { researchCategories } from '@/data/mockData';

const iconMap = {
  'human-biology': Heart,
  'plant-biology': Leaf, 
  'microbiology': Microscope,
  'cell-biology': Dna,
  'radiation-effects': Zap,
  'gravity-studies': Globe
};

const categories = [
  {
    id: 'all',
    name: 'All Research',
    icon: Globe,
    color: '#6B7280',
    count: 608
  },
  ...researchCategories.map(cat => ({
    id: cat.id,
    name: cat.name,
    icon: iconMap[cat.id] || Globe,
    color: cat.color,
    count: Math.floor(Math.random() * 100) + 50 // Mock counts for now
  }))
];

export default function CategoryFilter({ selectedCategory, onCategoryChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-black/40 backdrop-blur-xl rounded-xl p-3 border border-white/20 min-w-[220px]"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-purple-400" />
        <h3 className="text-white font-medium text-sm">Categories</h3>
      </div>

      {/* Compact Category List */}
      <div className="space-y-1.5">
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            whileHover={{ scale: 1.02, x: 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onCategoryChange(category.id)}
            className={`w-full flex items-center gap-2 p-2 rounded-lg text-sm transition-all ${
              selectedCategory === category.id
                ? 'bg-white/20 border border-white/30'
                : 'hover:bg-white/10 border border-transparent'
            }`}
          >
            {/* Category Icon */}
            <div 
              className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: category.color + '20' }}
            >
              <category.icon 
                className="w-3 h-3"
                style={{ color: category.color }}
              />
            </div>

            {/* Category Info */}
            <div className="flex-1 text-left min-w-0">
              <div className={`font-medium truncate ${
                selectedCategory === category.id ? 'text-white' : 'text-gray-300'
              }`}>
                {category.name}
              </div>
              <div className="text-xs text-gray-500">
                {category.count}
              </div>
            </div>

            {/* Selection Indicator */}
            {selectedCategory === category.id && (
              <motion.div
                layoutId="categoryIndicator"
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: category.color }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Quick Mission Focus Tags */}
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="flex flex-wrap gap-1">
          {['Mars', 'Moon', 'ISS'].map((focus) => (
            <motion.span
              key={focus}
              whileHover={{ scale: 1.05 }}
              className="px-2 py-0.5 bg-white/10 text-gray-300 text-xs rounded-full border border-white/20 cursor-pointer hover:bg-white/20 transition-colors"
            >
              {focus}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}