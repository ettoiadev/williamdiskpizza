/**
 * Protected Route Component
 * 
 * Componente para proteger rotas que requerem autenticação.
 * Redireciona para login se usuário não estiver autenticado.
 * 
 * @module components/ProtectedRoute
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * Props do ProtectedRoute
 */
interface ProtectedRouteProps {
  /**
   * Requer role admin?
   */
  requireAdmin?: boolean;
  
  /**
   * Rota de redirecionamento se não autenticado
   */
  redirectTo?: string;
}

/**
 * ProtectedRoute - Componente de rota protegida
 * 
 * Verifica autenticação antes de renderizar children.
 * Mostra loading durante verificação e redireciona se não autorizado.
 * 
 * @param props - Configurações da rota protegida
 * 
 * @example
 * ```typescript
 * // No router
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/admin/dashboard" element={<Dashboard />} />
 * </Route>
 * 
 * // Apenas para admins
 * <Route element={<ProtectedRoute requireAdmin />}>
 *   <Route path="/admin/settings" element={<Settings />} />
 * </Route>
 * ```
 */
export function ProtectedRoute({ 
  requireAdmin = false, 
  redirectTo = '/admin/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Não autenticado - redirecionar para login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Requer admin mas usuário não é admin
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🚫</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Acesso Negado
          </h2>
          <p className="text-gray-600 mb-6">
            Você não tem permissão para acessar esta área. 
            Esta funcionalidade é restrita para administradores.
          </p>
          <a 
            href="/admin/dashboard" 
            className="inline-block px-6 py-2 bg-primary text-white rounded-md hover:opacity-90 transition"
          >
            Voltar ao Dashboard
          </a>
        </div>
      </div>
    );
  }

  // Tudo OK - renderizar rota
  return <Outlet />;
}

/**
 * Higher-Order Component para proteger componentes individuais
 * 
 * @param Component - Componente a ser protegido
 * @param requireAdmin - Requer role admin?
 * 
 * @example
 * ```typescript
 * const ProtectedDashboard = withAuth(Dashboard);
 * const ProtectedSettings = withAuth(Settings, true); // Apenas admin
 * ```
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requireAdmin = false
) {
  return function ProtectedComponent(props: P) {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!isAuthenticated) {
      return <Navigate to="/admin/login" replace />;
    }

    if (requireAdmin && !isAdmin) {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Component {...props} />;
  };
}
