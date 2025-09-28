"use client"
import React from 'react'
import { useSearchParams } from 'next/navigation'

export default function GapFinderPage() {
  const params = useSearchParams()
  const title = params.get('title')
  const doi = params.get('doi')

  // Hard-coded recommendations for now
  const gaps = [
    {
      heading: 'Underreported Longitudinal Effects',
      detail: 'Few studies track biomarkers beyond 6 months post-mission. A longitudinal follow-up with quarterly sampling for 2 years would help quantify recovery trajectories.'
    },
    {
      heading: 'Control Cohorts in Analog Environments',
      detail: 'Comparative cohorts in Antarctic overwinter missions and HERA analogs could disambiguate isolation vs. microgravity effects.'
    },
    {
      heading: 'Multi-omics Integration',
      detail: 'Integrate transcriptomics, proteomics, metabolomics with in-flight radiation dosimetry to identify convergent pathways.'
    }
  ]

  const suggestedStudies = [
    {
      title: 'Integrated Omics for Spaceflight Health',
      why: 'Demonstrates pipelines for multi-omics in constrained environments.',
      link: '#'
    },
    {
      title: 'Antarctic Analog Physiology Cohort',
      why: 'Useful template for year-long isolation studies with frequent sampling.',
      link: '#'
    },
    {
      title: 'In-flight Radiation Dose Cohort Synthesis',
      why: 'Aggregates dosimetry with health outcomes across missions.',
      link: '#'
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Gap Finder</h1>
          {(title || doi) && (
            <p className="text-sm text-gray-400 mt-1">
              Context: {title ? `“${title}”` : ''}{title && doi ? ' • ' : ''}{doi ? `DOI: ${doi}` : ''}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-4">
              <h2 className="text-lg font-semibold text-white mb-2">Potential Research Gaps</h2>
              <ul className="space-y-3">
                {gaps.map((g, i) => (
                  <li key={i} className="p-3 rounded-lg border border-neutral-800 bg-neutral-900">
                    <div className="text-gray-100 font-medium">{g.heading}</div>
                    <div className="text-sm text-gray-300">{g.detail}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-4">
              <h2 className="text-lg font-semibold text-white mb-2">Recommended Study Designs</h2>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-3">
                  <div className="font-medium text-gray-100">Prospective Multi-center Cohort</div>
                  <div>ISS and cislunar missions with pre-, in-, and post-flight sampling; include matched ground controls.</div>
                </div>
                <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-3">
                  <div className="font-medium text-gray-100">Randomized Countermeasure Trial</div>
                  <div>Compare exercise, nutritional, and pharmacological countermeasures with harmonized endpoints.</div>
                </div>
                <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-3">
                  <div className="font-medium text-gray-100">Analog Environment Cross-over</div>
                  <div>Antarctic/HERA crews with cross-over protocols to isolate isolation vs. microgravity proxies.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-4">
              <h2 className="text-lg font-semibold text-white mb-2">Suggested Papers to Approach</h2>
              <ul className="space-y-3">
                {suggestedStudies.map((s, i) => (
                  <li key={i} className="flex items-start justify-between gap-3 p-3 rounded-lg border border-neutral-800 bg-neutral-900">
                    <div>
                      <div className="font-medium text-gray-100">{s.title}</div>
                      <div className="text-xs text-gray-400">{s.why}</div>
                    </div>
                    <a className="text-sm text-sky-400 hover:underline" href={s.link} target="_blank" rel="noopener noreferrer">Open</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-4">
              <h2 className="text-lg font-semibold text-white mb-2">Next Steps</h2>
              <ol className="list-decimal list-inside text-sm text-gray-300 space-y-1">
                <li>Refine endpoints and align with NASA Human Research Roadmap.</li>
                <li>Pre-register protocols and define data harmonization plan.</li>
                <li>Establish data sharing via NASA Open Science policy.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
