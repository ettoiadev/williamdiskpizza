/**
 * Media Service
 * 
 * Serviço para gerenciar biblioteca de mídia (tabela media).
 * Integra com Storage Service para upload e rastreamento de arquivos.
 * 
 * @module services/media-service
 */

import { supabase } from '@/lib/supabase';
import { storageService, type UploadedFile, type UploadOptions } from '@/services/storage-service';
import type { ApiResponse, MediaFile } from '@/types/cms';

/**
 * Dados para criar entrada de mídia
 */
export interface MediaInput {
  name: string;
  url: string;
  type: string;
  size: number;
  alt_text?: string;
}

/**
 * Dados para atualizar mídia
 */
export interface MediaUpdate extends Partial<MediaInput> {
  id: string;
}

/**
 * Filtros para busca de mídia
 */
export interface MediaFilters {
  type?: string;
  search?: string;
}

/**
 * MediaService - Gerencia biblioteca de mídia
 */
class MediaService {
  private readonly table = 'media';

  /**
   * Upload completo: arquivo + entrada no banco
   * 
   * @param file - Arquivo a ser enviado
   * @param options - Opções de upload e metadata
   * @returns Entrada de mídia criada
   * 
   * @example
   * ```typescript
   * const file = input.files[0];
   * const { data, error } = await mediaService.uploadAndCreate(file, {
   *   folder: 'gallery',
   *   alt_text: 'Pizza deliciosa'
   * });
   * ```
   */
  async uploadAndCreate(
    file: File,
    options: UploadOptions & { alt_text?: string } = {}
  ): Promise<ApiResponse<MediaFile>> {
    try {
      // 1. Upload para Storage
      const { data: uploadedFile, error: uploadError } = await storageService.upload(file, options);

      if (uploadError || !uploadedFile) {
        return { data: null, error: uploadError || 'Erro no upload' };
      }

      // 2. Criar entrada no banco
      const { data: mediaEntry, error: dbError } = await this.create({
        name: uploadedFile.name,
        url: uploadedFile.url,
        type: uploadedFile.type,
        size: uploadedFile.size,
        alt_text: options.alt_text,
      });

      if (dbError || !mediaEntry) {
        // Se falhar no banco, tentar deletar arquivo do storage
        await storageService.delete(uploadedFile.path);
        return { data: null, error: dbError || 'Erro ao salvar no banco' };
      }

      return { data: mediaEntry, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao fazer upload completo' };
    }
  }

  /**
   * Upload de múltiplos arquivos
   * 
   * @param files - Lista de arquivos
   * @param options - Opções de upload
   * @returns Lista de entradas criadas
   */
  async uploadAndCreateMany(
    files: File[],
    options: UploadOptions & { alt_text?: string } = {}
  ): Promise<ApiResponse<MediaFile[]>> {
    try {
      const results = await Promise.all(
        files.map(file => this.uploadAndCreate(file, options))
      );

      const errors = results.filter(r => r.error);
      if (errors.length > 0) {
        return {
          data: null,
          error: `${errors.length} arquivo(s) falharam`,
        };
      }

      const mediaFiles = results
        .filter(r => r.data !== null)
        .map(r => r.data!);

      return { data: mediaFiles, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao fazer uploads múltiplos' };
    }
  }

  /**
   * Buscar toda a biblioteca de mídia
   * 
   * @param filters - Filtros opcionais
   * @returns Lista de mídia
   */
  async getAll(filters?: MediaFilters): Promise<ApiResponse<MediaFile[]>> {
    try {
      let query = supabase
        .from(this.table)
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,alt_text.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as MediaFile[], error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao buscar mídia' };
    }
  }

  /**
   * Buscar mídia por ID
   * 
   * @param id - ID da mídia
   * @returns Entrada de mídia
   */
  async getById(id: string): Promise<ApiResponse<MediaFile>> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as MediaFile, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao buscar mídia' };
    }
  }

  /**
   * Criar entrada de mídia manualmente
   * 
   * @param input - Dados da mídia
   * @returns Mídia criada
   */
  async create(input: MediaInput): Promise<ApiResponse<MediaFile>> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .insert({
          name: input.name,
          url: input.url,
          type: input.type,
          size: input.size,
          alt_text: input.alt_text || null,
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as MediaFile, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao criar mídia' };
    }
  }

  /**
   * Atualizar entrada de mídia
   * 
   * @param input - Dados para atualizar
   * @returns Mídia atualizada
   */
  async update(input: MediaUpdate): Promise<ApiResponse<MediaFile>> {
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

      return { data: data as MediaFile, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao atualizar mídia' };
    }
  }

  /**
   * Deletar mídia (banco + storage)
   * 
   * @param id - ID da mídia
   * @returns Resultado da operação
   */
  async delete(id: string): Promise<ApiResponse<boolean>> {
    try {
      // 1. Buscar informações da mídia
      const { data: media, error: fetchError } = await this.getById(id);

      if (fetchError || !media) {
        return { data: null, error: 'Mídia não encontrada' };
      }

      // 2. Extrair path do storage da URL
      const url = new URL(media.url);
      const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)$/);
      
      if (pathMatch && pathMatch[1]) {
        // Deletar do storage
        await storageService.delete(pathMatch[1]);
      }

      // 3. Deletar do banco
      const { error: deleteError } = await supabase
        .from(this.table)
        .delete()
        .eq('id', id);

      if (deleteError) {
        return { data: null, error: deleteError.message };
      }

      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao deletar mídia' };
    }
  }

  /**
   * Buscar mídia por tipo
   * 
   * @param type - MIME type (ex: 'image/jpeg')
   * @returns Lista de mídia
   */
  async getByType(type: string): Promise<ApiResponse<MediaFile[]>> {
    return this.getAll({ type });
  }

  /**
   * Buscar apenas imagens
   * 
   * @returns Lista de imagens
   */
  async getImages(): Promise<ApiResponse<MediaFile[]>> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .like('type', 'image/%')
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as MediaFile[], error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao buscar imagens' };
    }
  }

  /**
   * Contar total de arquivos
   * 
   * @returns Total de arquivos
   */
  async count(): Promise<ApiResponse<number>> {
    try {
      const { count, error } = await supabase
        .from(this.table)
        .select('id', { count: 'exact', head: true });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: count || 0, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao contar arquivos' };
    }
  }

  /**
   * Calcular espaço total usado
   * 
   * @returns Tamanho total em bytes
   */
  async getTotalSize(): Promise<ApiResponse<number>> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('size');

      if (error) {
        return { data: null, error: error.message };
      }

      const total = data.reduce((acc, item) => acc + item.size, 0);
      return { data: total, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao calcular espaço' };
    }
  }
}

// Exportar instância singleton
export const mediaService = new MediaService();
