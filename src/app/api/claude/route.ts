import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { nodeRedGet, nodeRedPost, nodeRedPatch } from '@/lib/nodered'
import { graphGet } from '@/lib/sharepoint'
import { withAudit } from '@/lib/audit'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const tools: Anthropic.Tool[] = [
  {
    name: 'consultar_dados',
    description: 'Consulta dados da API interna Node-RED da Alexandria Solar',
    input_schema: {
      type: 'object' as const,
      properties: {
        endpoint: { type: 'string', description: 'Endpoint da API, ex: /chamados, /clientes' },
        params: { type: 'object', description: 'Parâmetros de query opcionais' },
      },
      required: ['endpoint'],
    },
  },
  {
    name: 'atualizar_dado',
    description: 'Atualiza um registro na API interna Node-RED (PATCH)',
    input_schema: {
      type: 'object' as const,
      properties: {
        endpoint: { type: 'string', description: 'Endpoint com ID, ex: /chamados/123' },
        dados: { type: 'object', description: 'Dados a atualizar' },
        setor: { type: 'string', description: 'Setor responsável pela operação' },
        comando_original: { type: 'string', description: 'Comando original do usuário' },
      },
      required: ['endpoint', 'dados'],
    },
  },
  {
    name: 'criar_registro',
    description: 'Cria um novo registro na API interna Node-RED (POST)',
    input_schema: {
      type: 'object' as const,
      properties: {
        endpoint: { type: 'string', description: 'Endpoint, ex: /chamados' },
        dados: { type: 'object', description: 'Dados do novo registro' },
        setor: { type: 'string', description: 'Setor responsável' },
        comando_original: { type: 'string', description: 'Comando original do usuário' },
      },
      required: ['endpoint', 'dados'],
    },
  },
  {
    name: 'buscar_sharepoint',
    description: 'Busca arquivos no SharePoint da Alexandria Solar',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Termo de busca' },
      },
      required: ['query'],
    },
  },
]

async function executeTool(name: string, input: Record<string, unknown>): Promise<unknown> {
  if (name === 'consultar_dados') {
    const params = input.params as Record<string, string> | undefined
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return await nodeRedGet(String(input.endpoint) + qs)
  }

  if (name === 'atualizar_dado') {
    return await withAudit({
      usuario: 'claude-chat',
      comando: String(input.comando_original || input.endpoint),
      fonte: 'chat',
      setor: String(input.setor || ''),
      operacao: async () => {
        return await nodeRedPatch(String(input.endpoint), input.dados as Record<string, unknown>)
      },
      getEstadoAtual: async () => {
        try { return await nodeRedGet(String(input.endpoint)) } catch { return null }
      },
    })
  }

  if (name === 'criar_registro') {
    return await withAudit({
      usuario: 'claude-chat',
      comando: String(input.comando_original || input.endpoint),
      fonte: 'chat',
      setor: String(input.setor || ''),
      operacao: async () => {
        return await nodeRedPost(String(input.endpoint), input.dados as Record<string, unknown>)
      },
      getEstadoAtual: async () => null,
    })
  }

  if (name === 'buscar_sharepoint') {
    const siteId = process.env.SHAREPOINT_SITE_ID || 'root'
    return await graphGet(`/sites/${siteId}/drive/root/search(q='${encodeURIComponent(String(input.query))}')`)
  }

  return { error: `Tool desconhecida: ${name}` }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: `Você é Alexandria, assistente interna da Alexandria Solar.
Você tem acesso a ferramentas para consultar e atualizar dados no sistema interno da empresa.
Responda sempre em português. Seja conciso e direto.
Quando usar ferramentas, explique o que está fazendo antes de executar.
Após consultar dados, apresente de forma clara e organizada.`,
      tools,
      messages,
    })

    let content = ''
    const toolResults: Anthropic.MessageParam[] = []

    for (const block of response.content) {
      if (block.type === 'text') {
        content += block.text
      } else if (block.type === 'tool_use') {
        const result = await executeTool(block.name, block.input as Record<string, unknown>)
        toolResults.push({
          role: 'user',
          content: [{
            type: 'tool_result',
            tool_use_id: block.id,
            content: JSON.stringify(result),
          }],
        })
      }
    }

    if (toolResults.length > 0) {
      const followUp = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        system: `Você é Alexandria, assistente interna da Alexandria Solar. Responda em português.`,
        tools,
        messages: [...messages, { role: 'assistant', content: response.content }, ...toolResults],
      })

      for (const block of followUp.content) {
        if (block.type === 'text') content += block.text
      }
    }

    return NextResponse.json({ content })
  } catch (e: unknown) {
    console.error('Claude API error:', e)
    return NextResponse.json({ error: 'Erro ao processar com Claude.' }, { status: 500 })
  }
}
