/**
 * Media Library Component
 * 
 * Componente para visualizar e gerenciar biblioteca de mídia.
 * Permite seleção, exclusão e visualização de arquivos.
 * 
 * @module components/MediaLibrary
 */

import { useState } from 'react';
import { useMedia, useDeleteMedia } from '@/hooks/use-media';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Image as ImageIcon, 
  Trash2, 
  Search, 
  Loader2,
  Check,
  X 
} from 'lucide-react';
import { storageService } from '@/services/storage-service';
import { cn } from '@/lib/utils';
import type { MediaFile } from '@/types/cms';

/**
 * Props do componente
 */
interface MediaLibraryProps {
  /**
   * Modo de seleção?
   */
  selectionMode?: boolean;
  
  /**
   * Permitir seleção múltipla?
   */
  multiple?: boolean;
  
  /**
   * Callback ao selecionar arquivo(s)
   */
  onSelect?: (files: MediaFile[]) => void;
  
  /**
   * Classe CSS customizada
   */
  className?: string;
}

/**
 * MediaLibrary - Biblioteca de mídia
 * 
 * @example
 * ```typescript
 * <MediaLibrary 
 *   selectionMode
 *   onSelect={(files) => console.log(files)}
 * />
 * ```
 */
export function MediaLibrary({
  selectionMode = false,
  multiple = false,
  onSelect,
  className,
}: MediaLibraryProps) {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: media, isLoading } = useMedia({ search });
  const deleteMutation = useDeleteMedia();

  /**
   * Toggle seleção de arquivo
   */
  const toggleSelection = (file: MediaFile) => {
    const newSelection = new Set(selectedIds);
    
    if (newSelection.has(file.id)) {
      newSelection.delete(file.id);
    } else {
      if (!multiple) {
        newSelection.clear();
      }
      newSelection.add(file.id);
    }
    
    setSelectedIds(newSelection);
  };

  /**
   * Confirmar seleção
   */
  const handleConfirmSelection = () => {
    if (!media || !onSelect) return;
    
    const selected = media.filter(f => selectedIds.has(f.id));
    onSelect(selected);
  };

  /**
   * Deletar arquivo
   */
  const handleDelete = async () => {
    if (!deleteId) return;
    
    await deleteMutation.mutateAsync(deleteId);
    setDeleteId(null);
    
    // Remover da seleção se estava selecionado
    const newSelection = new Set(selectedIds);
    newSelection.delete(deleteId);
    setSelectedIds(newSelection);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar na biblioteca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {selectionMode && selectedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {selectedIds.size} selecionado(s)
            </span>
            <Button onClick={handleConfirmSelection}>
              <Check className="mr-2 h-4 w-4" />
              Confirmar
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedIds(new Set())}
            >
              <X className="mr-2 h-4 w-4" />
              Limpar
            </Button>
          </div>
        )}
      </div>

      {/* Grid de mídia */}
      {!media || media.length === 0 ? (
        <Card className="p-12">
          <div className="text-center text-gray-500">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>Nenhum arquivo encontrado</p>
            {search && (
              <p className="text-sm mt-2">
                Tente uma busca diferente
              </p>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((file) => {
            const isSelected = selectedIds.has(file.id);
            
            return (
              <div
                key={file.id}
                className="relative group"
              >
                <Card
                  className={cn(
                    'cursor-pointer transition-all overflow-hidden',
                    isSelected && 'ring-2 ring-primary',
                    selectionMode && 'hover:ring-2 hover:ring-primary/50'
                  )}
                  onClick={() => selectionMode && toggleSelection(file)}
                >
                  <div className="aspect-square relative">
                    <img
                      src={file.url}
                      alt={file.alt_text || file.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay de seleção */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    )}
                    
                    {/* Botão de deletar */}
                    {!selectionMode && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(file.id);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </Card>
                
                {/* Info do arquivo */}
                <div className="mt-1 space-y-1">
                  <p className="text-xs text-gray-700 truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {storageService.formatFileSize(file.size)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar arquivo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O arquivo será permanentemente removido do storage e da biblioteca.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deletando...
                </>
              ) : (
                'Deletar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
