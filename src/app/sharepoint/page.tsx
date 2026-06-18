'use client'

import { useState } from 'react'

interface SPFile {
  id: string
  name: string
  webUrl: string
  lastModifiedDateTime: string
  size: number
  createdBy?: { user?: { displayName?: string } }
}

export default function SharePointPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SPFile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function search() {
    const q = query.trim()
    if (!q) return
    setLoading(true)
    setError('')
    try {
      const r = await fetch(`/api/sharepoint?q=${encodeURIComponent(q)}`)
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Erro na busca')
      setResults(d.files || [])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido')
      setResults([])
    }
    setLoading(false)
  }

  function fmtBytes(b: number) {
    if (b < 1024) return `${b} B`
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
    return `${(b / 1024 / 1024).toFixed(1)} MB`
  }

  function fmtDate(d: string) {
    return new Date(d).toLocaleString('pt-BR')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">SharePoint</h1>
        <p className="text-gray-400 mt-1">Busca de arquivos no SharePoint da Alexandria Solar</p>
      </div>

      <div className="flex gap-3">
        <input
          className="flex-1 bg-[#1a1d27] border border-[#2a2d3e] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
          placeholder="Buscar arquivos no SharePoint..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search()}
        />
        <button
          onClick={search}
          disabled={loading || !query.trim()}
          className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="bg-[#1a1d27] border border-[#2a2d3e] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2d3e]">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Nome</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Modificado por</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Data</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Tamanho</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Link</th>
              </tr>
            </thead>
            <tbody>
              {results.map((f) => (
                <tr key={f.id} className="border-b border-[#2a2d3e] last:border-0 hover:bg-white/5">
                  <td className="px-4 py-3 text-white">{f.name}</td>
                  <td className="px-4 py-3 text-gray-400">{f.createdBy?.user?.displayName || '—'}</td>
                  <td className="px-4 py-3 text-gray-400">{fmtDate(f.lastModifiedDateTime)}</td>
                  <td className="px-4 py-3 text-gray-400">{fmtBytes(f.size)}</td>
                  <td className="px-4 py-3">
                    <a
                      href={f.webUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:text-amber-300 underline"
                    >
                      Abrir
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && results.length === 0 && query && !error && (
        <p className="text-gray-500 text-sm">Nenhum arquivo encontrado para "{query}".</p>
      )}
    </div>
  )
}
