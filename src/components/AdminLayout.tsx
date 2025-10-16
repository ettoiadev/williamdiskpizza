/**
 * Admin Layout
 * 
 * Layout compartilhado para todas as páginas administrativas.
 * Inclui sidebar de navegação e header.
 * 
 * @module components/AdminLayout
 */

import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Pizza, 
  LogOut, 
  FileText, 
  Image, 
  MessageSquare, 
  Settings,
  Users,
  LayoutDashboard,
  FolderOpen,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Props do layout
 */
interface AdminLayoutProps {
  children: ReactNode;
}

/**
 * Item de menu
 */
interface MenuItem {
  icon: typeof FileText;
  label: string;
  path: string;
  adminOnly?: boolean;
}

/**
 * AdminLayout - Layout das páginas administrativas
 */
export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, adminUser, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: FileText, label: 'Conteúdo', path: '/admin/conteudo' },
    { icon: Image, label: 'Galeria', path: '/admin/galeria' },
    { icon: MessageSquare, label: 'Depoimentos', path: '/admin/depoimentos' },
    { icon: FolderOpen, label: 'Mídia', path: '/admin/midia' },
    { icon: Settings, label: 'Configurações', path: '/admin/configuracoes', adminOnly: true },
    { icon: Users, label: 'Usuários', path: '/admin/usuarios', adminOnly: true },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    !item.adminOnly || (item.adminOnly && isAdmin)
  );

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Mobile */}
      <header className="lg:hidden bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            {sidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          
          <div className="flex items-center space-x-2">
            <Pizza className="h-6 w-6 text-primary" />
            <span className="font-bold">Admin</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r transition-transform lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b">
              <Link to="/admin/dashboard" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Pizza className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    William Pizza
                  </h1>
                  <p className="text-xs text-gray-600">Painel Admin</p>
                </div>
              </Link>
            </div>

            {/* Menu */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {filteredMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Info */}
            <div className="p-4 border-t">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.email}
                  </p>
                  <p className="text-xs text-gray-600">
                    {adminUser?.role === 'admin' ? 'Administrador' : 'Editor'}
                  </p>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
              
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                >
                  Ver Site
                </Button>
              </Link>
            </div>
          </div>
        </aside>

        {/* Overlay Mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
