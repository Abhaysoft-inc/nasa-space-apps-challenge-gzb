"use client"
import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { ChatBubbleLeftIcon, MicrophoneIcon, SpeakerWaveIcon, ClipboardIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

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

    // Chat state
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [chatMessages, setChatMessages] = useState([])
    const [chatInput, setChatInput] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [chatError, setChatError] = useState(null)
    const sessionRef = useRef(Date.now())

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

    // Chat functions
    const requestChatCompletion = async (prompt) => {
        const comparisonContext = items.length > 0 ?
            `You are helping with a comparison of the following papers:\n${items.map((item, idx) =>
                `${idx + 1}. "${item.title}" (${item.source}, ${item.year})`
            ).join('\n')}\n\nContext: The user is comparing these papers and wants to understand similarities, differences, and insights from this comparison.\n\n` :
            'No papers are currently being compared.\n\n'

        const payload = {
            query: comparisonContext + prompt,
            chat_history: chatMessages.map(msg => ({
                type: msg.type === 'user' ? 'user' : 'assistant',
                message: msg.message
            }))
        }

        const res = await fetch('http://127.0.0.1:8000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })

        if (!res.ok) {
            throw new Error('Chat service unavailable')
        }

        const data = await res.json()
        if (data?.answer) return data.answer
        return 'I could not find a confident answer yet, but I will keep learning from these papers.'
    }

    const handleChatSubmit = async (e) => {
        e.preventDefault()
        const trimmed = chatInput.trim()
        if (!trimmed || isGenerating) return

        setChatInput('')
        setChatError(null)
        setChatMessages(prev => [...prev, { type: 'user', message: trimmed }])
        const sessionId = sessionRef.current
        setIsGenerating(true)

        try {
            const aiReply = await requestChatCompletion(trimmed)
            if (sessionId !== sessionRef.current) return
            setChatMessages(prev => [...prev, { type: 'ai', message: aiReply, prompt: trimmed }])
        } catch (err) {
            console.error('Chat failed', err)
            setChatError('Unable to get response. Please try again.')
        } finally {
            setIsGenerating(false)
        }
    }

    const formatAIResponse = (text) => {
        return text.split('\n').map((line, i) => {
            if (line.startsWith('**') && line.endsWith('**')) {
                return <div key={i} className="font-semibold text-gray-900 mt-3 mb-2">{line.slice(2, -2)}</div>
            }
            if (line.startsWith('- ')) {
                return <div key={i} className="ml-4 mb-1">• {line.slice(2)}</div>
            }
            if (line.match(/^\d+\./)) {
                return <div key={i} className="ml-4 mb-1">{line}</div>
            }
            if (line.trim() === '') {
                return <div key={i} className="h-2"></div>
            }
            return <div key={i} className="mb-2">{line}</div>
        })
    }

    // Initialize chat with welcome message when items change
    useEffect(() => {
        if (items.length > 0 && chatMessages.length === 0) {
            setChatMessages([{
                type: 'ai',
                message: `Hello! I can help you analyze and compare the ${items.length} paper${items.length > 1 ? 's' : ''} you've selected:\n\n${items.map((item, idx) =>
                    `${idx + 1}. "${item.title}"`
                ).join('\n')}\n\nAsk me anything about similarities, differences, methodologies, or insights from these papers!`
            }])
        }
    }, [items])

    return (
        <div className="min-h-screen bg-gray-50">
            <style>{`.fade-out { opacity: 0; transition: opacity .25s ease; }`}</style>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Paper Comparison</h1>
                    <div className="flex items-center gap-2">
                        <Link href="/papers" className="text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50">Back to Papers</Link>
                        <button onClick={clearAll} className="text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50">Clear All</button>
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
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
                    <p className="text-sm text-gray-700 mb-3">Add another paper to compare (paste DOI/PMCID/Title):</p>
                    <div className="flex gap-2">
                        <input value={addText} onChange={(e) => setAddText(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg" placeholder="10.1234/xyz or PMC123456 or Title" />
                        <button onClick={addItem} className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">Add</button>
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center text-gray-500">
                        Nothing to compare yet. Go to a paper and click "Compare".
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {items.map((it, idx) => (
                            <div key={it.key} className={`rounded-2xl border ${idx === 0 ? 'border-blue-300 bg-blue-50/40' : 'border-gray-200 bg-white'} p-4`}>
                                {idx === 0 && (
                                    <div className="text-[11px] inline-flex items-center gap-2 px-2 py-1 rounded-full bg-blue-100 text-blue-700 mb-2">Most Recent</div>
                                )}
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-semibold text-gray-900 line-clamp-2">{it.title}</p>
                                        <p className="text-xs text-gray-500">{it.source} • {it.year}</p>
                                    </div>
                                    <button onClick={() => removeItem(it.key)} className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50">Remove</button>
                                </div>
                                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                                    <Detail label="Citations" value={it.citations ?? '-'} />
                                    <Detail label="DOI" value={it.doi ? (it.doi.split('/').pop()) : '-'} />
                                    <Detail label="PMCID" value={it.pmcid ?? '-'} />
                                    <Detail label="Link" value={<a href={it.url} target="_blank" rel="noopener" className="text-blue-600 hover:underline">Open</a>} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Detailed comparison table */}
                {items.length > 0 && (
                    <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900">Detailed Comparison</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50 text-gray-600">
                                    <tr>
                                        <th className="text-left font-semibold px-4 py-2">Attribute</th>
                                        {items.map((it) => (
                                            <th key={it.key} className="text-left font-semibold px-4 py-2">{it.title}</th>
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
                                        <tr key={row.k} className="border-t border-gray-100">
                                            <td className="px-4 py-2 font-medium text-gray-700">{row.label}</td>
                                            {items.map((it) => (
                                                <td key={it.key + row.k} className="px-4 py-2 text-gray-900">{it[row.k] ?? '-'}</td>
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
                        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white text-xs">✓</span>
                                <h3 className="text-gray-900 font-semibold">Areas of Consensus</h3>
                            </div>
                            <ul className="p-4 space-y-2 text-sm text-gray-800">
                                <li className="flex gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500"></span> All papers acknowledge microgravity as a primary driver of observed physiological changes.</li>
                                <li className="flex gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Use of standardized data collection protocols and ISS-aligned experimental timelines.</li>
                                <li className="flex gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Consensus that long-duration exposure increases the magnitude of effects.</li>
                            </ul>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-500 text-white text-xs">!</span>
                                <h3 className="text-gray-900 font-semibold">Areas of Disagreement</h3>
                            </div>
                            <ul className="p-4 space-y-2 text-sm text-gray-800">
                                <li className="flex gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-500"></span> Divergent interpretations of radiation’s contribution vs. microgravity in total effect size.</li>
                                <li className="flex gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-500"></span> Conflicting statistical significance due to small sample sizes and differing controls.</li>
                                <li className="flex gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-500"></span> Disagreement on recovery timelines post-landing (days vs. weeks) across studies.</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* Floating Chat Button */}
            {items.length > 0 && (
                <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50"
                >
                    <ChatBubbleLeftIcon className="h-6 w-6 text-white" />
                </button>
            )}

            {/* Chat Panel */}
            {isChatOpen && items.length > 0 && (
                <div className="fixed bottom-24 right-6 w-96 h-96 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-50">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Paper Comparison Assistant</h3>
                        <button
                            onClick={() => setIsChatOpen(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ×
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {chatMessages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs rounded-lg p-3 text-sm ${msg.type === 'user'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-900'
                                    }`}>
                                    {msg.type === 'ai' ? formatAIResponse(msg.message) : msg.message}
                                </div>
                            </div>
                        ))}
                        {isGenerating && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-900">
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                        <span>Analyzing papers...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-200">
                        <div className="flex space-x-2">
                            <input
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Ask about paper comparison..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={isGenerating}
                            />
                            <button
                                type="submit"
                                disabled={isGenerating || !chatInput.trim()}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Send
                            </button>
                        </div>
                        {chatError && (
                            <p className="text-red-600 text-xs mt-2">{chatError}</p>
                        )}
                    </form>
                </div>
            )}
        </div>
    )
}

function Detail({ label, value }) {
    return (
        <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-3">
            <p className="text-[11px] uppercase tracking-wide text-gray-500">{label}</p>
            <p className="text-sm text-gray-900">{value}</p>
        </div>
    )
}