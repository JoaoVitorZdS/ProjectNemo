'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { href: '/', label: 'Dashboard', icon: '▦' },
  { href: '/chat', label: 'Chat IA', icon: '◈' },
  { href: '/sharepoint', label: 'SharePoint', icon: '◉' },
  { href: '/audit', label: 'Auditoria', icon: '≡' },
  { href: '/revert', label: 'Reversões', icon: '↺' },
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-[#1a1d27] border-r border-[#2a2d3e] flex flex-col z-10">
      <div className="px-6 py-5 border-b border-[#2a2d3e]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-black font-bold text-sm">A</div>
          <div>
            <p className="text-white font-semibold text-sm">Alexandria Solar</p>
            <p className="text-gray-500 text-xs">Plataforma Interna</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="px-6 py-4 border-t border-[#2a2d3e]">
        <p className="text-gray-600 text-xs">v0.1.0 — jun/2026</p>
      </div>
    </aside>
  )
}
