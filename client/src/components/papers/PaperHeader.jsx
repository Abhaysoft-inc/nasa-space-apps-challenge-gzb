import React from 'react'

const PaperHeader = ({ paperData }) => {
    return (
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
    )
}

export default PaperHeader