"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"

/**
 * Responsive contribution heatmap that fills available width with fixed-size cells.
 * Props:
 * - data: number[] length >= maxWeeks*7, values 0..4
 * - cellSize: px size of each square (default 12)
 * - gap: px gap between cells (default 4)
 * - maxWeeks: maximum weeks to render (default 52)
 * - minWeeks: minimum weeks to render (default 14)
 */
export default function ContributionHeatmap({
    data,
    cellSize = 12,
    gap = 4,
    maxWeeks = 52,
    minWeeks = 14,
}) {
    const containerRef = useRef(null)
    const [cols, setCols] = useState(minWeeks)

    useEffect(() => {
        if (!containerRef.current) return
        const el = containerRef.current

        const compute = () => {
            const width = el.clientWidth || 0
            // each column is a cellSize wide; there are 6 vertical gaps per column (rows have gap, columns have gap per column as well)
            // horizontal capacity: available width for N columns with (N-1) gaps between
            const colWithGap = cellSize + gap
            const possible = Math.floor((width + gap) / colWithGap)
            const next = Math.max(minWeeks, Math.min(maxWeeks, possible))
            setCols(next)
        }

        compute()
        const ro = new ResizeObserver(() => compute())
        ro.observe(el)
        return () => ro.disconnect()
    }, [cellSize, gap, maxWeeks, minWeeks])

    const cells = useMemo(() => {
        const len = cols * 7
        if (!Array.isArray(data) || data.length < len) return Array.from({ length: len }, (_, i) => data?.[i] ?? 0)
        return data.slice(0, len)
    }, [data, cols])

    const levels = [
        "bg-gray-100",
        "bg-green-100",
        "bg-green-200",
        "bg-green-400",
        "bg-green-600",
    ]

    return (
        <div ref={containerRef}>
            <div
                className="grid"
                style={{
                    gridTemplateColumns: `repeat(${cols}, auto)`,
                    columnGap: `${gap}px`,
                }}
            >
                {Array.from({ length: cols }).map((_, w) => (
                    <div
                        key={w}
                        className="grid"
                        style={{ gridTemplateRows: `repeat(7, ${cellSize}px)`, rowGap: `${gap}px` }}
                    >
                        {Array.from({ length: 7 }).map((_, d) => {
                            const v = cells[w * 7 + d] || 0
                            return (
                                <div
                                    key={d}
                                    title={`${v} reads`}
                                    className={`rounded ${levels[v]}`}
                                    style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                                />
                            )
                        })}
                    </div>
                ))}
            </div>
            <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-500">
                <span>Less</span>
                <span className="w-3 h-3 rounded bg-gray-100" />
                <span className="w-3 h-3 rounded bg-green-100" />
                <span className="w-3 h-3 rounded bg-green-200" />
                <span className="w-3 h-3 rounded bg-green-400" />
                <span className="w-3 h-3 rounded bg-green-600" />
                <span>More</span>
            </div>
        </div>
    )
}
