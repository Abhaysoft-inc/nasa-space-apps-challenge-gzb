import { NextResponse } from 'next/server'

const gapPrompts = [
  'Consider extending the sample size with multi-mission aggregation to improve statistical power.',
  'Evaluate countermeasure protocols alongside biomarkers to isolate which interventions drive recovery.',
  'Explore cross-species comparisons to identify conserved adaptation mechanisms.',
  'Integrate radiation dosimetry with immune response tracking to reveal dose-response patterns.',
]

const followUpIdeas = [
  'Pair in-flight telemetry with post-landing clinical follow-ups to detect latent effects.',
  'Design a mixed-methods study that couples quantitative biomarkers with astronaut qualitative reports.',
  'Leverage machine learning to correlate omics signatures with mission conditions.',
]

const formatResponse = (message, paper = {}) => {
  const { title, summary, keywords = [], authors = [], source, date } = paper
  const keywordSnippet = keywords.length ? keywords.slice(0, 3).join(', ') : 'space biology'
  const authorSnippet = authors.length ? `${authors[0]} et al.` : 'the research team'
  const overview = summary
    ? summary
    : `This study explores key adaptation mechanisms related to ${keywordSnippet}.`

  const primaryIdea = gapPrompts[Math.floor(Math.random() * gapPrompts.length)]
  const secondaryIdea = followUpIdeas[Math.floor(Math.random() * followUpIdeas.length)]

  return `Here is what I can derive from ${title ? `"${title}"` : 'this paper'}:

• Overview: ${overview}
• Key insight: ${authorSnippet} highlight how mission conditions influence long-term adaptation.
• Suggested next step: ${primaryIdea}
• Follow-up idea: ${secondaryIdea}

You asked: "${message}"${source ? ` (source: ${source}, ${date})` : ''}. Align these recommendations with NASA’s Human Research Roadmap for validation.`
}

export async function POST(request) {
  try {
    const body = await request.json()
    const message = body?.message?.trim()
    if (!message) {
      return NextResponse.json({ reply: 'Please provide a question to analyze.' }, { status: 400 })
    }

    const reply = formatResponse(message, body?.paper)
    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chat route error', error)
    return NextResponse.json({ error: 'Unable to generate a response right now.' }, { status: 500 })
  }
}
