/**
 * Script para criar usuário admin no projeto sitewilliam
 *
 * Execute este script no navegador (Console) após fazer login no Supabase
 * ou use com Node.js instalando as dependências necessárias.
 */

const SUPABASE_URL = 'https://lteokgdvxnnpbyiykezt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0ZW9rZ2R2eG5ucGJ5aXlrZXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MDY0MTIsImV4cCI6MjA3NjE4MjQxMn0.1SH_rr-2UJ3okGev7i94gHUkF24t_jrmh5b9tCsjNjM';

const ADMIN_EMAIL = 'admin@admin.com';
const ADMIN_PASSWORD = '123456';

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
