import React from 'react'
import GamesCenter from '../../components/games/GamesCenter'

export const metadata = {
  title: 'Knowledge Assessment Games • Biolore',
  description: 'Interactive quizzes and challenges to deepen understanding of space biology research.',
}

export default function GamesPage(){
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <GamesCenter />
      </div>
    </div>
  )
}
