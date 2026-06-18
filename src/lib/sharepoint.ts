let tokenCache: { token: string; expires: number } | null = null

async function getAccessToken(): Promise<string> {
  if (tokenCache && tokenCache.expires > Date.now() + 60000) {
    return tokenCache.token
  }

  const tenantId = process.env.AZURE_TENANT_ID
  const clientId = process.env.AZURE_CLIENT_ID
  const clientSecret = process.env.AZURE_CLIENT_SECRET

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error('Credenciais Azure não configuradas (AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET)')
  }

  const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    scope: 'https://graph.microsoft.com/.default',
    grant_type: 'client_credentials',
  })

  const r = await fetch(url, { method: 'POST', body, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
  if (!r.ok) {
    const err = await r.text()
    throw new Error(`Erro ao obter token Azure: ${err}`)
  }
  const data = await r.json() as { access_token: string; expires_in: number }
  tokenCache = { token: data.access_token, expires: Date.now() + data.expires_in * 1000 }
  return tokenCache.token
}

const GRAPH_BASE = 'https://graph.microsoft.com/v1.0'

export async function graphGet(path: string): Promise<unknown> {
  const token = await getAccessToken()
  const r = await fetch(`${GRAPH_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  })
  if (!r.ok) throw new Error(`Graph API error ${r.status}: ${await r.text()}`)
  return r.json()
}

export async function graphPost(path: string, body: unknown): Promise<unknown> {
  const token = await getAccessToken()
  const r = await fetch(`${GRAPH_BASE}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!r.ok) throw new Error(`Graph API error ${r.status}: ${await r.text()}`)
  return r.json()
}

export async function graphPatch(path: string, body: unknown): Promise<unknown> {
  const token = await getAccessToken()
  const r = await fetch(`${GRAPH_BASE}${path}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!r.ok) throw new Error(`Graph API error ${r.status}: ${await r.text()}`)
  return r.json()
}
