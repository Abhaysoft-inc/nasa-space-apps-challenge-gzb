import React from 'react'

const RelatedPapers = ({ relatedPapers }) => {
    return (
        <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Related Papers</h3>
            <div className="space-y-3">
                {relatedPapers.map((paper, index) => (
                    <div key={index} className="border-b border-neutral-800 last:border-b-0 pb-3 last:pb-0">
                        <h4 className="font-medium text-gray-100 text-xs mb-1 hover:text-sky-400 cursor-pointer leading-tight">
                            {paper.title}
                        </h4>
                        <p className="text-gray-400 text-xs mb-1">
                            {paper.authors}
                        </p>
                        <p className="text-gray-500 text-xs">
                            {paper.source} • {paper.year}
                        </p>
                    </div>
                ))}
            </div>
            <button className="w-full mt-3 bg-neutral-800 border border-neutral-700 text-gray-100 py-2 px-3 rounded-md hover:bg-neutral-700 transition-colors text-xs">
                View More Related Papers
            </button>
        </div>
    )
}

export default RelatedPapers