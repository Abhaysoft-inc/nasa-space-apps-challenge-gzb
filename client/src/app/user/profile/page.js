import React from 'react'
import Image from 'next/image'
import ContributionHeatmap from '../../../components/profile/ContributionHeatmap'
import LearningPathways from '../../../components/profile/LearningPathways'
import ProgressOrbitMap from '../../../components/profile/ProgressOrbitMap'
import NextRecommendations from '../../../components/profile/NextRecommendations'
import KnowledgeGamesSection from '../../../components/profile/KnowledgeGamesSection'

export default function ProfilePage() {
    // Mock data (replace with real data when backend is ready)
    const user = {
        name: 'Alex Johnson',
        username: 'alexj',
        joined: 'Jan 2025',
        avatar: null, // fallback to initials
    }

    const stats = {
        totalRead: 27,
        weeklyGoal: 5,
        thisWeek: 3,
        streakDays: 6,
        longestStreak: 9,
        minutesRead: 1240,
        rankingPercentile: 12, // top 12%
    }

    const topics = [
        { name: 'Space Biology', read: 12, goal: 20 },
        { name: 'Microgravity', read: 7, goal: 15 },
        { name: 'Radiation', read: 4, goal: 10 },
        { name: 'Life Support', read: 3, goal: 8 },
        { name: 'Robotics', read: 1, goal: 6 },
    ]

    const badges = [
        { id: 'starter', name: 'First Paper', desc: 'Read your first paper', earned: true, color: 'from-green-500 to-emerald-600' },
        { id: 'streak', name: '5-Day Streak', desc: 'Read papers 5 days in a row', earned: true, color: 'from-blue-500 to-indigo-600' },
        { id: 'ten', name: '10 Papers', desc: 'Read 10 papers overall', earned: true, color: 'from-purple-500 to-fuchsia-600' },
        { id: 'focus', name: 'Topic Focus', desc: 'Read 5 papers on one topic', earned: false, color: 'from-slate-400 to-zinc-500' },
    ]

    const initials = user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')

    // Derived stats
    const weeklyActivity = getWeeklyActivity()
    const contributions = getContributionData(52)
    const topicDistribution = topics.map(t => ({ name: t.name, value: t.read }))

    // Learning Path & Recommendations (mock)
    const stages = [
        { id: 'fundamentals', title: 'Space Biology Fundamentals', blurb: 'Core concepts and terminology', progress: 1 },
        { id: 'microgravity', title: 'Microgravity Effects', blurb: 'Physiology and cellular changes', progress: 0.6, requires: ['fundamentals'] },
        { id: 'applications', title: 'Mission Applications', blurb: 'Translate science to mission design', progress: 0.15, requires: ['microgravity'] },
    ]
    const completedIds = ['fundamentals']
    const orbitNodes = [
        { id: 'f', label: 'Fundamentals', completed: true },
        { id: 'm', label: 'Microgravity', completed: false },
        { id: 'r', label: 'Radiation', completed: false },
        { id: 'a', label: 'Applications', completed: false },
    ]
    const progressRatio = 0.35
    const recs = [
        { id: 'p1', title: 'Bone Density Changes in Microgravity', authors: 'Chen et al.', tags: ['Human Biology','ISS'], reason: 'Builds on your interest in physiology' },
        { id: 'p2', title: 'Plant Growth Strategies for Mars', authors: 'Rodriguez et al.', tags: ['Plant Biology','Mars'], reason: 'Related to Microgravity Effects pathway' },
        { id: 'p3', title: 'Shielding Against Cosmic Rays', authors: 'Kim et al.', tags: ['Radiation','Materials'], reason: 'High impact potential for missions' },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="flex items-center justify-between gap-6 flex-wrap">
                        <div className="flex items-center gap-4">
                            <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-lg font-semibold">
                                {user.avatar ? (
                                    <Image src={user.avatar} alt={user.name} fill sizes="56px" className="object-cover" />
                                ) : (
                                    <span>{initials}</span>
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                                <p className="text-sm text-gray-500">@{user.username} • Joined {user.joined}</p>
                            </div>
                        </div>

                        {/* Quick stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full sm:w-auto">
                            <StatChip label="Total Read" value={stats.totalRead} />
                            <StatChip label="This Week" value={`${stats.thisWeek}/${stats.weeklyGoal}`} />
                            <StatChip label="Streak" value={`${stats.streakDays}d`} />
                            <StatChip label="Minutes" value={stats.minutesRead} />
                        </div>
                    </div>
                </div>

                {/* Main */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Progress and Activity */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Learning Pathways */}
                        <LearningPathways stages={stages} completedIds={completedIds} />

                        {/* Visual Progress Map */}
                        <ProgressOrbitMap nodes={orbitNodes} progress={progressRatio} />

                        {/* Activity: Heatmap + Weekly Bars */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Activity</h2>
                                <span className="text-xs text-gray-500">Recent activity</span>
                            </div>

                            <div className="space-y-6">
                                <ContributionHeatmap data={contributions} cellSize={12} gap={4} minWeeks={18} maxWeeks={52} />

                                <div>
                                    <p className="text-sm font-medium text-gray-900 mb-2">This Week</p>
                                    <MiniBarChart data={weeklyActivity} />
                                </div>
                            </div>
                        </div>

                        {/* Recommendations */}
                        <NextRecommendations items={recs} />

                        {/* Knowledge Assessment Games */}
                        <KnowledgeGamesSection seed={3} />



                        {/* Progress by Topic */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Reading Progress</h2>
                                <span className="text-xs text-gray-500">{stats.totalRead} total papers</span>
                            </div>

                            <div className="space-y-4">
                                {topics.map((t) => {
                                    const pct = Math.min(100, Math.round((t.read / t.goal) * 100))
                                    return (
                                        <div key={t.name} className="border border-gray-100 rounded-xl p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="inline-flex items-center justify-center w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></span>
                                                    <p className="text-sm font-medium text-gray-900">{t.name}</p>
                                                </div>
                                                <p className="text-xs text-gray-500">{t.read}/{t.goal}</p>
                                            </div>
                                            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right: Stats, Donut, Badges */}
                    <div className="space-y-8">
                        {/* Ranking & Streaks */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Stats</h2>
                            <div className="grid grid-cols-2 gap-3">
                                <StatBlock label="Ranking" value={`Top ${stats.rankingPercentile}%`} hint="based on papers read" />
                                <StatBlock label="Current Streak" value={`${stats.streakDays} days`} />
                                <StatBlock label="Longest Streak" value={`${stats.longestStreak} days`} />
                                <StatBlock label="Avg min/paper" value={Math.max(5, Math.round(stats.minutesRead / Math.max(1, stats.totalRead)))} />
                            </div>
                        </div>

                        {/* Topics Distribution */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Topics Distribution</h2>
                            <div className="flex items-center gap-6">
                                <DonutChart data={topicDistribution} size={140} />
                                <div className="grid grid-cols-1 gap-2 flex-1">
                                    {topicDistribution.map((d, idx) => (
                                        <div key={d.name} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-block w-2.5 h-2.5 rounded-sm ${donutColorClass(idx)}`}></span>
                                                <span className="text-gray-700">{d.name}</span>
                                            </div>
                                            <span className="text-gray-500">{d.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Badges */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Badges</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {badges.map((b) => (
                                    <div
                                        key={b.id}
                                        className={`relative rounded-xl border p-3 ${b.earned ? 'border-gray-100' : 'border-dashed border-gray-200 opacity-70'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${b.color} text-white flex items-center justify-center mb-2`}>
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900">{b.name}</p>
                                        <p className="text-xs text-gray-500">{b.desc}</p>
                                        {!b.earned && (
                                            <span className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">Locked</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatChip({ label, value }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-sm">
            <p className="text-[11px] uppercase tracking-wide text-gray-500">{label}</p>
            <p className="text-lg font-semibold text-gray-900">{value}</p>
        </div>
    )
}

function StatBlock({ label, value, hint }) {
    return (
        <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
            <p className="text-[11px] uppercase tracking-wide text-gray-500">{label}</p>
            <p className="text-lg font-semibold text-gray-900">{value}</p>
            {hint && <p className="text-[11px] text-gray-500 mt-0.5">{hint}</p>}
        </div>
    )
}


function MiniBarChart({ data }) {
    const max = Math.max(1, ...data.map(d => d.value))
    return (
        <div className="flex items-end gap-2 h-24">
            {data.map((d) => (
                <div key={d.label} className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-full bg-gray-100 rounded">
                        <div className="bg-gradient-to-t from-blue-500 to-purple-500 w-full rounded" style={{ height: `${(d.value / max) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-500">{d.label}</span>
                </div>
            ))}
        </div>
    )
}

function DonutChart({ data, size = 160 }) {
    const total = data.reduce((s, d) => s + d.value, 0)
    let current = 0
    const segments = data.map((d, idx) => {
        const start = current / total
        current += d.value
        const end = current / total
        const color = donutColor(idx)
        return { start, end, color }
    })
    const gradient = segments
        .map((s) => `${s.color} ${Math.round(s.start * 100)}% ${Math.round(s.end * 100)}%`)
        .join(', ')
    return (
        <div className="relative" style={{ width: size, height: size }}>
            <div
                className="rounded-full"
                style={{ width: size, height: size, background: `conic-gradient(${gradient})` }}
            />
            <div
                className="absolute inset-3 bg-white rounded-full flex items-center justify-center"
                style={{ inset: size * 0.18 }}
            >
                <div className="text-center">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-lg font-semibold text-gray-900">{total}</p>
                </div>
            </div>
        </div>
    )
}

function donutColor(index) {
    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#14b8a6']
    return colors[index % colors.length]
}

function donutColorClass(index) {
    const classes = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-teal-500']
    return classes[index % classes.length]
}

function getWeeklyActivity() {
    // Mock last 7 days (Mon-Sun)
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return labels.map((l) => ({ label: l, value: Math.floor(Math.random() * 5) }))
}

function getContributionData(weeks = 16) {
    // Flat array of weeks*7 with values 0..4
    return Array.from({ length: weeks * 7 }, () => {
        const r = Math.random()
        if (r < 0.5) return 0
        if (r < 0.7) return 1
        if (r < 0.85) return 2
        if (r < 0.95) return 3
        return 4
    })
}