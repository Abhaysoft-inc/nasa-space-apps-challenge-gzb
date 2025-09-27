"use client"

import React, { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import KnowledgeGamesSection from "../profile/KnowledgeGamesSection"

export default function GamesCenter(){
  const router = useRouter()
  const pathname = usePathname()
  const search = useSearchParams()
  const initialTab = search.get('tab') || 'overview'
  const [tab, setTab] = useState(initialTab)

  useEffect(()=>{ setTab(initialTab) }, [initialTab])

  const setRouteTab = (t) => {
    const sp = new URLSearchParams(Array.from(search.entries()))
    sp.set('tab', t)
    router.push(`${pathname}?${sp.toString()}`, { scroll: true })
  }

  const stats = useMemo(()=> ({
    xp: 500,
    coins: 100,
    streak: 1,
    rank: 156,
  }), [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <header className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white mb-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8h12M6 12h12M6 16h6"/></svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Game Center</h1>
              <p className="text-sm text-gray-600">Level up your knowledge with quizzes and challenges — earn rewards and track progress.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full sm:w-auto">
              <StatCard label="Total XP" value={stats.xp} gradient="from-violet-500 to-fuchsia-500"/>
              <StatCard label="BioCoins" value={stats.coins} gradient="from-amber-500 to-orange-500"/>
              <StatCard label="Day Streak" value={stats.streak} gradient="from-rose-500 to-pink-500"/>
              <StatCard label="Global Rank" value={`#${stats.rank}`} gradient="from-emerald-500 to-green-600"/>
            </div>
          </div>
        </header>

        {/* Sub Navigation Tabs */}
        <div className="sticky top-[56px] z-40">
          <div className="bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border border-gray-200 rounded-2xl p-2">
            <div className="flex items-center gap-2 overflow-x-auto">
              <TabButton active={tab==='overview'} onClick={()=> setRouteTab('overview')}>Overview</TabButton>
              <TabButton active={tab==='challenges'} onClick={()=> setRouteTab('challenges')}>Daily Challenges</TabButton>
              <TabButton active={tab==='competitions'} onClick={()=> setRouteTab('competitions')}>Competitions</TabButton>
              <TabButton active={tab==='achievements'} onClick={()=> setRouteTab('achievements')}>Achievements</TabButton>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <KnowledgeGamesSection seed={3} />
            
            {/* NEW: Featured Tardigrade Story Game */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Featured: Interactive Science Stories</h2>
                <span className="text-sm text-indigo-600">Choose Your Experience →</span>
              </div>
              
              {/* Story Game Options */}
              <div className="grid md:grid-cols-3 gap-4">
                
                {/* Original Interactive Story */}
                <div className="rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <div className="aspect-[16/9] bg-gradient-to-br from-purple-600 to-blue-600 relative flex items-center justify-center">
                    {/* Professional tardigrade visualization */}
                    <svg width="60" height="40" viewBox="0 0 80 50" className="filter drop-shadow-lg">
                      <ellipse cx="40" cy="25" rx="35" ry="15" fill="#60a5fa" opacity="0.9"/>
                      <path d="M15 25 Q40 12 65 25 Q40 38 15 25" fill="#3b82f6" opacity="0.7"/>
                      <circle cx="20" cy="32" r="2.5" fill="#1d4ed8"/>
                      <circle cx="25" cy="35" r="2.5" fill="#1d4ed8"/>
                      <circle cx="55" cy="35" r="2.5" fill="#1d4ed8"/>
                      <circle cx="60" cy="32" r="2.5" fill="#1d4ed8"/>
                      <circle cx="20" cy="18" r="2.5" fill="#1d4ed8"/>
                      <circle cx="25" cy="15" r="2.5" fill="#1d4ed8"/>
                      <circle cx="55" cy="15" r="2.5" fill="#1d4ed8"/>
                      <circle cx="60" cy="18" r="2.5" fill="#1d4ed8"/>
                      <circle cx="10" cy="25" r="8" fill="#3b82f6" opacity="0.9"/>
                      <circle cx="7" cy="22" r="1.5" fill="#dc2626"/>
                      <circle cx="7" cy="28" r="1.5" fill="#dc2626"/>
                    </svg>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.1),transparent_60%)]" />
                  </div>
                  <div className="p-3">
                    <h3 className="text-md font-bold text-gray-900 mb-1">Interactive Story</h3>
                    <p className="text-gray-600 text-xs mb-2">
                      Make choices that affect the story outcome!
                    </p>
                    <a href="/games/tardigrade-story" className="inline-flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-700">
                      Play Interactive →
                    </a>
                  </div>
                </div>

                {/* 3D Animated Story */}
                <div className="rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] relative">
                  <div className="absolute top-2 right-2 z-10">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      3D
                    </span>
                  </div>
                  <div className="aspect-[16/9] bg-gradient-to-br from-emerald-600 to-cyan-600 relative flex items-center justify-center overflow-hidden">
                    {/* 3D-style tardigrade */}
                    <div className="relative animate-pulse">
                      <svg width="70" height="45" viewBox="0 0 90 60" className="filter drop-shadow-2xl">
                        <defs>
                          <radialGradient id="tardigrade3D" cx="50%" cy="30%">
                            <stop offset="0%" stopColor="#60a5fa" />
                            <stop offset="100%" stopColor="#1d4ed8" />
                          </radialGradient>
                        </defs>
                        <ellipse cx="45" cy="30" rx="40" ry="18" fill="url(#tardigrade3D)" opacity="0.9"/>
                        <circle cx="15" cy="30" r="12" fill="url(#tardigrade3D)"/>
                        <circle cx="10" cy="25" r="2" fill="#fbbf24"/>
                        <circle cx="10" cy="32" r="2" fill="#fbbf24"/>
                      </svg>
                    </div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.1),transparent_60%)]" />
                  </div>
                  <div className="p-3">
                    <h3 className="text-md font-bold text-gray-900 mb-1">3D Chronicle</h3>
                    <p className="text-gray-600 text-xs mb-2">
                      Watch stunning 3D visuals and animations!
                    </p>
                    <a href="/games/tardigrade-animated" className="inline-flex items-center text-xs font-medium text-emerald-600 hover:text-emerald-700">
                      Watch 3D →
                    </a>
                  </div>
                </div>

                {/* NEW: Visual Novel */}
                <div className="rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] relative">
                  <div className="absolute top-2 right-2 z-10">
                    <span className="bg-gradient-to-r from-pink-400 to-violet-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      NEW VN
                    </span>
                  </div>
                  <div className="aspect-[16/9] bg-gradient-to-br from-violet-600 to-pink-600 relative flex items-center justify-center overflow-hidden">
                    {/* Visual Novel Style Character */}
                    <div className="relative">
                      <div className="w-16 h-20 bg-gradient-to-b from-white/20 to-purple-300/30 rounded-lg border border-white/30 flex items-center justify-center backdrop-blur-sm">
                        <div className="text-2xl">👩‍🔬</div>
                      </div>
                      <div className="absolute -right-6 top-2 w-12 h-16 bg-gradient-to-b from-white/15 to-blue-300/30 rounded-lg border border-white/30 flex items-center justify-center backdrop-blur-sm">
                        <div className="text-lg">👨‍🚀</div>
                      </div>
                    </div>
                    
                    {/* Dialogue box effect */}
                    <div className="absolute bottom-2 left-2 right-2 bg-black/60 rounded px-2 py-1 backdrop-blur-sm">
                      <div className="text-white text-xs leading-tight">
                        "These tiny creatures could..."
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.1),transparent_60%)]" />
                  </div>
                  <div className="p-3">
                    <h3 className="text-md font-bold text-gray-900 mb-1">Visual Novel</h3>
                    <p className="text-gray-600 text-xs mb-2">
                      Character-driven story with dialogue!
                    </p>
                    <a href="/games/tardigrade-visual-novel" className="inline-flex items-center text-xs font-medium text-violet-600 hover:text-violet-700">
                      Play Visual Novel →
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-1">Tardigrade: The Ultimate Survivors</h4>
                <p className="text-gray-600 text-sm">
                  Discover the amazing water bears that can survive in space! Follow Dr. Elena Rodriguez as she 
                  uncovers the secrets of Earth's most resilient creatures and partners with NASA to protect astronauts on Mars missions.
                </p>
              </div>
            </section>
            
            {/* Original Bion-M1 Game */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Classic Interactive Story</h2>
                <a href="/games/bion-m1" className="text-sm text-indigo-600 hover:text-indigo-700">Open →</a>
              </div>
              <div className="grid md:grid-cols-[1fr,2fr] gap-4 items-center">
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <div className="aspect-[16/9] bg-gradient-to-br from-indigo-600 to-fuchsia-600 relative">
                    <img src="/biology.jpeg" alt="Bion‑M1" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity"/>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.15),transparent_60%)]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Mission Bion‑M1: The Complete Story</h3>
                  <p className="text-sm text-gray-600 mt-1">A story‑driven web experience that follows 30 days of space biology aboard the Bion‑M1 biosatellite. Make decisions, analyze telemetry, and unlock the bone‑health breakthrough.</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">Educational</span>
                    <span className="px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">Narrative</span>
                    <span className="px-2 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200">Beginner‑friendly</span>
                  </div>
                  <div className="mt-4">
                    <a href="/games/bion-m1" className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500">Play Now</a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {tab === 'challenges' && (
          <DailyChallenges />
        )}

        {tab === 'competitions' && (
          <Competitions />
        )}

        {tab === 'achievements' && (
          <Achievements />
        )}
      </div>
    </div>
  )
}

