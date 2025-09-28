"use client"

import React, { useMemo, useState } from "react"

export default function KnowledgeGames({ seed = 1, onScore = () => {} }) {
  const [quizIdx, setQuizIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])

  const quiz = useMemo(() => makeQuiz(seed), [seed])

  const select = (i) => {
    if (answers[quizIdx] != null) return
    const correct = quiz[quizIdx].correct === i
    const nextScore = score + (correct ? 1 : 0)
    setScore(nextScore)
    setAnswers((a) => { const b=[...a]; b[quizIdx]=i; return b })
    if (quizIdx < quiz.length - 1) setTimeout(()=> setQuizIdx(quizIdx+1), 300)
    else onScore(nextScore)
  }

  const q = quiz[quizIdx]

  return (
    <div className="bg-neutral-900 rounded-2xl shadow-sm border border-neutral-800 p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-white">Knowledge Assessment Games</h2>
        <span className="text-xs text-gray-400">Score: {score}/{quiz.length}</span>
      </div>

      {/* Quick Quizzes */}
      <div className="rounded-xl border border-neutral-800 p-4 mb-4 bg-neutral-900">
        <p className="text-sm font-semibold text-white mb-1">Quick Quiz</p>
        <p className="text-xs text-gray-400 mb-3">{q.prompt}</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => select(i)}
              className={`text-left rounded-lg border px-3 py-2 text-sm ${
                answers[quizIdx] == null
                  ? 'border-neutral-800 hover:border-neutral-700 text-gray-200'
                  : i === q.correct
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200'
                    : answers[quizIdx] === i
                      ? 'border-rose-500 bg-rose-950/40 text-rose-200'
                      : 'border-neutral-800 opacity-60 text-gray-400'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-gray-400 mt-2">Question {quizIdx+1} of {quiz.length}</p>
      </div>

      {/* Research Prediction */}
      <div className="rounded-xl border border-neutral-800 p-4 mb-4 bg-neutral-900">
        <p className="text-sm font-semibold text-white mb-1">Research Prediction</p>
        <p className="text-xs text-gray-400 mb-3">Predict the outcome: "Plant growth in microgravity will be (a) slowed, (b) unchanged, (c) accelerated"</p>
        <div className="flex items-center gap-2">
          {['Slowed','Unchanged','Accelerated'].map((t)=> (
            <span key={t} className="text-[11px] px-2 py-1 rounded-full bg-neutral-800 text-gray-200 cursor-default">{t}</span>
          ))}
        </div>
      </div>

      {/* Timeline Challenge */}
      <div className="rounded-xl border border-neutral-800 p-4 mb-4 bg-neutral-900">
        <p className="text-sm font-semibold text-white mb-1">Timeline Challenge</p>
        <p className="text-xs text-gray-400 mb-3">Order the milestones: ISS (1998), CRISPR (2012), Perseverance (2021)</p>
        <div className="text-[11px] text-gray-400">(Drag & drop coming soon)</div>
      </div>

      {/* Impact Estimation */}
      <div className="rounded-xl border border-neutral-800 p-4 bg-neutral-900">
        <p className="text-sm font-semibold text-white mb-1">Impact Estimation</p>
        <p className="text-xs text-gray-400">Which study will most influence future missions? Choose based on citations and novelty.</p>
        <div className="mt-2 grid sm:grid-cols-3 gap-2 text-sm">
          {['Bone Density in Microgravity','Plant Photosynthesis in Space','Radiation Shielding Strategies'].map((t)=> (
            <div key={t} className="rounded-lg border border-neutral-800 p-2 text-gray-200">{t}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

function makeQuiz(seed=1){
  const bank = [
    { prompt: 'Which system is most affected by long-duration microgravity?', options: ['Skeletal','Digestive','Integumentary','Endocrine'], correct:0 },
    { prompt: 'Which radiation is a major risk for interplanetary travel?', options: ['UV-A','Gamma Rays','Cosmic Rays','X-Rays'], correct:2 },
    { prompt: 'Plants in space require what support for root orientation?', options: ['Phototropism','Gravitropism','Chemotaxis','Hydrotaxis'], correct:1 },
    { prompt: 'Which platform hosts many life science experiments?', options: ['Hubble','ISS','JWST','Voyager 1'], correct:1 },
    { prompt: 'What countermeasure helps reduce muscle atrophy?', options: ['Sleep','Diet alone','Resistance Exercise','Cold exposure'], correct:2 },
  ]
  // rotate by seed
  const rot = seed % bank.length
  return [...bank.slice(rot), ...bank.slice(0,rot)]
}
