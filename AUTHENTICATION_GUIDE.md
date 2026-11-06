# 🔐 Guia de Autenticação - William Disk Pizza CMS

## 📋 Visão Geral

Sistema completo de autenticação implementado usando Supabase Auth e React Context API.

---

## 🏗️ Arquitetura

### Componentes Principais

```
src/
├── services/
│   └── auth-service.ts          # Serviço de autenticação
├── contexts/
│   └── AuthContext.tsx          # Context Provider
├── components/
│   └── ProtectedRoute.tsx       # Guard de rotas
└── pages/admin/
    ├── Login.tsx                # Página de login
    └── Dashboard.tsx            # Dashboard protegido
```

---

## 🔧 Como Funciona

### 1. **AuthService** (`auth-service.ts`)

Serviço singleton que gerencia todas as operações de autenticação:

```typescript
import { authService } from '@/services/auth-service';

// Login
const { user, error } = await authService.signIn({
  email: 'admin@admin.com',
  password: '***REMOVIDO***'
});

// Logout
await authService.signOut();

// Verificar se é admin
const isAdmin = await authService.isAdmin(userId);

// Obter dados do admin user
const adminUser = await authService.getAdminUser(userId);
```

**Métodos Disponíveis:**
- ✅ `signIn(credentials)` - Fazer login
- ✅ `signUp(credentials)` - Criar novo usuário
- ✅ `signOut()` - Fazer logout
- ✅ `getCurrentUser()` - Usuário atual
- ✅ `getCurrentSession()` - Sessão atual
- ✅ `isAuthenticated()` - Verificar se está logado
- ✅ `getAdminUser(userId)` - Dados completos do admin
- ✅ `isAdmin(userId)` - Verificar se é admin
- ✅ `updatePassword(newPassword)` - Alterar senha
- ✅ `resetPassword(email)` - Recuperar senha
- ✅ `updateEmail(newEmail)` - Alterar email
- ✅ `emailExists(email)` - Verificar se email existe

---

### 2. **AuthProvider** (`AuthContext.tsx`)

Context Provider que fornece estado de autenticação global:

```typescript
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// No App.tsx
<AuthProvider>
  <YourApp />
</AuthProvider>

// Em qualquer componente
function MyComponent() {
  const { 
    user,           // Usuário atual
    session,        // Sessão atual
    adminUser,      // Dados admin_users
    loading,        // Loading state
    isAuthenticated, // Boolean
    isAdmin,        // Boolean
    signIn,         // Função de login
    signOut,        // Função de logout
    refreshAdminUser // Refresh dados
  } = useAuth();
}
```

**Estados Fornecidos:**
- `user` - Objeto User do Supabase Auth
- `session` - Sessão atual
- `adminUser` - Dados da tabela admin_users (role, etc)
- `loading` - Loading durante verificação inicial
- `isAuthenticated` - true se logado
- `isAdmin` - true se role === 'admin'

**Funções Fornecidas:**
- `signIn(email, password)` - Login
- `signOut()` - Logout
- `refreshAdminUser()` - Atualizar dados do admin

---

### 3. **ProtectedRoute** (`ProtectedRoute.tsx`)

Componente para proteger rotas que requerem autenticação:

```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Rota protegida básica
<Route element={<ProtectedRoute />}>
  <Route path="/admin/dashboard" element={<Dashboard />} />
</Route>

// Rota apenas para admins
<Route element={<ProtectedRoute requireAdmin />}>
  <Route path="/admin/settings" element={<Settings />} />
</Route>

// Com redirecionamento customizado
<Route element={<ProtectedRoute redirectTo="/login" />}>
  <Route path="/protected" element={<Protected />} />
</Route>
```

**Props:**
- `requireAdmin?: boolean` - Requer role admin? (default: false)
- `redirectTo?: string` - Rota de redirecionamento (default: '/admin/login')

**Comportamento:**
- ✅ Mostra loading enquanto verifica auth
- ✅ Redireciona para login se não autenticado
- ✅ Mostra tela de "Acesso Negado" se não for admin (quando requireAdmin=true)
- ✅ Renderiza children se autorizado

---

### 4. **Página de Login** (`Login.tsx`)

Página completa de autenticação com:

- ✅ Formulário de email e senha
- ✅ Toggle de mostrar/ocultar senha
- ✅ Validação de campos
- ✅ Mensagens de erro claras
- ✅ Loading state durante login
- ✅ Redirecionamento automático após login
- ✅ Link "Esqueci minha senha"
- ✅ Credenciais de teste em modo DEV

**Acessar:** `http://localhost:5173/admin/login`

---

### 5. **Dashboard** (`Dashboard.tsx`)

Página principal do painel admin:

- ✅ Header com logo e informações do usuário
- ✅ Botão de logout
- ✅ Cards de estatísticas
- ✅ Ações rápidas (links para outras páginas)
- ✅ Funcionalidades específicas para admins
- ✅ Link para visualizar site público

**Acessar:** `http://localhost:5173/admin/dashboard` (requer login)

---

## 🚀 Como Usar

### Implementar Login em um Componente

```typescript
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error);
      return;
    }
    
    navigate('/admin/dashboard');
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button type="submit">Entrar</button>
    </form>
  );
}
```

---

### Proteger uma Rota

