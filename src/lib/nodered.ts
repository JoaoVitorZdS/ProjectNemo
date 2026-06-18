function getBase(): string {
  const url = process.env.NODERED_API_URL
  if (!url) throw new Error('NODERED_API_URL não configurada')
  return url.replace(/\/$/, '')
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (process.env.NODERED_API_KEY) {
    headers['Authorization'] = `Bearer ${process.env.NODERED_API_KEY}`
  }
  return headers
}

export async function nodeRedGet(path: string): Promise<unknown> {
  const r = await fetch(`${getBase()}${path}`, { headers: getHeaders() })
  if (!r.ok) throw new Error(`Node-RED GET error ${r.status}: ${await r.text()}`)
  return r.json()
}

export async function nodeRedPost(path: string, body: unknown): Promise<unknown> {
  const r = await fetch(`${getBase()}${path}`, {
    method: 'POST', headers: getHeaders(), body: JSON.stringify(body),
  })
  if (!r.ok) throw new Error(`Node-RED POST error ${r.status}: ${await r.text()}`)
  return r.json()
}

export async function nodeRedPut(path: string, body: unknown): Promise<unknown> {
  const r = await fetch(`${getBase()}${path}`, {
    method: 'PUT', headers: getHeaders(), body: JSON.stringify(body),
  })
  if (!r.ok) throw new Error(`Node-RED PUT error ${r.status}: ${await r.text()}`)
  return r.json()
}

export async function nodeRedPatch(path: string, body: unknown): Promise<unknown> {
  const r = await fetch(`${getBase()}${path}`, {
    method: 'PATCH', headers: getHeaders(), body: JSON.stringify(body),
  })
  if (!r.ok) throw new Error(`Node-RED PATCH error ${r.status}: ${await r.text()}`)
  return r.json()
}
