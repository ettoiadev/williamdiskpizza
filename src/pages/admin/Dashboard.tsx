/**
 * Admin Dashboard Page
 * 
 * Página principal do painel administrativo.
 * Mostra visão geral e estatísticas do CMS.
 * 
 * @module pages/admin/Dashboard
 */

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Pizza, 
  LogOut, 
  FileText, 
  Image, 
  MessageSquare, 
  Settings,
  Users,
  TrendingUp,
  FolderOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Dashboard - Página principal do admin
 */
export default function Dashboard() {
  const { user, adminUser, isAdmin, signOut } = useAuth();

  /**
   * Handler de logout
   */
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Pizza className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  William Disk Pizza
                </h1>
                <p className="text-sm text-gray-600">Painel Administrativo</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                <p className="text-xs text-gray-600">
                  {adminUser?.role === 'admin' ? 'Administrador' : 'Editor'}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bem-vindo */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo de volta! 👋
          </h2>
          <p className="text-gray-600">
            Gerencie o conteúdo do seu site de forma fácil e rápida.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Conteúdo
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32</div>
              <p className="text-xs text-muted-foreground">
                Seções configuradas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Galeria
              </CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">
                Imagens ativas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Depoimentos
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                Avaliações 5★
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avaliação
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.9★</div>
              <p className="text-xs text-muted-foreground">
                Média de satisfação
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/admin/conteudo">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Editar Conteúdo</CardTitle>
                      <CardDescription className="text-xs">
                        Textos, títulos e informações
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/admin/galeria">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Image className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Gerenciar Galeria</CardTitle>
                      <CardDescription className="text-xs">
                        Upload e organização de fotos
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/admin/depoimentos">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Depoimentos</CardTitle>
                      <CardDescription className="text-xs">
                        Gerencie avaliações de clientes
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/admin/midia">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <FolderOpen className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Mídia</CardTitle>
                      <CardDescription className="text-xs">
                        Biblioteca de arquivos
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>

            {isAdmin && (
              <>
                <Link to="/admin/configuracoes">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Settings className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <CardTitle className="text-base">Configurações</CardTitle>
                          <CardDescription className="text-xs">
                            Geral, SEO e Tema
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>

                <Link to="/admin/usuarios">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <Users className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <CardTitle className="text-base">Usuários</CardTitle>
                          <CardDescription className="text-xs">
                            Gerenciar admins e editores
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Dica */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>💡</span> Dica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">
              Todas as alterações feitas no painel são aplicadas imediatamente no site. 
              Não se esqueça de revisar o site após fazer mudanças importantes!
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              asChild
            >
              <a href="/" target="_blank" rel="noopener noreferrer">
                Visualizar Site
              </a>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
