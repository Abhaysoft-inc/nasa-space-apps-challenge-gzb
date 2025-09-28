'use client'
import React, { useState, useEffect, useRef } from 'react'
import PaperHeader from '../../../components/papers/PaperHeader'
import PaperSummary from '../../../components/papers/PaperSummary'
import PaperContent from '../../../components/papers/PaperContent'
import RelatedPapers from '../../../components/papers/RelatedPapers'
import PaperActions from '../../../components/papers/PaperActions'
import ProfileSidebarCard from '../../../components/profile/ProfileSidebarCard'

const PapersPage = () => {
    const [chatInput, setChatInput] = useState('')
    const [chatMessages, setChatMessages] = useState([])
    const [isListening, setIsListening] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [chatError, setChatError] = useState(null)
    const recognitionRef = useRef(null)
    const sessionRef = useRef(0) // increments to invalidate in-flight responses on reset
    // const [isChatOpen, setIsChatOpen] = useState(false)

    // Sample paper data
    const paperData = {
        title: "Mice in Bion-M 1 Space Mission: Training and Selection",
        authors: ["Alexander Andreev-Andrievskiy", "Anfisa Popova", "Richard Boyle", "Jeffrey Alberts", "Boris Shenkman", "Olga Vinogradova"],
        source: "PLoS ONE",
        date: "August 18, 2014",
        citations: 127,
        doi: "10.1371/journal.pone.0104830",
        pmcid: "PMC4136787",
        summary: "After a 16-year hiatus, Russia has resumed its program of biomedical research in space, with the successful 30-day flight of the Bion-M 1 biosatellite (April 19–May 19, 2013). The principal species for biomedical research in this project was the mouse. This paper presents an overview of the scientific goals, the experimental design and the mouse training/selection program. The aim of mice experiments in the Bion-M 1 project was to elucidate cellular and molecular mechanisms, underlying the adaptation of key physiological systems to long-term exposure in microgravity.",
        keywords: ["Space biology", "Microgravity", "Mouse models", "Biomedical research", "Space adaptation"]
    }

    const relatedPapers = [
        {
            title: "Effects of spaceflight on immunity in the C57BL/6 mouse",
            authors: "Pecaut MJ, Nelson GA",
            source: "J Appl Physiol",
            year: "2003"
        },
        {
            title: "The Mice Drawer System (MDS) Experiment and the Space Endurance Record-Breaking Mice",
            authors: "Cancedda R, Liu Y",
            source: "PLoS ONE",
            year: "2012"
        },
        {
            title: "Changes in Mouse Thymus and Spleen after Return from the STS-135 Mission in Space",
            authors: "Gridley DS, Mao XW",
            source: "PLoS ONE",
            year: "2013"
        }
    ]

    const requestChatCompletion = async (prompt) => {
        // Add paper context to the query
        const contextualQuery = `I am asking about the paper "${paperData.title}" by ${paperData.authors.join(', ')} published in ${paperData.source} (${paperData.date}). 

Paper Summary: ${paperData.summary}

Keywords: ${paperData.keywords.join(', ')}

My question about this paper: ${prompt}`

        const payload = {
            query: contextualQuery,
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
        return 'I could not find a confident answer yet, but I will keep learning from this paper.'
    }

    // Initialize chat with welcome message
    useEffect(() => {
        setChatMessages([
            {
                type: 'ai',
                message: `Hello! I'm ready to help you with questions about "${paperData.title}" by ${paperData.authors.slice(0, 2).join(', ')}${paperData.authors.length > 2 ? ' et al.' : ''}. This paper discusses ${paperData.summary.split('.')[0].toLowerCase()}. What would you like to know about this research?`
            }
        ])
    }, [])

    useEffect(() => {
        if (typeof window === 'undefined') return
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SpeechRecognition) return
        const recognition = new SpeechRecognition()
        recognition.lang = 'en-US'
        recognition.interimResults = false
        recognition.maxAlternatives = 1
        recognitionRef.current = recognition

        return () => {
            recognition.stop()
            recognitionRef.current = null
        }
    }, [])

    const handleVoiceInput = () => {
        if (isGenerating) return
        const recognition = recognitionRef.current
        if (!recognition) {
            alert('Voice search is not supported in this browser.')
            return
        }
        if (isListening) {
            recognition.stop()
            setIsListening(false)
            return
        }
        try {
            setIsListening(true)
            recognition.onresult = (event) => {
                const transcript = event.results?.[0]?.[0]?.transcript
                if (transcript) {
                    setChatInput(transcript)
                }
                setIsListening(false)
            }
            recognition.onerror = () => {
                setIsListening(false)
            }
            recognition.onend = () => {
                setIsListening(false)
            }
            recognition.start()
        } catch (err) {
            setIsListening(false)
            console.error('Voice recognition failed', err)
        }
    }

    const handleTextToSpeech = (text) => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
            alert('Text-to-speech is not supported in this browser.')
            return
        }
        const synth = window.speechSynthesis
        synth.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'en-US'
        synth.speak(utterance)
    }

    const handleCopyResponse = async (text) => {
        try {
            await navigator.clipboard.writeText(text)
        } catch (err) {
            console.error('Copy failed', err)
        }
    }

    const handleRegenerateResponse = async (index) => {
        if (isGenerating) return
        const target = chatMessages[index]
        if (!target || target.type !== 'ai') return

        const findPrompt = () => {
            if (target?.prompt) return target.prompt
            for (let j = index - 1; j >= 0; j -= 1) {
                if (chatMessages[j]?.type === 'user') {
                    return chatMessages[j].message
                }
            }
            return null
        }

        const prompt = findPrompt()
        if (!prompt) return

        const sessionId = sessionRef.current
        setIsGenerating(true)
        setChatError(null)
        try {
            const freshReply = await requestChatCompletion(`${prompt}\n\nPlease provide a refreshed perspective or additional insights.`)
            if (sessionId !== sessionRef.current) return
            setChatMessages(prev => {
                const next = [...prev]
                next.splice(index, 1, {
                    type: 'ai',
                    message: freshReply,
                    prompt,
                })
                return next
            })
        } catch (err) {
            console.error('Regenerate failed', err)
            setChatError('Unable to regenerate right now. Please try again in a moment.')
        } finally {
            setIsGenerating(false)
        }
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
            console.error('Chat request failed', err)
            if (sessionId === sessionRef.current) {
                setChatError('We could not fetch a response right now. Showing a fallback note.')
                setChatMessages(prev => [...prev, {
                    type: 'ai',
                    message: 'Sorry, I could not reach the research assistant service right now. Please try again shortly.',
                    prompt: trimmed,
                    error: true
                }])
            }
        } finally {
            setIsGenerating(false)
        }
    }

    const formatAIResponse = (text) => {
        // Convert **bold** to <strong>
        let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-100">$1</strong>')

        // Convert bullet points (lines starting with *) to proper list items
        const lines = formatted.split('\n')
        let inList = false
        let result = []

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim()

            if (line.startsWith('* ')) {
                if (!inList) {
                    result.push('<ul class="list-disc list-inside ml-4 space-y-1 mt-2 mb-2">')
                    inList = true
                }
                result.push(`<li class="text-gray-300">${line.substring(2)}</li>`)
            } else {
                if (inList) {
                    result.push('</ul>')
                    inList = false
                }
                if (line) {
                    result.push(`<p class="mb-2 text-gray-300">${line}</p>`)
                } else {
                    result.push('<br/>')
                }
            }
        }

        if (inList) {
            result.push('</ul>')
        }

        return result.join('')
    }

    const handleResetChat = () => {
        // Invalidate any in-flight responses
        sessionRef.current += 1
        // Stop voice recognition if active
        try {
            const rec = recognitionRef.current
            if (rec) rec.stop()
        } catch { }
        // Stop any ongoing speech synthesis
        try {
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel()
            }
        } catch { }
        // Clear UI state
        setIsListening(false)
        setIsGenerating(false)
        setChatError(null)
        setChatInput('')
        setChatMessages([])
    }

    return (
        <div className="min-h-screen bg-black text-white pb-32">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <PaperHeader paperData={paperData} />
                        <PaperSummary paperData={paperData} />
                        {chatMessages.length > 0 && (
                            <div className="mt-6 bg-neutral-900 rounded-2xl border border-neutral-800 p-4 md:p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-semibold text-white">AI Q&A</h3>
                                    <button
                                        type="button"
                                        onClick={handleResetChat}
                                        className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-gray-300"
                                        title="Reset chat history"
                                    >
                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 12a9 9 0 11-9-9" />
                                            <path d="M21 3v7h-7" />
                                        </svg>
                                        Reset
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {chatMessages.map((m, i) => (
                                        <div key={i} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`flex flex-col gap-1 ${m.type === 'user' ? 'items-end' : 'items-start'}`}>
                                                <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2 text-sm border ${m.type === 'user'
                                                    ? 'bg-sky-950 text-sky-100 border-sky-900'
                                                    : 'bg-neutral-900 text-gray-100 border-neutral-800'
                                                    }`}>
                                                    {m.type === 'ai' ? (
                                                        <div
                                                            className="prose prose-sm max-w-none prose-invert"
                                                            dangerouslySetInnerHTML={{
                                                                __html: formatAIResponse(m.message)
                                                            }}
                                                        />
                                                    ) : (
                                                        m.message
                                                    )}
                                                </div>
                                                {m.type === 'ai' && (
                                                    <div className="flex gap-2 text-[11px] text-gray-400">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleTextToSpeech(m.message)}
                                                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-neutral-800 bg-neutral-900 hover:bg-neutral-800"
                                                            title="Listen to response"
                                                        >
                                                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                                                                <path d="M15.54 8.46a5 5 0 010 7.07" />
                                                                <path d="M19.07 5.93a9 9 0 010 12.73" />
                                                            </svg>
                                                            TTS
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCopyResponse(m.message)}
                                                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-neutral-800 bg-neutral-900 hover:bg-neutral-800"
                                                            title="Copy response"
                                                        >
                                                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <rect x="9" y="9" width="13" height="13" rx="2" />
                                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                            </svg>
                                                            Copy
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRegenerateResponse(i)}
                                                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-neutral-800 bg-neutral-900 hover:bg-neutral-800"
                                                            title="Regenerate response"
                                                        >
                                                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M21 12a9 9 0 11-9-9" />
                                                                <path d="M21 3v7h-7" />
                                                            </svg>
                                                            Retry
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {isGenerating && (
                                        <div className="flex justify-start">
                                            <div className="flex flex-col items-start">
                                                <div className="inline-flex items-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900 px-4 py-2 text-xs text-gray-300">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
                                                    <span>Analyzing paper…</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {chatError && (
                                    <p className="text-xs text-red-500 mt-3">{chatError}</p>
                                )}
                            </div>
                        )}
                        <PaperContent />
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        <ProfileSidebarCard />
                        <RelatedPapers relatedPapers={relatedPapers} />
                        <PaperActions />
                    </div>
                </div>
            </div>

            {/* Bottom AI Chat Dockbar */}
            <div className="fixed bottom-0 left-0 right-0 z-40 py-4">
                <div className="mx-auto w-full px-4 sm:px-6">
                    {/* Desktop: align with main content (col-span-2) */}
                    <div className="hidden lg:grid max-w-7xl mx-auto grid-cols-3 gap-8">
                        <div className="col-span-2">
                            <div className="bg-black/70 backdrop-blur-md rounded-2xl border border-neutral-800 shadow-lg p-4">
                                {/* Quick suggestion buttons - top */}
                                <div className="mb-3 flex flex-wrap gap-2">
                                    {[
                                        "What are the main findings?",
                                        "Explain the methodology",
                                        "What are the implications?",
                                        "Summary in simple terms"
                                    ].map((question, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setChatInput(question)}
                                            className="text-[11px] bg-neutral-900 text-gray-300 px-2.5 py-1.5 rounded-full hover:bg-neutral-800 hover:text-sky-400 transition-colors border border-neutral-800"
                                        >
                                            {question}
                                        </button>
                                    ))}
                                </div>
                                <form onSubmit={handleChatSubmit} className="flex items-center gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-500 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-medium text-gray-300">Ask AI about this paper</span>
                                    </div>

                                    <div className="flex-1 flex gap-3">
                                        <input
                                            type="text"
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            placeholder="What would you like to know about this research?"
                                            className="flex-1 px-4 py-2 border border-neutral-800 bg-neutral-900 text-gray-100 placeholder-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-neutral-700 text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleVoiceInput}
                                            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${isListening ? 'bg-neutral-800 border-neutral-700 text-sky-400' : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 text-gray-300'}`}
                                            title={isListening ? 'Listening…' : 'Voice search'}
                                        >
                                            {isListening ? (
                                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="9" strokeOpacity="0.3" />
                                                    <path d="M21 12a9 9 0 01-9 9" />
                                                </svg>
                                            ) : (
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M12 1a3 3 0 00-3 3v6a3 3 0 006 0V4a3 3 0 00-3-3z" />
                                                    <path d="M19 10v2a7 7 0 01-14 0v-2" />
                                                    <path d="M12 19v4" />
                                                    <path d="M8 23h8" />
                                                </svg>
                                            )}
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!chatInput.trim()}
                                            className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                            Ask AI
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Mobile/Tablet: centered and narrower */}
                    <div className="lg:hidden">
                        <div className="mx-auto w-full max-w-2xl md:max-w-3xl bg-black/70 backdrop-blur-md rounded-2xl border border-neutral-800 shadow-lg p-4">
                            {/* Quick suggestion buttons - top */}
                            <div className="mb-3 flex flex-wrap gap-2">
                                {[
                                    "What are the main findings?",
                                    "Explain the methodology",
                                    "What are the implications?",
                                    "Summary in simple terms"
                                ].map((question, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setChatInput(question)}
                                        className="text-[11px] bg-neutral-900 text-gray-300 px-2.5 py-1.5 rounded-full hover:bg-neutral-800 hover:text-sky-400 transition-colors border border-neutral-800"
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                            <form onSubmit={handleChatSubmit} className="flex items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-500 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-gray-300">Ask AI about this paper</span>
                                </div>

                                <div className="flex-1 flex gap-3">
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        placeholder="What would you like to know about this research?"
                                        className="flex-1 px-4 py-2 border border-neutral-800 bg-neutral-900 text-gray-100 placeholder-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-neutral-700 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleVoiceInput}
                                        className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${isListening ? 'bg-neutral-800 border-neutral-700 text-sky-400' : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 text-gray-300'}`}
                                        title={isListening ? 'Listening…' : 'Voice search'}
                                    >
                                        {isListening ? (
                                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="9" strokeOpacity="0.3" />
                                                <path d="M21 12a9 9 0 01-9 9" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M12 1a3 3 0 00-3 3v6a3 3 0 006 0V4a3 3 0 00-3-3z" />
                                                <path d="M19 10v2a7 7 0 01-14 0v-2" />
                                                <path d="M12 19v4" />
                                                <path d="M8 23h8" />
                                            </svg>
                                        )}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!chatInput.trim()}
                                        className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                        Ask AI
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PapersPage