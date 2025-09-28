import React, { Suspense } from 'react'
import GamesCenter from '../../components/games/GamesCenter'

export const metadata = {
  title: 'Knowledge Assessment Games • Biolore',
  description: 'Interactive quizzes and challenges to deepen understanding of space biology research.',
}

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading Games...</p>
            </div>
          </div>
        }>
          <GamesCenter />
        </Suspense>
      </div>
    </div>
  )
}
