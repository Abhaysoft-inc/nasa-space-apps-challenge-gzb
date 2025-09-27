"use client"

import React, { useEffect, useMemo, useState } from "react"
import assets from "@/data/bionM1Assets.json"
import Link from "next/link"

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
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/games" className="text-sm text-gray-600 hover:text-gray-900">← Back to Games</Link>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Mission Bion‑M1: The Complete Story</h1>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-xs text-gray-600">
            <InfoPill label="Accuracy" value={`${game.scientificAccuracy}`} color="emerald"/>
            <InfoPill label="Breakthrough" value={`${game.breakthroughPoints}`} color="indigo"/>
            <InfoPill label="Status" value={game.missionStatus} color="gray"/>
          </div>
        </div>
        <div className="h-1 bg-gray-100"><div className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-all" style={{ width: `${progressPct}%` }} /></div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {chapter === 1 && (
          <SceneFrame bgClass="from-slate-900 via-indigo-950 to-slate-900" imageSrc={assets?.ch1?.bg || "/biology.jpeg"} imageClass="opacity-20 mix-blend-luminosity">
            <ChapterHeader title="Chapter 1 · The Selection" subtitle="NASA Ames — 6 months before launch"/>
            <p className="text-indigo-100/90 max-w-3xl">The Bion‑M1 mission will send 45 mice for 30 days in orbit. Your selection will decide the quality of science and animal welfare outcomes.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <ChoiceButton onClick={()=> selectStrain('C57BL6')}>
                <span className="text-lg">🐭 C57BL/6</span>
                <small className="block text-xs opacity-80">Reliable data, well‑studied genetics</small>
              </ChoiceButton>
              <ChoiceButton onClick={()=> selectStrain('BALB')}>
                <span className="text-lg">🐭 BALB/c</span>
                <small className="block text-xs opacity-80">Immune system focus</small>
              </ChoiceButton>
              <ChoiceButton onClick={()=> selectStrain('Mixed')}>
                <span className="text-lg">🐭 Mixed population</span>
                <small className="block text-xs opacity-80">More representative diversity</small>
              </ChoiceButton>
            </div>
          </SceneFrame>
        )}

        {chapter === 2 && (
          <SceneFrame bgClass="from-black via-slate-900 to-indigo-950" imageSrc={assets?.ch2?.bg} imageClass="opacity-25">
            <ChapterHeader title="Chapter 2 · Launch Day" subtitle="Baikonur Cosmodrome"/>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2 bg-black/60 border border-indigo-500/40 rounded-xl p-4 text-indigo-100">
                <div className="text-2xl font-mono">T‑minus <span className="font-bold">{timer}</span> s</div>
                <div className="mt-4 grid sm:grid-cols-3 gap-3 text-sm">
                  <StatusPill label="Mice" value="All 45 healthy" color="emerald"/>
                  <StatusPill label="Life Support" value="Optimal" color="sky"/>
                  <StatusPill label="Telemetry" value={timer<=60? 'Anomaly detected' : 'Strong signal'} color={timer<=60? 'amber':'violet'} />
                </div>
                <div className="mt-4 flex items-center gap-3">
                  {!counting ? (
                    <button onClick={startCountdown} className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white">Start Countdown</button>
                  ) : (
                    <button onClick={()=> setCounting(false)} className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white">Pause</button>
                  )}
                </div>
                {counting && timer<=60 && (
                  <div className="mt-6 border border-amber-400/60 bg-amber-50/10 text-amber-200 rounded-lg p-4">
                    <p className="font-semibold">ALERT: Telemetry shows one mouse under stress. Launch in 60 seconds.</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button onClick={abortLaunch} className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-500 text-white">Abort & Investigate</button>
                      <button onClick={continueLaunch} className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white">Continue Launch</button>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-indigo-600 to-fuchsia-600 p-6">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"/>
                <div className="relative h-72">
                  {/* If rocket sprite exists, show it; else fallback to dot */}
                  {assets?.ch2?.rocket ? (
                    <img src={assets.ch2.rocket} alt="rocket" className={`w-16 absolute left-1/2 -translate-x-1/2 bottom-2 ${counting? 'animate-[rocket_3s_linear_infinite]':''}`} />
                  ) : (
                    <div className={`w-10 h-10 bg-white/90 rounded-full shadow-lg absolute left-1/2 -translate-x-1/2 ${counting? 'animate-[rocket_3s_linear_infinite]':''}`}></div>
                  )}
                </div>
                <style jsx>{`@keyframes rocket { 0%{ transform: translate(-50%, 100%);} 100%{ transform: translate(-50%, -120%);} }`}</style>
                <p className="text-white/90 text-sm">Rocket ascent visualization</p>
              </div>
            </div>
          </SceneFrame>
        )}

        {chapter === 3 && (
          <SceneFrame bgClass="from-slate-900 via-indigo-900 to-black" imageSrc={assets?.ch3?.controlBg} imageClass="opacity-25">
            <ChapterHeader title="Chapter 3 · First Week in Space" subtitle="Mission Control"/>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-black/60 border border-emerald-500/30 rounded-xl p-4 text-emerald-100">
                <h3 className="font-semibold">LIVE: Day 5 Telemetry</h3>
                <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="mb-2">Heart Rate (BPM)</p>
                    <div className="flex items-end gap-2 h-28">
                      <div className="w-1/2 bg-emerald-500/40 rounded-t-md h-[60%] flex items-end justify-center">420</div>
                      <div className="w-1/2 bg-emerald-400 rounded-t-md h-[75%] flex items-end justify-center">485</div>
                    </div>
                  </div>
                  <div>
                    <p className="mb-2">Activity Level</p>
                    <div className="w-full h-3 bg-emerald-900/40 rounded-full overflow-hidden"><div className="h-full bg-emerald-400" style={{ width: '40%' }} /></div>
                    <p className="mt-1">40% of Earth normal</p>
                  </div>
                </div>
              </div>
              <div className="bg-black/60 border border-amber-500/30 rounded-xl p-4 text-amber-100">
                <h3 className="font-semibold">Anomaly Detected</h3>
                <p className="text-sm mt-2">Mouse #23 shows spinning behavior and reduced feeding.</p>
                <p className="text-sm mt-2">What is your hypothesis?</p>
                <div className="mt-3 grid gap-2">
                  <ChoiceButton onClick={()=> diagnose('vestibular')}>🧠 Vestibular disruption (microgravity)</ChoiceButton>
                  <ChoiceButton onClick={()=> diagnose('stress')}>😰 Stress response</ChoiceButton>
                  <ChoiceButton onClick={()=> diagnose('equipment')}>🔧 Equipment malfunction</ChoiceButton>
                </div>
              </div>
            </div>
          </SceneFrame>
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

function SceneFrame({ children, bgClass = "", imageSrc, imageClass }){
  return (
    <section className={`relative overflow-hidden rounded-2xl p-6 sm:p-8 text-white min-h-[60vh] bg-gradient-to-br ${bgClass}`}>
      {imageSrc && <img src={imageSrc} alt="" className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${imageClass||''}`} />}
      <div className="relative z-10 space-y-4">{children}</div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.04),transparent_60%)]" />
    </section>
  )
}

function ChapterHeader({ title, subtitle }){
  return (
    <div>
      <p className="uppercase tracking-wider text-xs text-white/70">{subtitle}</p>
      <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
    </div>
  )
}

function ChoiceButton({ children, className = "", ...props }){
  return (
    <button {...props} className={`text-left rounded-lg border border-white/20 bg-white/10 hover:bg-white/15 backdrop-blur px-4 py-3 transition shadow-sm ${className}`}>
      {children}
    </button>
  )
}

function InfoPill({ label, value, color }){
  const map = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    gray: 'bg-gray-50 text-gray-700 border-gray-200',
  }
  return <span className={`text-[11px] px-2 py-1 rounded-md border ${map[color]||map.gray}`}>{label}: <b>{value}</b></span>
}

function StatusPill({ label, value, color='gray' }){
  const colorMap = {
    emerald: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
    sky: 'bg-sky-500/20 text-sky-200 border-sky-400/30',
    violet: 'bg-violet-500/20 text-violet-200 border-violet-400/30',
    amber: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
    gray: 'bg-gray-500/20 text-gray-200 border-gray-400/30',
  }
  return (
    <div className="text-xs">
      <div className="opacity-80">{label}</div>
      <div className={`mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded border ${colorMap[color]}`}>{value}</div>
    </div>
  )
}

function LabeledSelect({ label, options }){
  return (
    <label className="block">
      <span className="text-xs text-gray-700">{label}</span>
      <select className="mt-1 w-full rounded-md border-gray-300 text-sm">
        {options.map(o=> <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </label>
  )
}
