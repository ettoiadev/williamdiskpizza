/**
 * Settings Service
 * 
 * Serviço para gerenciar configurações globais do site.
 * Armazena configurações como logo, cores, SEO, etc.
 * 
 * @module services/settings-service
 */

import { supabase } from '@/lib/supabase';
import type { ApiResponse } from '@/types/cms';

/**
 * Item de configuração
 */
export interface Setting {
  id: string;
  key: string;
  value: any;
  description: string | null;
  updated_at: string;
}

/**
 * Dados para criar/atualizar configuração
 */
export interface SettingInput {
  key: string;
  value: any;
  description?: string;
}

/**
 * SettingsService - Gerencia configurações do site
 */
class SettingsService {
  private readonly table = 'settings';

  /**
   * Buscar todas as configurações
   * 
   * @returns Lista de configurações
   */
  async getAll(): Promise<ApiResponse<Setting[]>> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .order('key', { ascending: true });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as Setting[], error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao buscar configurações' };
    }
  }

  /**
   * Buscar configuração por chave
   * 
   * @param key - Chave da configuração
   * @returns Configuração
   */
  async getByKey(key: string): Promise<ApiResponse<Setting>> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .eq('key', key)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as Setting, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao buscar configuração' };
    }
  }

  /**
   * Buscar múltiplas configurações por chaves
   * 
   * @param keys - Array de chaves
   * @returns Lista de configurações
   */
  async getByKeys(keys: string[]): Promise<ApiResponse<Setting[]>> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .in('key', keys);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as Setting[], error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao buscar configurações' };
    }
  }

  /**
   * Criar ou atualizar configuração (upsert)
   * 
   * @param input - Dados da configuração
   * @returns Configuração criada/atualizada
   */
  async upsert(input: SettingInput): Promise<ApiResponse<Setting>> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .upsert(
          {
            key: input.key,
            value: input.value,
            description: input.description || null,
          },
          {
            onConflict: 'key',
          }
        )
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as Setting, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao salvar configuração' };
    }
  }

  /**
   * Atualizar múltiplas configurações de uma vez
   * 
   * @param items - Lista de configurações
   * @returns Lista de configurações atualizadas
   */
  async upsertMany(items: SettingInput[]): Promise<ApiResponse<Setting[]>> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .upsert(
          items.map(item => ({
            key: item.key,
            value: item.value,
            description: item.description || null,
          })),
          {
            onConflict: 'key',
          }
        )
        .select();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as Setting[], error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao salvar configurações' };
    }
  }

  /**
   * Deletar configuração
   * 
   * @param key - Chave da configuração
   * @returns Resultado da operação
   */
  async delete(key: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from(this.table)
        .delete()
        .eq('key', key);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao deletar configuração' };
    }
  }

  /**
   * Buscar configurações de SEO
   * 
   * @returns Configurações de SEO
   */
  async getSEOSettings(): Promise<ApiResponse<Setting[]>> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .or('key.eq.site_name,key.eq.site_description,key.eq.meta_keywords');

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as Setting[], error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao buscar configurações de SEO' };
    }
  }

  /**
   * Buscar configurações de tema (cores, logo)
   * 
   * @returns Configurações de tema
   */
  async getThemeSettings(): Promise<ApiResponse<Setting[]>> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .or('key.eq.logo_url,key.eq.primary_color,key.eq.secondary_color');

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as Setting[], error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao buscar configurações de tema' };
    }
  }

  /**
   * Obter configurações como objeto chave-valor
   * 
   * @returns Objeto com configurações
   */
  async getAsObject(): Promise<ApiResponse<Record<string, any>>> {
    try {
      const { data, error } = await this.getAll();

      if (error || !data) {
        return { data: null, error: error || 'Erro ao buscar configurações' };
      }

      const settings: Record<string, any> = {};
      data.forEach(setting => {
        settings[setting.key] = setting.value;
      });

      return { data: settings, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao processar configurações' };
    }
  }
}

// Exportar instância singleton
export const settingsService = new SettingsService();
