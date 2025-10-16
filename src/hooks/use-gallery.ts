/**
 * Gallery Hooks
 * 
 * Hooks customizados usando React Query para gerenciar galeria de imagens.
 * 
 * @module hooks/use-gallery
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { galleryService, type GalleryInput, type GalleryUpdate } from '@/services/gallery-service';
import { useToast } from '@/hooks/use-toast';

/**
 * Query keys
 */
export const galleryKeys = {
  all: ['gallery'] as const,
  active: ['gallery', 'active'] as const,
  byId: (id: string) => ['gallery', id] as const,
  count: ['gallery', 'count'] as const,
};

/**
 * Hook para buscar galeria completa
 * 
 * @param activeOnly - Retornar apenas itens ativos?
 */
export function useGallery(activeOnly = false) {
  return useQuery({
    queryKey: activeOnly ? galleryKeys.active : galleryKeys.all,
    queryFn: async () => {
      const { data, error } = await galleryService.getAll(activeOnly);
      if (error) throw new Error(error);
      return data;
    },
  });
}

/**
 * Hook para buscar item por ID
 * 
 * @param id - ID do item
 */
export function useGalleryItem(id: string) {
  return useQuery({
    queryKey: galleryKeys.byId(id),
    queryFn: async () => {
      const { data, error } = await galleryService.getById(id);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!id,
  });
}

/**
 * Hook para contar itens
 */
export function useGalleryCount(activeOnly = false) {
  return useQuery({
    queryKey: [...galleryKeys.count, activeOnly],
    queryFn: async () => {
      const { data, error } = await galleryService.count(activeOnly);
      if (error) throw new Error(error);
      return data;
    },
  });
}

/**
 * Hook para criar item na galeria
 */
export function useCreateGalleryItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: GalleryInput) => {
      const { data, error } = await galleryService.create(input);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
      queryClient.invalidateQueries({ queryKey: galleryKeys.active });
      queryClient.invalidateQueries({ queryKey: galleryKeys.count });
      
      toast({
        title: 'Imagem adicionada!',
        description: 'A imagem foi adicionada à galeria.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao adicionar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook para atualizar item
 */
export function useUpdateGalleryItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: GalleryUpdate) => {
      const { data, error } = await galleryService.update(input);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
      queryClient.invalidateQueries({ queryKey: galleryKeys.active });
      queryClient.invalidateQueries({ queryKey: galleryKeys.byId(data!.id) });
      
      toast({
        title: 'Imagem atualizada!',
        description: 'As alterações foram salvas.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao atualizar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook para deletar item
 */
export function useDeleteGalleryItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await galleryService.delete(id);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
      queryClient.invalidateQueries({ queryKey: galleryKeys.active });
      queryClient.invalidateQueries({ queryKey: galleryKeys.count });
      
      toast({
        title: 'Imagem removida',
        description: 'A imagem foi deletada da galeria.',
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

/**
 * Hook para ativar/desativar item
 */
export function useToggleGalleryItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data, error } = await galleryService.toggleActive(id, isActive);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
      queryClient.invalidateQueries({ queryKey: galleryKeys.active });
      
      toast({
        title: variables.isActive ? 'Item ativado' : 'Item desativado',
        description: `A imagem foi ${variables.isActive ? 'ativada' : 'desativada'}.`,
      });
    },
  });
}

/**
 * Hook para reordenar galeria
 */
export function useReorderGallery() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (items: Array<{ id: string; order: number }>) => {
      const { data, error } = await galleryService.reorder(items);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
      queryClient.invalidateQueries({ queryKey: galleryKeys.active });
      
      toast({
        title: 'Ordem atualizada',
        description: 'A galeria foi reordenada.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao reordenar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
