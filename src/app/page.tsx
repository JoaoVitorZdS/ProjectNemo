'use client'

import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts'

interface FluxoSetor {
  setor: string
  total: number
  dia?: string
}

interface AuditStats {
  total: number
  hoje: number
  sucesso: number
  erros: number
}

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6']

export default function Dashboard() {
  const [fluxo, setFluxo] = useState<FluxoSetor[]>([])
  const [stats, setStats] = useState<AuditStats>({ total: 0, hoje: 0, sucesso: 0, erros: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const r = await fetch('/api/audit?view=dashboard')
        if (r.ok) {
          const d = await r.json()
          setFluxo(d.fluxo || [])
          setStats(d.stats || { total: 0, hoje: 0, sucesso: 0, erros: 0 })
        }
      } catch (_) {}
      setLoading(false)
    }
    load()
  }, [])

  const cards = [
    { label: 'Total de Operações', value: stats.total, color: 'text-amber-400' },
    { label: 'Operações Hoje', value: stats.hoje, color: 'text-blue-400' },
    { label: 'Sucesso', value: stats.sucesso, color: 'text-emerald-400' },
    { label: 'Erros', value: stats.erros, color: 'text-red-400' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Visão geral da plataforma Alexandria Solar</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-[#1a1d27] border border-[#2a2d3e] rounded-xl p-5">
            <p className="text-gray-400 text-sm">{c.label}</p>
            <p className={`text-3xl font-bold mt-1 ${c.color}`}>
              {loading ? '—' : c.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1a1d27] border border-[#2a2d3e] rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Operações por Setor</h2>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-gray-500">Carregando...</div>
          ) : fluxo.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500">Sem dados ainda</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={fluxo}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3e" />
                <XAxis dataKey="setor" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1d27', border: '1px solid #2a2d3e' }} />
                <Bar dataKey="total" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-[#1a1d27] border border-[#2a2d3e] rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Distribuição por Setor</h2>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-gray-500">Carregando...</div>
          ) : fluxo.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500">Sem dados ainda</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={fluxo} dataKey="total" nameKey="setor" cx="50%" cy="50%" outerRadius={80}>
                  {fluxo.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1a1d27', border: '1px solid #2a2d3e' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
