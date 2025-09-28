import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function ProfileSidebarCard({ user }) {
    const data = user || {
        name: 'Alex Johnson',
        username: 'alexj',
        avatar: '/5209083.png',
        rankingPercentile: 12,
        streakDays: 6,
        totalRead: 27,
        weeklyGoal: 5,
        thisWeek: 3,
        badges: 3,
    }

    const initials = (data.name || 'U N')
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')

    const weeklyPct = Math.min(100, Math.round((data.thisWeek / Math.max(1, data.weeklyGoal)) * 100))

    return (
        <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-4">
            <div className="flex items-center gap-3 mb-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br  text-white flex items-center justify-center font-semibold">
                    {data.avatar ? (
                        <Image src={data.avatar} alt={data.name} fill sizes="48px" className="object-contain" />
                    ) : (
                        <span>{initials}</span>
                    )}
                </div>
                <div>
                    <p className="text-sm font-semibold text-white">{data.name}</p>
                    <p className="text-xs text-gray-400">@{data.username}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
                <Chip label="Ranking" value={`Top ${data.rankingPercentile}%`} />
                <Chip label="Streak" value={`${data.streakDays}d`} />
            </div>

            <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-gray-400">Weekly</p>
                    <p className="text-[11px] text-gray-500">{data.thisWeek}/{data.weeklyGoal}</p>
                </div>
                <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-gray-700 to-gray-500" style={{ width: `${weeklyPct}%` }} />
                </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Total Read: <b className="text-gray-100">{data.totalRead}</b></span>
                <span>Badges: <b className="text-gray-100">{data.badges}</b></span>
            </div>

            <Link href="/user/profile" className="mt-3 inline-flex items-center justify-center w-full text-sm font-medium text-sky-400 hover:text-sky-300">
                View full profile
            </Link>
        </div>
    )
}

function Chip({ label, value }) {
    return (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-gray-400">{label}</p>
            <p className="text-sm font-semibold text-white">{value}</p>
        </div>
    )
}
