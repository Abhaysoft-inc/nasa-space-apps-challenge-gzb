"use client"
import React, { useMemo, useState } from "react"

// Stable constants (avoid recreating on each render)
const TOPICS = [
    "Space Biology",
    "Microgravity",
    "Radiation",
    "Life Support",
    "Robotics",
    "AI",
    "Materials",
    "Planetary Habitat",
]

const SOURCES = ["PLoS ONE", "J Appl Physiol", "Nature", "Science", "ArXiv"]
const YEARS = Array.from({ length: 10 }, (_, i) => 2016 + i)

// Mission Dashboard: interactive search + insights for the studies collection
export default function MissionDashboard() {
    // --- Mock dataset (replace with API later) ---
    const topics = TOPICS
    const sources = SOURCES
    const years = YEARS

    const studies = useMemo(() => generateMockStudies(topics, sources, years, 80), [topics, sources, years])

    // --- Filters ---
    const [query, setQuery] = useState("")
    const [selectedTopics, setSelectedTopics] = useState([])
    const [yearRange, setYearRange] = useState([years[0], years[years.length - 1]])
    const [source, setSource] = useState("All")
    const [outcomes, setOutcomes] = useState(["support", "inconclusive", "contradictory", "risk"]) // multi

    const filtered = useMemo(() => {
        return studies.filter((s) => {
            const matchesQuery = !query ||
                s.title.toLowerCase().includes(query.toLowerCase()) ||
                s.summary.toLowerCase().includes(query.toLowerCase())
            const matchesTopic = selectedTopics.length === 0 || selectedTopics.some((t) => s.topics.includes(t))
            const matchesYear = s.year >= yearRange[0] && s.year <= yearRange[1]
            const matchesSource = source === "All" || s.source === source
            const matchesOutcome = outcomes.includes(s.outcome)
            return matchesQuery && matchesTopic && matchesYear && matchesSource && matchesOutcome
        })
    }, [studies, query, selectedTopics, yearRange, source, outcomes])

    // --- Derived metrics ---
    const stats = useMemo(() => deriveStats(filtered, topics, years), [filtered, topics, years])

    // --- UI ---
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <header className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Mission Knowledge Dashboard</h1>
                    <p className="text-sm text-gray-600">Explore scientific progress, knowledge gaps, consensus, and actionable insights across space research studies.</p>
                </header>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Search</label>
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search titles, summaries, keywords..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Source</label>
                            <select
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            >
                                <option>All</option>
                                {sources.map((s) => (
                                    <option key={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Year Range</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg"
                                    value={yearRange[0]}
                                    min={years[0]}
                                    max={yearRange[1]}
                                    onChange={(e) => setYearRange([Number(e.target.value), yearRange[1]])}
                                />
                                <span className="text-gray-400">–</span>
                                <input
                                    type="number"
                                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg"
                                    value={yearRange[1]}
                                    min={yearRange[0]}
                                    max={years[years.length - 1]}
                                    onChange={(e) => setYearRange([yearRange[0], Number(e.target.value)])}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Topics and Outcomes */}
                    <div className="mt-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                        <div className="flex flex-wrap gap-2">
                            {topics.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => toggleArray(selectedTopics, setSelectedTopics, t)}
                                    className={`text-xs px-3 py-1.5 rounded-full border transition ${selectedTopics.includes(t)
                                            ? "bg-blue-50 text-blue-700 border-blue-200"
                                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {[
                                { k: "support", label: "Support" },
                                { k: "inconclusive", label: "Inconclusive" },
                                { k: "contradictory", label: "Contradictory" },
                                { k: "risk", label: "Risk" },
                            ].map((o) => (
                                <button
                                    key={o.k}
                                    onClick={() => toggleArray(outcomes, setOutcomes, o.k)}
                                    className={`text-xs px-3 py-1.5 rounded-full border transition ${outcomes.includes(o.k)
                                            ? "bg-purple-50 text-purple-700 border-purple-200"
                                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                                        }`}
                                >
                                    {o.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <StatCard label="Studies" value={filtered.length} />
                    <StatCard label="Topics" value={stats.topicCount} />
                    <StatCard label="Avg citations" value={stats.avgCitations} />
                    <StatCard label="Consensus" value={`${stats.consensusRate}%`} />
                </div>

                {/* Charts + Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Trend */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-semibold text-gray-900">Progress Over Time</h2>
                            <span className="text-xs text-gray-500">{yearRange[0]}–{yearRange[1]}</span>
                        </div>
                        <LineChart data={stats.byYear} years={years} range={yearRange} />
                    </div>

                    {/* Consensus */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-3">Consensus vs Disagreement</h2>
                        <DonutChart data={[{ name: "Consensus", value: stats.consensus }, { name: "Disagreement", value: stats.disagreement }]} size={160} />
                        <div className="mt-3 text-sm text-gray-600">
                            <p>Consensus reflects majority agreement within topics. Disagreement includes contradictory or inconclusive results.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Topic coverage */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-semibold text-gray-900">Topic Coverage</h2>
                            <span className="text-xs text-gray-500">Last {years.length} years</span>
                        </div>
                        <TopicBarChart data={stats.byTopic} />
                    </div>

                    {/* Heatmap */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-3">Where are the gaps?</h2>
                        <MatrixHeatmap matrix={stats.matrix} rows={topics} cols={years} />
                        <p className="mt-3 text-xs text-gray-500">Darker cells = more studies. Light or empty cells indicate potential knowledge gaps.</p>
                    </div>
                </div>

                {/* Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <InsightCard title="Areas of Progress" items={stats.progressInsights} accent="from-emerald-500 to-teal-500" />
                    <InsightCard title="Knowledge Gaps" items={stats.gapInsights} accent="from-amber-500 to-orange-500" />
                    <InsightCard title="Actionable for Mission" items={stats.actionInsights} accent="from-blue-500 to-indigo-500" />
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Studies</h2>
                        <span className="text-xs text-gray-500">{filtered.length} results</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <Th>Title</Th>
                                    <Th>Topics</Th>
                                    <Th>Year</Th>
                                    <Th>Source</Th>
                                    <Th>Citations</Th>
                                    <Th>Outcome</Th>
                                    <Th>Consensus</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((s) => (
                                    <tr key={s.id} className="border-t border-gray-100 hover:bg-gray-50">
                                        <Td>
                                            <p className="font-medium text-gray-900">{s.title}</p>
                                            <p className="text-xs text-gray-500 line-clamp-1">{s.summary}</p>
                                        </Td>
                                        <Td>
                                            <div className="flex flex-wrap gap-1">
                                                {s.topics.map((t) => (
                                                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">{t}</span>
                                                ))}
                                            </div>
                                        </Td>
                                        <Td>{s.year}</Td>
                                        <Td>{s.source}</Td>
                                        <Td>{s.citations}</Td>
                                        <Td>
                                            <OutcomePill outcome={s.outcome} />
                                        </Td>
                                        <Td>
                                            <span className="text-xs text-gray-700">{Math.round(s.consensusScore * 100)}%</span>
                                        </Td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

// --- Small UI bits ---
function Th({ children }) {
    return <th className="text-left font-semibold px-4 py-2 whitespace-nowrap">{children}</th>
}
function Td({ children }) {
    return <td className="px-4 py-3 align-top">{children}</td>
}

function StatCard({ label, value }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] uppercase tracking-wide text-gray-500">{label}</p>
            <p className="text-xl font-semibold text-gray-900">{value}</p>
        </div>
    )
}

function OutcomePill({ outcome }) {
    const map = {
        support: "bg-emerald-50 text-emerald-700 border-emerald-200",
        inconclusive: "bg-gray-50 text-gray-700 border-gray-200",
        contradictory: "bg-rose-50 text-rose-700 border-rose-200",
        risk: "bg-amber-50 text-amber-700 border-amber-200",
    }
    return <span className={`text-[10px] px-2 py-0.5 rounded-full border ${map[outcome]}`}>{outcome}</span>
}

function InsightCard({ title, items, accent }) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <div className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${accent} text-white px-3 py-1 text-xs mb-3`}>
                <span className="w-1.5 h-1.5 bg-white/90 rounded-full" />
                {title}
            </div>
            <ul className="space-y-2">
                {items.map((t, i) => (
                    <li key={i} className="text-sm text-gray-800">• {t}</li>
                ))}
            </ul>
        </div>
    )
}

// --- Charts ---
function LineChart({ data, years, range }) {
    const [minY, maxY] = useMemo(() => {
        const vals = years.filter((y) => y >= range[0] && y <= range[1]).map((y) => data[y] || 0)
        const maxV = Math.max(1, ...vals)
        return [0, maxV]
    }, [data, years, range])

    const points = years
        .filter((y) => y >= range[0] && y <= range[1])
        .map((y, i, arr) => {
            const x = (i / Math.max(1, arr.length - 1)) * 100
            const yVal = data[y] || 0
            const yPct = 100 - (yVal - minY) / Math.max(1, maxY - minY) * 100
            return `${x},${yPct}`
        })
        .join(" ")

    return (
        <svg viewBox="0 0 100 100" className="w-full h-40">
            <defs>
                <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
                </linearGradient>
            </defs>
            <polyline fill="none" stroke="#6366f1" strokeWidth="2" points={points} />
            <polyline
                fill="url(#grad)"
                stroke="none"
                points={`0,100 ${points} 100,100`}
                opacity="0.2"
            />
            {/* Grid */}
            {Array.from({ length: 5 }).map((_, i) => (
                <line key={i} x1="0" x2="100" y1={i * 25} y2={i * 25} stroke="#e5e7eb" strokeWidth="0.3" />
            ))}
        </svg>
    )
}

function TopicBarChart({ data }) {
    const entries = Object.entries(data).sort((a, b) => b[1] - a[1])
    const max = Math.max(1, ...entries.map(([, v]) => v))
    return (
        <div className="space-y-2">
            {entries.map(([k, v]) => (
                <div key={k}>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{k}</span>
                        <span>{v}</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${(v / max) * 100}%` }} />
                    </div>
                </div>
            ))}
        </div>
    )
}

function DonutChart({ data, size = 160 }) {
    const total = data.reduce((s, d) => s + d.value, 0)
    let current = 0
    const palette = ["#10b981", "#ef4444", "#f59e0b", "#6366f1", "#3b82f6"]
    const segments = data.map((d, idx) => {
        const start = current / total
        current += d.value
        const end = current / total
        const color = palette[idx % palette.length]
        return { start, end, color }
    })
    const gradient = segments.map((s) => `${s.color} ${Math.round(s.start * 100)}% ${Math.round(s.end * 100)}%`).join(", ")
    return (
        <div className="relative mx-auto" style={{ width: size, height: size }}>
            <div className="rounded-full" style={{ width: size, height: size, background: `conic-gradient(${gradient})` }} />
            <div className="absolute inset-5 bg-white rounded-full flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xs text-gray-500">Consensus</p>
                    <p className="text-lg font-semibold text-gray-900">{total}</p>
                </div>
            </div>
        </div>
    )
}

function MatrixHeatmap({ matrix, rows, cols }) {
    // matrix[row][col] => intensity 0..1
    return (
        <div className="overflow-x-auto">
            <div className="min-w-[480px]">
                <div className="grid" style={{ gridTemplateColumns: `120px repeat(${cols.length}, minmax(0, 1fr))` }}>
                    <div />
                    {cols.map((c) => (
                        <div key={c} className="text-[10px] text-gray-500 text-center py-1">{c}</div>
                    ))}
                    {rows.map((r, ri) => (
                        <React.Fragment key={r}>
                            <div className="text-xs text-gray-700 py-1 pr-2 flex items-center">{r}</div>
                            {cols.map((c, ci) => {
                                const v = matrix[r]?.[c] ?? 0
                                const color = heat(v)
                                return <div key={`${r}-${c}`} className="h-6 m-0.5 rounded" style={{ backgroundColor: color }} />
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    )
}

function heat(v) {
    // 0..1 -> light to dark blue
    const start = [219, 234, 254] // blue-100
    const end = [30, 64, 175] // blue-800
    const mix = (a, b) => Math.round(a + (b - a) * v)
    const [r, g, b] = [mix(start[0], end[0]), mix(start[1], end[1]), mix(start[2], end[2])]
    return `rgb(${r}, ${g}, ${b})`
}

// --- Data + derivations ---
function toggleArray(arr, setArr, v) {
    setArr(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])
}

function generateMockStudies(topics, sources, years, n = 60) {
    const outcomes = ["support", "inconclusive", "contradictory", "risk"]
    const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
    const pick = (arr) => arr[rnd(0, arr.length - 1)]
    const items = []
    for (let i = 0; i < n; i++) {
        const tCount = rnd(1, 2)
        const t = Array.from({ length: tCount }, () => pick(topics))
        const uniqueTopics = [...new Set(t)]
        const year = pick(years)
        const outcome = pick(outcomes)
        items.push({
            id: i + 1,
            title: `${pick(["Effects", "Impacts", "Assessment", "Trends"])} of ${pick(topics)} in ${pick(["long-duration missions", "LEO", "deep space"])}`,
            topics: uniqueTopics,
            year,
            source: pick(sources),
            citations: rnd(0, 350),
            outcome,
            consensusScore: Math.random() * 0.6 + (outcome === "support" ? 0.3 : 0.1),
            summary: "Brief summary of methodology and findings related to mission constraints, risks, and operational impacts.",
        })
    }
    return items
}

function deriveStats(studies, topics, years) {
    const byYear = {}
    const byTopic = {}
    let totalCitations = 0
    let consensus = 0
    let disagreement = 0

    const matrix = {}
    topics.forEach((t) => (matrix[t] = {}))

    for (const s of studies) {
        byYear[s.year] = (byYear[s.year] || 0) + 1
        totalCitations += s.citations
        if (s.outcome === "support") consensus++
        if (s.outcome === "contradictory" || s.outcome === "inconclusive") disagreement++
        for (const t of s.topics) {
            byTopic[t] = (byTopic[t] || 0) + 1
            matrix[t][s.year] = (matrix[t][s.year] || 0) + 1
        }
    }

    // normalize matrix to 0..1
    let maxCell = 1
    topics.forEach((t) => years.forEach((y) => { maxCell = Math.max(maxCell, matrix[t][y] || 0) }))
    topics.forEach((t) => years.forEach((y) => { matrix[t][y] = (matrix[t][y] || 0) / maxCell }))

    const avgCitations = studies.length ? Math.round(totalCitations / studies.length) : 0
    const consensusRate = studies.length ? Math.round((consensus / studies.length) * 100) : 0

    // insights
    const sortedTopics = Object.entries(byTopic).sort((a, b) => b[1] - a[1]).map(([t]) => t)
    const top3 = sortedTopics.slice(0, 3)
    const bottom3 = topics.filter((t) => !byTopic[t]).concat(sortedTopics.slice(-2))

    const progressInsights = top3.length
        ? top3.map((t) => `${t}: strong recent activity and growing evidence base.`)
        : ["Insufficient data to determine progress."]

    const gapInsights = bottom3.length
        ? bottom3.map((t) => `${t}: sparse coverage — prioritize new studies.`)
        : ["No obvious gaps detected across the selected filters."]

    const actionInsights = [
        "Prioritize standardized protocols to reduce contradictory findings.",
        "Allocate resources to under-studied high-risk domains.",
        "Focus on cross-disciplinary studies linking Life Support and Radiation.",
    ]

    return {
        byYear,
        byTopic,
        matrix,
        topicCount: Object.keys(byTopic).length,
        avgCitations,
        consensusRate,
        consensus,
        disagreement,
        progressInsights,
        gapInsights,
        actionInsights,
    }
}