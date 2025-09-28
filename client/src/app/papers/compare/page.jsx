"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

// Ensure we always have at least 2-3 items by seeding demo papers when needed
function ensureDemo(arr) {
    const result = [...(arr || [])]
    const DEMO = [
        {
            key: 'demo-1',
            title: 'Satellite-based Detection of Coastal Changes Using Multi-spectral Imagery',
            source: 'ArXiv',
            year: '2023',
            citations: 42,
            doi: '10.0000/demo.1',
            pmcid: 'PMC-DEMO-1',
            url: '#',
            ts: 1,
        },
        {
            key: 'demo-2',
            title: 'Robust Cloud Masking for Earth Observation with Self-Supervision',
            source: 'IEEE',
            year: '2022',
            citations: 77,
            doi: '10.0000/demo.2',
            pmcid: 'PMC-DEMO-2',
            url: '#',
            ts: 0,
        },
    ]
    while (result.length < 2 && DEMO.length) {
        const next = DEMO.shift()
        if (!result.find((x) => x.key === next.key)) result.push(next)
    }
    return result.slice(0, 3)
}

export default function ComparePage() {
    const [items, setItems] = useState([])
    const [primary, setPrimary] = useState(null)

    useEffect(() => {
        try {
            const primRaw = localStorage.getItem('comparePrimary')
            const prim = primRaw ? JSON.parse(primRaw) : null
            setPrimary(prim)
            const raw = localStorage.getItem('comparePapers')
            const arr = raw ? JSON.parse(raw) : []
            // sort newest first by ts
            arr.sort((a, b) => (b.ts || 0) - (a.ts || 0))
            // If primary isn't in list, prepend it
            const merged = prim ? [prim, ...arr.filter((x) => x.key !== prim.key)] : arr
            setItems(ensureDemo(merged))
        } catch { }
        // remove fade-out on mount
        try { document.body.classList.remove('fade-out') } catch { }
    }, [])

    const removeItem = (key) => {
        try {
            const next = items.filter((i) => i.key !== key)
            setItems(next)
            localStorage.setItem('comparePapers', JSON.stringify(next))
        } catch { }
    }

    const clearAll = () => {
        setItems([])
        try { localStorage.setItem('comparePapers', JSON.stringify([])) } catch { }
    }

    // Simple add-from-input (paste DOI/PMCID/title)
    const [addText, setAddText] = useState('')
    const addItem = () => {
        if (!addText.trim()) return
        const item = { key: addText.trim(), title: addText.trim(), source: 'Unknown', year: '-', citations: 0, url: '#', ts: Date.now() }
        const next = [item, ...items].slice(0, 3)
        setItems(next)
        try { localStorage.setItem('comparePapers', JSON.stringify(next)) } catch { }
        setAddText('')
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <style>{`.fade-out { opacity: 0; transition: opacity .25s ease; }`}</style>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-white">Paper Comparison</h1>
                    <div className="flex items-center gap-2">
                        <Link href="/papers" className="text-sm px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-gray-200">Back to Papers</Link>
                        <button onClick={clearAll} className="text-sm px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-gray-200">Clear All</button>
                    </div>
                </div>

                {/* Primary summary section */}
                {/* {items.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Primary Paper</h2>
                        <p className="text-sm text-gray-600 mb-4">The most recent paper you chose for comparison is highlighted below.</p>
                        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                            <p className="font-semibold text-gray-900">{items[0].title}</p>
                            <p className="text-xs text-gray-600">{items[0].source} • {items[0].year}</p>
                            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                <Detail label="Citations" value={items[0].citations ?? '-'} />
                                <Detail label="DOI" value={items[0].doi ?? '-'} />
                                <Detail label="PMCID" value={items[0].pmcid ?? '-'} />
                                <Detail label="Link" value={<a href={items[0].url} target="_blank" rel="noopener" className="text-blue-600 hover:underline">Open</a>} />
                            </div>
                        </div>
                    </div>
                )} */}

                {/* Add control */}
                <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-4 mb-6">
                    <p className="text-sm text-gray-300 mb-3">Add another paper to compare (paste DOI/PMCID/Title):</p>
                    <div className="flex gap-2">
                        <input value={addText} onChange={(e) => setAddText(e.target.value)} className="flex-1 px-3 py-2 border border-neutral-800 bg-neutral-900 text-gray-100 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-neutral-700" placeholder="10.1234/xyz or PMC123456 or Title" />
                        <button onClick={addItem} className="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-600 text-white">Add</button>
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="bg-neutral-900 rounded-2xl border border-dashed border-neutral-800 p-12 text-center text-gray-400">
                        Nothing to compare yet. Go to a paper and click "Compare".
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {items.map((it, idx) => (
                            <div key={it.key} className={`rounded-2xl border p-4 ${idx === 0 ? 'border-sky-700 bg-sky-950/30' : 'border-neutral-800 bg-neutral-900'}`}>
                                {idx === 0 && (
                                    <div className="text-[11px] inline-flex items-center gap-2 px-2 py-1 rounded-full bg-sky-900 text-sky-200 mb-2">Most Recent</div>
                                )}
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-semibold text-white line-clamp-2">{it.title}</p>
                                        <p className="text-xs text-gray-400">{it.source} • {it.year}</p>
                                    </div>
                                    <button onClick={() => removeItem(it.key)} className="text-xs px-2 py-1 rounded border border-neutral-800 hover:bg-neutral-800 text-gray-300">Remove</button>
                                </div>
                                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                                    <Detail label="Citations" value={it.citations ?? '-'} />
                                    <Detail label="DOI" value={it.doi ? (it.doi.split('/').pop()) : '-'} />
                                    <Detail label="PMCID" value={it.pmcid ?? '-'} />
                                    <Detail label="Link" value={<a href={it.url} target="_blank" rel="noopener" className="text-sky-400 hover:underline">Open</a>} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Detailed comparison table */}
                {items.length > 0 && (
                    <div className="mt-8 bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
                        <div className="p-4 border-b border-neutral-800">
                            <h2 className="text-lg font-semibold text-white">Detailed Comparison</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-neutral-950 text-gray-400">
                                    <tr>
                                        <th className="text-left font-semibold px-4 py-2">Attribute</th>
                                        {items.map((it) => (
                                            <th key={it.key} className="text-left font-semibold px-4 py-2 text-white">{it.title}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { k: 'source', label: 'Source' },
                                        { k: 'year', label: 'Year' },
                                        { k: 'citations', label: 'Citations' },
                                        { k: 'doi', label: 'DOI' },
                                        { k: 'pmcid', label: 'PMCID' },
                                    ].map((row) => (
                                        <tr key={row.k} className="border-t border-neutral-800">
                                            <td className="px-4 py-2 font-medium text-gray-300">{row.label}</td>
                                            {items.map((it) => (
                                                <td key={it.key + row.k} className="px-4 py-2 text-gray-100">{it[row.k] ?? '-'}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Consensus & Disagreement section (hard-coded) */}
                {items.length > 0 && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 hover:border-neutral-700 transition-all duration-200 hover:-translate-y-0.5">
                            <div className="px-4 py-3 border-b border-neutral-800 flex items-center gap-2">
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs">✓</span>
                                <h3 className="text-white font-semibold">Areas of Consensus</h3>
                            </div>
                            <ul className="p-4 space-y-2 text-sm text-gray-300">
                                <li className="flex gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500"></span> All papers acknowledge microgravity as a primary driver of observed physiological changes.</li>
                                <li className="flex gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Use of standardized data collection protocols and ISS-aligned experimental timelines.</li>
                                <li className="flex gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Consensus that long-duration exposure increases the magnitude of effects.</li>
                            </ul>
                        </div>

                        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 hover:border-neutral-700 transition-all duration-200 hover:-translate-y-0.5">
                            <div className="px-4 py-3 border-b border-neutral-800 flex items-center gap-2">
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-600 text-white text-xs">!</span>
                                <h3 className="text-white font-semibold">Areas of Disagreement</h3>
                            </div>
                            <ul className="p-4 space-y-2 text-sm text-gray-300">
                                <li className="flex gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-500"></span> Divergent interpretations of radiation’s contribution vs. microgravity in total effect size.</li>
                                <li className="flex gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-500"></span> Conflicting statistical significance due to small sample sizes and differing controls.</li>
                                <li className="flex gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-500"></span> Disagreement on recovery timelines post-landing (days vs. weeks) across studies.</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function Detail({ label, value }) {
    return (
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-3">
            <p className="text-[11px] uppercase tracking-wide text-gray-400">{label}</p>
            <p className="text-sm text-gray-100">{value}</p>
        </div>
    )
}