function TabButton({ active, onClick, children }){
  return (
    <button
      onClick={onClick}
      aria-selected={active}
      className={`px-3.5 py-2 rounded-lg text-sm whitespace-nowrap border transition ${active ? 'bg-indigo-600 text-white border-indigo-600 shadow' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`}
    >
      {children}
    </button>
  )
}

function StatCard({ label, value, gradient }){
  return (
    <div className={`rounded-xl text-white px-4 py-3 bg-gradient-to-br ${gradient}`}>
      <p className="text-[11px] uppercase tracking-wide opacity-90">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  )
}

function DailyChallenges(){
  const items = [
    { id:'c1', title:'Complete 3 Reading Sessions', desc:'Read abstracts and summaries to earn XP', difficulty:'easy', reward:150, progress:[2,3] },
    { id:'c2', title:'Watch 2 Tutorial Videos', desc:'Learn concepts from expert talks', difficulty:'easy', reward:100, progress:[1,2] },
    { id:'c3', title:'Take a Knowledge Quiz', desc:'Test your understanding of space biology', difficulty:'medium', reward:200, progress:[0,1] },
  ]
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Daily Challenges</h2>
        <span className="text-xs text-gray-500">Resets in ~4h</span>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {items.map((c)=> (
          <div key={c.id} className="rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${c.difficulty==='easy'?'bg-emerald-50 text-emerald-700 border border-emerald-200':'bg-amber-50 text-amber-700 border border-amber-200'}`}>{c.difficulty}</span>
              <span className="text-[11px] text-indigo-600 font-medium">+{c.reward} XP</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">{c.title}</p>
            <p className="text-xs text-gray-600 mb-3">{c.desc}</p>
            <ProgressBar num={c.progress[0]} den={c.progress[1]} />
            <button className="mt-3 w-full rounded-md bg-indigo-600 text-white text-sm py-2">{c.progress[0]===c.progress[1] ? 'Completed' : 'Continue'}</button>
          </div>
        ))}
      </div>
    </section>
  )
}

