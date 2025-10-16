/**
 * Users Manager Page
 * 
 * Página para gerenciar usuários administrativos (admin/editor).
 * Apenas administradores têm acesso a esta página.
 * 
 * @module pages/admin/UsersManager
 */

import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import {
  useUsers,
  useCreateUser,
  useUpdateUserRole,
  useResetUserPassword,
  useDeleteUser,
  useUsersCount,
  useUsersCountByRole,
} from '@/hooks/use-users';
import { useAuth } from '@/contexts/AuthContext';
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
  Plus,
  Edit,
  Trash2,
  Shield,
  ShieldAlert,
  Key,
  Users as UsersIcon,
  Mail,
  Calendar,
} from 'lucide-react';
import type { AdminUser } from '@/types/cms';

/**
 * UsersManager - Gerenciador de usuários (apenas para admins)
 */
export default function UsersManager() {
  const { user: currentUser } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Queries
  const { data: users, isLoading } = useUsers();
  const { data: totalCount } = useUsersCount();
  const { data: adminCount } = useUsersCountByRole('admin');
  const { data: editorCount } = useUsersCountByRole('editor');

  // Mutations
  const createMutation = useCreateUser();
  const updateRoleMutation = useUpdateUserRole();
  const resetPasswordMutation = useResetUserPassword();
  const deleteMutation = useDeleteUser();

  // Form states
  const [createForm, setCreateForm] = useState({
    email: '',
    password: '',
    role: 'editor' as 'admin' | 'editor',
  });

  const [editForm, setEditForm] = useState({
    role: 'editor' as 'admin' | 'editor',
  });

  const [resetPasswordForm, setResetPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const resetCreateForm = () => {
    setCreateForm({
      email: '',
      password: '',
      role: 'editor',
    });
  };

  const handleCreate = () => {
    if (!createForm.email || !createForm.password) return;

    createMutation.mutate(createForm, {
      onSuccess: () => {
        setIsCreateOpen(false);
        resetCreateForm();
      },
    });
  };

  const handleEditClick = (user: AdminUser) => {
    setSelectedUser(user);
    setEditForm({ role: user.role });
    setIsEditOpen(true);
  };

  const handleUpdateRole = () => {
    if (!selectedUser) return;

    updateRoleMutation.mutate(
      { userId: selectedUser.id, role: editForm.role },
      {
        onSuccess: () => {
          setIsEditOpen(false);
          setSelectedUser(null);
        },
      }
    );
  };

  const handleResetPasswordClick = (user: AdminUser) => {
    setSelectedUser(user);
    setResetPasswordForm({ newPassword: '', confirmPassword: '' });
    setIsResetPasswordOpen(true);
  };

  const handleResetPassword = () => {
    if (!selectedUser) return;
    if (resetPasswordForm.newPassword !== resetPasswordForm.confirmPassword) {
      return;
    }

    resetPasswordMutation.mutate(
      { userId: selectedUser.id, newPassword: resetPasswordForm.newPassword },
      {
        onSuccess: () => {
          setIsResetPasswordOpen(false);
          setSelectedUser(null);
          setResetPasswordForm({ newPassword: '', confirmPassword: '' });
        },
      }
    );
  };

  const handleDeleteClick = (user: AdminUser) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleDelete = () => {
    if (!selectedUser) return;

    deleteMutation.mutate(selectedUser.id, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        setSelectedUser(null);
      },
    });
  };

  // Filtrar usuários
  const filteredUsers = users?.filter((u) =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
            <p className="text-gray-600 mt-2">
              Gerencie administradores e editores do sistema
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Usuário
          </Button>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total de Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5 text-gray-400" />
                <div className="text-2xl font-bold">{totalCount || 0}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Administradores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-500" />
                <div className="text-2xl font-bold text-red-600">{adminCount || 0}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Editores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                <div className="text-2xl font-bold text-blue-600">{editorCount || 0}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Busca */}
        <Card>
          <CardContent className="pt-6">
            <Input
              placeholder="Buscar por email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Lista de Usuários */}
        <div className="grid grid-cols-1 gap-4">
          {filteredUsers?.map((user) => {
            const isCurrentUser = user.id === currentUser?.id;

            return (
              <Card key={user.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                        <span className="text-xl font-bold text-white">
                          {user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{user.email}</h3>
                          {isCurrentUser && (
                            <Badge variant="outline" className="text-xs">
                              Você
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Criado em {new Date(user.created_at).toLocaleDateString('pt-BR')}
                          </span>
                          {user.last_login && (
                            <span className="flex items-center gap-1">
                              Último acesso: {new Date(user.last_login).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={user.role === 'admin' ? 'destructive' : 'default'}
                        className="capitalize"
                      >
                        {user.role === 'admin' ? (
                          <>
                            <ShieldAlert className="mr-1 h-3 w-3" />
                            Admin
                          </>
                        ) : (
                          <>
                            <Shield className="mr-1 h-3 w-3" />
                            Editor
                          </>
                        )}
                      </Badge>

                      {!isCurrentUser && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(user)}
                            title="Alterar permissão"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleResetPasswordClick(user)}
                            title="Resetar senha"
                          >
                            <Key className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(user)}
                            title="Deletar usuário"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredUsers?.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum usuário encontrado</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Dialog Criar */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Usuário</DialogTitle>
            <DialogDescription>
              Crie um novo administrador ou editor
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="create-email">Email *</Label>
              <Input
                id="create-email"
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                placeholder="usuario@exemplo.com"
              />
            </div>

            <div>
              <Label htmlFor="create-password">Senha *</Label>
              <Input
                id="create-password"
                type="password"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <Label htmlFor="create-role">Permissão *</Label>
              <Select
                value={createForm.role}
                onValueChange={(value: 'admin' | 'editor') =>
                  setCreateForm({ ...createForm, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor">Editor (acesso limitado)</SelectItem>
                  <SelectItem value="admin">Admin (acesso total)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreate}
              disabled={
                createMutation.isPending ||
                !createForm.email ||
                !createForm.password ||
                createForm.password.length < 6
              }
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Usuário'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Editar Role */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Permissão</DialogTitle>
            <DialogDescription>
              Altere a permissão de <strong>{selectedUser?.email}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-role">Nova Permissão</Label>
              <Select
                value={editForm.role}
                onValueChange={(value: 'admin' | 'editor') =>
                  setEditForm({ role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor">Editor (acesso limitado)</SelectItem>
                  <SelectItem value="admin">Admin (acesso total)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateRole} disabled={updateRoleMutation.isPending}>
              {updateRoleMutation.isPending ? (
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

      {/* Dialog Reset Password */}
      <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resetar Senha</DialogTitle>
            <DialogDescription>
              Defina uma nova senha para <strong>{selectedUser?.email}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="reset-password">Nova Senha *</Label>
              <Input
                id="reset-password"
                type="password"
                value={resetPasswordForm.newPassword}
                onChange={(e) =>
                  setResetPasswordForm({ ...resetPasswordForm, newPassword: e.target.value })
                }
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <Label htmlFor="reset-confirm">Confirmar Senha *</Label>
              <Input
                id="reset-confirm"
                type="password"
                value={resetPasswordForm.confirmPassword}
                onChange={(e) =>
                  setResetPasswordForm({ ...resetPasswordForm, confirmPassword: e.target.value })
                }
                placeholder="Digite novamente"
              />
            </div>

            {resetPasswordForm.newPassword &&
              resetPasswordForm.confirmPassword &&
              resetPasswordForm.newPassword !== resetPasswordForm.confirmPassword && (
                <p className="text-sm text-red-600">As senhas não coincidem</p>
              )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetPasswordOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleResetPassword}
              disabled={
                resetPasswordMutation.isPending ||
                !resetPasswordForm.newPassword ||
                resetPasswordForm.newPassword !== resetPasswordForm.confirmPassword ||
                resetPasswordForm.newPassword.length < 6
              }
            >
              {resetPasswordMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetando...
                </>
              ) : (
                'Resetar Senha'
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
              Tem certeza que deseja excluir o usuário{' '}
              <strong>{selectedUser?.email}</strong>? Esta ação não pode ser desfeita.
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
