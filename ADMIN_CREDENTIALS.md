# 🔐 Credenciais de Acesso - Admin CMS

## Usuário Administrador Principal

**⚠️ IMPORTANTE: Mantenha estas credenciais seguras!**

---

### Credenciais de Login

| Campo | Valor |
|-------|-------|
| **Email** | `admin@admin.com` |
| **Senha** | `123456` |
| **Role** | `admin` (acesso total) |
| **User ID** | `9d189f35-002c-4fc8-904e-aded2ea90e3e` |

---

### Informações Técnicas

- **Criado em:** 16/10/2025 às 09:00 (UTC-3)
- **Status:** ✅ Ativo e corrigido
- **Último login:** Nunca (primeiro acesso pendente)

---

### Permissões do Admin

Como **admin**, você tem acesso total a:

✅ **Gerenciar Conteúdo**
- Editar textos, imagens, títulos
- Modificar seções do site
- Atualizar informações de contato

✅ **Gerenciar Galeria**
- Upload de imagens
- Reordenar fotos
- Ativar/desativar itens

✅ **Gerenciar Depoimentos**
- Adicionar/editar/remover depoimentos
- Moderar avaliações
- Controlar visibilidade

✅ **Gerenciar Mídia**
- Upload de arquivos
- Organizar biblioteca
- Deletar arquivos não utilizados

✅ **Configurações do Site**
- Alterar cores e logo
- Modificar meta tags (SEO)
- Configurações avançadas

✅ **Gerenciar Usuários**
- Criar novos admins
- Criar editores (acesso limitado)
- Remover usuários

---

## 🚀 Como Acessar

### Opção 1: Dashboard Admin (quando estiver pronto)
```
URL: https://williamdiskpizza.com.br/admin/login
Email: admin@admin.com
Senha: 123456
```

### Opção 2: Supabase Dashboard
1. Acesse: https://app.supabase.com
2. Entre no projeto: **cardapiov3**
3. Vá em **Authentication** → **Users**
4. Você verá o usuário criado

---

## 🔒 Segurança

### ⚠️ Recomendações IMPORTANTES:

1. **Altere a senha imediatamente após primeiro acesso**
   - Use uma senha forte (mínimo 12 caracteres)
   - Inclua letras maiúsculas, minúsculas, números e símbolos

2. **Não compartilhe estas credenciais**
   - Crie usuários específicos para cada pessoa
   - Use role "editor" para usuários com acesso limitado

3. **Mantenha este arquivo seguro**
   - Não commite no Git
   - Guarde em local seguro
   - Considere usar gerenciador de senhas

4. **Configure autenticação de dois fatores (2FA)**
   - Quando disponível no sistema

---

## 👥 Criar Outros Usuários

### Editor (acesso limitado)
```sql
-- Criar um editor (não pode gerenciar usuários nem settings)
-- Execute no SQL Editor do Supabase

-- Substitua email e senha
DO $$
DECLARE
    new_user_id UUID;
BEGIN
    INSERT INTO auth.users (
        instance_id, id, aud, role, email,
        encrypted_password, email_confirmed_at,
        created_at, updated_at,
        raw_app_meta_data, raw_user_meta_data,
        is_super_admin, confirmation_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated', 'authenticated',
        'editor@williamdiskpizza.com.br',  -- ALTERE AQUI
        crypt('senha_forte_aqui', gen_salt('bf')),  -- ALTERE AQUI
        NOW(), NOW(), NOW(),
        '{"provider":"email","providers":["email"]}',
        '{}', FALSE, ''
    ) RETURNING id INTO new_user_id;

    INSERT INTO public.admin_users (id, email, role)
    VALUES (new_user_id, 'editor@williamdiskpizza.com.br', 'editor');  -- ALTERE AQUI
    
    RAISE NOTICE 'Editor criado com sucesso!';
END $$;
```

---

## 🆘 Recuperação de Acesso

### Esqueceu a senha?

**Opção 1: Reset via Supabase**
1. Vá no Supabase Dashboard
2. **Authentication** → **Users**
3. Clique no usuário
4. **Reset Password**

**Opção 2: SQL Direto**
```sql
-- Resetar senha para "novasenha123"
UPDATE auth.users
SET encrypted_password = crypt('novasenha123', gen_salt('bf'))
WHERE email = 'admin@admin.com';
```

---

## 📊 Status do Sistema

- ✅ Banco de dados configurado
- ✅ Usuário admin criado
- ✅ Dados iniciais inseridos (48 registros)
- ⏳ Interface admin em desenvolvimento
- ⏳ Sistema de login em desenvolvimento

---

## 📞 Suporte

Se tiver problemas com acesso:
1. Verifique se o email está correto
2. Verifique se a senha está correta
3. Consulte os logs do Supabase
4. Verifique se o usuário existe na tabela `admin_users`

---

**Data de criação deste documento:** 15/10/2025  
**Última atualização:** 16/10/2025 - ⚠️ Usuário recriado para corrigir erro de schema
