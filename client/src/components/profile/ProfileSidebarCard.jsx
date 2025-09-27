import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function ProfileSidebarCard({ user }) {
    const data = user || {
        name: 'Alex Johnson',
        username: 'alexj',
        avatar: null,
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3 mb-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-semibold">
                    {data.avatar ? (
                        <Image src={data.avatar} alt={data.name} fill sizes="48px" className="object-cover" />
                    ) : (
                        <span>{initials}</span>
                    )}
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-900">{data.name}</p>
                    <p className="text-xs text-gray-500">@{data.username}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
                <Chip label="Ranking" value={`Top ${data.rankingPercentile}%`} />
                <Chip label="Streak" value={`${data.streakDays}d`} />
            </div>

            <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-gray-600">Weekly</p>
                    <p className="text-[11px] text-gray-500">{data.thisWeek}/{data.weeklyGoal}</p>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600" style={{ width: `${weeklyPct}%` }} />
                </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Total Read: <b className="text-gray-900">{data.totalRead}</b></span>
                <span>Badges: <b className="text-gray-900">{data.badges}</b></span>
            </div>

            <Link href="/user/profile" className="mt-3 inline-flex items-center justify-center w-full text-sm font-medium text-blue-700 hover:text-blue-800">
                View full profile
            </Link>
        </div>
    )
}

function Chip({ label, value }) {
    return (
        <div className="rounded-xl border border-gray-100 bg-gray-50/60 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-gray-500">{label}</p>
            <p className="text-sm font-semibold text-gray-900">{value}</p>
        </div>
    )
}
