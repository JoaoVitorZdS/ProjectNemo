import { NextRequest, NextResponse } from 'next/server'
import { graphGet } from '@/lib/sharepoint'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')
  if (!q) return NextResponse.json({ error: 'Query obrigatória' }, { status: 400 })

  try {
    const siteId = process.env.SHAREPOINT_SITE_ID || 'root'
    const data = await graphGet(
      `/sites/${siteId}/drive/root/search(q='${encodeURIComponent(q)}')?$select=id,name,webUrl,lastModifiedDateTime,size,createdBy`
    )
    const files = (data as { value?: unknown[] }).value || []
    return NextResponse.json({ files })
  } catch (e: unknown) {
    console.error('SharePoint error:', e)
    const msg = e instanceof Error ? e.message : 'Erro desconhecido'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
