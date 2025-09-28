"use client"
import React, { useMemo, useState, useMemo as useReactMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Static list of 50 papers (titles shown on cards; metadata used for filtering)
// Note: All cards navigate to /papers/[paperId] which currently renders a single hard-coded paper
// Add or edit entries here; ids should be URL-safe strings
const PAPERS = [
    { id: 'bion-m-1', title: 'Mice in Bion-M 1 Space Mission: Training and Selection', tags: ['Space Biology', 'Microgravity', 'Mouse'], domain: 'Biology', year: 2014 },
    { id: 'spaceflight-immunity-c57bl6', title: 'Effects of spaceflight on immunity in the C57BL/6 mouse', tags: ['Immunity', 'Mouse', 'Spaceflight'], domain: 'Immunity', year: 2003 },
    { id: 'mice-drawer-system', title: 'The Mice Drawer System (MDS) Experiment and the Space Endurance Record-Breaking Mice', tags: ['Microgravity', 'Experiment', 'Mouse'], domain: 'Biology', year: 2012 },
    { id: 'thymus-spleen-sts-135', title: 'Changes in Mouse Thymus and Spleen after Return from the STS-135 Mission in Space', tags: ['Immunity', 'Spaceflight', 'Mouse'], domain: 'Immunity', year: 2013 },
    { id: 'bone-loss-microgravity', title: 'Skeletal adaptation and bone loss in long-duration microgravity', tags: ['Microgravity', 'Physiology'], domain: 'Physiology', year: 2016 },
    { id: 'plant-growth-iss', title: 'Plant growth adaptations on the International Space Station', tags: ['Botany', 'Microgravity'], domain: 'Botany', year: 2018 },
    { id: 'radiation-exposure-crew', title: 'Space radiation exposure and mitigating strategies for crew health', tags: ['Radiation', 'Health'], domain: 'Radiation', year: 2020 },
    { id: 'cardiovascular-space', title: 'Cardiovascular deconditioning during space missions', tags: ['Cardiovascular', 'Physiology'], domain: 'Cardiovascular', year: 2015 },
    { id: 'circadian-rhythms-space', title: 'Circadian rhythm alterations during spaceflight', tags: ['Human Health', 'Spaceflight'], domain: 'Human Health', year: 2017 },
    { id: 'muscle-atrophy-countermeasures', title: 'Countermeasures for muscle atrophy in microgravity', tags: ['Physiology', 'Microgravity'], domain: 'Physiology', year: 2019 },
    { id: 'vestibular-adaptation-microgravity', title: 'Vestibular adaptation in microgravity environments', tags: ['Neuroscience', 'Spaceflight'], domain: 'Neuroscience', year: 2011 },
    { id: 'fluid-shifts-spaceflight', title: 'Fluid shifts and intracranial pressure during spaceflight', tags: ['Human Health', 'Physiology'], domain: 'Human Health', year: 2021 },
    { id: 'sleep-quality-iss-crew', title: 'Sleep quality among ISS crew members', tags: ['Human Health', 'ISS'], domain: 'Human Health', year: 2014 },
    { id: 'immune-dysfunction-long-duration', title: 'Immune dysfunction in long-duration missions', tags: ['Immunity', 'Human Health'], domain: 'Immunity', year: 2018 },
    { id: 'microbiome-changes-space', title: 'Human microbiome changes during space missions', tags: ['Biology', 'Human Health'], domain: 'Biology', year: 2019 },
    { id: 'plant-root-orientation', title: 'Plant root orientation and growth in microgravity', tags: ['Botany', 'Microgravity'], domain: 'Botany', year: 2013 },
    { id: 'seed-germination-microgravity', title: 'Seed germination studies in microgravity', tags: ['Botany', 'Microgravity'], domain: 'Botany', year: 2016 },
    { id: 'radiation-shielding-materials', title: 'Evaluation of radiation shielding materials for deep space', tags: ['Radiation', 'Materials'], domain: 'Radiation', year: 2022 },
    { id: 'dosimetry-deep-space', title: 'Passive and active dosimetry in deep space missions', tags: ['Radiation', 'Instrumentation'], domain: 'Radiation', year: 2021 },
    { id: 'cardiovascular-autonomic-regulation', title: 'Autonomic cardiovascular regulation in astronauts', tags: ['Cardiovascular', 'Physiology'], domain: 'Cardiovascular', year: 2010 },
    { id: 'orthostatic-intolerance-return', title: 'Orthostatic intolerance on return to gravity', tags: ['Cardiovascular', 'Human Health'], domain: 'Cardiovascular', year: 2012 },
    { id: 'vision-impairment-sans', title: 'Spaceflight Associated Neuro-ocular Syndrome (SANS) overview', tags: ['Neuroscience', 'Human Health'], domain: 'Neuroscience', year: 2015 },
    { id: 'bone-remodeling-nasa-twins', title: 'Bone remodeling insights from the NASA Twins Study', tags: ['Physiology', 'Microgravity'], domain: 'Physiology', year: 2017 },
    { id: 'nutrition-countermeasures', title: 'Nutrition countermeasures for astronaut health', tags: ['Human Health', 'Nutrition'], domain: 'Nutrition', year: 2019 },
    { id: 'exercise-devices-comparison', title: 'Comparison of exercise devices aboard the ISS', tags: ['Physiology', 'ISS'], domain: 'ISS', year: 2015 },
    { id: 'cognitive-performance-isolation', title: 'Cognitive performance under isolation and confinement', tags: ['Neuroscience', 'Human Health'], domain: 'Neuroscience', year: 2016 },
    { id: 'stress-hormones-spaceflight', title: 'Stress hormone dynamics during spaceflight', tags: ['Human Health', 'Endocrinology'], domain: 'Endocrinology', year: 2013 },
    { id: 'habitat-life-support-modeling', title: 'Modeling closed habitat life support systems', tags: ['Life Support', 'Modeling'], domain: 'Life Support', year: 2020 },
    { id: 'closed-loop-ecology', title: 'Closed-loop ecological systems for long missions', tags: ['Life Support', 'Ecology'], domain: 'Life Support', year: 2011 },
    { id: 'water-recycling-iss', title: 'Advances in water recycling on the ISS', tags: ['ISS', 'Life Support'], domain: 'ISS', year: 2014 },
    { id: 'air-quality-monitoring-iss', title: 'Air quality monitoring aboard the ISS', tags: ['ISS', 'Instrumentation'], domain: 'ISS', year: 2012 },
    { id: 'spacesuit-mobility-metabolism', title: 'Spacesuit mobility and metabolic cost', tags: ['EVA', 'Human Health'], domain: 'EVA', year: 2009 },
    { id: 'eva-fatigue-risk', title: 'EVA fatigue and risk management', tags: ['EVA', 'Operations'], domain: 'EVA', year: 2013 },
    { id: 'thermal-regulation-space', title: 'Thermal regulation challenges in space', tags: ['Operations', 'Engineering'], domain: 'Engineering', year: 2010 },
    { id: 'lunar-dust-toxicity', title: 'Toxicological considerations of lunar dust exposure', tags: ['Lunar', 'Human Health'], domain: 'Lunar', year: 2008 },
    { id: 'mars-radiation-risk', title: 'Radiation risk models for Mars missions', tags: ['Mars', 'Radiation'], domain: 'Mars', year: 2022 },
    { id: 'mars-analog-crew-health', title: 'Crew health findings from Mars analog habitats', tags: ['Mars', 'Human Health'], domain: 'Mars', year: 2019 },
    { id: 'robotic-surgery-telerobotics', title: 'Feasibility of telerobotic surgery for space missions', tags: ['Robotics', 'Human Health'], domain: 'Robotics', year: 2018 },
    { id: 'telemedicine-space', title: 'Telemedicine protocols for exploration missions', tags: ['Operations', 'Human Health'], domain: 'Operations', year: 2017 },
    { id: 'ai-assist-ops', title: 'AI assistance for onboard operations', tags: ['AI', 'Operations'], domain: 'AI', year: 2023 },
    { id: 'anomaly-detection-telemetry', title: 'Anomaly detection in spacecraft telemetry', tags: ['AI', 'Telemetry'], domain: 'AI', year: 2021 },
    { id: 'cube-sat-earth-observation', title: 'CubeSat platforms for Earth observation', tags: ['Earth Observation', 'Satellites'], domain: 'Satellites', year: 2016 },
    { id: 'wildfire-detection-sat', title: 'Satellite-based wildfire detection and alerting', tags: ['Earth Observation', 'Climate'], domain: 'Earth Observation', year: 2020 },
    { id: 'climate-trends-remote-sensing', title: 'Long-term climate trends from remote sensing', tags: ['Earth Observation', 'Climate'], domain: 'Earth Observation', year: 2015 },
    { id: 'exoplanet-transit-analysis', title: 'Transit photometry analysis for exoplanet detection', tags: ['Exoplanets', 'Astronomy'], domain: 'Astronomy', year: 2012 },
    { id: 'asteroid-mining-materials', title: 'Materials considerations for asteroid mining', tags: ['Materials', 'Operations'], domain: 'Materials', year: 2014 },
    { id: 'regolith-construction', title: 'Regolith-based construction techniques', tags: ['Lunar', 'Engineering'], domain: 'Lunar', year: 2021 },
    { id: '3d-printing-microgravity', title: '3D printing processes in microgravity', tags: ['Manufacturing', 'Microgravity'], domain: 'Manufacturing', year: 2019 },
    { id: 'protein-crystallization-iss', title: 'Protein crystallization experiments on the ISS', tags: ['Biology', 'ISS'], domain: 'Biology', year: 2013 },
    { id: 'stem-cell-differentiation-space', title: 'Stem cell differentiation under space conditions', tags: ['Biology', 'Microgravity'], domain: 'Biology', year: 2024 },
]

export default function PapersIndexPage() {
    const [query, setQuery] = useState('')
    const [activeDomains, setActiveDomains] = useState([])
    // Sort option
    const [sortBy, setSortBy] = useState('year-desc') // 'year-desc' | 'year-asc' | 'title-asc' | 'title-desc' | 'domain-asc'
    // Single year slider: lower bound (from year)
    const [yearFrom, setYearFrom] = useState(() => {
        const years = PAPERS.map(p => p.year)
        return Math.min(...years)
    })

    const allDomains = useMemo(() => {
        const set = new Set(PAPERS.map(p => p.domain).filter(Boolean))
        return Array.from(set).sort()
    }, [])

    // Categories removed per request

    const allYears = useMemo(() => {
        const set = new Set(PAPERS.map(p => p.year).filter(Boolean))
        return Array.from(set).sort((a, b) => b - a)
    }, [])

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        const result = PAPERS.filter(p => {
            const matchesQuery = !q || p.title.toLowerCase().includes(q)
            const matchesDomains = activeDomains.length === 0 || activeDomains.includes(p.domain)
            const matchesYear = p.year >= yearFrom
            return matchesQuery && matchesDomains && matchesYear
        })
        // Sorting
        const sorted = [...result]
        switch (sortBy) {
            case 'year-asc':
                sorted.sort((a, b) => a.year - b.year)
                break
            case 'title-asc':
                sorted.sort((a, b) => a.title.localeCompare(b.title))
                break
            case 'title-desc':
                sorted.sort((a, b) => b.title.localeCompare(a.title))
                break
            case 'domain-asc':
                sorted.sort((a, b) => a.domain.localeCompare(b.domain) || b.year - a.year)
                break
            case 'year-desc':
            default:
                sorted.sort((a, b) => b.year - a.year)
        }
        return sorted
    }, [query, activeDomains, yearFrom, sortBy])

    const toggleDomain = (domain) => {
        setActiveDomains(prev => prev.includes(domain) ? prev.filter(d => d !== domain) : [...prev, domain])
    }
    // Category filter removed

    // Dropdown handler removed; using checkbox toggles instead

    // Single year slider handler (lower bound)
    const onYearFromChange = (e) => {
        const v = Number(e.target.value)
        setYearFrom(v)
    }

    const clearFilters = () => {
        setActiveDomains([])
        setSortBy('year-desc')
        // Reset year to minimum
        if (allYears.length) setYearFrom(allYears[allYears.length - 1])
    }

    // Map papers to local images deterministically
    const getPaperImage = (paper) => {
        const title = (paper.title || '').toLowerCase()
        const domain = (paper.domain || '').toLowerCase()
        const tags = (paper.tags || []).map(t => t.toLowerCase())

        // Strong keyword checks
        if (domain.includes('mars') || tags.includes('mars') || title.includes('mars')) return '/mars.jpg'
        if (domain.includes('lunar') || tags.includes('lunar') || tags.includes('moon') || title.includes('lunar') || title.includes('moon')) return '/moon.jpg'
        if (domain.includes('iss') || tags.includes('iss') || title.includes('iss')) return '/moon.jpg'
        if (domain.includes('ai') || tags.includes('ai') || title.includes('ai') || title.includes('anomaly') || title.includes('telemetry')) return '/nasa_ai.jpeg'
        if (domain.includes('satellite') || domain.includes('earth observation') || tags.includes('satellites') || tags.includes('earth observation') || title.includes('satellite')) return '/nasa_rovers.jpeg'

        // Radiation/biology fallback
        if (domain.includes('radiation') || tags.includes('radiation')) return '/biology.jpeg'
        return '/biology.jpeg'
    }

    // Choose a local fallback image if external fetch fails or offline
    const getLocalFallback = (paper) => getPaperImage(paper)

    // Inline Image component with robust fallback handling
    function PaperCardImage({ paper }){
    const initial = getPaperImage(paper)
    const fallback = getLocalFallback(paper)
        const [src, setSrc] = useState(initial)
        const handleError = () => {
            if (src !== fallback) setSrc(fallback)
        }
        return (
            <Image
                src={src}
                alt={paper.title}
                width={800}
                height={600}
                className="w-full h-40 object-cover rounded-md bg-gray-200"
                loading="lazy"
                onError={handleError}
            />
        )
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-white">Research Papers</h1>
                    <p className="text-gray-400 mt-1">Browse papers as cards. Click any card to open the paper page.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-3">
                        <div className="sticky top-6 bg-neutral-900 rounded-xl border border-neutral-800 p-4 md:p-5">
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="text-base font-semibold text-white">Filters</h2>
                                {(activeDomains.length > 0 || sortBy !== 'year-desc' || (allYears.length > 0 && (yearFrom !== allYears[allYears.length - 1]))) && (
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="text-xs text-sky-400 hover:underline"
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>

                            {/* Year filter (single slider) */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-100 mb-2">Year</h3>
                                <div className="mb-2 text-xs text-gray-400 flex items-center justify-between">
                                    <span>{allYears[allYears.length - 1] ?? ''}</span>
                                    <span className="font-medium">From {yearFrom} → {allYears[0] ?? ''}</span>
                                    <span>{allYears[0] ?? ''}</span>
                                </div>
                                <input
                                    type="range"
                                    min={allYears[allYears.length - 1]}
                                    max={allYears[0]}
                                    step={1}
                                    value={yearFrom}
                                    onChange={onYearFromChange}
                                    className="w-full"
                                />
                            </div>

                            {/* Sort */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-100 mb-2">Sort by</h3>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full border border-neutral-800 bg-neutral-900 text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/40 focus:border-neutral-700"
                                >
                                    <option value="year-desc">Newest (Year ↓)</option>
                                    <option value="year-asc">Oldest (Year ↑)</option>
                                    <option value="title-asc">Title A → Z</option>
                                    <option value="title-desc">Title Z → A</option>
                                    <option value="domain-asc">Domain A → Z</option>
                                </select>
                            </div>

                            {/* Domain filter (checkbox list) */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-100 mb-2">Domain</h3>
                                <div className="max-h-60 overflow-auto pr-1 space-y-2">
                                    {allDomains.map(domain => (
                                        <label key={domain} className="flex items-center gap-2 text-sm text-gray-300">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-neutral-700 text-sky-500 focus:ring-sky-500/40 bg-neutral-900"
                                                checked={activeDomains.includes(domain)}
                                                onChange={() => toggleDomain(domain)}
                                            />
                                            <span className="flex-1">{domain}</span>
                                            <span className="text-xs text-gray-500">
                                                {PAPERS.filter(p => p.domain === domain).length}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Category, Year, Sort removed from sidebar; moved to top toolbar */}
                        </div>
                    </aside>

                    {/* Main content */}
                    <main className="lg:col-span-9">
                        {/* Top toolbar: search only */}
                        <div className="mb-4">
                            <label className="sr-only" htmlFor="paper-search-main">Search papers</label>
                            <div className="relative">
                                <input
                                    id="paper-search-main"
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search by title..."
                                    className="w-full rounded-lg border border-neutral-800 bg-neutral-900 text-gray-100 placeholder-gray-500 px-4 py-2.5 pl-10 text-sm focus:ring-2 focus:ring-sky-500/40 focus:border-neutral-700"
                                />
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18.5a7.5 7.5 0 006.15-3.85z" />
                                </svg>
                            </div>
                        </div>

                        <div className="mb-4 text-sm text-gray-400">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                            {filtered.map(paper => (
                                <Link key={paper.id} href={`/papers/${paper.id}`} className="group">
                                    <div className="h-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-neutral-700 transition-colors">
                                        {/* Image header */}
                                        <div className="mb-3">
                                            <PaperCardImage paper={paper} />
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-base font-semibold text-white group-hover:text-sky-400">{paper.title}</h3>

                                        {/* Tags */}
                                        {paper.tags?.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-1.5">
                                                {paper.tags.slice(0, 3).map(t => (
                                                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">{t}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}