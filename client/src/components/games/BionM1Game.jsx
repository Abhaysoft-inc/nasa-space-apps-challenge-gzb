"use client"

import React, { useEffect, useMemo, useState } from "react"
import assets from "@/data/bionM1Assets.json"
import Link from "next/link"
import FullScreenScene from "./FullScreenScene"
import StoryChoice from "./StoryChoice"

export default function BionM1Game(){
  const [chapter, setChapter] = useState(1)
  const [popup, setPopup] = useState(null)
  const [timer, setTimer] = useState(600)
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

  function startCountdown(){ setTimer(600); setCounting(true) }
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
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Full-screen game container */}
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
            {/* Lab environment layers */}
            {assets?.ch1?.layers?.[0] && (
              <img src={assets.ch1.layers[0]} alt="lab racks" className="absolute inset-0 w-full h-full object-cover opacity-60" />
            )}
            {assets?.ch1?.layers?.[1] && (
              <img src={assets.ch1.layers[1]} alt="lab table" className="absolute bottom-0 left-0 w-full h-1/3 object-cover opacity-70" />
            )}
            
            {/* Character - Dr. Sarah Chen */}
            {assets?.ch1?.characters?.sarahIdle && (
              <img src={assets.ch1.characters.sarahIdle} alt="Dr. Sarah Chen" className="absolute bottom-0 left-8 h-96 object-contain z-20" />
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
            {/* Launch pad smoke and effects */}
            {assets?.ch2?.smoke && (
              <img src={assets.ch2.smoke} alt="launch smoke" className="absolute bottom-0 left-0 w-full h-2/3 object-cover opacity-50" />
            )}
            
            {/* Rocket */}
            <div className="absolute right-1/4 bottom-0 top-0 flex items-end justify-center">
              {assets?.ch2?.rocket ? (
                <img 
                  src={assets.ch2.rocket} 
                  alt="Bion-M1 rocket" 
                  className={`h-5/6 object-contain transition-all duration-3000 ${
                    counting && timer <= 0 ? 'transform -translate-y-full opacity-0' : 
                    counting ? 'animate-pulse' : ''
                  }`} 
                />
              ) : (
                <div className="w-16 h-80 bg-gradient-to-t from-gray-300 to-white rounded-t-full" />
              )}
            </div>
            
            {/* Mission Control Interface */}
            <div className="absolute top-8 left-8 right-8">
              <div className="backdrop-blur bg-black/80 border border-cyan-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white font-bold text-2xl tracking-wide">LAUNCH CONTROL</h2>
                  <div className="text-3xl font-mono text-cyan-400">
                    T-{String(Math.floor(timer / 60)).padStart(2, '0')}:{String(timer % 60).padStart(2, '0')}
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
            `}</style>
          </FullScreenScene>
        )}

        {chapter === 3 && (
          <FullScreenScene bgImage={assets?.ch3?.controlBg}>
            {/* Mission Control Environment */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/20 to-black/60" />
              
              {/* Floating microgravity habitat view */}
              <div className="absolute top-1/4 right-8 w-80 h-60 border border-cyan-500/50 rounded-xl overflow-hidden backdrop-blur bg-black/40">
                {assets?.ch3?.habitatBg && (
                  <img src={assets.ch3.habitatBg} alt="habitat interior" className="w-full h-full object-cover opacity-70" />
                )}
                
                {/* Floating mice animation */}
                {assets?.ch3?.mice?.map((mouseImg, i) => (
                  <img 
                    key={mouseImg} 
                    src={mouseImg} 
                    alt={`mouse ${i+1}`} 
                    className={`absolute w-12 h-12 object-contain ${
                      i === 0 ? 'top-4 left-8 animate-[float_4s_ease-in-out_infinite]' :
                      i === 1 ? 'top-16 right-12 animate-[float_5s_ease-in-out_infinite_0.5s]' :
                      'top-32 left-1/2 animate-[float_6s_ease-in-out_infinite_1s] transform rotate-45'
                    }`}
                  />
                ))}
                
                <div className="absolute bottom-2 left-2 text-cyan-400 text-xs font-mono">HABITAT CAM - DAY 5</div>
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
            
            <style jsx>{`
              @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-10px) rotate(5deg); }
              }
            `}</style>
          </FullScreenScene>
        )}

        {chapter === 4 && (
          <SceneFrame bgClass="from-fuchsia-900 via-violet-900 to-slate-900" imageSrc={assets?.ch4?.vignette} imageClass="opacity-40">
            <ChapterHeader title="Chapter 4 · The Bone Discovery" subtitle="Day 14 — X‑ray analysis"/>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold">Bone Density Analysis</h3>
                <div className="mt-3 grid grid-cols-2 gap-3 text-center">
                  <div>
                    {assets?.ch4?.pre ? (
                      <img src={assets.ch4.pre} alt="Pre-flight bone scan" className="h-40 w-full object-contain rounded-lg bg-white" />
                    ) : (
                      <div className="h-40 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300" />
                    )}
                    <p className="mt-1 text-sm">Pre‑flight — 100% baseline</p>
                  </div>
                  <div>
                    {assets?.ch4?.day14 ? (
                      <div className="relative h-40 w-full rounded-lg overflow-hidden bg-white">
                        <img src={assets.ch4.day14} alt="Day 14 bone scan" className="h-full w-full object-contain" />
                        {assets?.ch4?.highlight && <img src={assets.ch4.highlight} alt="highlight" className="absolute inset-0 object-contain mix-blend-screen opacity-80" />}
                      </div>
                    ) : (
                      <div className="h-40 rounded-lg bg-gradient-to-br from-red-200 to-rose-300" />
                    )}
                    <p className="mt-1 text-sm text-rose-600 font-medium">Day 14 — 79% baseline</p>
                  </div>
                </div>
              </div>
              <div className="bg-black/60 border border-fuchsia-400/30 rounded-xl p-4 text-fuchsia-100">
                <p className="text-sm">You notice bone loss is not uniform. Weight‑bearing bones show 21% loss vs 8% for non‑weight‑bearing.</p>
                <p className="text-sm mt-3">This pattern suggests:</p>
                <div className="mt-3 grid gap-2">
                  <ChoiceButton onClick={()=> breakthrough('mechanical')} className="ring-2 ring-fuchsia-400">⚡ Mechanical loading is crucial</ChoiceButton>
                  <ChoiceButton onClick={()=> breakthrough('blood')}>🩸 Blood flow changes</ChoiceButton>
                  <ChoiceButton onClick={()=> breakthrough('hormonal')}>🧪 Hormonal changes</ChoiceButton>
                </div>
              </div>
            </div>
          </SceneFrame>
        )}

        {chapter === 5 && (
          <SceneFrame bgClass="from-indigo-900 via-slate-900 to-black">
            <ChapterHeader title="Chapter 5 · The Final Week" subtitle="Emergency experiment protocol"/>
            <div className="bg-white rounded-xl border border-gray-200 p-4 max-w-2xl">
              <p className="text-sm text-gray-700">You have 8 days and 15 mice remaining. Select parameters to test mechanical loading.</p>
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                <LabeledSelect label="Exercise Group Size" options={[{v:5,l:'5 mice'},{v:8,l:'8 mice'},{v:12,l:'12 mice'}]} />
                <LabeledSelect label="Exercise Duration" options={[{v:30,l:'30 min/day'},{v:60,l:'60 min/day'},{v:120,l:'120 min/day'}]} />
              </div>
              <button onClick={runExperiment} className="mt-4 px-4 py-2 rounded-md bg-indigo-600 text-white">Run the Experiment</button>
            </div>
          </SceneFrame>
        )}

        {chapter === 6 && (
          <SceneFrame bgClass="from-emerald-900 via-teal-900 to-slate-900">
            <ChapterHeader title="Chapter 6 · Return to Earth" subtitle="Mission complete"/>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold">Key Discoveries</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex gap-3"><span>🦴</span> <span><strong>Mechanical loading</strong> is critical for bone health — 21% vs 8% loss.</span></li>
                  <li className="flex gap-3"><span>💪</span> <span>Exercise countermeasures reduced loss by ~50% in protocol group (simulated).</span></li>
                </ul>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold">Your Research Legacy</h3>
                <ol className="mt-3 text-sm space-y-2">
                  <li>2015 — ISS upgrades exercise equipment.</li>
                  <li>2020 — Artemis incorporates bone protocols.</li>
                  <li>2028 — Mars crews use derived systems.</li>
                </ol>
                <div className="mt-4 flex gap-2">
                  <Link href="/papers" className="px-3 py-2 rounded-md bg-gray-800 text-white text-sm">Explore related papers</Link>
                  <Link href="/games" className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm">Play more games</Link>
                </div>
              </div>
            </div>
          </SceneFrame>
        )}
      </main>

      {popup && (
        <div className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4" role="dialog" aria-modal="true">
          <div className="max-w-md w-full rounded-xl bg-white p-5 shadow-lg">
            <h3 className="text-lg font-semibold">{popup.title}</h3>
            <p className="mt-2 text-sm text-gray-700">{popup.content}</p>
            {popup.footer && <p className="mt-2 text-xs text-gray-500">{popup.footer}</p>}
            <div className="mt-4 flex justify-end gap-2">
              {popup.action ? (
                <button onClick={popup.action.onClick} className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm">{popup.action.label}</button>
              ) : null}
              <button onClick={closePopup} className="px-3 py-1.5 rounded-md bg-gray-200 text-gray-800 text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


