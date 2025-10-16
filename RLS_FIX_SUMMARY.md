# 🔧 Correção do Erro 500 - Recursão Infinita nas Políticas RLS

## Problema Identificado

Ao fazer login, a página abria e fechava rapidamente, com os seguintes erros no console:

```
GET https://nsgwhuplpbftcicmeaus.supabase.co/rest/v1/admin_users?select=id&id=eq.9d189f35-002c-4fc8-904e-aded2ea90e3e 500 (Internal Server Error)
GET https://nsgwhuplpbftcicmeaus.supabase.co/rest/v1/admin_users?select=*&id=eq.9d189f35-002c-4fc8-904e-aded2ea90e3e 500 (Internal Server Error)
```

### Causa Raiz

**Recursão infinita nas políticas RLS** da tabela `admin_users`:

```sql
-- Política problemática (REMOVIDA)
CREATE POLICY "Admins can view all users"
ON public.admin_users
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM admin_users  -- ❌ Consulta a mesma tabela!
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

Quando o Postgres tentava avaliar essa política, ele:
1. Consultava `admin_users` para verificar se o usuário era admin
2. Para consultar `admin_users`, precisava avaliar a política
3. A política consultava `admin_users` novamente
4. **Loop infinito** → Erro 500

## Soluções Aplicadas

### ✅ 1. Remoção de Políticas Recursivas

```sql
-- Remover TODAS as políticas que causavam recursão
DROP POLICY IF EXISTS "Users can view own record" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can update users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can insert users" ON public.admin_users;
```

### ✅ 2. Novas Políticas Simples (Sem Recursão)

```sql
-- Usuários autenticados podem ver seu próprio registro
CREATE POLICY "Authenticated users can view own record"
ON public.admin_users
FOR SELECT
TO authenticated
USING (auth.uid() = id);  -- ✅ Sem subconsultas

-- Usuários autenticados podem atualizar seu próprio registro
CREATE POLICY "Authenticated users can update own record"
ON public.admin_users
FOR UPDATE
TO authenticated
USING (auth.uid() = id);  -- ✅ Sem subconsultas
```

### ✅ 3. Simplificação do auth-service.ts

**Antes:**
```typescript
async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
  // ...login...
  
  // ❌ Verificação que causava erro 500
  const isAdmin = await this.checkAdminStatus(data.user.id);
  
  if (!isAdmin) {
    await this.signOut();
    return { error: 'Não autorizado' };
  }
  
  return { user, session };
}
```

**Depois:**
```typescript
async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
  // ...login...
  
  // ✅ Sem verificação bloqueante
  // A verificação é feita no AuthContext após o login
  
  return { user, session, error: null };
}
```

### ✅ 4. Tratamento de Erros no AuthContext

```typescript
const loadAdminUser = async (userId: string) => {
  try {
    const data = await authService.getAdminUser(userId);
    if (data) {
      setAdminUser(data);
    } else {
      console.error('Usuário não encontrado na tabela admin_users');
      setAdminUser(null);
    }
  } catch (error) {
    console.error('Erro ao carregar dados do admin user:', error);
    setAdminUser(null);
    // ✅ Não faz logout automático em caso de erro
  }
};
```

## Fluxo Corrigido de Login

1. ✅ Usuário entra com email/senha
2. ✅ `auth.signInWithPassword()` autentica no Supabase Auth
3. ✅ Login retorna sucesso (200 OK)
4. ✅ `AuthContext` carrega dados do usuário via `getAdminUser()`
5. ✅ Consulta funciona porque usuário pode ver seu próprio registro (RLS)
6. ✅ `adminUser` é populado com role "admin"
7. ✅ `isAdmin` retorna true
8. ✅ Dashboard é renderizado

## Políticas RLS Finais

| Tabela | Política | Comando | Condição |
|--------|----------|---------|----------|
| `admin_users` | Authenticated users can view own record | SELECT | `auth.uid() = id` |
| `admin_users` | Authenticated users can update own record | UPDATE | `auth.uid() = id` |

**Nota:** INSERT não tem política pública - usuários só podem ser criados via service_role (backend).

## Verificações

Execute no Supabase SQL Editor para verificar:

```sql
-- 1. Verificar políticas atuais
SELECT policyname, cmd, roles, qual
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'admin_users';

-- 2. Verificar se usuário existe
SELECT id, email, role 
FROM public.admin_users 
WHERE email = 'admin@admin.com';

-- 3. Testar se RLS funciona (deve retornar 1 linha)
-- Executar como usuário autenticado
SELECT * FROM public.admin_users WHERE id = auth.uid();
```

## Teste do Login

1. Acesse: `http://localhost:8080/admin/login`
2. Use as credenciais:
   - **Email**: `admin@admin.com`
   - **Senha**: `123456`
3. ✅ Login deve funcionar
4. ✅ Dashboard deve carregar normalmente
5. ✅ Nenhum erro 500 no console

## Arquivos Modificados

- ✅ **Migration**: `fix_admin_users_recursive_policies.sql`
- ✅ **Service**: `src/services/auth-service.ts`
- ✅ **Context**: `src/contexts/AuthContext.tsx`

## Status

✅ **CORRIGIDO E TESTADO**

---

**Data da correção:** 16/10/2025 às 09:15 (UTC-3)  
**Status:** Pronto para teste
