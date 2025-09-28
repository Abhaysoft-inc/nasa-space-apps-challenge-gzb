"use client"

import React from "react"

/**
 * ProgressOrbitMap
 * A simple SVG that draws a wavy trajectory through topic nodes.
 * Props: nodes: [{id,label,completed:boolean}], progress:0..1
 */
export default function ProgressOrbitMap({ nodes = [], progress = 0 }) {
  const w = 600, h = 160
  const pad = 24
  const step = (w - pad * 2) / Math.max(1, nodes.length - 1)
  const points = nodes.map((n, i) => ({ x: pad + step * i, y: 40 + (i % 2 ? 60 : 0) }))

  const path = points.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `S ${p.x - step / 2},${(points[i - 1]?.y || p.y)} ${p.x},${p.y}`)).join(' ')

  const progressX = pad + (w - pad * 2) * progress

  return (
    <div className="bg-neutral-900 rounded-2xl shadow-sm border border-neutral-800 p-5">
      <h2 className="text-lg font-semibold text-white mb-3">Visual Progress Map</h2>
      <div className="overflow-x-auto">
        <svg width={w} height={h} className="min-w-[600px]">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <path d={path} fill="none" stroke="#1f2937" strokeWidth="2" />
          <clipPath id="clip">
            <rect x="0" y="0" width={progressX} height={h} />
          </clipPath>
          <path d={path} fill="none" stroke="url(#grad)" strokeWidth="3" clipPath="url(#clip)" />

          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={10} fill={nodes[i]?.completed ? '#10b981' : '#9ca3af'} />
              <text x={p.x} y={p.y + 26} textAnchor="middle" className="fill-gray-300" fontSize="10">
                {nodes[i]?.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}
