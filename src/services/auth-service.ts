/**
 * Authentication Service
 * 
 * Serviço centralizado para gerenciar autenticação de usuários.
 * Integra com Supabase Auth e gerencia sessões.
 * 
 * @module services/auth-service
 */

import { supabase } from '@/lib/supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import type { AdminUser } from '@/types/cms';

/**
 * Resposta de autenticação
 */
interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

/**
 * Dados de login
 */
interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Dados de registro
 */
interface SignUpCredentials extends LoginCredentials {
  role?: 'admin' | 'editor';
}

/**
 * AuthService - Gerencia todas as operações de autenticação
 * 
 * @example
 * ```typescript
 * import { authService } from '@/services/auth-service';
 * 
 * // Login
 * const { user, error } = await authService.signIn({
 *   email: 'admin@admin.com',
 *   password: '123456'
 * });
 * ```
 */
class AuthService {
  /**
   * Fazer login com email e senha
   * 
   * @param credentials - Email e senha do usuário
   * @returns Dados do usuário ou erro
   */
  async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return { user: null, session: null, error };
      }

      // Atualizar último login (não bloquear se falhar)
      try {
        await this.updateLastLogin(data.user.id);
      } catch (updateError) {
        console.warn('Failed to update last login:', updateError);
      }

      return {
        user: data.user,
        session: data.session,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as AuthError,
      };
    }
  }

  /**
   * Criar novo usuário admin/editor
   * 
   * @param credentials - Email, senha e role
   * @returns Dados do usuário ou erro
   * 
   * @example
   * ```typescript
   * const { user, error } = await authService.signUp({
   *   email: 'editor@example.com',
   *   password: 'senha123',
   *   role: 'editor'
   * });
   * ```
   */
  async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      });

      if (error || !data.user) {
        return { user: null, session: null, error };
      }

      // Adicionar usuário à tabela admin_users
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert({
          id: data.user.id,
          email: credentials.email,
          role: credentials.role || 'editor',
        });

      if (insertError) {
        // Se falhar ao inserir, deletar usuário do auth
        await supabase.auth.admin.deleteUser(data.user.id);
        
        return {
          user: null,
          session: null,
          error: {
            name: 'DatabaseError',
            message: 'Erro ao criar usuário administrativo.',
            status: 500,
          } as AuthError,
        };
      }

      return {
        user: data.user,
        session: data.session,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as AuthError,
      };
    }
  }

  /**
   * Fazer logout
   * 
   * @returns Resultado da operação
   */
  async signOut(): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  /**
   * Obter usuário atual
   * 
   * @returns Usuário atual ou null
   */
  async getCurrentUser(): Promise<User | null> {
    const { data } = await supabase.auth.getUser();
    return data.user;
  }

  /**
   * Obter sessão atual
   * 
   * @returns Sessão atual ou null
   */
  async getCurrentSession(): Promise<Session | null> {
    const { data } = await supabase.auth.getSession();
    return data.session;
  }

  /**
   * Verificar se usuário está autenticado
   * 
   * @returns True se autenticado
   */
  async isAuthenticated(): Promise<boolean> {
    const session = await this.getCurrentSession();
    return !!session;
  }

  /**
   * Obter dados completos do admin user
   * 
   * @param userId - ID do usuário
   * @returns Dados do admin ou null
   */
  async getAdminUser(userId: string): Promise<AdminUser | null> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return data as AdminUser;
  }

  /**
   * Verificar se usuário é admin
   * 
   * @param userId - ID do usuário
   * @returns True se é admin
   */
  async isAdmin(userId: string): Promise<boolean> {
    const adminUser = await this.getAdminUser(userId);
    return adminUser?.role === 'admin';
  }

  /**
   * Verificar se usuário tem permissão administrativa
   * 
   * @param userId - ID do usuário
   * @returns True se tem permissão
   */
  private async checkAdminStatus(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', userId)
      .single();

    return !error && !!data;
  }

  /**
   * Atualizar timestamp de último login
   * 
   * @param userId - ID do usuário
   */
  private async updateLastLogin(userId: string): Promise<void> {
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userId);
  }

  /**
   * Alterar senha do usuário atual
   * 
   * @param newPassword - Nova senha
   * @returns Resultado da operação
   */
  async updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    return { error };
  }

  /**
   * Enviar email de recuperação de senha
   * 
   * @param email - Email do usuário
   * @returns Resultado da operação
   */
  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });

    return { error };
  }

  /**
   * Atualizar email do usuário
   * 
   * @param newEmail - Novo email
   * @returns Resultado da operação
   */
  async updateEmail(newEmail: string): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.updateUser({
      email: newEmail,
    });

    return { error };
  }

  /**
   * Verificar se email já está em uso
   * 
   * @param email - Email para verificar
   * @returns True se email já existe
   */
  async emailExists(email: string): Promise<boolean> {
    const { data } = await supabase
      .from('admin_users')
      .select('email')
      .eq('email', email)
      .single();

    return !!data;
  }
}

// Exportar instância única (singleton)
export const authService = new AuthService();
