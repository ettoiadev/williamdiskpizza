# 📚 Migrations do Supabase - William Disk Pizza

Este diretório contém as migrations SQL para configurar o banco de dados do CMS.

## 📋 Ordem de Execução

Execute os scripts **na ordem numérica** no SQL Editor do Supabase:

### 1️⃣ `001_initial_schema.sql`
**O que faz:**
- ✅ Cria 6 tabelas principais
- ✅ Configura Row Level Security (RLS)
- ✅ Adiciona triggers para timestamps automáticos
- ✅ Cria índices para performance
- ✅ Define políticas de segurança

**Tabelas criadas:**
- `admin_users` - Usuários administrativos
- `site_content` - Conteúdo dinâmico
- `media` - Biblioteca de mídia
- `testimonials` - Depoimentos
- `gallery` - Galeria de fotos
- `settings` - Configurações gerais

### 2️⃣ `002_seed_data.sql`
**O que faz:**
- ✅ Popula tabelas com dados iniciais
- ✅ Configura conteúdo das seções do site
- ✅ Adiciona 3 depoimentos de exemplo
- ✅ Adiciona 6 imagens de exemplo na galeria
- ✅ Define configurações padrão

### 3️⃣ `003_storage_setup.sql`
**O que faz:**
- ✅ Cria bucket 'media' para uploads
- ✅ Configura políticas de acesso público (leitura)
- ✅ Restringe upload/update/delete para autenticados
- ✅ Cria função para limpar arquivos órfãos

---

## 🚀 Como Executar

### Passo 1: Acessar SQL Editor
1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. No menu lateral, clique em **SQL Editor**
3. Clique em **+ New query**

### Passo 2: Executar Scripts
Para cada arquivo SQL (na ordem):

1. Abra o arquivo no seu editor de código
2. **Copie todo o conteúdo**
3. Cole no SQL Editor do Supabase
4. Clique em **Run** (ou pressione `Ctrl+Enter`)
5. Verifique se apareceu "Success" ✅

### Passo 3: Verificar Tabelas
Após executar todos os scripts:

1. Vá em **Table Editor** no menu lateral
2. Você deve ver as 6 tabelas criadas
3. Algumas já terão dados (seed data)

---

## 🔍 Verificação Rápida

Execute este comando no SQL Editor para verificar se tudo foi criado:

```sql
-- Verificar tabelas criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Contar registros em cada tabela
SELECT 
    'site_content' as table_name, COUNT(*) as records FROM site_content
UNION ALL
SELECT 'testimonials', COUNT(*) FROM testimonials
UNION ALL
SELECT 'gallery', COUNT(*) FROM gallery
UNION ALL
SELECT 'settings', COUNT(*) FROM settings
UNION ALL
SELECT 'media', COUNT(*) FROM media
UNION ALL
SELECT 'admin_users', COUNT(*) FROM admin_users;

-- Verificar bucket de storage
SELECT * FROM storage.buckets WHERE id = 'media';
```

**Resultado esperado:**
- ✅ 6 tabelas públicas
- ✅ ~30 registros em site_content
- ✅ 3 registros em testimonials
- ✅ 6 registros em gallery
- ✅ ~7 registros em settings
- ✅ 1 bucket 'media' criado

---

## 🔐 Configurar Primeiro Usuário Admin

Após executar as migrations, você precisa criar o primeiro usuário admin:

### Opção 1: Via Dashboard (Recomendado)

1. Vá em **Authentication** → **Users** no Supabase
2. Clique em **Add user**
3. Preencha:
   - **Email:** seu@email.com
   - **Password:** senha_forte_aqui
   - Marque: **Auto Confirm User**
4. Clique em **Create user**
5. **Copie o User ID** gerado

6. Volte ao **SQL Editor** e execute:
```sql
-- Substitua 'user-id-aqui' pelo ID copiado
-- Substitua 'seu@email.com' pelo seu email
INSERT INTO public.admin_users (id, email, role)
VALUES ('user-id-aqui', 'seu@email.com', 'admin');
```

### Opção 2: Via SQL (Avançado)

```sql
-- Este método cria usuário E admin de uma vez
-- ATENÇÃO: Substitua os valores antes de executar

DO $$
DECLARE
    new_user_id UUID;
BEGIN
    -- Criar usuário na tabela auth.users
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        confirmation_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'admin@williamdiskpizza.com.br', -- ALTERE AQUI
        crypt('sua_senha_forte', gen_salt('bf')), -- ALTERE AQUI
        NOW(),
        NOW(),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{}',
        FALSE,
        ''
    ) RETURNING id INTO new_user_id;

    -- Criar entrada na tabela admin_users
    INSERT INTO public.admin_users (id, email, role)
    VALUES (new_user_id, 'admin@williamdiskpizza.com.br', 'admin'); -- ALTERE AQUI

    RAISE NOTICE '✅ Usuário admin criado com ID: %', new_user_id;
END $$;
```

---

## 🧪 Testar Conexão

Execute no SQL Editor:

```sql
-- Verificar RLS está ativo
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Todas devem retornar: rowsecurity = true
```

---

## ⚠️ Troubleshooting

### Erro: "relation already exists"
- **Causa:** Tentou executar migration novamente
- **Solução:** Scripts são idempotentes em alguns casos, mas se precisar resetar:
```sql
-- CUIDADO: Isso apaga TUDO!
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

### Erro: "permission denied for table"
- **Causa:** Políticas RLS muito restritivas
- **Solução:** Verifique se você está logado como admin

### Storage não funciona
- **Solução:** Execute novamente o script `003_storage_setup.sql`

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no Supabase Dashboard
2. Consulte a [documentação oficial](https://supabase.com/docs)
3. Revise as políticas RLS nas tabelas

---

## ✅ Próximos Passos

Após executar com sucesso:
1. ✅ Fase 2 completa - Banco de dados configurado
2. ⏳ Fase 3 - Sistema de autenticação
3. ⏳ Fase 4 - Desenvolver serviços/API
4. ⏳ Fase 5 - Upload de arquivos
5. ⏳ Fase 6 - Interface administrativa

**Boa sorte! 🚀**
