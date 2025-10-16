/**
 * Gallery Service
 * 
 * Serviço para gerenciar galeria de imagens do site.
 * Permite CRUD completo e reordenação de imagens.
 * 
 * @module services/gallery-service
 */

import { supabase } from '@/lib/supabase';
import type { ApiResponse, GalleryItem } from '@/types/cms';

/**
 * Dados para criar item da galeria
 */
export interface GalleryInput {
  title: string;
  image_url: string;
  alt_text: string;
  order?: number;
  is_active?: boolean;
}

/**
 * Dados para atualizar item da galeria
 */
export interface GalleryUpdate extends Partial<GalleryInput> {
  id: string;
}

/**
 * GalleryService - Gerencia galeria de imagens
 */
class GalleryService {
  private readonly table = 'gallery';

  /**
   * Buscar todos os itens da galeria
   * 
   * @param activeOnly - Retornar apenas itens ativos?
   * @returns Lista de itens
   */
  async getAll(activeOnly = false): Promise<ApiResponse<GalleryItem[]>> {
    try {
      let query = supabase
        .from(this.table)
        .select('*')
        .order('order', { ascending: true });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as GalleryItem[], error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao buscar galeria' };
    }
  }

  /**
   * Buscar item por ID
   * 
   * @param id - ID do item
   * @returns Item da galeria
   */
  async getById(id: string): Promise<ApiResponse<GalleryItem>> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as GalleryItem, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao buscar item' };
    }
  }

  /**
   * Criar novo item na galeria
   * 
   * @param input - Dados do item
   * @returns Item criado
   */
  async create(input: GalleryInput): Promise<ApiResponse<GalleryItem>> {
    try {
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
          title: input.title,
          image_url: input.image_url,
          alt_text: input.alt_text,
          order,
          is_active: input.is_active ?? true,
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as GalleryItem, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao criar item' };
    }
  }

  /**
   * Atualizar item da galeria
   * 
   * @param input - Dados para atualizar
   * @returns Item atualizado
   */
  async update(input: GalleryUpdate): Promise<ApiResponse<GalleryItem>> {
    try {
      const { id, ...updateData } = input;

      const { data, error } = await supabase
        .from(this.table)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as GalleryItem, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao atualizar item' };
    }
  }

  /**
   * Deletar item da galeria
   * 
   * @param id - ID do item
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
      return { data: null, error: 'Erro ao deletar item' };
    }
  }

  /**
   * Ativar/desativar item
   * 
   * @param id - ID do item
   * @param isActive - Novo status
   * @returns Item atualizado
   */
  async toggleActive(id: string, isActive: boolean): Promise<ApiResponse<GalleryItem>> {
    return this.update({ id, is_active: isActive });
  }

  /**
   * Reordenar itens da galeria
   * 
   * @param items - Lista de {id, order}
   * @returns Lista de itens atualizados
   */
  async reorder(items: Array<{ id: string; order: number }>): Promise<ApiResponse<GalleryItem[]>> {
    try {
      // Atualizar cada item individualmente (Supabase não suporta bulk update de diferentes valores)
      const promises = items.map(item =>
        supabase
          .from(this.table)
          .update({ order: item.order })
          .eq('id', item.id)
      );

      const results = await Promise.all(promises);

      // Verificar se algum falhou
      const errors = results.filter(r => r.error);
      if (errors.length > 0) {
        return { data: null, error: 'Erro ao reordenar alguns itens' };
      }

      // Buscar todos os itens atualizados
      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .order('order', { ascending: true });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as GalleryItem[], error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao reordenar galeria' };
    }
  }

  /**
   * Contar total de itens
   * 
   * @param activeOnly - Contar apenas ativos?
   * @returns Total de itens
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
      return { data: null, error: 'Erro ao contar itens' };
    }
  }
}

// Exportar instância singleton
export const galleryService = new GalleryService();
