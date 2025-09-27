'use client'
import React, { useState } from 'react'

const PapersPage = () => {
    const [chatInput, setChatInput] = useState('')
    const [chatMessages, setChatMessages] = useState([])
    const [isChatOpen, setIsChatOpen] = useState(false)

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
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Paper Title */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                {paperData.title}
                            </h1>

                            {/* Paper Metadata */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                <div className="group relative bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-all duration-200 cursor-pointer">
                                    <span className="text-xs text-blue-800 font-medium">
                                        Source: {paperData.source}
                                    </span>
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                        Published in {paperData.source}
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                    </div>
                                </div>

                                <div className="group relative bg-green-50 hover:bg-green-100 px-3 py-1 rounded-full transition-all duration-200 cursor-pointer">
                                    <span className="text-xs text-green-800 font-medium">
                                        {paperData.citations} Citations
                                    </span>
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                        Cited {paperData.citations} times by other papers
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                    </div>
                                </div>

                                <div className="group relative bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-full transition-all duration-200 cursor-pointer">
                                    <span className="text-xs text-purple-800 font-medium">
                                        {paperData.date}
                                    </span>
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                        Publication date: {paperData.date}
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                    </div>
                                </div>

                                <div className="group relative bg-orange-50 hover:bg-orange-100 px-3 py-1 rounded-full transition-all duration-200 cursor-pointer">
                                    <span className="text-xs text-orange-800 font-medium">
                                        DOI: {paperData.doi.split('/').pop()}
                                    </span>
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 max-w-xs">
                                        Full DOI: {paperData.doi}
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                    </div>
                                </div>

                                <div className="group relative bg-gray-50 hover:bg-gray-100 px-3 py-1 rounded-full transition-all duration-200 cursor-pointer">
                                    <span className="text-xs text-gray-800 font-medium">
                                        PMC: {paperData.pmcid}
                                    </span>
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                        PubMed Central ID: {paperData.pmcid}
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Authors */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Authors</h3>
                                <div className="flex flex-wrap gap-2">
                                    {paperData.authors.map((author, index) => (
                                        <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                                            {author}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                <div>
                                    <span className="font-medium">PMC ID:</span> {paperData.pmcid}
                                </div>
                            </div>
                        </div>

                        {/* Summary Section */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Abstract</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                {paperData.summary}
                            </p>

                            {/* Keywords */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Keywords</h3>
                                <div className="flex flex-wrap gap-2">
                                    {paperData.keywords.map((keyword, index) => (
                                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Paper Content Section */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Full Paper Content</h2>
                            <div className="prose max-w-none">
                                <p className="text-gray-700 mb-4">
                                    The full paper content would be displayed here. This section could include:
                                </p>
                                <ul className="list-disc pl-6 text-gray-700 mb-4">
                                    <li>Introduction and background</li>
                                    <li>Methodology and experimental design</li>
                                    <li>Results and findings</li>
                                    <li>Discussion and implications</li>
                                    <li>Conclusions and future work</li>
                                </ul>
                                <p className="text-gray-700">
                                    In a real implementation, this would contain the complete research paper text,
                                    properly formatted with sections, subsections, figures, and tables.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        {/* Related Papers */}
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Papers</h3>
                            <div className="space-y-3">
                                {relatedPapers.map((paper, index) => (
                                    <div key={index} className="border-b border-gray-200 last:border-b-0 pb-3 last:pb-0">
                                        <h4 className="font-medium text-gray-900 text-xs mb-1 hover:text-blue-600 cursor-pointer leading-tight">
                                            {paper.title}
                                        </h4>
                                        <p className="text-gray-600 text-xs mb-1">
                                            {paper.authors}
                                        </p>
                                        <p className="text-gray-500 text-xs">
                                            {paper.source} • {paper.year}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-3 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors text-xs">
                                View More Related Papers
                            </button>
                        </div>

                        {/* AI Chat Preview */}
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg shadow-lg p-4 relative overflow-hidden cursor-pointer hover:shadow-xl transition-shadow" onClick={() => setIsChatOpen(true)}>
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full -mr-8 -mt-8 opacity-20"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-2">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Research Assistant</h3>
                                    </div>
                                    <span className="text-xs text-gray-500">Click to chat</span>
                                </div>
                                <p className="text-xs text-gray-600 mt-2">Get instant answers about this research paper</p>
                            </div>
                        </div>                        {/* Paper Actions */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Paper Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm">
                                    Download PDF
                                </button>
                                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                                    Save to Library
                                </button>
                                <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors text-sm">
                                    Export Citation
                                </button>
                                <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors text-sm">
                                    Share Paper
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Chat Modal */}
            {isChatOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setIsChatOpen(false)}>
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md h-[600px] flex flex-col" onClick={(e) => e.stopPropagation()}>
                        {/* Chat Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold">AI Research Assistant</h3>
                                    <p className="text-xs opacity-90">Ask about this paper</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsChatOpen(false)}
                                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                            {chatMessages.length === 0 ? (
                                <div className="text-center text-gray-500 mt-8">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm">Start a conversation!</p>
                                    <p className="text-xs mt-2">Ask me anything about this research paper</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {chatMessages.map((msg, index) => (
                                        <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.type === 'user'
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                                : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                                                }`}>
                                                <p className="text-sm">{msg.message}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Suggested Questions (only when no messages) */}
                        {chatMessages.length === 0 && (
                            <div className="px-4 py-2 bg-white border-t border-gray-200">
                                <p className="text-xs text-gray-600 mb-2">Try asking:</p>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        "Main findings?",
                                        "Methodology?",
                                        "Key results?",
                                        "Implications?"
                                    ].map((question, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setChatInput(question)
                                                document.getElementById('chat-input').focus()
                                            }}
                                            className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full hover:bg-blue-100 transition-colors"
                                        >
                                            {question}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Chat Input */}
                        <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
                            <form onSubmit={handleChatSubmit} className="flex gap-2">
                                <input
                                    id="chat-input"
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder="Ask a question about this paper..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={!chatInput.trim()}
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Chat Button (Alternative - shows when modal is closed) */}
            {!isChatOpen && (
                <button
                    onClick={() => setIsChatOpen(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-40 flex items-center justify-center"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">AI</span>
                    </div>
                </button>
            )}
        </div>
    )
}

export default PapersPage