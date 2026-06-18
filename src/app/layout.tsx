import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'Alexandria Solar — Plataforma Interna',
  description: 'Gestão interna Alexandria Solar',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen bg-[#0f1117] text-gray-100">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 overflow-auto">
          {children}
        </main>
      </body>
    </html>
  )
}
