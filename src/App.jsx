import React, { useEffect, useMemo, useRef, useState } from 'react'
import GuruCard from './components/GuruCard'
import MessageBubble from './components/MessageBubble'

function App() {
  const [gurus, setGurus] = useState([])
  const [selectedGuru, setSelectedGuru] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const listRef = useRef(null)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    const fetchGurus = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/gurus`)
        const data = await res.json()
        setGurus(data.gurus || [])
        if ((data.gurus || []).length > 0) {
          setSelectedGuru(data.gurus[0])
        }
      } catch (e) {
        // fallback to local defaults
        setGurus([
          { name: 'Zen Teacher', archetype: 'zen', avatar: '🪷', description: 'Quiet clarity and koan-like reflections.' },
          { name: 'Yogi Guide', archetype: 'yogi', avatar: '🧘', description: 'Breath, alignment, and daily practice.' },
          { name: 'Astrologer', archetype: 'astrologer', avatar: '✨', description: 'Patterns of time and temperament.' },
        ])
        setSelectedGuru({ name: 'Zen Teacher', archetype: 'zen', avatar: '🪷' })
      }
    }
    fetchGurus()
  }, [])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || !selectedGuru) return

    const userMsg = { role: 'user', content: trimmed }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(`${baseUrl}/api/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversationId,
          guru_id: selectedGuru.id || selectedGuru.archetype,
          user_message: trimmed,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setConversationId(data.conversation_id)
        setMessages((m) => [...m, { role: 'guru', content: data.reply }])
      } else {
        setMessages((m) => [...m, { role: 'guru', content: `Sorry, an error occurred: ${data.detail || 'Unknown error'}` }])
      }
    } catch (e) {
      setMessages((m) => [...m, { role: 'guru', content: 'Unable to reach the guidance service right now.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-blue-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.12),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(99,102,241,0.12),transparent_40%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-8">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔮</span>
            <div>
              <h1 className="text-2xl font-semibold text-white">Spiritual Guru Chat</h1>
              <p className="text-xs text-blue-200/70">Seek gentle guidance through mindful conversation.</p>
            </div>
          </div>
          <a href="/test" className="text-xs text-blue-200/70 hover:text-white transition">System Check</a>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <aside className="md:col-span-4 lg:col-span-3 space-y-3">
            <div className="text-xs uppercase tracking-wider text-blue-200/60 mb-2">Choose a guide</div>
            {gurus.map((g) => (
              <GuruCard key={(g.id || g.archetype)} guru={g} selected={(selectedGuru?.id || selectedGuru?.archetype) === (g.id || g.archetype)} onSelect={setSelectedGuru} />
            ))}
          </aside>

          <main className="md:col-span-8 lg:col-span-9">
            <div className="h-[65vh] md:h-[70vh] bg-white/5 border border-white/10 rounded-2xl p-4 overflow-y-auto" ref={listRef}>
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center text-blue-200/70">
                  <div>
                    <div className="text-4xl mb-2">{selectedGuru?.avatar || '🪷'}</div>
                    <div className="font-medium">Start a conversation</div>
                    <div className="text-sm">Ask anything on your mind—purpose, calm, relationships, work.</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((m, i) => (
                    <MessageBubble key={i} role={m.role} content={m.content} />
                  ))}
                  {loading && (
                    <MessageBubble role="guru" content="Thinking with a gentle breath..." />
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${selectedGuru?.name || 'your guide'}...`}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-white placeholder:text-blue-200/50 min-h-[48px]"
                rows={2}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-4 py-2 rounded-xl bg-blue-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition"
              >
                Send
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
