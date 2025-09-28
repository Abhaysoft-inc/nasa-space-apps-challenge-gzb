"use client"

import React from "react"

export default function NextRecommendations({ items = [] }) {
  return (
    <div className="bg-neutral-900 rounded-2xl shadow-sm border border-neutral-800 p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-white">Personalized Recommendations</h2>
        <span className="text-xs text-gray-400">Based on your interests</span>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {items.map((it) => (
          <div key={it.id} className="rounded-xl border border-neutral-800 p-4 hover:shadow-sm transition bg-neutral-900">
            <p className="text-sm font-semibold text-white mb-1">{it.title}</p>
            <p className="text-xs text-gray-400 mb-2">{it.authors}</p>
            <div className="flex items-center gap-2 flex-wrap">
              {it.tags?.map((t) => (
                <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-800 text-gray-200">{t}</span>
              ))}
            </div>
            {it.reason && <p className="text-[11px] text-gray-400 mt-2">{it.reason}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
