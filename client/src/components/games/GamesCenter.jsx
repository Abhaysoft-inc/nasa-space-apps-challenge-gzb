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
    <div className="min-h-screen bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <header className="bg-neutral-800 rounded-2xl shadow-sm border border-neutral-700 p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white mb-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8h12M6 12h12M6 16h6"/></svg>
              </div>
              <h1 className="text-2xl font-bold text-white">Game Center</h1>
              <p className="text-sm text-gray-400">Level up your knowledge with quizzes and challenges — earn rewards and track progress.</p>
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
          <div className="bg-neutral-800/90 backdrop-blur supports-[backdrop-filter]:bg-neutral-800/70 border border-neutral-700 rounded-2xl p-2">
            <div className="flex items-center gap-2 overflow-x-auto">
              <TabButton active={tab==='overview'} onClick={()=> setRouteTab('overview')}>Overview</TabButton>
              <TabButton active={tab==='stories'} onClick={()=> setRouteTab('stories')}>
                <span className="flex items-center gap-1">
                  🚀 Stories
                  <span className="px-1.5 py-0.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xs font-bold">NEW</span>
                </span>
              </TabButton>
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
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 border border-purple-300/20">
              {/* Animated Background */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-10 left-10 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
              </div>
              
              {/* Special Navbar */}
              <div className="relative z-10 border-b border-white/20 backdrop-blur-sm">
                <div className="px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 shadow-lg">
                        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white mb-1">Featured: Interactive Science Stories</h2>
                        <p className="text-purple-200 text-lg">Immerse yourself in cutting-edge space biology missions</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-semibold animate-pulse">
                        🚀 NEW MISSIONS
                      </span>
                      <button className="px-6 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all border border-white/30">
                        View All Stories →
                      </button>
                    </div>
                  </div>
                  
                  {/* Mission Type Navigation */}
                  <div className="mt-6 flex items-center space-x-2">
                    <span className="text-purple-200 text-sm font-medium">Mission Types:</span>
                    <div className="flex space-x-2">
                      <span className="px-3 py-1 rounded-full bg-purple-500/30 text-purple-100 text-xs border border-purple-300/30">🧬 Biology</span>
                      <span className="px-3 py-1 rounded-full bg-blue-500/30 text-blue-100 text-xs border border-blue-300/30">🚀 Space</span>
                      <span className="px-3 py-1 rounded-full bg-green-500/30 text-green-100 text-xs border border-green-300/30">🔬 Research</span>
                      <span className="px-3 py-1 rounded-full bg-pink-500/30 text-pink-100 text-xs border border-pink-300/30">⭐ Adventure</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Story Games Grid */}
              <div className="relative z-10 p-8">
                <div className="grid lg:grid-cols-3 gap-6">
                  
                  {/* Interactive Story */}
                  <div className="group rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                    <div className="relative">
                      <div className="aspect-[16/10] bg-gradient-to-br from-purple-600 to-blue-600 relative flex items-center justify-center overflow-hidden">
                        {/* Enhanced tardigrade visualization */}
                        <svg width="80" height="50" viewBox="0 0 100 60" className="filter drop-shadow-2xl group-hover:scale-110 transition-transform duration-500">
                          <ellipse cx="50" cy="30" rx="40" ry="18" fill="#60a5fa" opacity="0.9"/>
                          <path d="M20 30 Q50 15 80 30 Q50 45 20 30" fill="#3b82f6" opacity="0.8"/>
                          <circle cx="15" cy="30" r="12" fill="#3b82f6" opacity="0.9"/>
                          <circle cx="12" cy="25" r="2" fill="#dc2626"/>
                          <circle cx="12" cy="35" r="2" fill="#dc2626"/>
                          <circle cx="25" cy="35" r="3" fill="#1d4ed8"/>
                          <circle cx="30" cy="38" r="3" fill="#1d4ed8"/>
                          <circle cx="70" cy="38" r="3" fill="#1d4ed8"/>
                          <circle cx="75" cy="35" r="3" fill="#1d4ed8"/>
                          <circle cx="25" cy="22" r="3" fill="#1d4ed8"/>
                          <circle cx="30" cy="25" r="3" fill="#1d4ed8"/>
                          <circle cx="70" cy="25" r="3" fill="#1d4ed8"/>
                          <circle cx="75" cy="22" r="3" fill="#1d4ed8"/>
                        </svg>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 rounded-full bg-purple-500/80 text-white text-xs font-bold">INTERACTIVE</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">Interactive Story</h3>
                      <p className="text-purple-200 text-sm mb-4 leading-relaxed">
                        Make choices that affect the story outcome! Guide research decisions in this branching narrative.
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <span className="w-2 h-2 rounded-full bg-green-400"></span>
                          <span className="text-green-300 text-xs">Available Now</span>
                        </div>
                        <a href="/games/tardigrade-story" className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 transition-all font-medium text-sm group-hover:shadow-lg">
                          Play Interactive →
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Visual Novel */}
                  <div className="group rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                    <div className="relative">
                      <div className="aspect-[16/10] bg-gradient-to-br from-violet-600 to-pink-600 relative flex items-center justify-center overflow-hidden">
                        {/* Visual Novel Style Characters */}
                        <div className="relative group-hover:scale-110 transition-transform duration-500">
                          <div className="w-20 h-24 bg-gradient-to-b from-white/30 to-purple-300/40 rounded-lg border border-white/40 flex items-center justify-center backdrop-blur-sm">
                            <div className="text-3xl">👩‍🔬</div>
                          </div>
                          <div className="absolute -right-8 top-3 w-16 h-20 bg-gradient-to-b from-white/25 to-blue-300/40 rounded-lg border border-white/40 flex items-center justify-center backdrop-blur-sm">
                            <div className="text-2xl">👨‍🚀</div>
                          </div>
                        </div>
                        {/* Dialogue box effect */}
                        <div className="absolute bottom-3 left-3 right-3 bg-black/70 rounded-lg px-3 py-2 backdrop-blur-sm">
                          <div className="text-white text-sm leading-tight">
                            "These creatures could revolutionize..."
                          </div>
                        </div>
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 rounded-full bg-pink-500/80 text-white text-xs font-bold">VISUAL NOVEL</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-200 transition-colors">Visual Novel</h3>
                      <p className="text-purple-200 text-sm mb-4 leading-relaxed">
                        Character-driven story with dialogue! Experience rich narratives with detailed character interactions.
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                          <span className="text-yellow-300 text-xs">Coming Soon</span>
                        </div>
                        <a href="/games/tardigrade-visual-novel" className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:from-violet-600 hover:to-pink-600 transition-all font-medium text-sm group-hover:shadow-lg">
                          Play Visual Novel →
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* 3D Chronicle */}
                  <div className="group rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                    <div className="relative">
                      <div className="aspect-[16/10] bg-gradient-to-br from-emerald-600 to-cyan-600 relative flex items-center justify-center overflow-hidden">
                        {/* 3D-style tardigrade with animation */}
                        <div className="relative animate-pulse group-hover:animate-bounce">
                          <svg width="90" height="55" viewBox="0 0 110 70" className="filter drop-shadow-2xl">
                            <defs>
                              <radialGradient id="tardigrade3D-enhanced" cx="50%" cy="30%">
                                <stop offset="0%" stopColor="#60a5fa" />
                                <stop offset="100%" stopColor="#1d4ed8" />
                              </radialGradient>
                            </defs>
                            <ellipse cx="55" cy="35" rx="45" ry="20" fill="url(#tardigrade3D-enhanced)" opacity="0.9"/>
                            <circle cx="20" cy="35" r="15" fill="url(#tardigrade3D-enhanced)"/>
                            <circle cx="15" cy="28" r="2.5" fill="#fbbf24"/>
                            <circle cx="15" cy="38" r="2.5" fill="#fbbf24"/>
                          </svg>
                        </div>
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 rounded-full bg-emerald-500/80 text-white text-xs font-bold">3D EXPERIENCE</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-200 transition-colors">3D Chronicle</h3>
                      <p className="text-purple-200 text-sm mb-4 leading-relaxed">
                        Watch stunning 3D visuals and animations! Immersive experience with cutting-edge graphics.
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <span className="w-2 h-2 rounded-full bg-green-400"></span>
                          <span className="text-green-300 text-xs">Available Now</span>
                        </div>
                        <a href="/games/tardigrade-animated" className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600 transition-all font-medium text-sm group-hover:shadow-lg">
                          Watch 3D →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured Story Description */}
                <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <h4 className="font-bold text-white text-lg mb-3 flex items-center">
                    🦠 Tardigrade: The Ultimate Survivors 
                    <span className="ml-3 px-2 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold">FEATURED STORY</span>
                  </h4>
                  <p className="text-purple-200 leading-relaxed">
                    Discover the amazing water bears that can survive in space! Follow Dr. Elena Rodriguez as she 
                    uncovers the secrets of Earth's most resilient creatures and partners with NASA to protect astronauts on Mars missions. 
                    Experience this groundbreaking research through multiple interactive story formats.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs border border-emerald-400/30">Educational</span>
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs border border-purple-400/30">Interactive</span>
                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs border border-blue-400/30">NASA Partnership</span>
                    <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs border border-pink-400/30">Space Biology</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Classic Interactive Story - Updated Design */}
            <section className="bg-neutral-800 rounded-2xl shadow-lg border border-neutral-700 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 9V5a3 3 0 0 0-6 0v4"/>
                      <rect x="2" y="9" width="20" height="12" rx="2"/>
                      <circle cx="12" cy="15" r="2"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Classic Interactive Story</h2>
                    <p className="text-indigo-400">Experience the original Bion-M1 mission</p>
                  </div>
                </div>
                <a href="/games/bion-m1" className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl">
                  Launch Mission →
                </a>
              </div>
              
              <div className="grid lg:grid-cols-[1fr,2fr] gap-8 items-center">
                <div className="rounded-2xl overflow-hidden shadow-lg border border-neutral-600">
                  <div className="aspect-[16/9] bg-gradient-to-br from-indigo-600 to-fuchsia-600 relative">
                    <img src="/biology.jpeg" alt="Bion‑M1" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-indigo-500/80 text-white text-xs font-bold">CLASSIC MISSION</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white">Mission Bion‑M1: The Complete Story</h3>
                  <p className="text-gray-300 leading-relaxed">A story‑driven web experience that follows 30 days of space biology aboard the Bion‑M1 biosatellite. Make decisions, analyze telemetry, and unlock the bone‑health breakthrough that could save future astronauts.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-sm">Educational</span>
                    <span className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-sm">Narrative</span>
                    <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-sm">Beginner‑friendly</span>
                  </div>
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-400">Mission Progress</span>
                      <span className="text-sm text-gray-500">0/5 chapters</span>
                    </div>
                    <div className="w-full h-3 bg-neutral-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {tab === 'stories' && (
          <div className="space-y-6">
            {/* FEATURED: Interactive Science Stories - Special Section */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 border border-purple-300/20">
              {/* Animated Background */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-10 left-10 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
              </div>
              
              {/* Special Navbar */}
              <div className="relative z-10 border-b border-white/20 backdrop-blur-sm">
                <div className="px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 shadow-lg">
                        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white mb-1">Featured: Interactive Science Stories</h2>
                        <p className="text-purple-200 text-lg">Immerse yourself in cutting-edge space biology missions</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-semibold animate-pulse">
                        🚀 NEW MISSIONS
                      </span>
                      <button className="px-6 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all border border-white/30">
                        View All Stories →
                      </button>
                    </div>
                  </div>
                  
                  {/* Mission Type Navigation */}
                  <div className="mt-6 flex items-center space-x-2">
                    <span className="text-purple-200 text-sm font-medium">Mission Types:</span>
                    <div className="flex space-x-2">
                      <span className="px-3 py-1 rounded-full bg-purple-500/30 text-purple-100 text-xs border border-purple-300/30">🧬 Biology</span>
                      <span className="px-3 py-1 rounded-full bg-blue-500/30 text-blue-100 text-xs border border-blue-300/30">🚀 Space</span>
                      <span className="px-3 py-1 rounded-full bg-green-500/30 text-green-100 text-xs border border-green-300/30">🔬 Research</span>
                      <span className="px-3 py-1 rounded-full bg-pink-500/30 text-pink-100 text-xs border border-pink-300/30">⭐ Adventure</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Story Games Grid */}
              <div className="relative z-10 p-8">
                <div className="grid lg:grid-cols-3 gap-6">
                  
                  {/* Interactive Story */}
                  <div className="group rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                    <div className="relative">
                      <div className="aspect-[16/10] bg-gradient-to-br from-purple-600 to-blue-600 relative flex items-center justify-center overflow-hidden">
                        {/* Enhanced tardigrade visualization */}
                        <svg width="80" height="50" viewBox="0 0 100 60" className="filter drop-shadow-2xl group-hover:scale-110 transition-transform duration-500">
                          <ellipse cx="50" cy="30" rx="40" ry="18" fill="#60a5fa" opacity="0.9"/>
                          <path d="M20 30 Q50 15 80 30 Q50 45 20 30" fill="#3b82f6" opacity="0.8"/>
                          <circle cx="15" cy="30" r="12" fill="#3b82f6" opacity="0.9"/>
                          <circle cx="12" cy="25" r="2" fill="#dc2626"/>
                          <circle cx="12" cy="35" r="2" fill="#dc2626"/>
                          <circle cx="25" cy="35" r="3" fill="#1d4ed8"/>
                          <circle cx="30" cy="38" r="3" fill="#1d4ed8"/>
                          <circle cx="70" cy="38" r="3" fill="#1d4ed8"/>
                          <circle cx="75" cy="35" r="3" fill="#1d4ed8"/>
                          <circle cx="25" cy="22" r="3" fill="#1d4ed8"/>
                          <circle cx="30" cy="25" r="3" fill="#1d4ed8"/>
                          <circle cx="70" cy="25" r="3" fill="#1d4ed8"/>
                          <circle cx="75" cy="22" r="3" fill="#1d4ed8"/>
                        </svg>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 rounded-full bg-purple-500/80 text-white text-xs font-bold">INTERACTIVE</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">Interactive Story</h3>
                      <p className="text-purple-200 text-sm mb-4 leading-relaxed">
                        Make choices that affect the story outcome! Guide research decisions in this branching narrative.
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <span className="w-2 h-2 rounded-full bg-green-400"></span>
                          <span className="text-green-300 text-xs">Available Now</span>
                        </div>
                        <a href="/games/tardigrade-story" className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 transition-all font-medium text-sm group-hover:shadow-lg">
                          Play Interactive →
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Visual Novel */}
                  <div className="group rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                    <div className="relative">
                      <div className="aspect-[16/10] bg-gradient-to-br from-violet-600 to-pink-600 relative flex items-center justify-center overflow-hidden">
                        {/* Visual Novel Style Characters */}
                        <div className="relative group-hover:scale-110 transition-transform duration-500">
                          <div className="w-20 h-24 bg-gradient-to-b from-white/30 to-purple-300/40 rounded-lg border border-white/40 flex items-center justify-center backdrop-blur-sm">
                            <div className="text-3xl">👩‍🔬</div>
                          </div>
                          <div className="absolute -right-8 top-3 w-16 h-20 bg-gradient-to-b from-white/25 to-blue-300/40 rounded-lg border border-white/40 flex items-center justify-center backdrop-blur-sm">
                            <div className="text-2xl">👨‍🚀</div>
                          </div>
                        </div>
                        {/* Dialogue box effect */}
                        <div className="absolute bottom-3 left-3 right-3 bg-black/70 rounded-lg px-3 py-2 backdrop-blur-sm">
                          <div className="text-white text-sm leading-tight">
                            "These creatures could revolutionize..."
                          </div>
                        </div>
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 rounded-full bg-pink-500/80 text-white text-xs font-bold">VISUAL NOVEL</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-200 transition-colors">Visual Novel</h3>
                      <p className="text-purple-200 text-sm mb-4 leading-relaxed">
                        Character-driven story with dialogue! Experience rich narratives with detailed character interactions.
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                          <span className="text-yellow-300 text-xs">Coming Soon</span>
                        </div>
                        <a href="/games/tardigrade-visual-novel" className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:from-violet-600 hover:to-pink-600 transition-all font-medium text-sm group-hover:shadow-lg">
                          Play Visual Novel →
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* 3D Chronicle */}
                  <div className="group rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                    <div className="relative">
                      <div className="aspect-[16/10] bg-gradient-to-br from-emerald-600 to-cyan-600 relative flex items-center justify-center overflow-hidden">
                        {/* 3D-style tardigrade with animation */}
                        <div className="relative animate-pulse group-hover:animate-bounce">
                          <svg width="90" height="55" viewBox="0 0 110 70" className="filter drop-shadow-2xl">
                            <defs>
                              <radialGradient id="tardigrade3D-enhanced" cx="50%" cy="30%">
                                <stop offset="0%" stopColor="#60a5fa" />
                                <stop offset="100%" stopColor="#1d4ed8" />
                              </radialGradient>
                            </defs>
                            <ellipse cx="55" cy="35" rx="45" ry="20" fill="url(#tardigrade3D-enhanced)" opacity="0.9"/>
                            <circle cx="20" cy="35" r="15" fill="url(#tardigrade3D-enhanced)"/>
                            <circle cx="15" cy="28" r="2.5" fill="#fbbf24"/>
                            <circle cx="15" cy="38" r="2.5" fill="#fbbf24"/>
                          </svg>
                        </div>
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 rounded-full bg-emerald-500/80 text-white text-xs font-bold">3D EXPERIENCE</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-200 transition-colors">3D Chronicle</h3>
                      <p className="text-purple-200 text-sm mb-4 leading-relaxed">
                        Watch stunning 3D visuals and animations! Immersive experience with cutting-edge graphics.
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <span className="w-2 h-2 rounded-full bg-green-400"></span>
                          <span className="text-green-300 text-xs">Available Now</span>
                        </div>
                        <a href="/games/tardigrade-animated" className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600 transition-all font-medium text-sm group-hover:shadow-lg">
                          Watch 3D →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured Story Description */}
                <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <h4 className="font-bold text-white text-lg mb-3 flex items-center">
                    🦠 Tardigrade: The Ultimate Survivors 
                    <span className="ml-3 px-2 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold">FEATURED STORY</span>
                  </h4>
                  <p className="text-purple-200 leading-relaxed">
                    Discover the amazing water bears that can survive in space! Follow Dr. Elena Rodriguez as she 
                    uncovers the secrets of Earth's most resilient creatures and partners with NASA to protect astronauts on Mars missions. 
                    Experience this groundbreaking research through multiple interactive story formats.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs border border-emerald-400/30">Educational</span>
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs border border-purple-400/30">Interactive</span>
                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs border border-blue-400/30">NASA Partnership</span>
                    <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs border border-pink-400/30">Space Biology</span>
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
      className={`px-3.5 py-2 rounded-lg text-sm whitespace-nowrap border transition ${active ? 'bg-indigo-600 text-white border-indigo-600 shadow' : 'bg-neutral-700 text-gray-300 border-neutral-600 hover:border-neutral-500'}`}
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
    <section className="bg-neutral-800 rounded-2xl shadow-sm border border-neutral-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Daily Challenges</h2>
        <span className="text-xs text-gray-400">Resets in ~4h</span>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {items.map((c)=> (
          <div key={c.id} className="rounded-xl border border-neutral-600 bg-neutral-700/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${c.difficulty==='easy'?'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30':'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>{c.difficulty}</span>
              <span className="text-[11px] text-indigo-400 font-medium">+{c.reward} XP</span>
            </div>
            <p className="text-sm font-semibold text-white">{c.title}</p>
            <p className="text-xs text-gray-400 mb-3">{c.desc}</p>
            <ProgressBar num={c.progress[0]} den={c.progress[1]} />
            <button className="mt-3 w-full rounded-md bg-indigo-600 text-white text-sm py-2 hover:bg-indigo-500 transition-colors">{c.progress[0]===c.progress[1] ? 'Completed' : 'Continue'}</button>
          </div>
        ))}
      </div>
    </section>
  )
}

