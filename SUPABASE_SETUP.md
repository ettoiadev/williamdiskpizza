# 🔧 Setup do Supabase - William Disk Pizza CMS

Este guia orienta a configuração inicial do Supabase para o sistema administrativo.

## 📋 Pré-requisitos

- Conta no Supabase (gratuita): https://supabase.com
- Node.js 16+ instalado

## 🚀 Passo a Passo

### 1. Criar Projeto no Supabase

1. Acesse [Supabase Dashboard](https://app.supabase.com)
2. Clique em "New Project"
3. Preencha:
   - **Name:** william-disk-pizza
   - **Database Password:** (anote esta senha)
   - **Region:** South America (São Paulo) - mais próximo
4. Aguarde ~2 minutos para o projeto ser criado

### 2. Obter Credenciais

No dashboard do projeto:

1. Vá em **Settings** → **API**
2. Copie os valores:
   - **Project URL** (exemplo: `https://xxxxx.supabase.co`)
   - **anon/public key** (exemplo: `eyJhbGciOiJIUzI1...`)

### 3. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example`:
   ```bash
   cp .env.example .env.local
   ```

2. Edite `.env.local` e preencha com suas credenciais:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
   VITE_ADMIN_EMAIL=seu-email@exemplo.com
   ```

### 4. Criar Estrutura do Banco de Dados

Vá em **SQL Editor** no dashboard do Supabase e execute o script da próxima fase.

## 🗂️ Estrutura de Arquivos Criada

```
src/
├── config/
│   └── constants.ts          # Constantes da aplicação
├── hooks/
│   └── use-supabase.ts       # Hook customizado do Supabase
├── lib/
│   ├── supabase.ts           # Cliente Supabase configurado
│   └── utils.ts              # Utilitários
├── types/
│   ├── cms.ts                # Tipos do CMS
│   └── supabase.ts           # Tipos do banco de dados
```

## 📦 Dependências Instaladas

- `@supabase/supabase-js` - Cliente oficial do Supabase

## 🔐 Segurança

⚠️ **IMPORTANTE:**
- **Nunca** commite o arquivo `.env.local`
- **Nunca** exponha as chaves do Supabase publicamente
- Use Row Level Security (RLS) para proteger seus dados

## 📚 Recursos Úteis

- [Documentação do Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## ✅ Próximos Passos

Após configurar:
1. ✅ Fase 1 completa - Setup do Backend
2. ⏳ Fase 2 - Criar tabelas no banco de dados
3. ⏳ Fase 3 - Configurar autenticação
4. ⏳ Fase 4 - Desenvolver API REST

---

**Dúvidas?** Entre em contato ou consulte a documentação oficial.
