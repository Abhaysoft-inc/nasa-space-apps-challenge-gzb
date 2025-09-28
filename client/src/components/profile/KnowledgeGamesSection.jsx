"use client"

import React, { useMemo, useState } from "react"

export default function KnowledgeGamesSection({ seed = 1 }) {
  // aggregate progress
  const [quizScore, setQuizScore] = useState(null)
  const [predictionDone, setPredictionDone] = useState(false)
  const [timelineDone, setTimelineDone] = useState(null) // true/false
  const [impactDone, setImpactDone] = useState(false)

  const completed = [quizScore != null, predictionDone, timelineDone != null, impactDone].filter(Boolean).length
  const total = 4

  return (
    <section className="bg-neutral-900 rounded-2xl shadow-sm border border-neutral-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Knowledge Assessment Games</h2>
          <p className="text-xs text-gray-400">Sharpen understanding through quick, interactive challenges</p>
        </div>
        <div className="text-xs text-gray-400">
          <span className="inline-flex items-center gap-2">
            <ProgressDots count={total} done={completed} />
            <span>{completed}/{total} complete</span>
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <QuickQuizGame seed={seed} onComplete={setQuizScore} />
        <ResearchPredictionGame onComplete={() => setPredictionDone(true)} />
        <TimelineChallengeGame onComplete={(ok) => setTimelineDone(ok)} />
        <ImpactEstimationGame onComplete={() => setImpactDone(true)} />
      </div>
    </section>
  )
}

function ProgressDots({ count=4, done=0 }){
  return (
    <span className="inline-flex">
      {Array.from({length: count}).map((_,i)=> (
        <span key={i} className={`w-2 h-2 rounded-full ml-1 ${i < done ? 'bg-emerald-500' : 'bg-neutral-800'}`} />
      ))}
    </span>
  )
}

