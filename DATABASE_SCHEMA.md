# 🗄️ Estrutura do Banco de Dados - William Disk Pizza CMS

## 📊 Diagrama Visual

```
┌─────────────────────┐
│   auth.users        │ (Supabase Auth)
│  ─────────────────  │
│  • id (PK)          │
│  • email            │
│  • encrypted_pass   │
└──────────┬──────────┘
           │
           │ FK
           ↓
┌─────────────────────┐
│  admin_users        │
│  ─────────────────  │
│  • id (PK, FK)      │
│  • email            │
│  • role             │
│  • created_at       │
│  • last_login       │
└─────────────────────┘

┌─────────────────────┐       ┌─────────────────────┐
│  site_content       │       │  settings           │
│  ─────────────────  │       │  ─────────────────  │
│  • id (PK)          │       │  • id (PK)          │
│  • section          │       │  • key (UNIQUE)     │
│  • key              │       │  • value (JSONB)    │
│  • value (JSONB)    │       │  • description      │
│  • type             │       │  • updated_at       │
│  • created_at       │       └─────────────────────┘
│  • updated_at       │
└─────────────────────┘

┌─────────────────────┐       ┌─────────────────────┐
│  testimonials       │       │  gallery            │
│  ─────────────────  │       │  ─────────────────  │
│  • id (PK)          │       │  • id (PK)          │
│  • name             │       │  • title            │
│  • rating (1-5)     │       │  • image_url        │
│  • comment          │       │  • alt_text         │
│  • location         │       │  • order            │
│  • image_url        │       │  • is_active        │
│  • is_active        │       │  • created_at       │
│  • order            │       │  • updated_at       │
│  • created_at       │       └─────────────────────┘
│  • updated_at       │
└─────────────────────┘

┌─────────────────────┐       ┌─────────────────────┐
│  media              │       │  storage.objects    │
│  ─────────────────  │       │  ─────────────────  │
│  • id (PK)          │       │  • id               │
│  • name             │       │  • bucket_id        │
│  • url              │◄─────►│  • name (path)      │
│  • type             │       │  • metadata         │
│  • size (bytes)     │       └─────────────────────┘
│  • alt_text         │
│  • created_at       │
│  • updated_at       │
└─────────────────────┘
```

---

## 📋 Tabelas Detalhadas

### 1. **admin_users**
**Propósito:** Gerenciar usuários com acesso administrativo ao CMS

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID (PK, FK) | Referência para auth.users |
| `email` | TEXT (UNIQUE) | Email do usuário |
| `role` | TEXT | 'admin' ou 'editor' |
| `created_at` | TIMESTAMPTZ | Data de criação |
| `last_login` | TIMESTAMPTZ | Último acesso |

**Constraints:**
- ✅ Email deve ser válido (regex)
- ✅ Role apenas 'admin' ou 'editor'
- ✅ FK para auth.users (cascade delete)

---

### 2. **site_content**
**Propósito:** Armazenar todo conteúdo dinâmico do site

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID (PK) | Identificador único |
| `section` | TEXT | Seção do site (hero, stats, etc) |
| `key` | TEXT | Chave do conteúdo |
| `value` | JSONB | Valor (flexível) |
| `type` | TEXT | 'text', 'image', 'json', 'number' |
| `created_at` | TIMESTAMPTZ | Data de criação |
| `updated_at` | TIMESTAMPTZ | Última atualização (auto) |

**Constraints:**
- ✅ Combinação (section + key) é única
- ✅ Type apenas valores permitidos

**Índices:**
- `idx_site_content_section` - busca por seção
- `idx_site_content_key` - busca por chave
- `idx_site_content_type` - busca por tipo

**Seções Populadas:**
- `hero` - Banner principal
- `stats` - Estatísticas (35 anos, +10k clientes, etc)
- `features` - Diferenciais
- `contact` - Informações de contato
- `business_hours` - Horário de funcionamento
- `about` - Sobre a empresa
- `promo_banner` - Banner promocional
- `social_links` - Redes sociais

---

### 3. **media**
**Propósito:** Biblioteca central de mídia (imagens, PDFs, etc)

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID (PK) | Identificador único |
| `name` | TEXT | Nome do arquivo |
| `url` | TEXT | URL de acesso |
| `type` | TEXT | MIME type |
| `size` | INTEGER | Tamanho em bytes |
| `alt_text` | TEXT | Texto alternativo (SEO) |
| `created_at` | TIMESTAMPTZ | Data de upload |
| `updated_at` | TIMESTAMPTZ | Última atualização |

**Índices:**
- `idx_media_type` - filtrar por tipo
- `idx_media_created_at` - ordenar por data

---

### 4. **testimonials**
**Propósito:** Depoimentos e avaliações de clientes

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID (PK) | Identificador único |
| `name` | TEXT | Nome do cliente |
| `rating` | INTEGER | Avaliação (1-5 estrelas) |
| `comment` | TEXT | Depoimento |
| `location` | TEXT | Localização do cliente |
| `image_url` | TEXT | Foto do cliente (opcional) |
| `is_active` | BOOLEAN | Visível no site? |
| `order` | INTEGER | Ordem de exibição |
| `created_at` | TIMESTAMPTZ | Data de criação |
| `updated_at` | TIMESTAMPTZ | Última atualização |

