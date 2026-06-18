'use client'

import { useEffect, useState } from 'react'

interface AuditEntry {
  id: number
  usuario: string
  comando: string
  fonte: string
  setor: string
  status: 'success' | 'error' | 'reverted'
  duracao_ms: number
  criado_em: string
  operacao_id: string
}

export default function AuditPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [setor, setSetor] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const limit = 20

  async function load() {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (setor) params.set('setor', setor)
    if (status) params.set('status', status)
    try {
      const r = await fetch(`/api/audit?${params}`)
      const d = await r.json()
      setEntries(d.entries || [])
    } catch (_) {}
    setLoading(false)
  }

  useEffect(() => { load() }, [page, setor, status])

  const statusColor: Record<string, string> = {
    success: 'text-emerald-400',
    error: 'text-red-400',
    reverted: 'text-gray-400',
  }

  const statusLabel: Record<string, string> = {
    success: 'Sucesso',
    error: 'Erro',
    reverted: 'Revertido',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Auditoria</h1>
        <p className="text-gray-400 mt-1">Histórico completo de operações</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <input
          className="bg-[#1a1d27] border border-[#2a2d3e] rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors w-40"
          placeholder="Setor..."
          value={setor}
          onChange={(e) => { setSetor(e.target.value); setPage(1) }}
        />
        <select
          className="bg-[#1a1d27] border border-[#2a2d3e] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1) }}
        >
          <option value="">Todos os status</option>
          <option value="success">Sucesso</option>
          <option value="error">Erro</option>
          <option value="reverted">Revertido</option>
        </select>
        <button
          onClick={() => load()}
          className="bg-[#1a1d27] border border-[#2a2d3e] hover:border-amber-500/50 rounded-xl px-4 py-2 text-sm text-gray-300 transition-colors"
        >
          Atualizar
        </button>
      </div>

      <div className="bg-[#1a1d27] border border-[#2a2d3e] rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-500">Carregando...</div>
        ) : entries.length === 0 ? (
          <div className="py-16 text-center text-gray-500">Nenhum registro encontrado</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2d3e]">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">ID</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Usuário</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Comando</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Setor</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Duração</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Data</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-b border-[#2a2d3e] last:border-0 hover:bg-white/5">
                  <td className="px-4 py-3 text-gray-500 font-mono">{e.id}</td>
                  <td className="px-4 py-3 text-gray-300">{e.usuario}</td>
                  <td className="px-4 py-3 text-white max-w-xs truncate" title={e.comando}>{e.comando}</td>
                  <td className="px-4 py-3 text-gray-400">{e.setor || '—'}</td>
                  <td className={`px-4 py-3 font-medium ${statusColor[e.status] || 'text-gray-400'}`}>
                    {statusLabel[e.status] || e.status}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{e.duracao_ms}ms</td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(e.criado_em).toLocaleString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex gap-3 items-center">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="bg-[#1a1d27] border border-[#2a2d3e] disabled:opacity-50 rounded-xl px-4 py-2 text-sm text-gray-300 hover:border-amber-500/50 transition-colors"
        >
          Anterior
        </button>
        <span className="text-gray-400 text-sm">Página {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={entries.length < limit}
          className="bg-[#1a1d27] border border-[#2a2d3e] disabled:opacity-50 rounded-xl px-4 py-2 text-sm text-gray-300 hover:border-amber-500/50 transition-colors"
        >
          Próxima
        </button>
      </div>
    </div>
  )
}
