/**
 * Storage Service
 * 
 * Serviço para gerenciar upload e armazenamento de arquivos no Supabase Storage.
 * Suporta upload, download, deletar e listar arquivos.
 * 
 * @module services/storage-service
 */

import { supabase } from '@/lib/supabase';
import type { ApiResponse } from '@/types/cms';
import { FILE_UPLOAD } from '@/config/constants';

/**
 * Informações do arquivo uploadado
 */
export interface UploadedFile {
  url: string;
  path: string;
  name: string;
  size: number;
  type: string;
}

/**
 * Opções de upload
 */
export interface UploadOptions {
  /**
   * Sobrescrever arquivo existente?
   */
  upsert?: boolean;
  
  /**
   * Caminho/pasta dentro do bucket
   */
  folder?: string;
  
  /**
   * Nome customizado do arquivo
   */
  customName?: string;
}

/**
 * StorageService - Gerencia uploads e storage
 */
class StorageService {
  private readonly bucket = FILE_UPLOAD.STORAGE_BUCKET;

  /**
   * Fazer upload de arquivo
   * 
   * @param file - Arquivo a ser enviado
   * @param options - Opções de upload
   * @returns Informações do arquivo uploadado
   * 
   * @example
   * ```typescript
   * const file = document.querySelector('input[type="file"]').files[0];
   * const { data, error } = await storageService.upload(file, {
   *   folder: 'pizzas',
   *   customName: 'pizza-margherita'
   * });
   * ```
   */
  async upload(file: File, options: UploadOptions = {}): Promise<ApiResponse<UploadedFile>> {
    try {
      // Validar tamanho
      if (file.size > FILE_UPLOAD.MAX_SIZE) {
        return {
          data: null,
          error: `Arquivo muito grande. Tamanho máximo: ${FILE_UPLOAD.MAX_SIZE / 1024 / 1024}MB`,
        };
      }

      // Validar tipo (apenas imagens por padrão)
      if (!FILE_UPLOAD.ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return {
          data: null,
          error: 'Tipo de arquivo não permitido. Use JPG, PNG, WEBP ou GIF.',
        };
      }

      // Gerar nome do arquivo
      const timestamp = Date.now();
      const extension = file.name.split('.').pop();
      const fileName = options.customName 
        ? `${options.customName}.${extension}`
        : `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

      // Construir caminho completo
      const folder = options.folder ? `${options.folder}/` : '';
      const filePath = `${folder}${fileName}`;

      // Upload para Supabase Storage
      const { data, error } = await supabase.storage
        .from(this.bucket)
        .upload(filePath, file, {
          upsert: options.upsert ?? false,
          contentType: file.type,
        });

      if (error) {
        return { data: null, error: error.message };
      }

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from(this.bucket)
        .getPublicUrl(data.path);

      const uploadedFile: UploadedFile = {
        url: publicUrl,
        path: data.path,
        name: fileName,
        size: file.size,
        type: file.type,
      };

      return { data: uploadedFile, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao fazer upload' };
    }
  }

  /**
   * Fazer upload de múltiplos arquivos
   * 
   * @param files - Lista de arquivos
   * @param options - Opções de upload
   * @returns Lista de arquivos uploadados
   */
  async uploadMany(
    files: File[], 
    options: UploadOptions = {}
  ): Promise<ApiResponse<UploadedFile[]>> {
    try {
      const uploads = await Promise.all(
        files.map(file => this.upload(file, options))
      );

      // Verificar se algum falhou
      const errors = uploads.filter(u => u.error);
      if (errors.length > 0) {
        return {
          data: null,
          error: `${errors.length} arquivo(s) falharam no upload`,
        };
      }

      const uploadedFiles = uploads
        .filter(u => u.data !== null)
        .map(u => u.data!);

      return { data: uploadedFiles, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao fazer uploads múltiplos' };
    }
  }

  /**
   * Deletar arquivo
   * 
   * @param path - Caminho do arquivo no storage
   * @returns Resultado da operação
   */
  async delete(path: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase.storage
        .from(this.bucket)
        .remove([path]);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao deletar arquivo' };
    }
  }

  /**
   * Deletar múltiplos arquivos
   * 
   * @param paths - Lista de caminhos
   * @returns Resultado da operação
   */
  async deleteMany(paths: string[]): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase.storage
        .from(this.bucket)
        .remove(paths);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao deletar arquivos' };
    }
  }

  /**
   * Listar arquivos em uma pasta
   * 
   * @param folder - Nome da pasta (opcional)
   * @returns Lista de arquivos
   */
  async list(folder?: string): Promise<ApiResponse<any[]>> {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucket)
        .list(folder, {
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data || [], error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao listar arquivos' };
    }
  }

  /**
   * Obter URL pública de um arquivo
   * 
   * @param path - Caminho do arquivo
   * @returns URL pública
   */
  getPublicUrl(path: string): string {
    const { data } = supabase.storage
      .from(this.bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  /**
   * Criar URL assinada (com expiração)
   * 
   * @param path - Caminho do arquivo
   * @param expiresIn - Tempo de expiração em segundos
   * @returns URL assinada
   */
  async createSignedUrl(path: string, expiresIn = 3600): Promise<ApiResponse<string>> {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucket)
        .createSignedUrl(path, expiresIn);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data.signedUrl, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao criar URL assinada' };
    }
  }

  /**
   * Mover arquivo para outra pasta
   * 
   * @param fromPath - Caminho atual
   * @param toPath - Novo caminho
   * @returns Resultado da operação
   */
  async move(fromPath: string, toPath: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase.storage
        .from(this.bucket)
        .move(fromPath, toPath);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: 'Erro ao mover arquivo' };
    }
  }

  /**
   * Validar arquivo antes do upload
   * 
   * @param file - Arquivo a ser validado
   * @returns Objeto com isValid e mensagem de erro
   */
  validateFile(file: File): { isValid: boolean; error?: string } {
    // Verificar tamanho
    if (file.size > FILE_UPLOAD.MAX_SIZE) {
      return {
        isValid: false,
        error: `Arquivo muito grande. Máximo: ${FILE_UPLOAD.MAX_SIZE / 1024 / 1024}MB`,
      };
    }

    // Verificar tipo
    if (!FILE_UPLOAD.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: 'Tipo de arquivo não permitido',
      };
    }

    return { isValid: true };
  }

  /**
   * Formatar tamanho de arquivo para leitura humana
   * 
   * @param bytes - Tamanho em bytes
   * @returns String formatada (ex: "2.5 MB")
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}

// Exportar instância singleton
export const storageService = new StorageService();
