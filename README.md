# Alexandria Platform

Plataforma interna da Alexandria Solar para gestão de dados, integração com SharePoint e comandos em linguagem natural via IA.

## Stack

- **Frontend + Backend:** Next.js 14 (App Router)
- **Deploy:** Vercel
- **Banco de dados:** PostgreSQL (via API Node-RED)
- **IA:** Claude (Anthropic)
- **Estilo:** Tailwind CSS

## Setup

### 1. Instalar dependências

npm install

### 2. Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha as credenciais.

### 3. Banco de dados

Execute a migration antes do primeiro deploy:

psql $DATABASE_URL -f database/migrations/001_audit_log.sql

### 4. Desenvolvimento local

npm run dev

Acesse http://localhost:3000

### 5. Deploy (Vercel)

npx vercel --prod

Configure as variáveis de ambiente no painel da Vercel.
