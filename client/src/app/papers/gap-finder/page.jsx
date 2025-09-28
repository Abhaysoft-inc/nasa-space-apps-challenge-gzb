"use client"
import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function GapFinderContent() {
  const params = useSearchParams()
  const title = params.get('title')
  const doi = params.get('doi')

  // Hard-coded recommendations for now
  const gaps = [
    {
      id: 1,
      topic: "Long-term Cardiovascular Adaptations in Microgravity",
      discipline: "Cardiovascular Medicine",
      year: 2023,
      gapStatement: "Limited understanding of cardiovascular remodeling during missions exceeding 12 months, particularly regarding left ventricular mass changes and arterial stiffening patterns.",
      citation: "Current studies focus primarily on 6-month ISS missions, leaving a significant knowledge gap for Mars-class mission durations.",
      tags: ["microgravity", "cardiovascular", "long-duration", "Mars missions"],
      confidence: 85,
      relevance: 92,
      priority: "high"
    },
    {
      id: 2,
      topic: "Behavioral Health Interventions in Isolation",
      discipline: "Psychology",
      year: 2023,
      gapStatement: "Insufficient research on the efficacy of real-time psychological interventions during prolonged isolation periods in space analogue environments.",
      citation: "Most behavioral health research relies on post-mission debriefings rather than intervention effectiveness during active isolation.",
      tags: ["behavioral health", "isolation", "interventions", "crew psychology"],
      confidence: 78,
      relevance: 88,
      priority: "high"
    },
    {
      id: 3,
      topic: "Radiation Exposure and Cognitive Performance",
      discipline: "Neuroscience",
      year: 2022,
      gapStatement: "Limited data on the relationship between galactic cosmic radiation exposure and executive function degradation in astronauts.",
      citation: "Current radiation research focuses primarily on cancer risk, with minimal attention to cognitive impacts during mission-critical tasks.",
      tags: ["radiation", "cognition", "GCR", "neuroscience"],
      confidence: 72,
      relevance: 85,
      priority: "medium"
    }
  ]

  // Topic categories for visualization
  const topicCategories = [
    {
      name: "Cardiovascular",
      subcategories: ["Heart Function", "Blood Pressure", "Vascular Health", "Exercise Response"]
    },
    {
      name: "Musculoskeletal",
      subcategories: ["Bone Density", "Muscle Mass", "Joint Health", "Recovery"]
    },
    {
      name: "Neuroscience",
      subcategories: ["Cognition", "Motor Control", "Radiation Effects", "Brain Structure"]
    },
    {
      name: "Behavioral Health",
      subcategories: ["Isolation", "Team Dynamics", "Stress Response", "Interventions"]
    }
  ]

  // Filter the research gaps
  const filteredGaps = useMemo(() => {
    return researchGaps.filter(gap => {
      if (selectedFilters.discipline !== 'all' && gap.discipline !== selectedFilters.discipline) return false
      if (selectedFilters.year !== 'all' && gap.year.toString() !== selectedFilters.year) return false
      if (selectedFilters.confidence !== 'all') {
        if (selectedFilters.confidence === 'high' && gap.confidence < 80) return false
        if (selectedFilters.confidence === 'medium' && (gap.confidence < 60 || gap.confidence >= 80)) return false
        if (selectedFilters.confidence === 'low' && gap.confidence >= 60) return false
      }
      if (selectedFilters.relevance !== 'all') {
        if (selectedFilters.relevance === 'high' && gap.relevance < 80) return false
        if (selectedFilters.relevance === 'medium' && (gap.relevance < 60 || gap.relevance >= 80)) return false
        if (selectedFilters.relevance === 'low' && gap.relevance >= 60) return false
      }
      return true
    })
  }, [selectedFilters])

  // Get unique disciplines and years
  const uniqueDisciplines = [...new Set(researchGaps.map(gap => gap.discipline))]
  const uniqueYears = [...new Set(researchGaps.map(gap => gap.year))].sort((a, b) => b - a)

  // Helper functions for styling
  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'bg-green-500'
    if (confidence >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getRelevanceColor = (relevance) => {
    if (relevance >= 80) return 'bg-blue-500'
    if (relevance >= 60) return 'bg-indigo-500'
    return 'bg-purple-500'
  }

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FunnelIcon className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Research Gap Finder</h1>
                <p className="text-sm text-gray-600">Identifying opportunities in space medicine research</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-gray-100 rounded-lg p-1 flex">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'cards'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <RectangleStackIcon className="h-4 w-4 inline mr-2" />
                  Cards
                </button>
                <button
                  onClick={() => setViewMode('visualization')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'visualization'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <ViewColumnsIcon className="h-4 w-4 inline mr-2" />
                  Visualization
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Filters */}
        <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${sidebarCollapsed ? 'w-0 overflow-hidden' : 'w-80'
          }`}>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>

            {/* Basic Filters */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discipline</label>
                <select
                  value={selectedFilters.discipline}
                  onChange={(e) => setSelectedFilters({ ...selectedFilters, discipline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Disciplines</option>
                  {uniqueDisciplines.map(discipline => (
                    <option key={discipline} value={discipline}>{discipline}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <select
                  value={selectedFilters.year}
                  onChange={(e) => setSelectedFilters({ ...selectedFilters, year: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Years</option>
                  {uniqueYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Advanced Filters Toggle */}
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Advanced Filters
                {showAdvancedFilters ? (
                  <ChevronUpIcon className="h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4" />
                )}
              </button>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Relevance Score</label>
                    <select
                      value={selectedFilters.relevance}
                      onChange={(e) => setSelectedFilters({ ...selectedFilters, relevance: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Levels</option>
                      <option value="high">High (80%+)</option>
                      <option value="medium">Medium (60-79%)</option>
                      <option value="low">Low (&lt;60%)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confidence Level</label>
                    <select
                      value={selectedFilters.confidence}
                      onChange={(e) => setSelectedFilters({ ...selectedFilters, confidence: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Levels</option>
                      <option value="high">High (80%+)</option>
                      <option value="medium">Medium (60-79%)</option>
                      <option value="low">Low (&lt;60%)</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Results Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Research Gaps Identified</h2>
                <p className="text-gray-600 mt-1">
                  Found {filteredGaps.length} potential research opportunities
                </p>
              </div>
            </div>
          </div>

          {/* Content Views */}
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGaps.map((gap) => (
                <div key={gap.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{gap.topic}</h3>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {gap.discipline}
                      </span>
                      <span className="text-xs text-gray-500">{gap.year}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                    {gap.gapStatement}
                  </p>

                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-600 italic">
                      "{gap.citation}"
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {gap.tags.map((tag, index) => (
                      <span key={index} className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">Confidence</span>
                        <span className="text-xs text-gray-600">{gap.confidence}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getConfidenceColor(gap.confidence)}`}
                          style={{ width: `${gap.confidence}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">Relevance</span>
                        <span className="text-xs text-gray-600">{gap.relevance}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getRelevanceColor(gap.relevance)}`}
                          style={{ width: `${gap.relevance}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Research Gap Heatmap</h3>
                <p className="text-gray-600 text-sm">Visual representation of under-researched areas across disciplines</p>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-8">
                {topicCategories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900">{category.name}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {category.subcategories.map((sub, subIndex) => {
                        const intensity = Math.random() * 100
                        const getHeatmapColor = (intensity) => {
                          if (intensity > 75) return 'bg-red-500'
                          if (intensity > 50) return 'bg-yellow-500'
                          if (intensity > 25) return 'bg-blue-400'
                          return 'bg-green-400'
                        }

                        return (
                          <div
                            key={subIndex}
                            className={`h-12 rounded-lg ${getHeatmapColor(intensity)} opacity-80 flex items-center justify-center cursor-pointer hover:opacity-100 transition-opacity`}
                            title={`${sub}: ${Math.round(intensity)}% gap intensity`}
                          >
                            <span className="text-white text-xs font-medium text-center px-1">
                              {sub.split(' ')[0]}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-400 rounded mr-2"></div>
                  <span className="text-gray-600">Well Researched</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-400 rounded mr-2"></div>
                  <span className="text-gray-600">Moderate Gap</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                  <span className="text-gray-600">Significant Gap</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                  <span className="text-gray-600">Critical Gap</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function GapFinderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Gap Finder...</p>
      </div>
    </div>}>
      <GapFinderContent />
    </Suspense>
  )
}
