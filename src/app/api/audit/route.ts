import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const view = searchParams.get('view')

  if (view === 'dashboard') {
    try {
      const statsResult = await query(`
        SELECT
          COUNT(*) AS total,
          COUNT(*) FILTER (WHERE criado_em::date = CURRENT_DATE) AS hoje,
          COUNT(*) FILTER (WHERE status = 'success') AS sucesso,
          COUNT(*) FILTER (WHERE status = 'error') AS erros
        FROM audit_log
      `)
      const fluxoResult = await query(`
        SELECT setor, COUNT(*) AS total FROM audit_log
        WHERE setor IS NOT NULL AND setor != ''
        GROUP BY setor ORDER BY total DESC LIMIT 10
      `)
      const stats = statsResult.rows[0]
      const fluxo = fluxoResult.rows.map((r: Record<string, unknown>) => ({
        setor: r.setor,
        total: Number(r.total),
      }))
      return NextResponse.json({
        stats: {
          total: Number(stats.total),
          hoje: Number(stats.hoje),
          sucesso: Number(stats.sucesso),
          erros: Number(stats.erros),
        },
        fluxo,
      })
    } catch (e) {
      console.error('Dashboard query error:', e)
      return NextResponse.json({ stats: { total: 0, hoje: 0, sucesso: 0, erros: 0 }, fluxo: [] })
    }
  }

  if (view === 'reversoes') {
    try {
      const result = await query(`
        SELECT id, operacao_id, usuario, comando, setor, dados_antes, dados_depois, criado_em
        FROM audit_log
        WHERE status = 'success' AND dados_antes IS NOT NULL AND reverted = false
        ORDER BY criado_em DESC LIMIT 50
      `)
      return NextResponse.json({ entries: result.rows })
    } catch (e) {
      console.error('Reversoes query error:', e)
      return NextResponse.json({ entries: [] })
    }
  }

  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const setor = searchParams.get('setor') || ''
  const status = searchParams.get('status') || ''
  const offset = (page - 1) * limit

  try {
    const conditions: string[] = []
    const params: unknown[] = []
    let idx = 1

    if (setor) { conditions.push(`setor ILIKE $${idx++}`); params.push(`%${setor}%`) }
    if (status) { conditions.push(`status = $${idx++}`); params.push(status) }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const result = await query(
      `SELECT id, usuario, comando, fonte, setor, status, duracao_ms, criado_em, operacao_id FROM audit_log ${where} ORDER BY criado_em DESC LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset]
    )
    return NextResponse.json({ entries: result.rows })
  } catch (e) {
    console.error('Audit query error:', e)
    return NextResponse.json({ entries: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (body.action === 'revert') {
      const { id, operacao_id } = body
      const entry = await query(
        'SELECT * FROM audit_log WHERE id = $1 AND operacao_id = $2 AND status = $2',
        [id, operacao_id, 'success']
      )
      if (!entry.rows.length) {
        return NextResponse.json({ error: 'Registro não encontrado ou já revertido' }, { status: 404 })
      }
      await query(
        `UPDATE audit_log SET status = 'reverted', reverted = true WHERE id = $1`,
        [id]
      )
      return NextResponse.json({ success: true, message: `Operação ${operacao_id} marcada como revertida.` })
    }
    return NextResponse.json({ error: 'Ação desconhecida' }, { status: 400 })
  } catch (e: unknown) {
    console.error('Audit POST error:', e)
    const msg = e instanceof Error ? e.message : 'Erro desconhecido'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
