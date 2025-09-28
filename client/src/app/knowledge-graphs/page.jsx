export const metadata = {
  title: 'Knowledge Graphs • Biolore',
  description: 'Explore interconnected concepts, studies, and findings across space biology.',
}

export default function KnowledgeGraphsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black text-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-bold">Knowledge Graphs</h1>
        <p className="mt-4 text-gray-300 max-w-2xl">
          This is a placeholder for the Knowledge Graphs experience. Here you will be able to
          visualize relationships between papers, biological entities, experimental methods,
          and findings. We can plug in your graph backend or mock data next.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h2 className="font-semibold">Concept Maps</h2>
            <p className="mt-2 text-sm text-gray-300">High-level ontologies linking organs, pathways, and stressors.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h2 className="font-semibold">Paper Networks</h2>
            <p className="mt-2 text-sm text-gray-300">Clusters of studies by topic, organism, and mission.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h2 className="font-semibold">Evidence Trails</h2>
            <p className="mt-2 text-sm text-gray-300">Chain of evidence from methods to outcomes.</p>
          </div>
        </div>

        <a href="/papers" className="inline-block mt-12 px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition">
          Browse Research Papers
        </a>
      </div>
    </main>
  )
}
