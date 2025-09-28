import React from 'react'
import GamesCenter from '../../components/games/GamesCenter'

export const metadata = {
  title: 'Knowledge Assessment Games • Biolore',
  description: 'Interactive quizzes and challenges to deepen understanding of space biology research.',
}

export default function GamesPage(){
  return (
    <div className="min-h-screen bg-neutral-900">
      <GamesCenter />
    </div>
  )
}
