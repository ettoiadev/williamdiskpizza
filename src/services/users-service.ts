/**
 * Users Service
 * 
 * Serviço para gerenciar usuários administrativos (admin/editor).
 * Usa Edge Function para operações que requerem service_role.
 * 
 * @module services/users-service
 */

import { supabase } from '@/lib/supabase';
import type { ApiResponse, AdminUser } from '@/types/cms';

/**
 * Dados para criar usuário
 */
export interface CreateUserInput {
  email: string;
  password: string;
  role: 'admin' | 'editor';
}

/**
 * Dados para atualizar role
 */
export interface UpdateRoleInput {
  userId: string;
  role: 'admin' | 'editor';
}

/**
 * Dados para reset de senha
 */
export interface ResetPasswordInput {
  userId: string;
  newPassword: string;
}

/**
 * UsersService - Gerencia usuários administrativos
 */
class UsersService {
  private readonly table = 'admin_users';
  private readonly edgeFunctionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-manage-users`;

  /**
   * Buscar todos os usuários
   */
  async getAll(): Promise<ApiResponse<AdminUser[]>> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as AdminUser[], error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao buscar usuários' };
    }
  }

  /**
   * Buscar usuário por ID
   */
  async getById(id: string): Promise<ApiResponse<AdminUser>> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as AdminUser, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao buscar usuário' };
    }
  }

  /**
   * Criar novo usuário (via Edge Function)
   */
  async create(input: CreateUserInput): Promise<ApiResponse<AdminUser>> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return { data: null, error: 'Não autenticado' };
      }

      const response = await fetch(this.edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action: 'create',
          email: input.email,
          password: input.password,
          role: input.role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { data: null, error: result.error || 'Erro ao criar usuário' };
      }

      return { data: result.data as AdminUser, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao criar usuário' };
    }
  }

  /**
   * Atualizar role do usuário (via Edge Function)
   */
  async updateRole(input: UpdateRoleInput): Promise<ApiResponse<boolean>> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return { data: null, error: 'Não autenticado' };
      }

      const response = await fetch(this.edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action: 'update-role',
          userId: input.userId,
          role: input.role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { data: null, error: result.error || 'Erro ao atualizar role' };
      }

      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao atualizar role' };
    }
  }

  /**
   * Reset de senha (via Edge Function)
   */
  async resetPassword(input: ResetPasswordInput): Promise<ApiResponse<boolean>> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return { data: null, error: 'Não autenticado' };
      }

      const response = await fetch(this.edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action: 'reset-password',
          userId: input.userId,
          newPassword: input.newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { data: null, error: result.error || 'Erro ao resetar senha' };
      }

      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao resetar senha' };
    }
  }

  /**
   * Deletar usuário (via Edge Function)
   */
  async delete(userId: string): Promise<ApiResponse<boolean>> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return { data: null, error: 'Não autenticado' };
      }

      const response = await fetch(this.edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action: 'delete',
          userId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { data: null, error: result.error || 'Erro ao deletar usuário' };
      }

      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao deletar usuário' };
    }
  }

  /**
   * Contar total de usuários
   */
  async count(): Promise<ApiResponse<number>> {
    try {
      const { count, error } = await supabase
        .from(this.table)
        .select('id', { count: 'exact', head: true });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: count || 0, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao contar usuários' };
    }
  }

  /**
   * Contar por role
   */
  async countByRole(role: 'admin' | 'editor'): Promise<ApiResponse<number>> {
    try {
      const { count, error } = await supabase
        .from(this.table)
        .select('id', { count: 'exact', head: true })
        .eq('role', role);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: count || 0, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao contar usuários' };
    }
  }
}

// Exportar instância singleton
export const usersService = new UsersService();
