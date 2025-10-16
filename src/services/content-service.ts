/**
 * Content Service
 * 
 * Serviço para gerenciar conteúdo dinâmico do site (site_content).
 * Permite CRUD completo de todas as seções do site.
 * 
 * @module services/content-service
 */

import { supabase } from '@/lib/supabase';
import type { ApiResponse } from '@/types/cms';

/**
 * Item de conteúdo do site
 */
export interface SiteContent {
  id: string;
  section: string;
  key: string;
  value: any;
  type: 'text' | 'image' | 'json' | 'number';
  created_at: string;
  updated_at: string;
}

/**
 * Dados para criar/atualizar conteúdo
 */
export interface ContentInput {
  section: string;
  key: string;
  value: any;
  type: 'text' | 'image' | 'json' | 'number';
}

/**
 * ContentService - Gerencia conteúdo do site
 */
class ContentService {
  private readonly table = 'site_content';

  /**
   * Buscar todo o conteúdo
   * 
   * @returns Lista de conteúdo
   */
  async getAll(): Promise<ApiResponse<SiteContent[]>> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .order('section', { ascending: true })
        .order('key', { ascending: true });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as SiteContent[], error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao buscar conteúdo' };
    }
  }

  /**
   * Buscar conteúdo por seção
   * 
   * @param section - Nome da seção
   * @returns Conteúdo da seção
   */
  async getBySection(section: string): Promise<ApiResponse<SiteContent[]>> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .eq('section', section)
        .order('key', { ascending: true });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as SiteContent[], error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao buscar conteúdo da seção' };
    }
  }

  /**
   * Buscar item específico
   * 
   * @param section - Nome da seção
   * @param key - Chave do item
   * @returns Item de conteúdo
   */
  async getByKey(section: string, key: string): Promise<ApiResponse<SiteContent>> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .eq('section', section)
        .eq('key', key)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as SiteContent, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao buscar item' };
    }
  }

  /**
   * Criar ou atualizar conteúdo (upsert)
   * 
   * @param input - Dados do conteúdo
   * @returns Conteúdo criado/atualizado
   */
  async upsert(input: ContentInput): Promise<ApiResponse<SiteContent>> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .upsert(
          {
            section: input.section,
            key: input.key,
            value: input.value,
            type: input.type,
          },
          {
            onConflict: 'section,key',
          }
        )
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as SiteContent, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao salvar conteúdo' };
    }
  }

  /**
   * Atualizar múltiplos itens de uma vez
   * 
   * @param items - Lista de itens para atualizar
   * @returns Lista de itens atualizados
   */
  async upsertMany(items: ContentInput[]): Promise<ApiResponse<SiteContent[]>> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .upsert(
          items.map(item => ({
            section: item.section,
            key: item.key,
            value: item.value,
            type: item.type,
          })),
          {
            onConflict: 'section,key',
          }
        )
        .select();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as SiteContent[], error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao salvar conteúdos' };
    }
  }

  /**
   * Deletar item específico
   * 
   * @param section - Nome da seção
   * @param key - Chave do item
   * @returns Resultado da operação
   */
  async delete(section: string, key: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from(this.table)
        .delete()
        .eq('section', section)
        .eq('key', key);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao deletar item' };
    }
  }

  /**
   * Deletar toda uma seção
   * 
   * @param section - Nome da seção
   * @returns Resultado da operação
   */
  async deleteSection(section: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from(this.table)
        .delete()
        .eq('section', section);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao deletar seção' };
    }
  }

  /**
   * Listar todas as seções disponíveis
   * 
   * @returns Lista de nomes de seções
   */
  async getSections(): Promise<ApiResponse<string[]>> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('section')
        .order('section');

      if (error) {
        return { data: null, error: error.message };
      }

      // Remover duplicatas
      const sections = [...new Set(data.map(item => item.section))];
      return { data: sections, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao buscar seções' };
    }
  }

  /**
   * Buscar conteúdo por tipo
   * 
   * @param type - Tipo de conteúdo
   * @returns Lista de conteúdo
   */
  async getByType(type: 'text' | 'image' | 'json' | 'number'): Promise<ApiResponse<SiteContent[]>> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .eq('type', type)
        .order('section', { ascending: true });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as SiteContent[], error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao buscar conteúdo por tipo' };
    }
  }
}

// Exportar instância singleton
export const contentService = new ContentService();
