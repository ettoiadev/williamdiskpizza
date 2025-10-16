/**
 * Testimonials Hooks
 * 
 * Hooks customizados usando React Query para gerenciar depoimentos.
 * 
 * @module hooks/use-testimonials
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  testimonialsService, 
  type TestimonialInput, 
  type TestimonialUpdate,
  type TestimonialFilters 
} from '@/services/testimonials-service';
import { useToast } from '@/hooks/use-toast';

/**
 * Query keys
 */
export const testimonialsKeys = {
  all: ['testimonials'] as const,
  filtered: (filters?: TestimonialFilters) => ['testimonials', 'filtered', filters] as const,
  byId: (id: string) => ['testimonials', id] as const,
  byRating: (rating: number) => ['testimonials', 'rating', rating] as const,
  average: ['testimonials', 'average'] as const,
  stats: ['testimonials', 'stats'] as const,
  count: ['testimonials', 'count'] as const,
};

/**
 * Hook para buscar todos os depoimentos
 */
export function useTestimonials(filters?: TestimonialFilters) {
  return useQuery({
    queryKey: testimonialsKeys.filtered(filters),
    queryFn: async () => {
      const { data, error } = await testimonialsService.getAll(filters);
      if (error) throw new Error(error);
      return data;
    },
  });
}

/**
 * Hook para buscar depoimento por ID
 */
export function useTestimonial(id: string) {
  return useQuery({
    queryKey: testimonialsKeys.byId(id),
    queryFn: async () => {
      const { data, error } = await testimonialsService.getById(id);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!id,
  });
}

/**
 * Hook para buscar por rating
 */
export function useTestimonialsByRating(rating: number) {
  return useQuery({
    queryKey: testimonialsKeys.byRating(rating),
    queryFn: async () => {
      const { data, error } = await testimonialsService.getByRating(rating);
      if (error) throw new Error(error);
      return data;
    },
    enabled: rating >= 1 && rating <= 5,
  });
}

/**
 * Hook para buscar média de avaliações
 */
export function useAverageRating() {
  return useQuery({
    queryKey: testimonialsKeys.average,
    queryFn: async () => {
      const { data, error } = await testimonialsService.getAverageRating();
      if (error) throw new Error(error);
      return data;
    },
  });
}

/**
 * Hook para estatísticas de ratings
 */
export function useRatingStats() {
  return useQuery({
    queryKey: testimonialsKeys.stats,
    queryFn: async () => {
      const { data, error } = await testimonialsService.getRatingStats();
      if (error) throw new Error(error);
      return data;
    },
  });
}

/**
 * Hook para contar depoimentos
 */
export function useTestimonialsCount(activeOnly = false) {
  return useQuery({
    queryKey: [...testimonialsKeys.count, activeOnly],
    queryFn: async () => {
      const { data, error } = await testimonialsService.count(activeOnly);
      if (error) throw new Error(error);
      return data;
    },
  });
}

/**
 * Hook para criar depoimento
 */
export function useCreateTestimonial() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: TestimonialInput) => {
      const { data, error } = await testimonialsService.create(input);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testimonialsKeys.all });
      queryClient.invalidateQueries({ queryKey: testimonialsKeys.average });
      queryClient.invalidateQueries({ queryKey: testimonialsKeys.stats });
      queryClient.invalidateQueries({ queryKey: testimonialsKeys.count });
      
      toast({
        title: 'Depoimento adicionado!',
        description: 'O depoimento foi criado com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao criar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook para atualizar depoimento
 */
export function useUpdateTestimonial() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: TestimonialUpdate) => {
      const { data, error } = await testimonialsService.update(input);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: testimonialsKeys.all });
      queryClient.invalidateQueries({ queryKey: testimonialsKeys.byId(data!.id) });
      queryClient.invalidateQueries({ queryKey: testimonialsKeys.average });
      queryClient.invalidateQueries({ queryKey: testimonialsKeys.stats });
      
      toast({
        title: 'Depoimento atualizado!',
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
 * Hook para deletar depoimento
 */
export function useDeleteTestimonial() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await testimonialsService.delete(id);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testimonialsKeys.all });
      queryClient.invalidateQueries({ queryKey: testimonialsKeys.average });
      queryClient.invalidateQueries({ queryKey: testimonialsKeys.stats });
      queryClient.invalidateQueries({ queryKey: testimonialsKeys.count });
      
      toast({
        title: 'Depoimento removido',
        description: 'O depoimento foi deletado.',
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
 * Hook para ativar/desativar depoimento
 */
export function useToggleTestimonial() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data, error } = await testimonialsService.toggleActive(id, isActive);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: testimonialsKeys.all });
      
      toast({
        title: variables.isActive ? 'Depoimento ativado' : 'Depoimento desativado',
        description: `O depoimento foi ${variables.isActive ? 'publicado' : 'ocultado'}.`,
      });
    },
  });
}

/**
 * Hook para reordenar depoimentos
 */
export function useReorderTestimonials() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (items: Array<{ id: string; order: number }>) => {
      const { data, error } = await testimonialsService.reorder(items);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testimonialsKeys.all });
      
      toast({
        title: 'Ordem atualizada',
        description: 'Os depoimentos foram reordenados.',
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
