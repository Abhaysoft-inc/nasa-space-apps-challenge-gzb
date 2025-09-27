'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Calendar } from 'lucide-react';

export default function TimelineControl({ timeRange, onTimeRangeChange }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentYear, setCurrentYear] = useState(timeRange[1]);
  
  const minYear = 1990;
  const maxYear = 2024;
  const totalYears = maxYear - minYear;

  // Major milestones in space biology research
  const milestones = [
    { year: 1998, label: 'ISS Construction Begins', color: '#3B82F6' },
    { year: 2001, label: 'First Long-Duration Studies', color: '#10B981' },
    { year: 2005, label: 'Advanced Cell Research', color: '#8B5CF6' },
    { year: 2011, label: 'Mars Mission Planning', color: '#EF4444' },
    { year: 2020, label: 'COVID Space Research', color: '#F59E0B' },
    { year: 2024, label: 'Artemis Program', color: '#EC4899' }
  ];

  const handleRangeChange = useCallback((newRange) => {
    onTimeRangeChange(newRange);
  }, [onTimeRangeChange]);

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would animate through the timeline
  };

  const jumpToDecade = (startYear) => {
    const endYear = Math.min(startYear + 10, maxYear);
    handleRangeChange([startYear, endYear]);
    setCurrentYear(endYear);
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-black/40 backdrop-blur-xl rounded-xl p-4 border border-white/20 max-w-2xl"
    >
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-400" />
          <h3 className="text-white font-medium text-sm">Timeline: {timeRange[0]} - {timeRange[1]}</h3>
        </div>

        {/* Compact Controls */}
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => jumpToDecade(minYear)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <SkipBack className="w-3 h-3" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayToggle}
            className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => jumpToDecade(maxYear - 10)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <SkipForward className="w-3 h-3" />
          </motion.button>
        </div>
      </div>

      {/* Compact Timeline Visualization */}
      <div className="relative">
        {/* Main Timeline Bar */}
        <div className="relative h-2 bg-gray-800 rounded-full mb-3">
          {/* Selected Range */}
          <motion.div
            className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            style={{
              left: `${((timeRange[0] - minYear) / totalYears) * 100}%`,
              width: `${((timeRange[1] - timeRange[0]) / totalYears) * 100}%`
            }}
            layout
          />

          {/* Milestone Markers */}
          {milestones.map((milestone) => (
            <div
              key={milestone.year}
              className="absolute top-0 h-full w-0.5 rounded-full transform -translate-x-0.5 cursor-pointer group"
              style={{
                left: `${((milestone.year - minYear) / totalYears) * 100}%`,
                backgroundColor: milestone.color
              }}
              onClick={() => jumpToDecade(milestone.year - 2)}
            >
              <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/90 text-white text-xs rounded px-2 py-1 whitespace-nowrap border border-white/20">
                  {milestone.year}: {milestone.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Compact Year Labels */}
        <div className="flex justify-between text-xs text-gray-400 mb-3">
          {[1990, 2000, 2010, 2020, 2024].map(year => (
            <span key={year}>{year}</span>
          ))}
        </div>

        {/* Decade Buttons */}
        <div className="flex gap-1 justify-center">
          {Array.from({ length: 4 }, (_, i) => {
            const decadeStart = 1990 + (i * 10);
            const decadeEnd = Math.min(decadeStart + 9, maxYear);
            const isActive = timeRange[0] <= decadeEnd && timeRange[1] >= decadeStart;
            
            return (
              <motion.button
                key={decadeStart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => jumpToDecade(decadeStart)}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {decadeStart}s
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function TimelineHandle({ year, position, onDrag, isStart }) {
  return (
    <motion.div
      className="absolute top-1/2 w-4 h-4 bg-white rounded-full border-2 border-blue-500 transform -translate-y-1/2 -translate-x-1/2 cursor-pointer shadow-lg group"
      style={{ left: `${position}%` }}
      whileHover={{ scale: 1.2 }}
      whileDrag={{ scale: 1.3 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }} // Will be handled by parent bounds
      dragElastic={0}
      onDrag={(event, info) => {
        // Calculate new year based on drag position
        // This is a simplified version - real implementation would be more robust
        const rect = event.currentTarget.parentElement.getBoundingClientRect();
        const newPosition = Math.max(0, Math.min(100, ((info.point.x - rect.left) / rect.width) * 100));
        const newYear = Math.round(1990 + (newPosition / 100) * 34);
        onDrag(Math.max(1990, Math.min(2024, newYear)));
      }}
    >
      {/* Handle Tooltip */}
      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-black/90 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
          {year}
        </div>
      </div>
    </motion.div>
  );
}