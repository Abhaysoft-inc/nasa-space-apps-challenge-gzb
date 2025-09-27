import React from 'react'

const AIAssistantPreview = ({ setIsChatOpen }) => {
    return (
        <div
            className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg shadow-lg p-4 relative overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => setIsChatOpen(true)}
        >
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full -mr-8 -mt-8 opacity-20"></div>
            <div className="relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-2">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            AI Research Assistant
                        </h3>
                    </div>
                    <span className="text-xs text-gray-500">Click to chat</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">Get instant answers about this research paper</p>
            </div>
        </div>
    )
}

export default AIAssistantPreview