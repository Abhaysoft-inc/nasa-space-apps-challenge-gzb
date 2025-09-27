'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TardigradeVisualization = ({ 
  temperature, 
  pressure, 
  radiation, 
  survival, 
  isExperimentRunning,
  results 
}) => {
  const [tardigrades, setTardigrades] = useState([]);

  useEffect(() => {
    // Generate tardigrade grid
    const newTardigrades = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: (i % 10) * 10 + 5,
      y: Math.floor(i / 10) * 10 + 5,
      alive: i < survival,
      state: getState(i, survival, temperature, pressure, radiation)
    }));
    setTardigrades(newTardigrades);
  }, [survival, temperature, pressure, radiation]);

  const getState = (index, survivalRate, temp, press, rad) => {
    if (index >= survivalRate) return 'dead';
    
    // Determine state based on conditions
    if (temp < -100 || temp > 100 || press === 0 || rad > 1000) {
      return 'cryptobiosis'; // Suspended animation
    } else if (temp < 0 || temp > 50 || press < 0.5 || rad > 100) {
      return 'stressed';
    } else {
      return 'active';
    }
  };

  const getColor = (state) => {
    switch (state) {
      case 'active': return '#10B981'; // Green
      case 'stressed': return '#F59E0B'; // Yellow
      case 'cryptobiosis': return '#8B5CF6'; // Purple
      case 'dead': return '#EF4444'; // Red
      default: return '#6B7280'; // Gray
    }
  };

  const getEmoji = (state) => {
    switch (state) {
      case 'active': return '🐻';
      case 'stressed': return '😰';
      case 'cryptobiosis': return '😴';
      case 'dead': return '💀';
      default: return '❓';
    }
  };

  return (
    <div className="space-y-6">
      {/* Survival Statistics */}
      <div className="bg-black/60 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className={`text-2xl font-bold ${survival > 80 ? 'text-green-400' : survival > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
              {survival}%
            </div>
            <div className="text-gray-400 text-sm">Survival Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">
              {tardigrades.filter(t => t.state === 'active').length}
            </div>
            <div className="text-gray-400 text-sm">Active</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">
              {tardigrades.filter(t => t.state === 'cryptobiosis').length}
            </div>
            <div className="text-gray-400 text-sm">Cryptobiosis</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400">
              {tardigrades.filter(t => t.state === 'dead').length}
            </div>
            <div className="text-gray-400 text-sm">Dead</div>
          </div>
        </div>
      </div>

      {/* Tardigrade Grid Visualization */}
      <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-lg p-6 border border-blue-400/30">
        <h4 className="text-lg text-blue-400 mb-4 text-center">Population Status</h4>
        
        <div className="relative w-full h-64 bg-black/50 rounded-lg overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {tardigrades.map((tardigrade, index) => (
              <motion.circle
                key={tardigrade.id}
                cx={tardigrade.x}
                cy={tardigrade.y}
                r={isExperimentRunning ? 0.8 : 1}
                fill={getColor(tardigrade.state)}
                opacity={tardigrade.alive ? 1 : 0.3}
                animate={{
                  r: isExperimentRunning ? [1, 0.5, 1] : 1,
                  opacity: tardigrade.alive ? 1 : 0.3
                }}
                transition={{
                  r: { repeat: isExperimentRunning ? Infinity : 0, duration: 1 },
                  opacity: { duration: 0.5 }
                }}
              />
            ))}
          </svg>
          
          {/* Condition Overlays */}
          {temperature < -100 && (
            <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
              <div className="bg-blue-900/80 px-4 py-2 rounded-lg border border-blue-400">
                <div className="text-blue-200 text-sm font-mono">CRYOGENIC CONDITIONS</div>
                <div className="text-blue-100 text-xs">{temperature}°C</div>
              </div>
            </div>
          )}
          {temperature > 100 && (
            <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
              <div className="bg-red-900/80 px-4 py-2 rounded-lg border border-red-400">
                <div className="text-red-200 text-sm font-mono">THERMAL STRESS</div>
                <div className="text-red-100 text-xs">{temperature}°C</div>
              </div>
            </div>
          )}
          {pressure === 0 && (
            <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
              <div className="bg-purple-900/80 px-4 py-2 rounded-lg border border-purple-400">
                <div className="text-purple-200 text-sm font-mono">VACUUM CHAMBER</div>
                <div className="text-purple-100 text-xs">0.0 atm</div>
              </div>
            </div>
          )}
          {radiation > 1000 && (
            <div className="absolute inset-0 bg-yellow-500/20 flex items-center justify-center">
              <div className="bg-yellow-900/80 px-4 py-2 rounded-lg border border-yellow-400">
                <div className="text-yellow-200 text-sm font-mono">RADIATION EXPOSURE</div>
                <div className="text-yellow-100 text-xs">{radiation} Gy</div>
              </div>
            </div>
          )}
          
          {isExperimentRunning && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white text-lg font-semibold">
                <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-2"></div>
                Experiment in Progress...
              </div>
            </div>
          )}
        </div>

        {/* State Legend */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
            <span className="text-gray-300">Active</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
            <span className="text-gray-300">Stressed</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-400 mr-2"></div>
            <span className="text-gray-300">Cryptobiosis</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
            <span className="text-gray-300">Dead</span>
          </div>
        </div>
      </div>

      {/* Condition Analysis */}
      <div className="bg-black/60 rounded-lg p-4">
        <h4 className="text-lg text-white mb-3">Environmental Analysis</h4>
        <div className="space-y-2 text-sm">
          {survival > 90 && (
            <div className="text-green-400 bg-green-900/30 rounded p-2">
              ✅ Exceptional survival rate! Tardigrades are thriving in these conditions.
            </div>
          )}
          
          {temperature < -200 && survival > 60 && (
            <div className="text-blue-400 bg-blue-900/30 rounded p-2">
              🧊 Cryptobiosis activated! Tardigrades have entered suspended animation to survive extreme cold.
            </div>
          )}
          
          {pressure === 0 && survival > 50 && (
            <div className="text-purple-400 bg-purple-900/30 rounded p-2">
              🌌 Space vacuum survival confirmed! This matches real space experiment results.
            </div>
          )}
          
          {radiation > 5000 && survival > 30 && (
            <div className="text-yellow-400 bg-yellow-900/30 rounded p-2">
              ☢️ Incredible radiation resistance! Far beyond what any other animal could survive.
            </div>
          )}
          
          {survival < 30 && (
            <div className="text-red-400 bg-red-900/30 rounded p-2">
              ⚠️ Extreme conditions are challenging even for tardigrades. Consider adjusting parameters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TardigradeVisualization;