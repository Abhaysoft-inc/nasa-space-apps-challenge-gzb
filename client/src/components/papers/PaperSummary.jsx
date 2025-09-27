import React from 'react'

const PaperSummary = ({ paperData }) => {
    return (
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
    )
}

export default PaperSummary