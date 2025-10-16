/**
 * Users Hooks
 * 
 * Hooks customizados usando React Query para gerenciar usuários administrativos.
 * 
 * @module hooks/use-users
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  usersService,
  type CreateUserInput,
  type UpdateRoleInput,
  type ResetPasswordInput,
} from '@/services/users-service';
import { useToast } from '@/hooks/use-toast';

/**
 * Query keys
 */
export const usersKeys = {
  all: ['users'] as const,
  byId: (id: string) => ['users', id] as const,
  count: ['users', 'count'] as const,
  countByRole: (role: 'admin' | 'editor') => ['users', 'count', role] as const,
};

/**
 * Hook para buscar todos os usuários
 */
export function useUsers() {
  return useQuery({
    queryKey: usersKeys.all,
    queryFn: async () => {
      const { data, error } = await usersService.getAll();
      if (error) throw new Error(error);
      return data;
    },
  });
}

/**
 * Hook para buscar usuário por ID
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: usersKeys.byId(id),
    queryFn: async () => {
      const { data, error } = await usersService.getById(id);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!id,
  });
}

/**
 * Hook para contar total de usuários
 */
export function useUsersCount() {
  return useQuery({
    queryKey: usersKeys.count,
    queryFn: async () => {
      const { data, error } = await usersService.count();
      if (error) throw new Error(error);
      return data;
    },
  });
}

/**
 * Hook para contar por role
 */
export function useUsersCountByRole(role: 'admin' | 'editor') {
  return useQuery({
    queryKey: usersKeys.countByRole(role),
    queryFn: async () => {
      const { data, error } = await usersService.countByRole(role);
      if (error) throw new Error(error);
      return data;
    },
  });
}

/**
 * Hook para criar usuário
 */
export function useCreateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: CreateUserInput) => {
      const { data, error } = await usersService.create(input);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.all });
      queryClient.invalidateQueries({ queryKey: usersKeys.count });

      toast({
        title: 'Usuário criado',
        description: 'O novo usuário foi criado com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao criar usuário',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook para atualizar role
 */
export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: UpdateRoleInput) => {
      const { data, error } = await usersService.updateRole(input);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.all });

      toast({
        title: 'Role atualizada',
        description: 'A permissão do usuário foi atualizada.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao atualizar role',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook para resetar senha
 */
export function useResetUserPassword() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: ResetPasswordInput) => {
      const { data, error } = await usersService.resetPassword(input);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Senha resetada',
        description: 'A senha do usuário foi alterada com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao resetar senha',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook para deletar usuário
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await usersService.delete(userId);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.all });
      queryClient.invalidateQueries({ queryKey: usersKeys.count });

      toast({
        title: 'Usuário removido',
        description: 'O usuário foi deletado do sistema.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao deletar usuário',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
