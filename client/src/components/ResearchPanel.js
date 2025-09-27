'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Users2, Calendar, Link2, Star, Quote } from 'lucide-react';

export default function ResearchPanel({ selectedPaper, onClose }) {
  if (!selectedPaper) return null;

  const buildDoiUrl = (doi) => {
    if (!doi) return null;
    return doi.startsWith('http') ? doi : `https://doi.org/${doi}`;
  };

  const openOriginalPaper = () => {
    const doiUrl = buildDoiUrl(selectedPaper.doi);
    const fallback = selectedPaper.title
      ? `https://www.google.com/search?q=${encodeURIComponent(selectedPaper.title + ' site:ncbi.nlm.nih.gov|doi.org')}`
      : 'https://scholar.google.com';
    const url = doiUrl || fallback;
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {}
  };

  const exploreCitations = () => {
    // Prefer DOI-based scholar query; fallback to title search
    const query = selectedPaper.doi
      ? `doi:${selectedPaper.doi}`
      : (selectedPaper.title || 'space biology research');
    const url = `https://scholar.google.com/scholar?hl=en&q=${encodeURIComponent(query)}`;
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {}
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-96 bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl border-l border-white/10 z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getCategoryGradient(selectedPaper.category)}`} />
                <span className="text-sm text-gray-400 uppercase tracking-wide">
                  {selectedPaper.category}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white leading-tight mb-2">
                {selectedPaper.title}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {selectedPaper.year}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  {selectedPaper.citations}
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Authors */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Users2 className="w-4 h-4 text-blue-400" />
              <h3 className="font-semibold text-white">Research Team</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedPaper.authors.map((author, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-sm text-blue-200"
                >
                  {author}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Abstract */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <h3 className="font-semibold text-white">Research Abstract</h3>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <Quote className="w-5 h-5 text-gray-500 mb-2" />
              <p className="text-gray-300 leading-relaxed">
                {selectedPaper.abstract}
              </p>
            </div>
          </div>

          {/* Key Findings */}
          <div className="mb-6">
            <h3 className="font-semibold text-white mb-3">Key Discoveries</h3>
            <div className="space-y-2">
              {selectedPaper.keyFindings?.map((finding, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-400/20"
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-gray-300 text-sm">{finding}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Citation Network */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Link2 className="w-4 h-4 text-pink-400" />
              <h3 className="font-semibold text-white">Citation Network</h3>
            </div>
            <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-lg p-4 border border-pink-400/20">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-400">{selectedPaper.citations}</div>
                  <div className="text-sm text-gray-400">Total Citations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{selectedPaper.references?.length || 0}</div>
                  <div className="text-sm text-gray-400">References</div>
                </div>
              </div>
            </div>
          </div>

          {/* Research Impact */}
          <div className="mb-6">
            <h3 className="font-semibold text-white mb-3">Research Impact</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                <span className="text-gray-300">Citation Velocity</span>
                <span className="text-yellow-400 font-semibold">High</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                <span className="text-gray-300">Field Influence</span>
                <span className="text-green-400 font-semibold">{selectedPaper.category}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                <span className="text-gray-300">Era Significance</span>
                <span className="text-blue-400 font-semibold">{getEraSuffix(selectedPaper.year)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openOriginalPaper}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium hover:from-blue-500 hover:to-purple-500 transition-all"
            >
              View Full Paper
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={exploreCitations}
              className="w-full py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 transition-all"
            >
              Explore Citations
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function getCategoryGradient(category) {
  const gradients = {
    'Astrobiology': 'from-green-400 to-blue-500',
    'Plant Biology': 'from-green-500 to-emerald-400',
    'Microbiology': 'from-purple-400 to-pink-500',
    'Cell Biology': 'from-blue-400 to-cyan-500',
    'Genetics': 'from-red-400 to-orange-500',
    'Physiology': 'from-yellow-400 to-red-500',
    'Biotechnology': 'from-purple-500 to-blue-600',
    'Ecology': 'from-green-600 to-teal-500'
  };
  return gradients[category] || 'from-gray-400 to-gray-600';
}

function getEraSuffix(year) {
  if (year >= 2020) return '2020s - Current Era';
  if (year >= 2010) return '2010s - Digital Age';
  if (year >= 2000) return '2000s - Genomic Era';
  if (year >= 1990) return '1990s - Molecular Era';
  return 'Classical Era';
}