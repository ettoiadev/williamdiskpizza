/**
 * Script para criar usuário admin no projeto sitewilliam
 *
 * Execute este script no navegador (Console) após fazer login no Supabase
 * ou use com Node.js instalando as dependências necessárias.
 */

// ⚠️ Preencha com os valores do seu projeto antes de executar.
// NÃO faça commit deste arquivo com credenciais reais.
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://SEU_PROJETO.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'SUA_ANON_KEY_AQUI';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@exemplo.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'DEFINA_UMA_SENHA_FORTE';

/**
 * Cria usuário admin usando Supabase Auth
 */
async function createAdminUser() {
  try {
    console.log('🔄 Criando usuário admin...');

    // Criar usuário no Auth
    const authResponse = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        data: {
          role: 'admin'
        }
      }),
    });

    if (!authResponse.ok) {
      const error = await authResponse.json();
      console.error('❌ Erro ao criar usuário:', error);
      return;
    }

    const authData = await authResponse.json();
    console.log('✅ Usuário criado no Auth:', authData.user.id);

    // Aguardar um pouco para garantir que o usuário foi criado
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Adicionar à tabela admin_users
    const settingsResponse = await fetch(`${SUPABASE_URL}/rest/v1/admin_users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        id: authData.user.id,
        email: ADMIN_EMAIL,
        role: 'admin'
      }),
    });

    if (!settingsResponse.ok) {
      const error = await settingsResponse.json();
      console.error('❌ Erro ao inserir na tabela admin_users:', error);
      return;
    }

    console.log('✅ Usuário admin criado com sucesso!');
    console.log('📧 Email:', ADMIN_EMAIL);
    console.log('🔑 Senha:', ADMIN_PASSWORD);
    console.log('🎯 UUID:', authData.user.id);

    // Testar login
    console.log('🔍 Testando login...');
    const loginResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    });

    if (loginResponse.ok) {
      console.log('✅ Login testado com sucesso!');
    } else {
      console.log('⚠️ Login pode precisar de confirmação de email');
    }

  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

/**
 * Como usar:
 *
 * 1. Abra o navegador e vá para qualquer página do seu site
 * 2. Abra o Console do desenvolvedor (F12)
 * 3. Cole e execute este código:
 *
 * createAdminUser();
 *
 * Ou execute no Node.js (após instalar as dependências necessárias)
 */

// Para uso no Node.js, você precisaria instalar:
// npm install node-fetch@2

// createAdminUser();