**Constraints:**
- ✅ Rating entre 1 e 5

**Índices:**
- `idx_testimonials_active` - filtrar ativos
- `idx_testimonials_order` - ordenação
- `idx_testimonials_rating` - filtrar por nota

**Dados Iniciais:** 3 depoimentos de exemplo

---

### 5. **gallery**
**Propósito:** Galeria de fotos do site

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID (PK) | Identificador único |
| `title` | TEXT | Título da imagem |
| `image_url` | TEXT | URL da imagem |
| `alt_text` | TEXT | Texto alternativo (SEO) |
| `order` | INTEGER | Ordem de exibição |
| `is_active` | BOOLEAN | Visível no site? |
| `created_at` | TIMESTAMPTZ | Data de criação |
| `updated_at` | TIMESTAMPTZ | Última atualização |

**Índices:**
- `idx_gallery_active` - filtrar ativos
- `idx_gallery_order` - ordenação

**Dados Iniciais:** 6 imagens de exemplo (Unsplash)

---

### 6. **settings**
**Propósito:** Configurações globais do site

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID (PK) | Identificador único |
| `key` | TEXT (UNIQUE) | Chave da configuração |
| `value` | JSONB | Valor (flexível) |
| `description` | TEXT | Descrição |
| `updated_at` | TIMESTAMPTZ | Última atualização |

**Índice:**
- `idx_settings_key` - busca rápida

**Configurações Populadas:**
- `site_name` - Nome do site
- `site_description` - Descrição para SEO
- `logo_url` - Logo principal
- `primary_color` - Cor primária (#ef4444)
- `secondary_color` - Cor secundária (#f97316)
- `menu_url` - Link do cardápio externo
- `meta_keywords` - Palavras-chave SEO

---

## 🔒 Segurança (Row Level Security)

### Políticas Públicas (SELECT)
✅ Qualquer pessoa pode ler:
- `site_content` - Todo conteúdo
- `testimonials` - Apenas ativos (`is_active = true`)
- `gallery` - Apenas ativos (`is_active = true`)
- `media` - Toda biblioteca
- `settings` - Todas configurações

### Políticas Restritas (INSERT/UPDATE/DELETE)
🔐 Apenas usuários autenticados podem modificar:
- `site_content` - Editors e Admins
- `testimonials` - Editors e Admins
- `gallery` - Editors e Admins
- `media` - Editors e Admins
- `settings` - **Apenas Admins**
- `admin_users` - **Apenas Admins**

---

## 📁 Storage (Supabase Storage)

### Bucket: `media`
- **Tipo:** Público (leitura)
- **Propósito:** Armazenar imagens e arquivos
- **Políticas:**
  - ✅ Qualquer um pode **visualizar**
  - 🔐 Apenas autenticados podem **upload**
  - 🔐 Apenas autenticados podem **atualizar**
  - 🔐 Apenas autenticados podem **deletar**

---

## ⚙️ Triggers e Automações

### 1. **Auto-Update Timestamps**
Todas as tabelas com `updated_at` atualizam automaticamente via trigger:
```sql
CREATE TRIGGER update_{table}_updated_at
BEFORE UPDATE ON {table}
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2. **Cleanup Órfãos**
Função disponível para limpar arquivos não referenciados:
```sql
SELECT cleanup_orphaned_storage_objects();
```

---

## 📈 Índices para Performance

Total de **11 índices** criados para otimizar queries:

| Tabela | Índice | Propósito |
|--------|--------|-----------|
| site_content | section, key, type | Busca rápida por seção/chave/tipo |
| media | type, created_at | Filtrar e ordenar mídia |
| testimonials | is_active, order, rating | Listar depoimentos ativos |
| gallery | is_active, order | Listar galeria ativa |
| settings | key | Buscar configuração |

---

## 🎯 Relacionamentos

```
auth.users (1) ──── (1) admin_users
       ↓
   Protege todas as operações de modificação
```

Não há Foreign Keys entre as tabelas de conteúdo, permitindo máxima flexibilidade.

---

## 📊 Estatísticas de Dados Iniciais

| Tabela | Registros | Status |
|--------|-----------|--------|
| admin_users | 0 | ⏳ Criar manualmente |
| site_content | ~30 | ✅ Populado |
| testimonials | 3 | ✅ Populado |
| gallery | 6 | ✅ Populado |
| settings | 7 | ✅ Populado |
| media | 0 | ⏳ Popular via uploads |

**Total:** ~46 registros iniciais

---

## 🔄 Migrations Disponíveis

1. **001_initial_schema.sql** - Estrutura completa
2. **002_seed_data.sql** - Dados iniciais
3. **003_storage_setup.sql** - Configuração de storage

**Utilitários:**
- `inspect_schema.sql` - Visualizar estrutura
- `rollback_all.sql` - Resetar tudo (CUIDADO!)

---

## ✅ Checklist de Implementação

- [x] Tabelas criadas
- [x] RLS habilitado
- [x] Políticas configuradas
- [x] Triggers ativos
- [x] Índices criados
- [x] Storage configurado
- [x] Dados iniciais inseridos
- [ ] Primeiro admin criado
- [ ] Testado no frontend

---

**Próximo passo:** Criar primeiro usuário admin e testar autenticação! 🚀
