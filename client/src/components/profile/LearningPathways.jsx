"use client"

import React from "react"

/**
 * LearningPathways
 * Renders a linear (but supports branching later) pathway of modules with prerequisite locks.
 * Props:
 * - stages: [{ id, title, blurb, progress:0..1, requires:[ids] }]
 * - completedIds: string[]
 * - onSelect: (stageId)=>void
 */
export default function LearningPathways({ stages = [], completedIds = [], onSelect = () => {} }) {
  const isUnlocked = (stage) => (stage.requires || []).every((r) => completedIds.includes(r))

  return (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Learning Pathways</h2>
        <p className="text-xs text-gray-500">Prerequisites gate advanced topics</p>
      </div>

      <div className="relative">
        {/* connector line - send behind cards */}
        <div className="absolute left-6 right-6 top-8 h-0.5 bg-gray-200 -z-10" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-0">
          {stages.map((s, idx) => {
            const unlocked = isUnlocked(s)
            const done = completedIds.includes(s.id)
            return (
              <button
                key={s.id}
                onClick={() => unlocked && onSelect(s.id)}
                className={`text-left rounded-xl border p-4 transition focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
                  unlocked ? 'bg-white hover:shadow-md border-gray-200' : 'bg-gray-50 border-dashed border-gray-200 opacity-70 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                    done ? 'bg-emerald-500' : unlocked ? 'bg-indigo-500' : 'bg-gray-400'
                  }`}>
                    {done ? '✓' : idx + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{s.title}</p>
                    <p className="text-xs text-gray-500">{s.blurb}</p>
                  </div>
                </div>

                {/* progress bar */}
                <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${done ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${Math.min(100, Math.round((s.progress || 0) * 100))}%` }} />
                </div>

                {!unlocked && (
                  <p className="mt-2 text-[11px] text-gray-500">Locked • complete prerequisites first</p>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
