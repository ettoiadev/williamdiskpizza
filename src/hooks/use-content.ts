/**
 * Content Hooks
 * 
 * Hooks customizados usando React Query para gerenciar conteúdo do site.
 * Fornece cache automático, revalidação e estados de loading/error.
 * 
 * @module hooks/use-content
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentService, type ContentInput } from '@/services/content-service';
import { useToast } from '@/hooks/use-toast';

/**
 * Query keys para cache
 */
export const contentKeys = {
  all: ['site_content'] as const,
  bySection: (section: string) => ['site_content', section] as const,
  byKey: (section: string, key: string) => ['site_content', section, key] as const,
  sections: ['site_content', 'sections'] as const,
  byType: (type: string) => ['site_content', 'type', type] as const,
};

/**
 * Hook para buscar todo o conteúdo
 * 
 * @example
 * ```typescript
 * const { data: content, isLoading, error } = useContent();
 * ```
 */
export function useContent() {
  return useQuery({
    queryKey: contentKeys.all,
    queryFn: async () => {
      const { data, error } = await contentService.getAll();
      if (error) throw new Error(error);
      return data;
    },
  });
}

/**
 * Hook para buscar conteúdo por seção
 * 
 * @param section - Nome da seção
 * 
 * @example
 * ```typescript
 * const { data: heroContent } = useContentBySection('hero');
 * ```
 */
export function useContentBySection(section: string) {
  return useQuery({
    queryKey: contentKeys.bySection(section),
    queryFn: async () => {
      const { data, error } = await contentService.getBySection(section);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!section,
  });
}

/**
 * Hook para buscar item específico
 * 
 * @param section - Nome da seção
 * @param key - Chave do item
 * 
 * @example
 * ```typescript
 * const { data: title } = useContentByKey('hero', 'title');
 * ```
 */
export function useContentByKey(section: string, key: string) {
  return useQuery({
    queryKey: contentKeys.byKey(section, key),
    queryFn: async () => {
      const { data, error } = await contentService.getByKey(section, key);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!section && !!key,
  });
}

/**
 * Hook para listar seções
 * 
 * @example
 * ```typescript
 * const { data: sections } = useSections();
 * ```
 */
export function useSections() {
  return useQuery({
    queryKey: contentKeys.sections,
    queryFn: async () => {
      const { data, error } = await contentService.getSections();
      if (error) throw new Error(error);
      return data;
    },
  });
}

/**
 * Hook para criar/atualizar conteúdo
 * 
 * @example
 * ```typescript
 * const mutation = useUpsertContent();
 * 
 * mutation.mutate({
 *   section: 'hero',
 *   key: 'title',
 *   value: 'Novo Título',
 *   type: 'text'
 * });
 * ```
 */
export function useUpsertContent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: ContentInput) => {
      const { data, error } = await contentService.upsert(input);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: contentKeys.all });
      queryClient.invalidateQueries({ queryKey: contentKeys.bySection(data!.section) });
      
      toast({
        title: 'Conteúdo salvo!',
        description: 'As alterações foram aplicadas com sucesso.',
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
 * Hook para atualizar múltiplos itens
 * 
 * @example
 * ```typescript
 * const mutation = useUpsertManyContent();
 * 
 * mutation.mutate([
 *   { section: 'hero', key: 'title', value: 'Título', type: 'text' },
 *   { section: 'hero', key: 'subtitle', value: 'Subtítulo', type: 'text' }
 * ]);
 * ```
 */
export function useUpsertManyContent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (items: ContentInput[]) => {
      const { data, error } = await contentService.upsertMany(items);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.all });
      
      toast({
        title: 'Conteúdos salvos!',
        description: 'Todas as alterações foram aplicadas.',
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
 * Hook para deletar conteúdo
 * 
 * @example
 * ```typescript
 * const mutation = useDeleteContent();
 * 
 * mutation.mutate({ section: 'hero', key: 'old_field' });
 * ```
 */
export function useDeleteContent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ section, key }: { section: string; key: string }) => {
      const { data, error } = await contentService.delete(section, key);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: contentKeys.all });
      queryClient.invalidateQueries({ queryKey: contentKeys.bySection(variables.section) });
      
      toast({
        title: 'Item deletado',
        description: 'O item foi removido com sucesso.',
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
