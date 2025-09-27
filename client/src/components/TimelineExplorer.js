'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { Play, Pause, Calendar } from 'lucide-react';

export default function TimelineExplorer({ 
  currentEra = '2020s', 
  onEraChange = () => {}, 
  isPlaying = false, 
  onTogglePlay = () => {},
  explorerStats
}) {
  // Ensure explorerStats has proper defaults
  const stats = explorerStats || {
    erasExplored: new Set(),
    connectionsFound: 0,
    papersDiscovered: 0
  };
  const eras = [
    { 
      id: '1990s', 
      name: 'Molecular Era', 
      years: '1990-1999',
      color: 'from-blue-400 to-cyan-500',
      papers: 89,
      description: 'Foundation of space biology'
    },
    { 
      id: '2000s', 
      name: 'Genomic Era', 
      years: '2000-2009',
      color: 'from-green-400 to-emerald-500',
      papers: 156,
      description: 'DNA sequencing revolution'
    },
    { 
      id: '2010s', 
      name: 'Digital Age', 
      years: '2010-2019',
      color: 'from-purple-400 to-pink-500',
      papers: 234,
      description: 'Big data & bioinformatics'
    },
    { 
      id: '2020s', 
      name: 'Current Era', 
      years: '2020-2024',
      color: 'from-orange-400 to-red-500',
      papers: 129,
      description: 'AI & Mars missions'
    }
  ];

  // Slider interaction helpers
  const indexOfEra = eras.findIndex(e => e.id === currentEra);
  const percent = ((indexOfEra + 0.00001) / Math.max(1, eras.length - 1)) * 100;

  // Track ref for safe drag computations during window mousemove
  const trackRef = useRef(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleFromPercent = (p) => {
    const clamped = Math.max(0, Math.min(100, p));
    const idx = Math.round((clamped / 100) * (eras.length - 1));
    const era = eras[idx]?.id;
    if (era && era !== currentEra) onEraChange(era);
  };

  const onTrackClick = (e) => {
    const rect = (trackRef.current || e.currentTarget).getBoundingClientRect();
    const p = ((e.clientX - rect.left) / rect.width) * 100;
    handleFromPercent(p);
  };

  let isDown = false;
  const onMouseDown = (e) => {
    isDown = true;
    onTrackClick(e);
    const move = (ev) => {
      if (!isDown) return;
      const rect = (trackRef.current || e.currentTarget).getBoundingClientRect();
      const p = ((ev.clientX - rect.left) / rect.width) * 100;
      handleFromPercent(p);
    };
    const up = () => { isDown = false; window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-4 right-4 z-40 pointer-events-auto w-[25vw] min-w-[280px] max-w-md"
    >
      <div className="bg-black/35 backdrop-blur-xl border border-white/15 rounded-lg px-3 py-2 shadow-2xl relative">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowCalendar(v => !v)}
              className="w-7 h-7 rounded-full bg-black/40 border border-white/15 text-white flex items-center justify-center hover:bg-black/50"
              aria-label="Choose era"
            >
              <Calendar className="w-4 h-4" />
            </button>
            <button
              onClick={onTogglePlay}
              className="w-7 h-7 rounded-full bg-black/40 border border-white/15 text-white flex items-center justify-center hover:bg-black/50"
              suppressHydrationWarning
              aria-label="Play/Pause animation"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            {/* Calendar popover */}
            <AnimatePresence>
              {showCalendar && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-10 left-0 bg-black/70 backdrop-blur-md border border-white/15 rounded-md p-2 z-50 w-44"
                >
                  {['1990s','2000s','2010s','2020s'].map(id => (
                    <button
                      key={id}
                      onClick={() => { onEraChange(id); setShowCalendar(false); }}
                      className={`w-full text-left px-2 py-1 rounded text-sm ${currentEra===id? 'bg-white/10 text-white':'text-gray-200 hover:bg-white/5'}`}
                    >
                      {id}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Slim slider */}
          <div className="relative flex-1 h-6 select-none">
            {/* Clickable track */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1.5 bg-gray-800/80 rounded-full cursor-pointer"
              ref={trackRef}
              onClick={onTrackClick}
              onMouseDown={onMouseDown}
            >
              <div 
                className="h-full rounded-full"
                style={{ width: `${percent}%`, background: 'linear-gradient(90deg, rgba(253,166,0,1) 0%, rgba(231,125,17,1) 100%)' }}
              />
              {/* Handle */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow"
                style={{ left: `${percent}%` }}
              />
            </div>

            {/* Tiny era ticks */}
            <div className="absolute -top-1.5 left-0 right-0 flex justify-between pointer-events-none">
              {eras.map((era) => (
                <div key={era.id} className="flex flex-col items-center">
                  <div className={`w-2.5 h-2.5 rounded-full ${currentEra===era.id?'bg-white':'bg-gray-500'}`} />
                </div>
              ))}
            </div>
            <div className="absolute -bottom-3 left-0 right-0 flex justify-between text-[10px] text-gray-400 pointer-events-none">
              {eras.map((era)=> (
                <span key={`label-${era.id}`} className={currentEra===era.id? 'text-white':'text-gray-400'}>{era.id}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}