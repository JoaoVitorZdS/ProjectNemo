import { query } from './db'
import { randomUUID } from 'crypto'

interface AuditOptions<T> {
  usuario: string
  comando: string
  fonte: string
  setor: string
  operacao: () => Promise<T>
  getEstadoAtual: () => Promise<unknown>
}

export async function withAudit<T>(opts: AuditOptions<T>): Promise<T> {
  const operacaoId = randomUUID()
  const inicio = Date.now()
  let dadosAntes: unknown = null
  let dadosDepois: unknown = null
  let status: 'success' | 'error' = 'success'
  let resultado: T

  try {
    dadosAntes = await opts.getEstadoAtual()
    resultado = await opts.operacao()
    dadosDepois = resultado
    status = 'success'
  } catch (e) {
    status = 'error'
    const duracao = Date.now() - inicio
    try {
      await query(
        `INSERT INTO audit_log (operacao_id, usuario, comando, fonte, setor, status, duracao_ms, dados_antes, dados_depois)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [operacaoId, opts.usuario, opts.comando, opts.fonte, opts.setor, status, duracao,
          dadosAntes ? JSON.stringify(dadosAntes) : null, null]
      )
    } catch (dbErr) {
      console.error('Audit log insert error:', dbErr)
    }
    throw e
  }

  const duracao = Date.now() - inicio
  try {
    await query(
      `INSERT INTO audit_log (operacao_id, usuario, comando, fonte, setor, status, duracao_ms, dados_antes, dados_depois)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [operacaoId, opts.usuario, opts.comando, opts.fonte, opts.setor, status, duracao,
        dadosAntes ? JSON.stringify(dadosAntes) : null,
        dadosDepois ? JSON.stringify(dadosDepois) : null]
    )
  } catch (dbErr) {
    console.error('Audit log insert error:', dbErr)
  }

  return resultado!
}
