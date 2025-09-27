'use client'
import React, { useState } from 'react'
import PaperHeader from '../../../components/papers/PaperHeader'
import PaperSummary from '../../../components/papers/PaperSummary'
import PaperContent from '../../../components/papers/PaperContent'
import RelatedPapers from '../../../components/papers/RelatedPapers'
import PaperActions from '../../../components/papers/PaperActions'
import ProfileSidebarCard from '../../../components/profile/ProfileSidebarCard'

const PapersPage = () => {
    const [chatInput, setChatInput] = useState('')
    const [chatMessages, setChatMessages] = useState([])
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

    const handleChatSubmit = (e) => {
        e.preventDefault()
        if (chatInput.trim()) {
            setChatMessages([...chatMessages, { type: 'user', message: chatInput }])
            // Simulate AI response
            setTimeout(() => {
                setChatMessages(prev => [...prev, {
                    type: 'ai',
                    message: 'This is a simulated AI response about the paper. In a real implementation, this would connect to an AI service to answer questions about the research paper.'
                }])
            }, 1000)
            setChatInput('')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-32">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <PaperHeader paperData={paperData} />
                        <PaperSummary paperData={paperData} />
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
                            <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-4">
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
                                            className="text-[11px] bg-gray-100 text-gray-700 px-2.5 py-1.5 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors border border-gray-200"
                                        >
                                            {question}
                                        </button>
                                    ))}
                                </div>
                                <form onSubmit={handleChatSubmit} className="flex items-center gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Ask AI about this paper</span>
                                    </div>

                                    <div className="flex-1 flex gap-3">
                                        <input
                                            type="text"
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            placeholder="What would you like to know about this research?"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!chatInput.trim()}
                                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
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
                        <div className="mx-auto w-full max-w-2xl md:max-w-3xl bg-white/70 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-4">
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
                                        className="text-[11px] bg-gray-100 text-gray-700 px-2.5 py-1.5 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors border border-gray-200"
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                            <form onSubmit={handleChatSubmit} className="flex items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">Ask AI about this paper</span>
                                </div>

                                <div className="flex-1 flex gap-3">
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        placeholder="What would you like to know about this research?"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!chatInput.trim()}
                                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
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