// 1) Quick Quiz
function QuickQuizGame({ seed=1, onComplete=()=>{} }){
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState([])
  const [score, setScore] = useState(0)
  const quiz = useMemo(() => makeQuiz(seed), [seed])
  const q = quiz[idx]

  const choose = (i) => {
    if (answers[idx] != null) return
    const correct = i === q.correct
    const ns = score + (correct ? 1 : 0)
    setScore(ns)
    const next = [...answers]
    next[idx] = i
    setAnswers(next)
  }

  const next = () => {
    if (idx < quiz.length-1) setIdx(idx+1)
    else onComplete(score)
  }

  return (
    <div className="rounded-xl border border-neutral-800 p-4 bg-neutral-900">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-white">Quick Quizzes</p>
        <span className="text-xs text-gray-400">{score}/{quiz.length}</span>
      </div>
      <p className="text-xs text-gray-400 mb-3">5-question challenges about recently explored papers</p>
      <p className="text-sm font-medium text-white mb-2">{q.prompt}</p>
      <div className="grid gap-2">
        {q.options.map((opt, i) => {
          const chosen = answers[idx]
          const state = chosen == null ? 'idle' : i === q.correct ? 'correct' : chosen === i ? 'wrong' : 'dim'
          const cls = state === 'idle'
            ? 'border-neutral-800 hover:border-neutral-700'
            : state === 'correct'
              ? 'border-emerald-500 bg-emerald-950/40'
              : state === 'wrong'
                ? 'border-rose-500 bg-rose-950/40'
                : 'border-neutral-800 opacity-60'
          return (
            <button key={i} onClick={()=>choose(i)} className={`text-left rounded-lg border px-3 py-2 text-sm transition text-gray-200 ${cls}`}>
              {opt}
            </button>
          )
        })}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
        <span>Question {idx+1} of {quiz.length}</span>
        <button onClick={next} className="px-2.5 py-1.5 rounded-md bg-indigo-600 text-white disabled:opacity-50" disabled={answers[idx]==null}>
          {idx < quiz.length-1 ? 'Next' : 'Finish'}
        </button>
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
  const rot = seed % bank.length
  return [...bank.slice(rot), ...bank.slice(0,rot)]
}

// 2) Research Prediction
function ResearchPredictionGame({ onComplete=()=>{} }){
  const [choice, setChoice] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const options = ['Slowed','Unchanged','Accelerated']
  const reveal = () => { setRevealed(true); onComplete() }

  return (
    <div className="rounded-xl border border-neutral-800 p-4 bg-neutral-900">
      <p className="text-sm font-semibold text-white mb-1">Research Prediction</p>
      <p className="text-xs text-gray-400 mb-3">Guess experiment outcomes before reading results</p>
      <p className="text-sm text-gray-200 mb-2">"Plant growth in microgravity will be..."</p>
      <div className="flex items-center gap-2 mb-3">
        {options.map((t,i)=> (
          <button key={t} onClick={()=>setChoice(i)} className={`text-[11px] px-2.5 py-1.5 rounded-full border transition ${choice===i ? 'border-indigo-600 text-indigo-300 bg-indigo-950/40' : 'border-neutral-800 text-gray-300 hover:border-neutral-700'}`}>{t}</button>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-gray-400">Pick an outcome, then reveal</span>
        <button onClick={reveal} disabled={choice==null} className="px-2.5 py-1.5 rounded-md bg-indigo-600 text-white disabled:opacity-50">Reveal</button>
      </div>
      {revealed && (
        <div className="mt-3 text-xs text-gray-300">
          <p><span className="font-semibold text-white">Typical finding:</span> Many species show altered morphology and slower growth due to changes in fluid dynamics and gene expression.</p>
          <p className="mt-1">Your guess: <span className="font-medium text-white">{options[choice]}</span></p>
        </div>
      )}
    </div>
  )
}

// 3) Timeline Challenge (lightweight reorder)
function TimelineChallengeGame({ onComplete=()=>{} }){
  const target = useMemo(()=> [
    { label: 'ISS assembled', year: 1998 },
    { label: 'CRISPR technique', year: 2012 },
    { label: 'Perseverance lands', year: 2021 },
  ], [])
  const [items, setItems] = useState(shuffle(target))
  const [checked, setChecked] = useState(null) // true/false

  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const next = [...items]
    const tmp = next[i]
    next[i] = next[j]
    next[j] = tmp
    setItems(next)
  }

  const check = () => {
    const ok = items.every((it, i) => it.year === target[i].year)
    setChecked(ok)
    onComplete(ok)
  }

  return (
    <div className="rounded-xl border border-neutral-800 p-4 bg-neutral-900">
      <p className="text-sm font-semibold text-white mb-1">Timeline Challenges</p>
      <p className="text-xs text-gray-400 mb-3">Order discoveries chronologically</p>
      <ol className="space-y-2">
        {items.map((it, i)=> (
          <li key={it.year} className="flex items-center justify-between rounded-lg border border-neutral-800 px-3 py-2 text-sm text-gray-200">
            <span>{it.label} <span className="text-gray-400">({it.year})</span></span>
            <span className="inline-flex gap-1">
              <button onClick={()=>move(i,-1)} className="w-7 h-7 rounded border border-neutral-800 hover:border-neutral-700">↑</button>
              <button onClick={()=>move(i, 1)} className="w-7 h-7 rounded border border-neutral-800 hover:border-neutral-700">↓</button>
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-3 flex items-center justify-between">
        <span className={`text-xs ${checked==null ? 'text-gray-400' : checked ? 'text-emerald-400' : 'text-rose-400'}`}>
          {checked==null ? 'Adjust the order, then check' : checked ? 'Perfect order!' : 'Not quite—try again'}
        </span>
        <button onClick={check} className="px-2.5 py-1.5 rounded-md bg-indigo-600 text-white">Check Order</button>
      </div>
    </div>
  )
}

function shuffle(arr){
  const a = [...arr]
  for (let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 4) Impact Estimation (rate and compare)
function ImpactEstimationGame({ onComplete=()=>{} }){
  const studies = [
    { id:'s1', title:'Bone Density in Microgravity', hints:['High citations','Human health relevance'] },
    { id:'s2', title:'Plant Photosynthesis in Space', hints:['Resource efficiency','Closed-loop systems'] },
    { id:'s3', title:'Radiation Shielding Strategies', hints:['Mission safety','Materials science'] },
  ]
  const [ratings, setRatings] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const set = (id, val) => setRatings(r => ({...r, [id]: val}))
  const submit = () => { setSubmitted(true); onComplete() }

  const modelOrder = ['s3','s1','s2'] // pretend model ranking

  return (
    <div className="rounded-xl border border-neutral-800 p-4 bg-neutral-900">
      <p className="text-sm font-semibold text-white mb-1">Impact Estimation</p>
      <p className="text-xs text-gray-400 mb-3">Predict which studies will influence future missions</p>
      <div className="space-y-3">
        {studies.map((s)=> (
          <div key={s.id} className="rounded-lg border border-neutral-800 p-3">
            <p className="text-sm font-medium text-white">{s.title}</p>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-400 flex-wrap">
              {s.hints.map((h)=> (<span key={h} className="px-1.5 py-0.5 rounded bg-neutral-800 text-gray-200">{h}</span>))}
            </div>
            <div className="mt-2"><StarRating value={ratings[s.id]||0} onChange={(v)=>set(s.id, v)} /></div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-400">Rate 1-5 stars for mission impact</span>
        <button onClick={submit} className="px-2.5 py-1.5 rounded-md bg-indigo-600 text-white">Submit</button>
      </div>
      {submitted && (
        <div className="mt-3 text-xs text-gray-300">
          <p className="font-semibold text-white mb-1">Suggested ranking:</p>
          <ol className="list-decimal list-inside">
            {modelOrder.map((id)=> {
              const s = studies.find(x=>x.id===id)
              return <li key={id}>{s.title}</li>
            })}
          </ol>
        </div>
      )}
    </div>
  )
}

function StarRating({ value=0, onChange=()=>{} }){
  return (
    <div className="inline-flex items-center gap-1">
      {Array.from({length:5}).map((_,i)=> {
        const filled = i < value
        return (
          <button key={i} onClick={()=>onChange(i+1)} className={`w-6 h-6 rounded ${filled ? 'text-amber-400' : 'text-neutral-600'} hover:text-amber-400`} aria-label={`Rate ${i+1}`}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </button>
        )
      })}
    </div>
  )
}
