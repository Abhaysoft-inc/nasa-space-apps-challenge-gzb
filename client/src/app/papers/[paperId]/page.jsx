'use client'
import React, { useState } from 'react'
import PaperHeader from '../../../components/papers/PaperHeader'
import PaperSummary from '../../../components/papers/PaperSummary'
import PaperContent from '../../../components/papers/PaperContent'
import RelatedPapers from '../../../components/papers/RelatedPapers'
import AIAssistantPreview from '../../../components/papers/AIAssistantPreview'
import PaperActions from '../../../components/papers/PaperActions'
import ChatModal from '../../../components/papers/ChatModal'
import FloatingChatButton from '../../../components/papers/FloatingChatButton'

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
                        <PaperHeader paperData={paperData} />
                        <PaperSummary paperData={paperData} />
                        <PaperContent />
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        <RelatedPapers relatedPapers={relatedPapers} />
                        <AIAssistantPreview setIsChatOpen={setIsChatOpen} />
                        <PaperActions />
                    </div>
                </div>
            </div>

            <ChatModal
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                chatMessages={chatMessages}
                chatInput={chatInput}
                setChatInput={setChatInput}
                handleChatSubmit={handleChatSubmit}
            />

            {!isChatOpen && (
                <FloatingChatButton
                    onClick={() => setIsChatOpen(true)}
                />
            )}
        </div>
    )
}

export default PapersPage