function ProgressBar({ num=0, den=1 }){
  const pct = Math.min(100, Math.round((num/Math.max(1,den))*100))
  return (
    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" style={{ width: `${pct}%` }} />
      <div className="mt-1 text-[11px] text-gray-600">Progress <span className="font-medium">{num}/{den}</span></div>
    </div>
  )
}

function Competitions(){
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Competitions</h2>
      <div className="rounded-xl border border-dashed border-gray-300 p-6 text-sm text-gray-700">
        Upcoming: Weekly Research Trivia — compete with others and climb the leaderboard. Stay tuned!
      </div>
    </section>
  )
}

function Achievements(){
  const badges = [
    { id:'starter', name:'First Quiz', desc:'Completed your first knowledge quiz', color:'from-emerald-500 to-teal-600', earned:true },
    { id:'streak', name:'3-day Streak', desc:'Played games 3 days in a row', color:'from-indigo-500 to-fuchsia-600', earned:false },
    { id:'strategist', name:'Impact Analyst', desc:'Rated 5 impact studies', color:'from-amber-500 to-orange-600', earned:false },
  ]
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Achievements</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {badges.map((b)=> (
          <div key={b.id} className={`relative rounded-xl border p-4 ${b.earned ? 'border-gray-200' : 'border-dashed border-gray-200 opacity-80'}`}>
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${b.color} text-white flex items-center justify-center mb-2`}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"/></svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">{b.name}</p>
            <p className="text-xs text-gray-500">{b.desc}</p>
            {!b.earned && (
              <span className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">Locked</span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
