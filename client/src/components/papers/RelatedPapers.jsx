import React from 'react'

const RelatedPapers = ({ relatedPapers }) => {
    return (
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
    )
}

export default RelatedPapers