'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    const next: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setLoading(true)
    try {
      const r = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      const d = await r.json()
      setMessages([...next, { role: 'assistant', content: d.content || d.error || 'Erro desconhecido' }])
    } catch (e) {
      setMessages([...next, { role: 'assistant', content: 'Erro ao conectar com o servidor.' }])
    }
    setLoading(false)
  }

  const suggestions = [
    'Quantos chamados estão com status Enviado ao TI?',
    'Mostre os últimos 10 registros do setor TI',
    'Qual setor gerou mais chamados em junho?',
    'Quais operações foram revertidas essa semana?',
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">Chat com Alexandria</h1>
        <p className="text-gray-400 mt-1">Consulte e altere dados em linguagem natural</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-gray-500 text-sm">Sugestões de comandos:</p>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setInput(s)}
                className="block w-full text-left bg-[#1a1d27] border border-[#2a2d3e] rounded-lg px-4 py-3 text-sm text-gray-300 hover:border-amber-500/50 hover:text-white transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-amber-500 text-black font-medium'
                  : 'bg-[#1a1d27] border border-[#2a2d3e] text-gray-200'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#1a1d27] border border-[#2a2d3e] rounded-2xl px-5 py-3 text-sm text-gray-400">
              Processando...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-3">
        <input
          className="flex-1 bg-[#1a1d27] border border-[#2a2d3e] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
          placeholder="Digite seu comando..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
          disabled={loading}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Enviar
        </button>
      </div>
    </div>
  )
}
