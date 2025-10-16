/**
 * Settings Hooks
 * 
 * Hooks customizados usando React Query para gerenciar configurações do site.
 * 
 * @module hooks/use-settings
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService, type SettingInput } from '@/services/settings-service';
import { useToast } from '@/hooks/use-toast';

/**
 * Query keys
 */
export const settingsKeys = {
  all: ['settings'] as const,
  byKey: (key: string) => ['settings', key] as const,
  byKeys: (keys: string[]) => ['settings', 'keys', keys] as const,
  seo: ['settings', 'seo'] as const,
  theme: ['settings', 'theme'] as const,
  asObject: ['settings', 'object'] as const,
};

/**
 * Hook para buscar todas as configurações
 */
export function useSettings() {
  return useQuery({
    queryKey: settingsKeys.all,
    queryFn: async () => {
      const { data, error } = await settingsService.getAll();
      if (error) throw new Error(error);
      return data;
    },
  });
}

/**
 * Hook para buscar configuração por chave
 */
export function useSetting(key: string) {
  return useQuery({
    queryKey: settingsKeys.byKey(key),
    queryFn: async () => {
      const { data, error } = await settingsService.getByKey(key);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!key,
  });
}

/**
 * Hook para buscar múltiplas configurações
 */
export function useSettingsByKeys(keys: string[]) {
  return useQuery({
    queryKey: settingsKeys.byKeys(keys),
    queryFn: async () => {
      const { data, error } = await settingsService.getByKeys(keys);
      if (error) throw new Error(error);
      return data;
    },
    enabled: keys.length > 0,
  });
}

/**
 * Hook para configurações de SEO
 */
export function useSEOSettings() {
  return useQuery({
    queryKey: settingsKeys.seo,
    queryFn: async () => {
      const { data, error } = await settingsService.getSEOSettings();
      if (error) throw new Error(error);
      return data;
    },
  });
}

/**
 * Hook para configurações de tema
 */
export function useThemeSettings() {
  return useQuery({
    queryKey: settingsKeys.theme,
    queryFn: async () => {
      const { data, error } = await settingsService.getThemeSettings();
      if (error) throw new Error(error);
      return data;
    },
  });
}

/**
 * Hook para obter configurações como objeto
 */
export function useSettingsObject() {
  return useQuery({
    queryKey: settingsKeys.asObject,
    queryFn: async () => {
      const { data, error } = await settingsService.getAsObject();
      if (error) throw new Error(error);
      return data;
    },
  });
}

/**
 * Hook para criar/atualizar configuração
 */
export function useUpsertSetting() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: SettingInput) => {
      const { data, error } = await settingsService.upsert(input);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
      queryClient.invalidateQueries({ queryKey: settingsKeys.byKey(data!.key) });
      queryClient.invalidateQueries({ queryKey: settingsKeys.asObject });
      
      toast({
        title: 'Configuração salva!',
        description: 'A configuração foi atualizada.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook para atualizar múltiplas configurações
 */
export function useUpsertManySettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (items: SettingInput[]) => {
      const { data, error } = await settingsService.upsertMany(items);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
      queryClient.invalidateQueries({ queryKey: settingsKeys.asObject });
      queryClient.invalidateQueries({ queryKey: settingsKeys.seo });
      queryClient.invalidateQueries({ queryKey: settingsKeys.theme });
      
      toast({
        title: 'Configurações salvas!',
        description: 'Todas as configurações foram atualizadas.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook para deletar configuração
 */
export function useDeleteSetting() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (key: string) => {
      const { data, error } = await settingsService.delete(key);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (_, key) => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
      queryClient.invalidateQueries({ queryKey: settingsKeys.byKey(key) });
      queryClient.invalidateQueries({ queryKey: settingsKeys.asObject });
      
      toast({
        title: 'Configuração removida',
        description: 'A configuração foi deletada.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao deletar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
