/**
 * Testimonials Service
 * 
 * Serviço para gerenciar depoimentos de clientes.
 * Permite CRUD completo e moderação de avaliações.
 * 
 * @module services/testimonials-service
 */

import { supabase } from '@/lib/supabase';
import type { ApiResponse, Testimonial } from '@/types/cms';

/**
 * Dados para criar depoimento
 */
export interface TestimonialInput {
  name: string;
  rating: number;
  comment: string;
  location: string;
  image_url?: string;
  order?: number;
  is_active?: boolean;
}

/**
 * Dados para atualizar depoimento
 */
export interface TestimonialUpdate extends Partial<TestimonialInput> {
  id: string;
}

/**
 * Filtros para busca
 */
export interface TestimonialFilters {
  rating?: number;
  is_active?: boolean;
  search?: string;
}

/**
 * TestimonialsService - Gerencia depoimentos
 */
class TestimonialsService {
  private readonly table = 'testimonials';

  /**
   * Buscar todos os depoimentos
   * 
   * @param filters - Filtros opcionais
   * @returns Lista de depoimentos
   */
  async getAll(filters?: TestimonialFilters): Promise<ApiResponse<Testimonial[]>> {
    try {
      let query = supabase
        .from(this.table)
        .select('*')
        .order('order', { ascending: true });

      // Aplicar filtros
      if (filters?.rating) {
        query = query.eq('rating', filters.rating);
      }

      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,comment.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as Testimonial[], error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao buscar depoimentos' };
    }
  }

  /**
   * Buscar depoimento por ID
   * 
   * @param id - ID do depoimento
   * @returns Depoimento
   */
  async getById(id: string): Promise<ApiResponse<Testimonial>> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as Testimonial, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao buscar depoimento' };
    }
  }

  /**
   * Criar novo depoimento
   * 
   * @param input - Dados do depoimento
   * @returns Depoimento criado
   */
  async create(input: TestimonialInput): Promise<ApiResponse<Testimonial>> {
    try {
      // Validar rating
      if (input.rating < 1 || input.rating > 5) {
        return { data: null, error: 'Avaliação deve ser entre 1 e 5 estrelas' };
      }

      // Se order não foi fornecido, buscar o próximo número
      let order = input.order;
      if (order === undefined) {
        const { data: maxOrderData } = await supabase
          .from(this.table)
          .select('order')
          .order('order', { ascending: false })
          .limit(1)
          .single();

        order = maxOrderData ? maxOrderData.order + 1 : 0;
      }

      const { data, error } = await supabase
        .from(this.table)
        .insert({
          name: input.name,
          rating: input.rating,
          comment: input.comment,
          location: input.location,
          image_url: input.image_url,
          order,
          is_active: input.is_active ?? true,
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as Testimonial, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao criar depoimento' };
    }
  }

  /**
   * Atualizar depoimento
   * 
   * @param input - Dados para atualizar
   * @returns Depoimento atualizado
   */
  async update(input: TestimonialUpdate): Promise<ApiResponse<Testimonial>> {
    try {
      const { id, ...updateData } = input;

      // Validar rating se fornecido
      if (updateData.rating !== undefined && (updateData.rating < 1 || updateData.rating > 5)) {
        return { data: null, error: 'Avaliação deve ser entre 1 e 5 estrelas' };
      }

      const { data, error } = await supabase
        .from(this.table)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as Testimonial, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao atualizar depoimento' };
    }
  }

  /**
   * Deletar depoimento
   * 
   * @param id - ID do depoimento
   * @returns Resultado da operação
   */
  async delete(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from(this.table)
        .delete()
        .eq('id', id);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao deletar depoimento' };
    }
  }

  /**
   * Ativar/desativar depoimento (moderação)
   * 
   * @param id - ID do depoimento
   * @param isActive - Novo status
   * @returns Depoimento atualizado
   */
  async toggleActive(id: string, isActive: boolean): Promise<ApiResponse<Testimonial>> {
    return this.update({ id, is_active: isActive });
  }

  /**
   * Reordenar depoimentos
   * 
   * @param items - Lista de {id, order}
   * @returns Lista de depoimentos atualizados
   */
  async reorder(items: Array<{ id: string; order: number }>): Promise<ApiResponse<Testimonial[]>> {
    try {
      const promises = items.map(item =>
        supabase
          .from(this.table)
          .update({ order: item.order })
          .eq('id', item.id)
      );

      const results = await Promise.all(promises);

      const errors = results.filter(r => r.error);
      if (errors.length > 0) {
        return { data: null, error: 'Erro ao reordenar alguns depoimentos' };
      }

      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .order('order', { ascending: true });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as Testimonial[], error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao reordenar depoimentos' };
    }
  }

  /**
   * Buscar depoimentos por avaliação
   * 
   * @param rating - Nota (1-5)
   * @returns Lista de depoimentos
   */
  async getByRating(rating: number): Promise<ApiResponse<Testimonial[]>> {
    return this.getAll({ rating });
  }

  /**
   * Calcular média de avaliações
   * 
   * @returns Média de rating
   */
  async getAverageRating(): Promise<ApiResponse<number>> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('rating')
        .eq('is_active', true);

      if (error) {
        return { data: null, error: error.message };
      }

      if (!data || data.length === 0) {
        return { data: 0, error: null };
      }

      const sum = data.reduce((acc, item) => acc + item.rating, 0);
      const average = sum / data.length;

      return { data: Math.round(average * 10) / 10, error: null }; // 1 casa decimal
    } catch (error) {
      return { data: null, error: 'Erro ao calcular média' };
    }
  }

  /**
   * Contar depoimentos
   * 
   * @param activeOnly - Contar apenas ativos?
   * @returns Total de depoimentos
   */
  async count(activeOnly = false): Promise<ApiResponse<number>> {
    try {
      let query = supabase
        .from(this.table)
        .select('id', { count: 'exact', head: true });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { count, error } = await query;

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: count || 0, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao contar depoimentos' };
    }
  }

  /**
   * Estatísticas de avaliações
   * 
   * @returns Distribuição de ratings
   */
  async getRatingStats(): Promise<ApiResponse<Record<number, number>>> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('rating')
        .eq('is_active', true);

      if (error) {
        return { data: null, error: error.message };
      }

      const stats: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      data.forEach(item => {
        stats[item.rating] = (stats[item.rating] || 0) + 1;
      });

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao buscar estatísticas' };
    }
  }
}

// Exportar instância singleton
export const testimonialsService = new TestimonialsService();
