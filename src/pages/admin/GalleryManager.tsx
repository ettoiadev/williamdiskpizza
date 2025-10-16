/**
 * Gallery Manager Page
 * 
 * Página para gerenciar galeria de imagens do site.
 * Permite upload, edição, reordenação e exclusão de imagens.
 * 
 * @module pages/admin/GalleryManager
 */

import { AdminLayout } from '@/components/AdminLayout';
import { ImageUpload } from '@/components/ImageUpload';
import { useGallery, useDeleteGalleryItem, useToggleGalleryItem } from '@/hooks/use-gallery';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
import { Loader2, Trash2, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

/**
 * GalleryManager - Gerenciador de galeria
 */
export default function GalleryManager() {
  const { data: gallery, isLoading } = useGallery();
  const deleteMutation = useDeleteGalleryItem();
  const toggleMutation = useToggleGalleryItem();
  
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteMutation.mutateAsync(deleteId);
    setDeleteId(null);
  };

  const handleToggle = (id: string, currentStatus: boolean) => {
    toggleMutation.mutate({ id, isActive: !currentStatus });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gerenciar Galeria
          </h1>
          <p className="text-gray-600 mt-2">
            Upload e organização de fotos para o site
          </p>
        </div>

        {/* Upload */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Adicionar Novas Imagens</h2>
          <ImageUpload
            multiple
            folder="gallery"
            defaultAltText="Galeria William Disk Pizza"
            onUploadComplete={(urls) => {
              console.log('Imagens enviadas:', urls);
            }}
          />
        </Card>

        {/* Galeria Atual */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Galeria Atual ({gallery?.length || 0} imagens)
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !gallery || gallery.length === 0 ? (
            <Card className="p-12">
              <div className="text-center text-gray-500">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Nenhuma imagem na galeria</p>
                <p className="text-sm mt-2">
                  Use o formulário acima para adicionar imagens
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  {/* Imagem */}
                  <div className="aspect-video relative">
                    <img
                      src={item.image_url}
                      alt={item.alt_text}
                      className="w-full h-full object-cover"
                    />
                    {!item.is_active && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold">
                          Inativa
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info e Ações */}
                  <div className="p-4 space-y-3">
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-600 truncate">
                        {item.alt_text}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={item.is_active}
                          onCheckedChange={() => handleToggle(item.id, item.is_active)}
                        />
                        <Label className="text-sm">
                          {item.is_active ? (
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              Ativa
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <EyeOff className="h-3 w-3" />
                              Inativa
                            </span>
                          )}
                        </Label>
                      </div>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteId(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Dialog de confirmação */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Deletar imagem?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. A imagem será removida da galeria.
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
    </AdminLayout>
  );
}
