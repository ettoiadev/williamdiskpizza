# 🚨 INSTRUÇÕES: Criar Usuário Admin no Projeto sitewilliam

## ⚠️ Importante: Não consigo criar usuários no Auth via SQL

O Supabase Auth não permite criação de usuários diretamente via SQL por questões de segurança. Você precisa criar o usuário através da interface ou API.

## 📋 Como Criar o Usuário Admin

### Opção 1: Via Dashboard (Mais Fácil)

1. **Acesse o Dashboard:**
   ```
   https://supabase.com/dashboard/project/lteokgdvxnnpbyiykezt
   ```

2. **Vá para Authentication:**
   - No menu lateral esquerdo, clique em **"Authentication"**
   - Selecione a aba **"Users"**

3. **Crie o Novo Usuário:**
   - Clique no botão **"Add user"**
   - Escolha **"Create new user"**
   - Preencha:
     - **Email:** `admin@admin.com`
     - **Password:** `***REMOVIDO***`
     - **Auto Confirm User:** ✅ Marque esta opção
     - **User Metadata:** (opcional)

4. **Clique em "Create user"**

5. **Copie o UUID do Usuário:**
   - Após criar, você verá uma tabela com usuários
   - Clique no usuário `admin@admin.com`
   - Copie o **UUID** (formato: `123e4567-e89b-12d3-a456-426614174000`)

6. **Adicione à Tabela admin_users:**
   - Vá para **"SQL Editor"** no dashboard
   - Execute esta consulta (substitua `UUID_AQUI` pelo UUID copiado):

   ```sql
   INSERT INTO public.admin_users (id, email, role)
   VALUES ('UUID_AQUI', 'admin@admin.com', 'admin');
   ```

### Opção 2: Via API (Programática)

Se preferir criar via código, você pode usar o Supabase JavaScript SDK:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://lteokgdvxnnpbyiykezt.supabase.co',
  '<ANON_KEY_REMOVIDA>'
)

async function createAdminUser() {
  const { data, error } = await supabase.auth.signUp({
    email: 'admin@admin.com',
    password: '***REMOVIDO***',
    options: {
      data: {
        role: 'admin'
      }
    }
  })

  if (error) {
    console.error('Erro ao criar usuário:', error)
    return
  }

  console.log('Usuário criado:', data.user.id)

  // Agora adicione à tabela admin_users
  const { error: insertError } = await supabase
    .from('admin_users')
    .insert([
      {
        id: data.user.id,
        email: 'admin@admin.com',
        role: 'admin'
      }
    ])

  if (insertError) {
    console.error('Erro ao inserir na tabela admin_users:', insertError)
  } else {
    console.log('Usuário admin criado com sucesso!')
  }
}

createAdminUser()
```

---

## ✅ Após Criar o Usuário

### Testar o Login:
1. Acesse: `http://localhost:8080/admin`
2. Faça login com:
   - **Email:** `admin@admin.com`
   - **Senha:** `***REMOVIDO***`
3. Você deve ser redirecionado para o dashboard

### Verificar no Banco:
Execute esta consulta no SQL Editor para confirmar:
```sql
SELECT * FROM public.admin_users;
```

Resultado esperado:
```
id | email | role | created_at | last_login
UUID | admin@admin.com | admin | TIMESTAMP | NULL
```

---

## 🔒 Segurança

- ✅ **Senha temporária:** `***REMOVIDO***` - altere após primeiro login
- ✅ **Confirmação automática:** Usuário já confirmado
- ✅ **Role admin:** Acesso total ao painel administrativo
- ✅ **UUID único:** Cada usuário tem identificador único

---

## 🚨 Problemas Comuns

### "Email já existe"
- Se aparecer erro de email duplicado, significa que o usuário já foi criado
- Verifique na tabela `admin_users` se já existe

### "Não consegue fazer login"
- Verifique se marcou "Auto Confirm User" ao criar
- Confirme que a senha está correta
- Verifique se inseriu corretamente na tabela `admin_users`

### "Acesso negado ao painel"
- Confirme que o usuário foi inserido na tabela `admin_users`
- Verifique se o role está correto (`admin` ou `editor`)

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no Console do navegador
2. Confirme que o usuário existe na tabela `auth.users`
3. Verifique que foi inserido na tabela `admin_users`
4. Teste a conexão com o banco de dados

**Status:** ⏳ Aguardando criação do usuário admin
