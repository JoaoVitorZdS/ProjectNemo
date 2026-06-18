'use client'

import { useEffect, useState } from 'react'

interface RevertEntry {
  id: number
  operacao_id: string
  usuario: string
  comando: string
  setor: string
  dados_antes: unknown
  dados_depois: unknown
  criado_em: string
}

export default function RevertPage() {
  const [entries, setEntries] = useState<RevertEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [reverting, setReverting] = useState<number | null>(null)
  const [message, setMessage] = useState('')

  async function load() {
    setLoading(true)
    try {
      const r = await fetch('/api/audit?view=reversoes')
      const d = await r.json()
      setEntries(d.entries || [])
    } catch (_) {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function revert(id: number, operacaoId: string) {
    setReverting(id)
    setMessage('')
    try {
      const r = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'revert', id, operacao_id: operacaoId }),
      })
      const d = await r.json()
      if (r.ok) {
        setMessage(`Operação ${operacaoId} revertida com sucesso.`)
        await load()
      } else {
        setMessage(`Erro: ${d.error}`)
      }
    } catch (_) {
      setMessage('Erro ao conectar com o servidor.')
    }
    setReverting(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Reversões</h1>
        <p className="text-gray-400 mt-1">Operações disponíveis para reversão</p>
      </div>

      {message && (
        <div className={`rounded-xl p-4 text-sm border ${
          message.startsWith('Erro')
            ? 'bg-red-500/10 border-red-500/30 text-red-400'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}>
          {message}
        </div>
      )}

      <div className="bg-[#1a1d27] border border-[#2a2d3e] rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-500">Carregando...</div>
        ) : entries.length === 0 ? (
          <div className="py-16 text-center text-gray-500">Nenhuma operação disponível para reversão</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2d3e]">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Operação</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Usuário</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Comando</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Setor</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Data</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Ação</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-b border-[#2a2d3e] last:border-0 hover:bg-white/5">
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{e.operacao_id}</td>
                  <td className="px-4 py-3 text-gray-300">{e.usuario}</td>
                  <td className="px-4 py-3 text-white max-w-xs truncate" title={e.comando}>{e.comando}</td>
                  <td className="px-4 py-3 text-gray-400">{e.setor || '—'}</td>
                  <td className="px-4 py-3 text-gray-400">{new Date(e.criado_em).toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => revert(e.id, e.operacao_id)}
                      disabled={reverting === e.id}
                      className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 disabled:opacity-50 text-red-400 rounded-lg px-3 py-1 text-xs font-medium transition-colors"
                    >
                      {reverting === e.id ? 'Revertendo...' : 'Reverter'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
