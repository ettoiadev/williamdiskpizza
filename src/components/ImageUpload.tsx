/**
 * Image Upload Component
 * 
 * Componente para upload de imagens com drag-and-drop.
 * Suporta preview, validação e upload múltiplo.
 * 
 * @module components/ImageUpload
 */

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useUploadMedia, useUploadManyMedia } from '@/hooks/use-media';
import { storageService } from '@/services/storage-service';
import { cn } from '@/lib/utils';

/**
 * Props do componente
 */
interface ImageUploadProps {
  /**
   * Aceitar múltiplos arquivos?
   */
  multiple?: boolean;
  
  /**
   * Callback ao concluir upload
   */
  onUploadComplete?: (urls: string[]) => void;
  
  /**
   * Pasta de destino no storage
   */
  folder?: string;
  
  /**
   * Texto alternativo padrão
   */
  defaultAltText?: string;
  
  /**
   * Classe CSS customizada
   */
  className?: string;
  
  /**
   * Texto do botão
   */
  buttonText?: string;
}

/**
 * ImageUpload - Componente de upload de imagens
 * 
 * @example
 * ```typescript
 * <ImageUpload 
 *   multiple
 *   folder="gallery"
 *   onUploadComplete={(urls) => console.log(urls)}
 * />
 * ```
 */
export function ImageUpload({
  multiple = false,
  onUploadComplete,
  folder,
  defaultAltText,
  className,
  buttonText = 'Selecionar Imagens',
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const uploadSingleMutation = useUploadMedia();
  const uploadManyMutation = useUploadManyMedia();

  /**
   * Validar e processar arquivos
   */
  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    fileArray.forEach(file => {
      const validation = storageService.validateFile(file);
      
      if (!validation.isValid) {
        console.error(validation.error);
        return;
      }

      validFiles.push(file);
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newPreviews.push(e.target.result as string);
          setPreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setSelectedFiles(prev => multiple ? [...prev, ...validFiles] : validFiles);
  };

  /**
   * Handler de drag over
   */
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  /**
   * Handler de drag leave
   */
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  /**
   * Handler de drop
   */
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  /**
   * Handler de seleção de arquivo
   */
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  /**
   * Remover arquivo da lista
   */
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  /**
   * Limpar tudo
   */
  const clearAll = () => {
    setSelectedFiles([]);
    setPreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Fazer upload
   */
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    const uploadOptions = {
      folder,
      alt_text: defaultAltText,
    };

    if (selectedFiles.length === 1) {
      const result = await uploadSingleMutation.mutateAsync({
        file: selectedFiles[0],
        options: uploadOptions,
      });

      if (result && onUploadComplete) {
        onUploadComplete([result.url]);
      }
    } else {
      const result = await uploadManyMutation.mutateAsync({
        files: selectedFiles,
        options: uploadOptions,
      });

      if (result && onUploadComplete) {
        onUploadComplete(result.map(r => r.url));
      }
    }

    clearAll();
  };

  const isUploading = uploadSingleMutation.isPending || uploadManyMutation.isPending;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop Zone */}
      <Card
        className={cn(
          'border-2 border-dashed transition-colors',
          isDragging ? 'border-primary bg-primary/5' : 'border-gray-300',
          'hover:border-primary/50 cursor-pointer'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <Upload className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-700 mb-1">
            Arraste imagens aqui ou clique para selecionar
          </p>
          <p className="text-xs text-gray-500">
            JPG, PNG, WEBP ou GIF (máx. 5MB)
          </p>
        </div>
      </Card>

      {/* Input escondido */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Preview das imagens */}
      {previews.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              {previews.length} arquivo(s) selecionado(s)
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              disabled={isUploading}
            >
              Limpar tudo
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  disabled={isUploading}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="mt-1 text-xs text-gray-600 truncate">
                  {selectedFiles[index]?.name}
                </div>
                <div className="text-xs text-gray-500">
                  {storageService.formatFileSize(selectedFiles[index]?.size || 0)}
                </div>
              </div>
            ))}
          </div>

          {/* Botão de Upload */}
          <Button
            onClick={handleUpload}
            disabled={isUploading || selectedFiles.length === 0}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <ImageIcon className="mr-2 h-4 w-4" />
                Fazer Upload ({selectedFiles.length})
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
