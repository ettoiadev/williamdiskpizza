/**
 * Testimonials Manager Page
 * 
 * Página para gerenciar depoimentos de clientes.
 * CRUD completo, ativação/desativação, ordenação e métricas.
 * 
 * @module pages/admin/TestimonialsManager
 */

import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import {
  useTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
  useToggleTestimonial,
  useAverageRating,
  useRatingStats,
  useTestimonialsCount,
} from '@/hooks/use-testimonials';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Badge } from '@/components/ui/badge';
import { ImageUpload } from '@/components/ImageUpload';
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  Star,
  Eye,
  EyeOff,
  MapPin,
  MessageSquare,
} from 'lucide-react';
import type { Testimonial } from '@/types/cms';

/**
 * TestimonialsManager - Gerenciador de depoimentos
 */
export default function TestimonialsManager() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');

  // Queries
  const { data: testimonials, isLoading } = useTestimonials();
  const { data: avgRating } = useAverageRating();
  const { data: ratingStats } = useRatingStats();
  const { data: totalCount } = useTestimonialsCount();

  // Mutations
  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial();
  const deleteMutation = useDeleteTestimonial();
  const toggleMutation = useToggleTestimonial();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    comment: '',
    location: '',
    rating: 5,
    image_url: '',
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      comment: '',
      location: '',
      rating: 5,
      image_url: '',
      is_active: true,
    });
  };

  const handleCreate = () => {
    createMutation.mutate(formData, {
      onSuccess: () => {
        setIsCreateOpen(false);
        resetForm();
      },
    });
  };

  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      comment: testimonial.comment,
      location: testimonial.location,
      rating: testimonial.rating,
      image_url: testimonial.image_url || '',
      is_active: testimonial.is_active,
    });
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedTestimonial) return;

    updateMutation.mutate(
      { id: selectedTestimonial.id, ...formData },
      {
        onSuccess: () => {
          setIsEditOpen(false);
          setSelectedTestimonial(null);
          resetForm();
        },
      }
    );
  };

  const handleDeleteClick = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsDeleteOpen(true);
  };

  const handleDelete = () => {
    if (!selectedTestimonial) return;

    deleteMutation.mutate(selectedTestimonial.id, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        setSelectedTestimonial(null);
      },
    });
  };

  const handleToggle = (id: string) => {
    toggleMutation.mutate(id);
  };

  // Filtrar depoimentos
  const filteredTestimonials = testimonials?.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter =
      filterActive === 'all' ||
      (filterActive === 'active' && t.is_active) ||
      (filterActive === 'inactive' && !t.is_active);

    return matchesSearch && matchesFilter;
  });

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
            <h1 className="text-3xl font-bold text-gray-900">Depoimentos</h1>
            <p className="text-gray-600 mt-2">
              Gerencie avaliações e comentários dos clientes
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Depoimento
          </Button>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCount || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avaliação Média
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">
                  {avgRating?.toFixed(1) || '0.0'}
                </div>
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {testimonials?.filter((t) => t.is_active).length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Inativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-400">
                {testimonials?.filter((t) => !t.is_active).length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Distribuição de Estrelas */}
        {ratingStats && (
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Avaliações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const stat = Array.isArray(ratingStats) 
                    ? ratingStats.find((s) => s.rating === rating)
                    : undefined;
                  const count = stat?.count || 0;
                  const percentage = totalCount ? (count / totalCount) * 100 : 0;

                  return (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-16">
                        <span className="text-sm font-medium">{rating}</span>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filtros e Busca */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por nome ou comentário..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterActive === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterActive('all')}
                >
                  Todos
                </Button>
                <Button
                  variant={filterActive === 'active' ? 'default' : 'outline'}
                  onClick={() => setFilterActive('active')}
                >
                  Ativos
                </Button>
                <Button
                  variant={filterActive === 'inactive' ? 'default' : 'outline'}
                  onClick={() => setFilterActive('inactive')}
                >
                  Inativos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Depoimentos */}
        <div className="grid grid-cols-1 gap-4">
          {filteredTestimonials?.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {testimonial.image_url ? (
                      <img
                        src={testimonial.image_url}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-400">
                          {testimonial.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {testimonial.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < testimonial.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            <MapPin className="inline h-3 w-3 mr-1" />
                            {testimonial.location}
                          </span>
                        </div>
                      </div>

                      {/* Badges e Ações */}
                      <div className="flex items-center gap-2">
                        <Badge variant={testimonial.is_active ? 'default' : 'secondary'}>
                          {testimonial.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggle(testimonial.id, testimonial.is_active)}
                        >
                          {testimonial.is_active ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(testimonial)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(testimonial)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>

                    <p className="mt-3 text-gray-700">{testimonial.comment}</p>

                    <div className="mt-2 text-xs text-gray-500">
                      Criado em {new Date(testimonial.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredTestimonials?.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum depoimento encontrado</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Dialog Criar */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Depoimento</DialogTitle>
            <DialogDescription>
              Adicione um novo depoimento de cliente
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="create-name">Nome do Cliente *</Label>
              <Input
                id="create-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Maria Silva"
              />
            </div>

            <div>
              <Label htmlFor="create-location">Localização *</Label>
              <Input
                id="create-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Jacareí, SP"
              />
            </div>

            <div>
              <Label htmlFor="create-rating">Avaliação *</Label>
              <div className="flex items-center gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        rating <= formData.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 hover:text-yellow-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="create-comment">Comentário *</Label>
              <Textarea
                id="create-comment"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                placeholder="A melhor pizza da região..."
                rows={4}
              />
            </div>

            <div>
              <Label>Foto do Cliente (opcional)</Label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="URL da imagem"
                className="mb-2"
              />
              <ImageUpload
                multiple={false}
                folder="testimonials"
                buttonText="Enviar foto"
                onUploadComplete={(urls) => {
                  if (urls && urls[0]) {
                    setFormData({ ...formData, image_url: urls[0] });
                  }
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="create-active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="create-active" className="cursor-pointer">
                Ativar depoimento imediatamente
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreate}
              disabled={createMutation.isPending || !formData.name || !formData.comment}
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Depoimento'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Editar */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Depoimento</DialogTitle>
            <DialogDescription>
              Atualize as informações do depoimento
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-name">Nome do Cliente *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="edit-location">Localização *</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="edit-rating">Avaliação *</Label>
              <div className="flex items-center gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        rating <= formData.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 hover:text-yellow-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="edit-comment">Comentário *</Label>
              <Textarea
                id="edit-comment"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows={4}
              />
            </div>

            <div>
              <Label>Foto do Cliente (opcional)</Label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="URL da imagem"
                className="mb-2"
              />
              <ImageUpload
                multiple={false}
                folder="testimonials"
                buttonText="Enviar foto"
                onUploadComplete={(urls) => {
                  if (urls && urls[0]) {
                    setFormData({ ...formData, image_url: urls[0] });
                  }
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="edit-active" className="cursor-pointer">
                Depoimento ativo
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateMutation.isPending || !formData.name || !formData.comment}
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
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
              Tem certeza que deseja excluir o depoimento de{' '}
              <strong>{selectedTestimonial?.name}</strong>? Esta ação não pode ser desfeita.
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
