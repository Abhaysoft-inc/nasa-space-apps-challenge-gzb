import React from 'react'

const PaperSummary = ({ paperData }) => {
    return (
        <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Abstract</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
                {paperData.summary}
            </p>

            {/* Keywords */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-2">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                    {paperData.keywords.map((keyword, index) => (
                        <span key={index} className="bg-neutral-800 text-neutral-200 border border-neutral-700 px-3 py-1 rounded-full text-sm">
                            {keyword}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PaperSummary