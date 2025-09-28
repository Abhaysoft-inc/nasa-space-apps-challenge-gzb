"use client"

import React, { useEffect, useMemo, useState } from "react"
import assets from "@/data/bionM1Assets.json"
import Link from "next/link"
import FullScreenScene from "./FullScreenScene"
import StoryChoice from "./StoryChoice"

export default function BionM1Game(){
  const [chapter, setChapter] = useState(1)
  const [popup, setPopup] = useState(null)
  const [timer, setTimer] = useState(150)
  const [counting, setCounting] = useState(false)

  const initialState = useMemo(()=> ({
    playerName: "Dr. Sarah Chen",
    decisions: [],
    scientificAccuracy: 0,
    breakthroughPoints: 0,
    missionStatus: "pre-launch",
    boneDataQuality: 0,
    geneticDiversity: 0,
  }), [])

  const [game, setGame] = useState(initialState)

  useEffect(()=>{
    if(!counting) return
    if(timer <= 0){
      setCounting(false)
      setGame(g=> ({...g, missionStatus: "in-orbit"}))
      setTimeout(()=> setChapter(3), 800)
      return
    }
    const id = setTimeout(()=> setTimer(t=> t-1), 50)
    return ()=> clearTimeout(id)
  }, [counting, timer])

  const progressPct = Math.round((chapter-1)/5 * 100)
  const showPopup = (cfg) => setPopup(cfg)
  const closePopup = () => setPopup(null)

  function selectStrain(strain){
    setGame(g=> ({
      ...g,
      decisions: [...g.decisions, { key:'strain', value: strain }],
      boneDataQuality: g.boneDataQuality + (strain==='C57BL6' ? 10 : 0),
      geneticDiversity: g.geneticDiversity + (strain==='Mixed' ? 10 : 0),
    }))
    if (strain === 'C57BL6'){
      showPopup({ title:'Great Choice', content:'C57BL/6 mice will provide reliable bone density data.' })
    } else if (strain === 'Mixed'){
      showPopup({ title:'Smart Call', content:'Genetic diversity will help us understand individual variations.' })
    }
    setTimeout(()=> setChapter(2), 600)
  }

  function startCountdown(){ setTimer(150); setCounting(true) }
  function abortLaunch(){
    setCounting(false)
    showPopup({ title:'Launch Aborted', content:'You prioritized animal welfare and system safety. Launch will be rescheduled. (Demo continues)', action:{ label:'Continue Mission', onClick:()=> { closePopup(); setChapter(3) } } })
  }
  function continueLaunch(){ closePopup(); setTimer(3); setCounting(true) }

  function diagnose(k){
    if(k==='vestibular'){
      showPopup({ title:'Correct! Vestibular Disruption', content:'Microgravity disrupts the inner ear, causing disorientation. Similar to astronaut space adaptation.', footer:'Bion‑M1 logged comparable behavioral changes.' })
      setGame(g=> ({...g, scientificAccuracy: g.scientificAccuracy + 10}))
    }
    setTimeout(()=> setChapter(4), 800)
  }

  function breakthrough(theory){
    if(theory==='mechanical'){
      setGame(g=> ({...g, breakthroughPoints: g.breakthroughPoints + 50, missionStatus:'discovery'}))
      showPopup({ title:'Breakthrough Discovery!', content:'Mechanical loading is essential for bone health. This insight powers countermeasures for long‑duration missions.' })
    }
    setTimeout(()=> setChapter(5), 800)
  }

  function runExperiment(){ setGame(g=> ({...g, missionStatus:'experiment'})); setTimeout(()=> setChapter(6), 600) }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden game-container">
      {/* Full-screen game container with proper black background */}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/games" className="text-white/80 hover:text-white text-sm backdrop-blur bg-black/40 px-3 py-2 rounded-lg border border-white/20">← Exit Game</Link>
          <h1 className="text-white font-bold text-xl tracking-wide">Mission Bion‑M1: The Complete Story</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="backdrop-blur bg-black/40 px-3 py-2 rounded-lg border border-emerald-500/30">
            <span className="text-emerald-400 text-sm">Accuracy: {game.scientificAccuracy}</span>
          </div>
          <div className="backdrop-blur bg-black/40 px-3 py-2 rounded-lg border border-indigo-500/30">
            <span className="text-indigo-400 text-sm">Discovery: {game.breakthroughPoints}</span>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="absolute top-20 left-4 right-4 z-40 h-1 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 transition-all duration-1000" style={{ width: `${progressPct}%` }} />
      </div>

      {/* Main game canvas */}
      <main className="absolute inset-0 pt-24">
        {chapter === 1 && (
          <FullScreenScene bgImage={assets?.ch1?.bg || "/biology.jpeg"}>
            {/* Lab environment - cleaner layout */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30" />
            
            {/* Character - Dr. Sarah Chen - positioned to not overlap with dialogue */}
            {assets?.ch1?.characters?.sarahIdle && (
              <div className="absolute bottom-0 right-8 h-80 w-64 flex items-end justify-center z-10">
                <img 
                  src={assets.ch1.characters.sarahIdle} 
                  alt="Dr. Sarah Chen" 
                  className="h-full w-auto object-contain filter drop-shadow-lg"
                  style={{
                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3)) brightness(1.1)'
                  }}
                />
              </div>
            )}
            
            {/* Story dialogue */}
            <div className="absolute bottom-8 left-8 right-8 z-30">
              <div className="backdrop-blur bg-black/70 border border-white/20 rounded-2xl p-8 max-w-4xl">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">SC</div>
                  <div>
                    <h3 className="text-white font-bold text-xl mb-2">Dr. Sarah Chen</h3>
                    <p className="text-gray-300 text-sm">Lead Mission Scientist, NASA Ames Research Center</p>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-white text-lg leading-relaxed mb-4">
                    "We're 6 months out from launch. The Bion‑M1 mission will be humanity's most comprehensive study of biological adaptation to spaceflight."
                  </p>
                  <p className="text-gray-300 text-base">
                    "Forty-five mice will spend 30 days in orbit. Every decision we make now will determine whether we unlock the secrets to long-duration space travel... or watch years of research fail."
                  </p>
                </div>
                
                <div className="space-y-3">
                  <p className="text-cyan-400 font-semibold mb-4">Which mouse strain should we prioritize for the bone density study?</p>
                  
                  <StoryChoice onClick={()=> selectStrain('C57BL6')} icon="🧬">
                    <div>
                      <h4 className="font-bold text-white">C57BL/6 Strain</h4>
                      <p className="text-gray-300 text-sm">Gold standard for research - reliable, consistent data</p>
                    </div>
                  </StoryChoice>
                  
                  <StoryChoice onClick={()=> selectStrain('BALB')} icon="🛡️">
                    <div>
                      <h4 className="font-bold text-white">BALB/c Strain</h4>
                      <p className="text-gray-300 text-sm">Immune system specialists - stress response focus</p>
                    </div>
                  </StoryChoice>
                  
                  <StoryChoice onClick={()=> selectStrain('Mixed')} icon="🌍">
                    <div>
                      <h4 className="font-bold text-white">Mixed Population</h4>
                      <p className="text-gray-300 text-sm">Genetic diversity - mirrors human variation</p>
                    </div>
                  </StoryChoice>
                </div>
              </div>
            </div>
          </FullScreenScene>
        )}

        {chapter === 2 && (
          <FullScreenScene bgImage={assets?.ch2?.bg}>
            {/* Rocket - custom CSS design to avoid transparency issues */}
            <div className="absolute left-1/2 bottom-0 top-0 flex items-end justify-center transform -translate-x-1/2">
              <div className={`relative transition-all duration-2000 ${
                counting && timer <= 0 ? 'transform -translate-y-full scale-75 opacity-0' : 
                counting ? 'animate-pulse' : ''
              }`}>
                {/* Custom rocket design */}
                <div className="relative w-16 h-80 mx-auto">
                  {/* Rocket body */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-64 bg-gradient-to-t from-gray-300 via-gray-200 to-white rounded-t-full shadow-2xl border-2 border-gray-400"></div>
                  
                  {/* Rocket nose */}
                  <div className="absolute bottom-64 left-1/2 transform -translate-x-1/2 w-6 h-16 bg-gradient-to-t from-white to-gray-100 clip-path-triangle shadow-lg"></div>
                  
                  {/* Side boosters */}
                  <div className="absolute bottom-8 left-0 w-4 h-32 bg-gradient-to-t from-gray-400 to-gray-300 rounded-t-lg shadow-lg"></div>
                  <div className="absolute bottom-8 right-0 w-4 h-32 bg-gradient-to-t from-gray-400 to-gray-300 rounded-t-lg shadow-lg"></div>
                  
                  {/* Launch effects */}
                  {counting && (
                    <>
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-8 h-16 bg-gradient-to-t from-orange-500 via-yellow-400 to-transparent animate-pulse opacity-90"></div>
                      <div className="absolute -bottom-4 left-0 w-3 h-8 bg-gradient-to-t from-red-500 via-orange-400 to-transparent animate-pulse opacity-80"></div>
                      <div className="absolute -bottom-4 right-0 w-3 h-8 bg-gradient-to-t from-red-500 via-orange-400 to-transparent animate-pulse opacity-80"></div>
                      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-radial from-orange-400/60 via-red-500/40 to-transparent rounded-full animate-ping"></div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Launch pad smoke effects - subtle */}
            {counting && (
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-gray-300/20 to-transparent animate-pulse" />
            )}
            
            {/* Mission Control Interface */}
            <div className="absolute top-8 left-8 right-8">
              <div className="backdrop-blur bg-black/80 border border-cyan-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white font-bold text-2xl tracking-wide">LAUNCH CONTROL</h2>
                  <div className="text-4xl font-mono text-cyan-400 font-bold">
                    {String(Math.floor(timer / 60)).padStart(2, '0')}:{String(timer % 60).padStart(2, '0')}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-lg p-3">
                    <div className="text-emerald-400 font-bold">BIOLOGICAL PAYLOAD</div>
                    <div className="text-white text-sm">45 mice - All systems nominal</div>
                  </div>
                  <div className="bg-sky-500/20 border border-sky-500/50 rounded-lg p-3">
                    <div className="text-sky-400 font-bold">LIFE SUPPORT</div>
                    <div className="text-white text-sm">Optimal parameters</div>
                  </div>
                  <div className={`${timer <= 60 ? 'bg-amber-500/20 border-amber-500/50' : 'bg-violet-500/20 border-violet-500/50'} rounded-lg p-3`}>
                    <div className={`${timer <= 60 ? 'text-amber-400' : 'text-violet-400'} font-bold`}>TELEMETRY</div>
                    <div className="text-white text-sm">{timer <= 60 ? '⚠️ Anomaly detected' : 'Strong signal'}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {!counting ? (
                    <button onClick={startCountdown} className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-bold px-8 py-3 rounded-lg transition-all">
                      🚀 INITIATE LAUNCH SEQUENCE
                    </button>
                  ) : (
                    <button onClick={()=> setCounting(false)} className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg">
                      HOLD
                    </button>
                  )}
                </div>
                
                {counting && timer <= 60 && (
                  <div className="mt-6 bg-amber-500/10 border border-amber-500/50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
                      <span className="text-amber-400 font-bold text-lg">CRITICAL DECISION REQUIRED</span>
                    </div>
                    <p className="text-white mb-4">Telemetry indicates Mouse #23 showing elevated stress markers. Launch window closes in {timer} seconds.</p>
                    <div className="flex gap-4">
                      <button onClick={abortLaunch} className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2">
                        🛑 ABORT LAUNCH
                        <span className="text-sm opacity-80">Investigate anomaly</span>
                      </button>
                      <button onClick={continueLaunch} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2">
                        ✓ CONTINUE LAUNCH
                        <span className="text-sm opacity-80">Monitor remotely</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <style jsx>{`
              @keyframes rocket { 
                0% { transform: translateY(0) scale(1); } 
                100% { transform: translateY(-150vh) scale(0.5); opacity: 0; } 
              }
              @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-10px) rotate(5deg); }
              }
              /* Fix all image rendering issues */
              img {
                background-color: transparent !important;
                image-rendering: -webkit-optimize-contrast;
                image-rendering: crisp-edges;
              }
              .no-checkerboard {
                background-image: none !important;
                background-color: transparent !important;
              }
              /* Custom gradient utilities */
              .bg-gradient-radial {
                background: radial-gradient(circle, var(--tw-gradient-stops));
              }
              /* Triangle clip path for rocket nose */
              .clip-path-triangle {
                clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
              }
              /* Ensure all containers have proper backgrounds */
              .game-container {
                background: #000 !important;
              }
              .game-container * {
                background-clip: padding-box;
              }
            `}</style>
          </FullScreenScene>
        )}

        {chapter === 3 && (
          <FullScreenScene bgImage={assets?.ch3?.controlBg}>
            {/* Mission Control Environment */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/20 to-black/60" />
              
              {/* Floating microgravity habitat view */}
              <div className="absolute top-1/4 right-8 w-80 h-60 border-2 border-cyan-500/60 rounded-xl overflow-hidden backdrop-blur-sm bg-slate-900/80">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
                  {/* Habitat interior simulation */}
                  <div className="absolute inset-2 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg">
                    {/* Floating mice simulation with CSS */}
                    <div className="absolute top-4 left-8 w-8 h-6 bg-gradient-to-br from-amber-200 to-amber-400 rounded-full animate-[float_4s_ease-in-out_infinite] shadow-lg">
                      <div className="absolute top-1 left-1 w-2 h-2 bg-black rounded-full"></div>
                      <div className="absolute top-1 right-1 w-2 h-2 bg-black rounded-full"></div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-amber-300 rounded-full"></div>
                    </div>
                    
                    <div className="absolute top-16 right-12 w-8 h-6 bg-gradient-to-br from-amber-200 to-amber-400 rounded-full animate-[float_5s_ease-in-out_infinite_0.5s] shadow-lg">
                      <div className="absolute top-1 left-1 w-2 h-2 bg-black rounded-full"></div>
                      <div className="absolute top-1 right-1 w-2 h-2 bg-black rounded-full"></div>
                    </div>
                    
                    <div className="absolute top-32 left-1/2 transform -translate-x-1/2 rotate-45 w-8 h-6 bg-gradient-to-br from-amber-200 to-amber-400 rounded-full animate-[float_6s_ease-in-out_infinite_1s] shadow-lg">
                      <div className="absolute top-1 left-1 w-2 h-2 bg-black rounded-full"></div>
                      <div className="absolute top-1 right-1 w-2 h-2 bg-black rounded-full"></div>
                    </div>
                    
                    {/* Habitat equipment */}
                    <div className="absolute bottom-4 left-4 w-16 h-8 bg-gray-600 rounded border border-gray-500"></div>
                    <div className="absolute bottom-4 right-4 w-12 h-12 bg-blue-600 rounded-full border-2 border-blue-500"></div>
                  </div>
                </div>
                
                <div className="absolute bottom-2 left-2 text-cyan-400 text-xs font-mono bg-black/60 px-2 py-1 rounded">HABITAT CAM - DAY 5</div>
              </div>
            </div>
            
            {/* Main Mission Control Interface */}
            <div className="absolute bottom-8 left-8 right-8">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Telemetry Panel */}
                <div className="backdrop-blur bg-black/80 border border-emerald-500/40 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                    <h3 className="text-emerald-400 font-bold text-lg">LIVE TELEMETRY - DAY 5</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Heart Rate (BPM)</p>
                      <div className="flex items-end gap-2 h-16">
                        <div className="bg-emerald-500/40 rounded-t w-1/2 h-[60%] flex items-end justify-center text-xs text-white">420</div>
                        <div className="bg-emerald-400 rounded-t w-1/2 h-[75%] flex items-end justify-center text-xs text-white font-bold">485</div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Earth</span><span>Space</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Activity Level</p>
                      <div className="bg-emerald-900/40 h-4 rounded-full overflow-hidden mb-2">
                        <div className="bg-emerald-400 h-full w-[40%] rounded-full" />
                      </div>
                      <p className="text-emerald-400 text-sm">40% of Earth baseline</p>
                    </div>
                  </div>
                </div>
                
                {/* Anomaly Alert Panel */}
                <div className="backdrop-blur bg-black/80 border border-amber-500/40 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
                    <h3 className="text-amber-400 font-bold text-lg">⚠️ ANOMALY DETECTED</h3>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-white mb-2">Subject #23 exhibiting unusual behavior:</p>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Spinning motions in microgravity</li>
                      <li>• Reduced feeding activity (60% normal)</li>
                      <li>• Elevated stress biomarkers</li>
                    </ul>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-4">
                    <p className="text-cyan-400 font-semibold mb-4">Dr. Chen, what's your diagnosis?</p>
                    
                    <div className="space-y-3">
                      <StoryChoice onClick={()=> diagnose('vestibular')} icon="🧠" highlight>
                        <div>
                          <h4 className="font-bold text-white">Vestibular System Disruption</h4>
                          <p className="text-gray-300 text-sm">Microgravity affecting inner ear balance</p>
                        </div>
                      </StoryChoice>
                      
                      <StoryChoice onClick={()=> diagnose('stress')} icon="😰">
                        <div>
                          <h4 className="font-bold text-white">Psychological Stress Response</h4>
                          <p className="text-gray-300 text-sm">Confined environment anxiety</p>
                        </div>
                      </StoryChoice>
                      
                      <StoryChoice onClick={()=> diagnose('equipment')} icon="🔧">
                        <div>
                          <h4 className="font-bold text-white">Equipment Malfunction</h4>
                          <p className="text-gray-300 text-sm">Habitat system irregularity</p>
                        </div>
                      </StoryChoice>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FullScreenScene>
        )}

        {chapter === 4 && (
          <FullScreenScene bgImage={assets?.ch4?.vignette}>
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black/60" />
            
            {/* Discovery moment */}
            <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-4">CRITICAL DISCOVERY</h2>
                <p className="text-cyan-400 text-lg">Day 14 - Bone Density Analysis</p>
              </div>
            </div>
            
            {/* Bone scan comparison */}
            <div className="absolute bottom-8 left-8 right-8">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Pre-flight scan */}
                <div className="backdrop-blur bg-black/80 border border-emerald-500/40 rounded-2xl p-6">
                  <h3 className="text-emerald-400 font-bold text-lg mb-4">PRE-FLIGHT BASELINE</h3>
                  <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 rounded-lg p-4 mb-4 border border-emerald-600">
                    {/* Custom bone scan visualization */}
                    <div className="w-full h-48 relative bg-gradient-to-br from-gray-900 to-black rounded border border-emerald-500/30">
                      <div className="absolute inset-4 flex items-center justify-center">
                        {/* Bone structure visualization */}
                        <div className="relative">
                          <div className="w-16 h-32 bg-gradient-to-b from-white via-gray-200 to-white rounded-full opacity-90 shadow-lg">
                            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white rounded-full"></div>
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white rounded-full"></div>
                          </div>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-emerald-400 text-xs font-bold">HEALTHY</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center text-emerald-400 font-bold text-2xl">100%</div>
                  <p className="text-gray-300 text-sm text-center">Bone Density</p>
                </div>
                
                {/* Day 14 scan */}
                <div className="backdrop-blur bg-black/80 border border-red-500/40 rounded-2xl p-6">
                  <h3 className="text-red-400 font-bold text-lg mb-4">DAY 14 - ORBIT</h3>
                  <div className="bg-gradient-to-br from-red-900 to-red-800 rounded-lg p-4 mb-4 border border-red-600">
                    {/* Degraded bone scan visualization */}
                    <div className="w-full h-48 relative bg-gradient-to-br from-gray-900 to-black rounded border border-red-500/30">
                      <div className="absolute inset-4 flex items-center justify-center">
                        {/* Degraded bone structure */}
                        <div className="relative">
                          <div className="w-16 h-32 bg-gradient-to-b from-red-200 via-red-300 to-red-200 rounded-full opacity-70 shadow-lg">
                            {/* Visible damage areas */}
                            <div className="absolute top-6 left-2 w-3 h-3 bg-red-600 rounded opacity-80"></div>
                            <div className="absolute top-12 right-1 w-2 h-4 bg-red-700 rounded opacity-90"></div>
                            <div className="absolute bottom-8 left-1 w-4 h-2 bg-red-800 rounded opacity-85"></div>
                            
                            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-300 rounded-full opacity-60"></div>
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-300 rounded-full opacity-60"></div>
                          </div>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-400 text-xs font-bold">DEGRADED</div>
                          {/* Highlight critical areas */}
                          <div className="absolute inset-0 border-2 border-red-500 rounded-full animate-pulse opacity-50"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center text-red-400 font-bold text-2xl">79%</div>
                  <p className="text-gray-300 text-sm text-center">21% Loss in 14 days!</p>
                </div>
                
                {/* Analysis panel */}
                <div className="backdrop-blur bg-black/80 border border-cyan-500/40 rounded-2xl p-6">
                  <h3 className="text-cyan-400 font-bold text-lg mb-4">DR. CHEN'S ANALYSIS</h3>
                  <p className="text-white text-sm mb-4">
                    "The pattern is unprecedented. Weight-bearing bones show 21% loss, while non-weight-bearing bones show only 8%."
                  </p>
                  <p className="text-cyan-400 font-semibold mb-4">What does this pattern suggest?</p>
                  
                  <div className="space-y-3">
                    <StoryChoice onClick={()=> breakthrough('mechanical')} icon="⚡" highlight>
                      <div>
                        <h4 className="font-bold text-white">Mechanical Loading Critical</h4>
                        <p className="text-gray-300 text-sm">Gravity provides essential bone stress</p>
                      </div>
                    </StoryChoice>
                    
                    <StoryChoice onClick={()=> breakthrough('blood')} icon="🩸">
                      <div>
                        <h4 className="font-bold text-white">Blood Flow Changes</h4>
                        <p className="text-gray-300 text-sm">Circulation affects bone formation</p>
                      </div>
                    </StoryChoice>
                  </div>
                </div>
              </div>
            </div>
          </FullScreenScene>
        )}

        {chapter === 5 && (
          <FullScreenScene bgImage={assets?.ch5?.blueprint}>
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/30 to-black/70" />
            
            {/* Emergency protocol header */}
            <div className="absolute top-8 left-8 right-8">
              <div className="backdrop-blur bg-black/80 border border-amber-500/50 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-4 h-4 bg-amber-400 rounded-full animate-pulse" />
                  <h2 className="text-amber-400 font-bold text-2xl">EMERGENCY EXPERIMENT PROTOCOL</h2>
                </div>
                <p className="text-white text-lg">
                  Your breakthrough discovery has changed everything. Mission Control approves an emergency experiment to test mechanical loading theory.
                </p>
              </div>
            </div>
            
            {/* Exercise device design - custom CSS to avoid image issues */}
            <div className="absolute left-8 top-1/3 w-1/2">
              <div className="backdrop-blur bg-black/60 border border-cyan-500/40 rounded-2xl p-6">
                <h3 className="text-cyan-400 font-bold text-lg mb-4">PROTOTYPE EXERCISE DEVICE</h3>
                <div className="w-full h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-cyan-500/30 p-4 mb-4">
                  {/* Custom exercise device visualization */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Central hub */}
                    <div className="absolute w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full border-4 border-cyan-300 shadow-lg">
                      <div className="absolute inset-2 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full"></div>
                    </div>
                    
                    {/* Exercise arms */}
                    <div className="absolute w-32 h-4 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-full transform rotate-0"></div>
                    <div className="absolute w-4 h-32 bg-gradient-to-b from-gray-600 via-gray-500 to-gray-600 rounded-full"></div>
                    <div className="absolute w-32 h-4 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-full transform rotate-45"></div>
                    <div className="absolute w-32 h-4 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-full transform -rotate-45"></div>
                    
                    {/* End caps */}
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full border-2 border-red-400"></div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full border-2 border-red-400"></div>
                    <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full border-2 border-red-400"></div>
                    <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full border-2 border-red-400"></div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">Microgravity resistance loading system</p>
              </div>
            </div>
            
            {/* Experiment parameters */}
            <div className="absolute bottom-8 right-8 w-96">
              <div className="backdrop-blur bg-black/80 border border-indigo-500/40 rounded-2xl p-6">
                <h3 className="text-indigo-400 font-bold text-lg mb-4">EXPERIMENT PARAMETERS</h3>
                <p className="text-white mb-4">8 days remaining, 15 mice available</p>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-gray-300 text-sm block mb-2">Exercise Group Size</label>
                    <select className="w-full bg-black/60 border border-gray-600 rounded p-2 text-white">
                      <option>5 mice (small sample)</option>
                      <option>8 mice (optimal)</option>
                      <option>12 mice (large sample)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-gray-300 text-sm block mb-2">Exercise Duration</label>
                    <select className="w-full bg-black/60 border border-gray-600 rounded p-2 text-white">
                      <option>30 min/day (safe)</option>
                      <option>60 min/day (moderate)</option>
                      <option>120 min/day (intensive)</option>
                    </select>
                  </div>
                </div>
                
                <button 
                  onClick={runExperiment} 
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
                >
                  🧪 INITIATE EXPERIMENT
                </button>
              </div>
            </div>
          </FullScreenScene>
        )}

        {chapter === 6 && (
          <FullScreenScene bgImage={assets?.ch6?.bg}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Mission complete header */}
            <div className="absolute top-8 left-8 right-8 text-center">
              <div className="backdrop-blur bg-emerald-900/80 border border-emerald-500/50 rounded-2xl p-8">
                <h1 className="text-4xl font-bold text-white mb-4">🎉 MISSION COMPLETE</h1>
                <p className="text-emerald-300 text-xl">Bion‑M1 has successfully returned to Earth</p>
              </div>
            </div>
            
            {/* Recovery scene elements - custom CSS designs */}
            <div className="absolute bottom-1/4 left-1/3 transform -translate-x-1/2">
              {/* Custom capsule design */}
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 rounded-full shadow-2xl border-2 border-gray-600">
                  <div className="absolute inset-2 bg-gradient-to-br from-white to-gray-200 rounded-full"></div>
                  <div className="absolute top-3 left-3 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-3 right-3 w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-gradient-to-b from-orange-500 to-red-600 rounded-b-lg"></div>
              </div>
            </div>
            
            {/* Recovery team representation */}
            <div className="absolute bottom-20 right-1/3 flex gap-2">
              <div className="w-4 h-8 bg-gradient-to-b from-blue-600 to-blue-800 rounded-t-full"></div>
              <div className="w-4 h-8 bg-gradient-to-b from-green-600 to-green-800 rounded-t-full"></div>
              <div className="w-4 h-8 bg-gradient-to-b from-red-600 to-red-800 rounded-t-full"></div>
            </div>
            
            {/* Helicopter representation */}
            <div className="absolute top-1/4 right-12">
              <div className="relative">
                <div className="w-12 h-4 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full"></div>
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-800 rounded-full animate-spin"></div>
                <div className="absolute top-1 right-0 w-4 h-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded"></div>
              </div>
            </div>
            
            {/* Results summary */}
            <div className="absolute bottom-8 left-8 right-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="backdrop-blur bg-black/80 border border-emerald-500/40 rounded-2xl p-6">
                  <h3 className="text-emerald-400 font-bold text-lg mb-4">🏆 YOUR DISCOVERIES</h3>
                  <ul className="space-y-3 text-white">
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">🦴</span>
                      <div>
                        <p className="font-bold">Mechanical Loading Critical</p>
                        <p className="text-gray-300 text-sm">21% vs 8% bone loss pattern identified</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">💪</span>
                      <div>
                        <p className="font-bold">Exercise Countermeasures Work</p>
                        <p className="text-gray-300 text-sm">50% reduction in bone loss achieved</p>
                      </div>
                    </li>
                  </ul>
                  <div className="mt-6 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-lg">
                    <p className="text-emerald-300 font-bold">Final Score</p>
                    <div className="flex gap-4 mt-2">
                      <span className="text-white">Accuracy: {game.scientificAccuracy}</span>
                      <span className="text-white">Discovery: {game.breakthroughPoints}</span>
                    </div>
                  </div>
                </div>
                
                <div className="backdrop-blur bg-black/80 border border-cyan-500/40 rounded-2xl p-6">
                  <h3 className="text-cyan-400 font-bold text-lg mb-4">🚀 RESEARCH LEGACY</h3>
                  <div className="space-y-3 text-gray-300 text-sm">
                    <div className="flex gap-3">
                      <span className="text-cyan-400 font-bold">2015</span>
                      <span>ISS exercise equipment upgraded based on your findings</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-cyan-400 font-bold">2020</span>
                      <span>Artemis program incorporates bone health protocols</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-cyan-400 font-bold">2028</span>
                      <span>Mars mission crews use exercise systems derived from your research</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex gap-3">
                    <Link 
                      href="/papers" 
                      className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg text-center transition-all"
                    >
                      📚 Explore Research Papers
                    </Link>
                    <Link 
                      href="/games" 
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg text-center transition-all"
                    >
                      🎮 Play More Games
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </FullScreenScene>
        )}
      </main>

      {/* Story popup modal */}
      {popup && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="max-w-lg w-full backdrop-blur bg-black/90 border border-white/20 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">{popup.title}</h3>
            <p className="text-gray-300 text-base leading-relaxed mb-4">{popup.content}</p>
            {popup.footer && <p className="text-sm text-gray-500 mb-6">{popup.footer}</p>}
            <div className="flex justify-end gap-3">
              {popup.action ? (
                <button 
                  onClick={popup.action.onClick} 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-lg transition-all"
                >
                  {popup.action.label}
                </button>
              ) : null}
              <button 
                onClick={closePopup} 
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-6 py-3 rounded-lg transition-all"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FullScreenScene({ children, bgImage }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {bgImage && (
        <div className="absolute inset-0">
          <img 
            src={bgImage} 
            alt="scene background" 
            className="w-full h-full object-cover" 
            style={{ 
              backgroundColor: '#000000',
              objectFit: 'cover',
              minWidth: '100%',
              minHeight: '100%'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.style.background = 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
        </div>
      )}
      {!bgImage && (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-black" />
      )}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  )
}

function StoryChoice({ children, onClick, icon, highlight = false }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all hover:scale-[1.02] hover:shadow-lg ${
        highlight 
          ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border-cyan-500/50 hover:from-cyan-500/30 hover:to-indigo-500/30 shadow-cyan-500/20'
          : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/40'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="text-2xl">{icon}</div>
        <div className="flex-1">{children}</div>
      </div>
    </button>
  )
}