/**
 * Media Manager Page
 * 
 * Página para gerenciar biblioteca de mídia (imagens e arquivos).
 * Upload, visualização, edição e exclusão de arquivos.
 * 
 * @module pages/admin/MediaManager
 */

import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import {
  useMedia,
  useMediaCount,
  useTotalMediaSize,
  useUploadManyMedia,
  useUpdateMedia,
  useDeleteMedia,
} from '@/hooks/use-media';
import { storageService } from '@/services/storage-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Upload,
  Image as ImageIcon,
  File,
  Trash2,
  Edit,
  Copy,
  Check,
  HardDrive,
  FolderOpen,
  Search,
} from 'lucide-react';
import type { MediaFile } from '@/types/cms';

/**
 * MediaManager - Gerenciador de biblioteca de mídia
 */
export default function MediaManager() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'document'>('all');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Queries
  const { data: mediaFiles, isLoading } = useMedia();
  const { data: totalCount } = useMediaCount();
  const { data: totalSize } = useTotalMediaSize();

  // Mutations
  const uploadMutation = useUploadManyMedia();
  const updateMutation = useUpdateMedia();
  const deleteMutation = useDeleteMedia();

  // Form state
  const [editForm, setEditForm] = useState({
    name: '',
    alt_text: '',
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) return;

    uploadMutation.mutate(
      { files: selectedFiles, options: { folder: 'uploads' } },
      {
        onSuccess: () => {
          setIsUploadOpen(false);
          setSelectedFiles([]);
        },
      }
    );
  };

  const handleEditClick = (media: MediaFile) => {
    setSelectedMedia(media);
    setEditForm({
      name: media.name,
      alt_text: media.alt_text || '',
    });
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedMedia) return;

    updateMutation.mutate(
      { id: selectedMedia.id, ...editForm },
      {
        onSuccess: () => {
          setIsEditOpen(false);
          setSelectedMedia(null);
        },
      }
    );
  };

  const handleDeleteClick = (media: MediaFile) => {
    setSelectedMedia(media);
    setIsDeleteOpen(true);
  };

  const handleDelete = () => {
    if (!selectedMedia) return;

    deleteMutation.mutate(selectedMedia.id, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        setSelectedMedia(null);
      },
    });
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  // Filtrar mídia
  const filteredMedia = mediaFiles?.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.alt_text && m.alt_text.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType =
      filterType === 'all' ||
      (filterType === 'image' && m.type.startsWith('image/')) ||
      (filterType === 'document' && !m.type.startsWith('image/'));

    return matchesSearch && matchesType;
  });

  const imageCount = mediaFiles?.filter((m) => m.type.startsWith('image/')).length || 0;
  const documentCount = mediaFiles?.filter((m) => !m.type.startsWith('image/')).length || 0;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Biblioteca de Mídia</h1>
            <p className="text-gray-600 mt-2">
              Gerencie imagens e arquivos do site
            </p>
          </div>
          <Button onClick={() => setIsUploadOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload de Arquivos
          </Button>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total de Arquivos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-gray-400" />
                <div className="text-2xl font-bold">{totalCount || 0}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Imagens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-blue-500" />
                <div className="text-2xl font-bold text-blue-600">{imageCount}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Documentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <File className="h-5 w-5 text-green-500" />
                <div className="text-2xl font-bold text-green-600">{documentCount}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Espaço Usado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-purple-500" />
                <div className="text-2xl font-bold text-purple-600">
                  {storageService.formatFileSize(totalSize || 0)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nome ou descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={(v: any) => setFilterType(v)}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="image">Apenas imagens</SelectItem>
                  <SelectItem value="document">Apenas documentos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Grid de Mídia */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredMedia?.map((media) => {
            const isImage = media.type.startsWith('image/');

            return (
              <Card key={media.id} className="overflow-hidden group">
                <div className="aspect-square bg-gray-100 relative">
                  {isImage ? (
                    <img
                      src={media.url}
                      alt={media.alt_text || media.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <File className="h-16 w-16 text-gray-400" />
                    </div>
                  )}

                  {/* Overlay com ações */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleCopyUrl(media.url)}
                      title="Copiar URL"
                    >
                      {copiedUrl === media.url ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEditClick(media)}
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteClick(media)}
                      title="Deletar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-3">
                  <p className="text-sm font-medium truncate" title={media.name}>
                    {media.name}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {media.type.split('/')[1]?.toUpperCase() || 'FILE'}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {storageService.formatFileSize(media.size)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredMedia?.length === 0 && (
            <div className="col-span-full">
              <Card>
                <CardContent className="py-12 text-center">
                  <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhum arquivo encontrado</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setIsUploadOpen(true)}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Fazer Upload
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Dialog Upload */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload de Arquivos</DialogTitle>
            <DialogDescription>
              Selecione um ou mais arquivos para fazer upload
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="file-upload">Selecionar Arquivos</Label>
              <Input
                id="file-upload"
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileSelect}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-2">
                Tipos aceitos: Imagens (JPG, PNG, WEBP, GIF) e PDF
              </p>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {selectedFiles.length} arquivo(s) selecionado(s):
                </p>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded"
                    >
                      <span className="truncate flex-1">{file.name}</span>
                      <span className="text-gray-500 ml-2">
                        {storageService.formatFileSize(file.size)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploadMutation.isPending || selectedFiles.length === 0}
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Fazer Upload ({selectedFiles.length})
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Editar */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Arquivo</DialogTitle>
            <DialogDescription>
              Atualize as informações do arquivo
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedMedia && selectedMedia.type.startsWith('image/') && (
              <div className="flex justify-center">
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.name}
                  className="max-h-48 rounded-lg"
                />
              </div>
            )}

            <div>
              <Label htmlFor="edit-name">Nome do Arquivo</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="edit-alt">Texto Alternativo (Alt Text)</Label>
              <Input
                id="edit-alt"
                value={editForm.alt_text}
                onChange={(e) => setEditForm({ ...editForm, alt_text: e.target.value })}
                placeholder="Descrição da imagem para acessibilidade"
              />
            </div>

            <div>
              <Label>URL do Arquivo</Label>
              <div className="flex gap-2 mt-1">
                <Input value={selectedMedia?.url || ''} readOnly className="flex-1" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => selectedMedia && handleCopyUrl(selectedMedia.url)}
                >
                  {copiedUrl === selectedMedia?.url ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Deletar */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir <strong>{selectedMedia?.name}</strong>?
              <br />
              Este arquivo será removido do storage e do banco de dados.
              <br />
              <span className="text-red-600 font-semibold">Esta ação não pode ser desfeita.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
