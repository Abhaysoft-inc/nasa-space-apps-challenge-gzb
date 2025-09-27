"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

const PaperHeader = ({ paperData }) => {
    const doiUrl = paperData?.doi
        ? (paperData.doi.startsWith('http') ? paperData.doi : `https://doi.org/${paperData.doi}`)
        : null
    const pmcUrl = paperData?.pmcid ? `https://www.ncbi.nlm.nih.gov/pmc/articles/${paperData.pmcid}` : null
    const originalUrl = doiUrl || pmcUrl || '#'
    const pdfUrl = paperData?.pdfUrl || (paperData?.pmcid ? `https://www.ncbi.nlm.nih.gov/pmc/articles/${paperData.pmcid}/pdf` : null)

    // Favorites (stored in localStorage)
    const key = paperData?.doi || paperData?.pmcid || paperData?.title
    const [favorite, setFavorite] = useState(false)
    // Compare (no toggle, navigate to compare page with this as primary)

    useEffect(() => {
        try {
            const raw = localStorage.getItem('favorites')
            if (!raw) return
            const set = new Set(JSON.parse(raw))
            setFavorite(set.has(key))
        } catch { }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key])

    const toggleFavorite = () => {
        try {
            const raw = localStorage.getItem('favorites')
            const arr = raw ? JSON.parse(raw) : []
            const set = new Set(arr)
            if (set.has(key)) {
                set.delete(key)
                setFavorite(false)
            } else {
                set.add(key)
                setFavorite(true)
            }
            localStorage.setItem('favorites', JSON.stringify(Array.from(set)))
        } catch { }
    }

    const goToCompare = () => {
        try {
            const item = buildCompareItem()
            localStorage.setItem('comparePrimary', JSON.stringify(item))
            document.body.classList.add('fade-out')
        } catch { }
        // Navigate
        window.location.href = '/papers/compare'
    }

    const buildCompareItem = () => ({
        key,
        title: paperData.title,
        source: paperData.source,
        year: paperData.date,
        citations: paperData.citations,
        doi: paperData.doi,
        pmcid: paperData.pmcid,
        url: originalUrl,
        ts: Date.now(),
    })

    const handleCopyCitation = async () => {
        const authors = Array.isArray(paperData.authors) ? paperData.authors.join(', ') : paperData.authors
        const citation = `${authors}. (${paperData.date}). ${paperData.title}. ${paperData.source}. ${doiUrl ?? ''}`.trim()
        try {
            await navigator.clipboard.writeText(citation)
        } catch (e) {
            // no-op
        }
    }

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({ title: paperData.title, text: 'Research paper', url: originalUrl })
            } else {
                await navigator.clipboard.writeText(originalUrl)
            }
        } catch (e) {
            // no-op
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {paperData.title}
            </h1>
            {/* Authors - One Line under title */}
            <p className="text-sm text-gray-600 mb-4 whitespace-nowrap overflow-hidden text-ellipsis">
                <span className="font-medium">By:</span> {paperData.authors.join(', ')}
            </p>

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

            {/* Actions below metadata */}
            <div className="flex items-center gap-2 flex-wrap">
                <button
                    type="button"
                    onClick={goToCompare}
                    title={'Compare this paper'}
                    className={`inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-indigo-300 bg-indigo-50 text-indigo-800 hover:bg-indigo-100`}
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 3h6v18H3zM15 9h6v12h-6z" />
                    </svg>
                    Compare
                </button>

                <button
                    type="button"
                    onClick={toggleFavorite}
                    title={favorite ? 'Remove from favorites' : 'Save to favorites'}
                    className={`inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border  ${favorite ? 'border-amber-300 bg-amber-50 text-amber-800' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                    {favorite ? (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.09 4.81 13.76 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                    ) : (
                        <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61A5.5 5.5 0 0 0 12 8.28a5.5 5.5 0 0 0-8.84-3.67C.64 6.5 1.31 10.28 6.55 15.05L12 20l5.45-4.95c5.24-4.77 5.91-8.55 3.39-10.44z" /></svg>
                    )}
                    {favorite ? 'Saved' : 'Favorite'}
                </button>
                <button
                    type="button"
                    onClick={handleCopyCitation}
                    title="Copy citation"
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
                >
                    <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Cite
                </button>
                <button
                    type="button"
                    onClick={handleShare}
                    title="Share"
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
                >
                    <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49" />
                    </svg>
                    Share
                </button>
                {pdfUrl ? (
                    <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Download PDF"
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
                    >
                        <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v14M5 12l7 7 7-7" />
                        </svg>
                        PDF
                    </a>
                ) : (
                    <button
                        type="button"
                        disabled
                        title="PDF not available"
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v14M5 12l7 7 7-7" />
                        </svg>
                        PDF
                    </button>
                )}
                {originalUrl && originalUrl !== '#' && (
                    <a
                        href={originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open original paper"
                        className="ml-auto inline-flex items-center gap-2 px-4 py-2 text-sm rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-md"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M7 17l9-9M7 7h9v9" />
                        </svg>
                        Open Original
                    </a>
                )}
            </div>
        </div>
    )
}

export default PaperHeader