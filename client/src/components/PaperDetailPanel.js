'use client';

import { motion } from 'framer-motion';
import { X, ExternalLink, Users, Calendar, Quote, TrendingUp, Link2, BookOpen } from 'lucide-react';

export default function PaperDetailPanel({ paper, onClose }) {
  if (!paper) return null;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="absolute top-0 right-0 w-96 h-full bg-black/90 backdrop-blur-xl border-l border-white/20 z-30 overflow-y-auto"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: paper.color }}
              />
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                {paper.category}
              </span>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2 leading-tight">
              {paper.title}
            </h2>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="ml-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <MetricCard 
            icon={Calendar}
            label="Published"
            value={paper.year}
            color="text-blue-400"
          />
          <MetricCard 
            icon={TrendingUp}
            label="Citations"
            value={paper.citations}
            color="text-green-400"
          />
          <MetricCard 
            icon={Link2}
            label="Connections"
            value={paper.connections}
            color="text-purple-400"
          />
          <MetricCard 
            icon={BookOpen}
            label="Impact Score"
            value={Math.round(paper.citations / 10 + paper.connections)}
            color="text-yellow-400"
          />
        </div>

        {/* Authors */}
        <div className="mb-6">
          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            Authors
          </h3>
          <div className="space-y-2">
            {paper.authors.map((author, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {author.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="text-gray-300">{author}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Abstract */}
        <div className="mb-6">
          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
            <Quote className="w-4 h-4 text-gray-400" />
            Abstract
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {paper.abstract}
          </p>
        </div>

        {/* Research Impact */}
        <div className="mb-6">
          <h3 className="text-white font-medium mb-3">Research Impact</h3>
          
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-4 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <span className="text-purple-300 text-sm font-medium">
                Key Findings
              </span>
            </div>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li>• Advanced understanding of {paper.category.toLowerCase()} in microgravity</li>
              <li>• Provided crucial data for Mars mission planning</li>
              <li>• Established new protocols for space-based research</li>
            </ul>
          </div>
        </div>

        {/* Related Studies */}
        <div className="mb-6">
          <h3 className="text-white font-medium mb-3">Related Research</h3>
          <div className="space-y-2">
            {Array.from({ length: 3 }, (_, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 4 }}
                className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: paper.color }}
                  />
                  <div className="flex-1">
                    <div className="text-gray-300 text-sm">
                      Related Study #{i + 1}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {paper.year - Math.floor(Math.random() * 5)} • {Math.floor(Math.random() * 50 + 10)} citations
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
          >
            View Full Paper
          </motion.button>
          
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="py-2 bg-white/10 text-gray-300 rounded-lg text-sm hover:bg-white/20 transition-colors"
            >
              Cite Paper
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="py-2 bg-white/10 text-gray-300 rounded-lg text-sm hover:bg-white/20 transition-colors"
            >
              Save to List
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MetricCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-gray-400 text-xs">{label}</span>
      </div>
      <div className={`text-lg font-bold ${color}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </div>
  );
}