function ProgressBar({ num=0, den=1 }){
  const pct = Math.min(100, Math.round((num/Math.max(1,den))*100))
  return (
    <div>
      <div className="w-full h-2 bg-neutral-600 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 text-[11px] text-gray-400">Progress <span className="font-medium text-gray-300">{num}/{den}</span></div>
    </div>
  )
}

function Competitions(){
  return (
    <section className="bg-neutral-800 rounded-2xl shadow-sm border border-neutral-700 p-6">
      <h2 className="text-lg font-semibold text-white mb-3">Competitions</h2>
      <div className="rounded-xl border border-dashed border-neutral-600 bg-neutral-700/30 p-6 text-sm text-gray-300">
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
    <section className="bg-neutral-800 rounded-2xl shadow-sm border border-neutral-700 p-6">
      <h2 className="text-lg font-semibold text-white mb-3">Achievements</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {badges.map((b)=> (
          <div key={b.id} className={`relative rounded-xl border p-4 ${b.earned ? 'border-neutral-600 bg-neutral-700/50' : 'border-dashed border-neutral-600 bg-neutral-700/20 opacity-60'}`}>
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${b.color} text-white flex items-center justify-center mb-2`}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"/></svg>
            </div>
            <p className="text-sm font-semibold text-white">{b.name}</p>
            <p className="text-xs text-gray-400">{b.desc}</p>
            {!b.earned && (
              <span className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-600 text-gray-400">Locked</span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
