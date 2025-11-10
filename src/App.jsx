import { useEffect, useMemo, useState } from 'react'

const CATEGORIES = [
  { key: 'football', label: 'Football' },
  { key: 'star-wars', label: 'Star Wars' },
  { key: 'coding', label: 'Coding' },
  { key: 'drawing', label: 'Drawing' },
  { key: 'music', label: 'Music' },
  { key: 'art', label: 'Art' },
  { key: 'hacking', label: 'Hacking' },
]

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

function App() {
  const [active, setActive] = useState('football')
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')

  const filtered = useMemo(() => entries.filter(e => e.category === active), [entries, active])

  async function fetchEntries(category) {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/entries?category=${encodeURIComponent(category)}`)
      const data = await res.json()
      setEntries(prev => {
        // merge unique by _id
        const map = new Map()
        ;[...prev, ...data].forEach(d => map.set(d._id, d))
        return Array.from(map.values())
      })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEntries(active)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  async function addEntry(e) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    try {
      const res = await fetch(`${API_BASE}/api/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: active, title, content, mood }),
      })
      if (!res.ok) throw new Error('Failed to create')
      setTitle('')
      setContent('')
      setMood('')
      fetchEntries(active)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
      <header className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          My Passion Hub
        </h1>
        <p className="text-purple-200 mt-2">A personal space for football, Star Wars, coding, drawing, music, art, and hacking.</p>
      </header>

      <nav className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-2 sm:gap-3 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActive(cat.key)}
            className={`px-4 py-2 rounded-full text-sm sm:text-base transition-all border ${active === cat.key ? 'bg-purple-500 border-purple-400 shadow-lg' : 'bg-white/10 border-white/20 hover:bg-white/20'}`}
          >
            {cat.label}
          </button>
        ))}
      </nav>

      <main className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-8 mt-8">
        <section className="bg-white/5 backdrop-blur rounded-2xl p-5 border border-white/10">
          <h2 className="text-xl font-semibold mb-3">Create an entry</h2>
          <form onSubmit={addEntry} className="space-y-3">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={`Title about ${active}`}
              className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Share your thoughts, notes, or ideas..."
              rows={4}
              className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              value={mood}
              onChange={e => setMood(e.target.value)}
              placeholder="Mood (optional)"
              className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 transition-colors rounded-md py-2 font-medium">Save</button>
          </form>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Recent entries</h2>
            {loading && <span className="text-xs text-purple-200">Loading...</span>}
          </div>
          <div className="grid gap-3">
            {filtered.length === 0 && (
              <div className="text-purple-200 text-sm">No entries yet. Be the first to add one!</div>
            )}
            {filtered.map(item => (
              <article key={item._id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <span className="text-xs text-purple-200 capitalize">{item.category}</span>
                </div>
                <p className="text-purple-100 mt-1 whitespace-pre-wrap">{item.content}</p>
                {item.mood && <div className="mt-2 text-xs text-purple-300">Mood: {item.mood}</div>}
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="max-w-5xl mx-auto px-6 py-10 text-center text-purple-300 text-sm">
        Built with love for creativity and fandoms.
      </footer>
    </div>
  )
}

export default App
