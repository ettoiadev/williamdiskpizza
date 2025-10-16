/**
 * Media Hooks
 * 
 * Hooks customizados usando React Query para gerenciar biblioteca de mídia.
 * 
 * @module hooks/use-media
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mediaService, type MediaUpdate, type MediaFilters } from '@/services/media-service';
import type { UploadOptions } from '@/services/storage-service';
import { useToast } from '@/hooks/use-toast';

/**
 * Query keys
 */
export const mediaKeys = {
  all: ['media'] as const,
  filtered: (filters?: MediaFilters) => ['media', 'filtered', filters] as const,
  byId: (id: string) => ['media', id] as const,
  images: ['media', 'images'] as const,
  count: ['media', 'count'] as const,
  totalSize: ['media', 'totalSize'] as const,
};

/**
 * Hook para buscar toda a biblioteca de mídia
 */
export function useMedia(filters?: MediaFilters) {
  return useQuery({
    queryKey: mediaKeys.filtered(filters),
    queryFn: async () => {
      const { data, error } = await mediaService.getAll(filters);
      if (error) throw new Error(error);
      return data;
    },
  });
}

/**
 * Hook para buscar mídia por ID
 */
export function useMediaItem(id: string) {
  return useQuery({
    queryKey: mediaKeys.byId(id),
    queryFn: async () => {
      const { data, error } = await mediaService.getById(id);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!id,
  });
}

/**
 * Hook para buscar apenas imagens
 */
export function useImages() {
  return useQuery({
    queryKey: mediaKeys.images,
    queryFn: async () => {
      const { data, error } = await mediaService.getImages();
      if (error) throw new Error(error);
      return data;
    },
  });
}

/**
 * Hook para contar total de arquivos
 */
export function useMediaCount() {
  return useQuery({
    queryKey: mediaKeys.count,
    queryFn: async () => {
      const { data, error } = await mediaService.count();
      if (error) throw new Error(error);
      return data;
    },
  });
}

/**
 * Hook para calcular espaço usado
 */
export function useTotalMediaSize() {
  return useQuery({
    queryKey: mediaKeys.totalSize,
    queryFn: async () => {
      const { data, error } = await mediaService.getTotalSize();
      if (error) throw new Error(error);
      return data;
    },
  });
}

/**
 * Hook para upload de arquivo único
 */
export function useUploadMedia() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      file, 
      options 
    }: { 
      file: File; 
      options?: UploadOptions & { alt_text?: string } 
    }) => {
      const { data, error } = await mediaService.uploadAndCreate(file, options);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
      queryClient.invalidateQueries({ queryKey: mediaKeys.images });
      queryClient.invalidateQueries({ queryKey: mediaKeys.count });
      queryClient.invalidateQueries({ queryKey: mediaKeys.totalSize });
      
      toast({
        title: 'Upload concluído!',
        description: 'O arquivo foi enviado com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro no upload',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook para upload de múltiplos arquivos
 */
export function useUploadManyMedia() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      files, 
      options 
    }: { 
      files: File[]; 
      options?: UploadOptions & { alt_text?: string } 
    }) => {
      const { data, error } = await mediaService.uploadAndCreateMany(files, options);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
      queryClient.invalidateQueries({ queryKey: mediaKeys.images });
      queryClient.invalidateQueries({ queryKey: mediaKeys.count });
      queryClient.invalidateQueries({ queryKey: mediaKeys.totalSize });
      
      toast({
        title: 'Uploads concluídos!',
        description: `${data?.length || 0} arquivo(s) enviado(s).`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro nos uploads',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook para atualizar mídia
 */
export function useUpdateMedia() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: MediaUpdate) => {
      const { data, error } = await mediaService.update(input);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
      queryClient.invalidateQueries({ queryKey: mediaKeys.byId(data!.id) });
      
      toast({
        title: 'Mídia atualizada!',
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
 * Hook para deletar mídia
 */
export function useDeleteMedia() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await mediaService.delete(id);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
      queryClient.invalidateQueries({ queryKey: mediaKeys.images });
      queryClient.invalidateQueries({ queryKey: mediaKeys.count });
      queryClient.invalidateQueries({ queryKey: mediaKeys.totalSize });
      
      toast({
        title: 'Arquivo deletado',
        description: 'O arquivo foi removido da biblioteca.',
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