```typescript
// No seu router (App.tsx)
import { ProtectedRoute } from '@/components/ProtectedRoute';

<Routes>
  {/* Rota pública */}
  <Route path="/" element={<Home />} />
  
  {/* Rotas protegidas */}
  <Route element={<ProtectedRoute />}>
    <Route path="/admin/dashboard" element={<Dashboard />} />
    <Route path="/admin/content" element={<ContentEditor />} />
  </Route>
  
  {/* Apenas para admins */}
  <Route element={<ProtectedRoute requireAdmin />}>
    <Route path="/admin/settings" element={<Settings />} />
    <Route path="/admin/users" element={<UserManagement />} />
  </Route>
</Routes>
```

---

### Acessar Dados do Usuário

```typescript
import { useAuth } from '@/contexts/AuthContext';

function UserProfile() {
  const { user, adminUser, isAdmin, signOut } = useAuth();

  return (
    <div>
      <h2>Bem-vindo, {user?.email}</h2>
      <p>Role: {adminUser?.role}</p>
      {isAdmin && <p>Você é um administrador!</p>}
      <button onClick={signOut}>Sair</button>
    </div>
  );
}
```

---

### Verificar Permissões

```typescript
import { useAuth } from '@/contexts/AuthContext';

function AdminButton() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return null; // Não renderizar para não-admins
  }

  return <button>Ação Exclusiva de Admin</button>;
}
```

---

## 🔒 Segurança

### Verificações Implementadas

1. **Row Level Security (RLS)**
   - Todas as tabelas têm RLS ativo
   - Políticas impedem acesso não autorizado

2. **Verificação de Admin Status**
   - Login verifica se usuário existe em `admin_users`
   - Nega acesso se não for admin/editor

3. **Atualização de Last Login**
   - Timestamp atualizado a cada login
   - Útil para auditoria

4. **Proteção de Rotas**
   - Rotas admin sempre verificam autenticação
   - Redirecionamento automático se não autorizado

5. **Session Management**
   - Sessões gerenciadas pelo Supabase
   - Auto-refresh de tokens
   - Persistência de sessão

---

## 🧪 Testar Autenticação

### 1. Testar Login

```bash
# Rodar aplicação
npm run dev

# Acessar login
http://localhost:5173/admin/login

# Credenciais
Email: admin@admin.com
Senha: ***REMOVIDO***
```

### 2. Testar Proteção de Rota

```bash
# Tentar acessar dashboard sem login
http://localhost:5173/admin/dashboard
# Deve redirecionar para /admin/login

# Fazer login e acessar
# Deve funcionar normalmente
```

### 3. Testar Logout

```bash
# No dashboard, clicar em "Sair"
# Deve deslogar e redirecionar para login
```

---

## 📊 Fluxo de Autenticação

```
┌─────────────────────────────────────────┐
│   Usuário acessa /admin/login          │
└───────────────┬─────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│   Preenche email e senha                │
└───────────────┬─────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│   authService.signIn()                  │
│   - Supabase Auth valida credenciais   │
│   - Verifica existência em admin_users  │
│   - Atualiza last_login                 │
└───────────────┬─────────────────────────┘
                ↓
         ┌──────┴───────┐
         │              │
    ✅ Sucesso      ❌ Erro
         │              │
         ↓              ↓
  ┌─────────┐     ┌─────────┐
  │ Session │     │ Mensagem│
  │  Criada │     │  de Erro│
  └────┬────┘     └─────────┘
       ↓
┌─────────────────────────────────────────┐
│   AuthContext atualiza estado:          │
│   - user                                │
│   - session                             │
│   - adminUser                           │
│   - isAuthenticated = true              │
└───────────────┬─────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│   Redireciona para /admin/dashboard     │
└─────────────────────────────────────────┘
```

---

## 🆘 Troubleshooting

### "useAuth deve ser usado dentro de um AuthProvider"

**Causa:** Componente tentando usar `useAuth()` fora do `<AuthProvider>`

**Solução:** Certifique-se de que `<AuthProvider>` envolve sua aplicação no `App.tsx`

---

### Login não funciona / Redireciona para login imediatamente

**Causa:** Credenciais incorretas ou usuário não existe em `admin_users`

**Solução:**
```sql
-- Verificar se usuário existe
SELECT * FROM public.admin_users WHERE email = 'admin@admin.com';

-- Se não existir, criar
-- Veja ADMIN_CREDENTIALS.md
```

---

### Erro: "Supabase URL e/ou Anon Key não configurados"

**Causa:** Arquivo `.env.local` não está configurado

**Solução:**
```bash
# Criar .env.local
cp .env.example .env.local

# Preencher com suas credenciais do Supabase
VITE_SUPABASE_URL=sua-url-aqui
VITE_SUPABASE_ANON_KEY=sua-key-aqui
```

---

### ProtectedRoute sempre mostra loading

**Causa:** Session do Supabase não está inicializando

**Solução:**
1. Verificar se credenciais do Supabase estão corretas
2. Verificar console do browser por erros
3. Limpar localStorage e recarregar

---

## 📝 Próximas Implementações

As seguintes funcionalidades serão adicionadas nas próximas fases:

- [ ] Recuperação de senha por email
- [ ] Troca de senha (perfil do usuário)
- [ ] 2FA (autenticação de dois fatores)
- [ ] Gerenciamento de usuários (admin)
- [ ] Logs de acesso
- [ ] Sessões ativas
- [ ] Expiração de sessão

---

## 📚 Recursos Adicionais

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [React Context API](https://react.dev/reference/react/useContext)
- [React Router Protected Routes](https://reactrouter.com/en/main/start/tutorial)

---

**Última atualização:** 15/10/2025  
**Versão:** 1.0.0
