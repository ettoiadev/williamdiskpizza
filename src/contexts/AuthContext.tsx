/**
 * Authentication Context
 * 
 * Context React para gerenciar estado global de autenticação.
 * Fornece acesso ao usuário atual e funções de auth em toda a aplicação.
 * 
 * @module contexts/AuthContext
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { authService } from '@/services/auth-service';
import type { AdminUser } from '@/types/cms';

/**
 * Estado do contexto de autenticação
 */
interface AuthContextType {
  user: User | null;
  session: Session | null;
  adminUser: AdminUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshAdminUser: () => Promise<void>;
}

/**
 * Props do provider
 */
interface AuthProviderProps {
  children: ReactNode;
}

// Criar contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider - Provider de autenticação
 * 
 * Envolve a aplicação e fornece estado de autenticação
 * 
 * @param props - Children components
 * 
 * @example
 * ```typescript
 * import { AuthProvider } from '@/contexts/AuthContext';
 * 
 * function App() {
 *   return (
 *     <AuthProvider>
 *       <YourApp />
 *     </AuthProvider>
 *   );
 * }
 * ```
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Carregar dados do admin user
   */
  const loadAdminUser = async (userId: string) => {
    try {
      const data = await authService.getAdminUser(userId);
      if (data) {
        setAdminUser(data);
      } else {
        console.error('Usuário não encontrado na tabela admin_users');
        // Não fazer logout, apenas mostrar que não é admin
        setAdminUser(null);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do admin user:', error);
      // Não fazer logout em caso de erro, apenas deixar adminUser como null
      setAdminUser(null);
    }
  };

  /**
   * Refresh dos dados do admin user
   */
  const refreshAdminUser = async () => {
    if (user) {
      await loadAdminUser(user.id);
    }
  };

  /**
   * Inicializar auth state
   */
  useEffect(() => {
    let mounted = true;

    // Função async para inicializar autenticação
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // ✅ AGUARDAR o carregamento do admin user antes de definir loading=false
          await loadAdminUser(session.user.id);
        }
        
        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('[AuthContext] Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    // Escutar mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // ✅ AGUARDAR o carregamento do admin user
        await loadAdminUser(session.user.id);
      } else {
        setAdminUser(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Função de login
   */
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await authService.signIn({ email, password });
      
      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      return { error: 'Erro ao fazer login. Tente novamente.' };
    }
  };

  /**
   * Função de logout
   */
  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setSession(null);
    setAdminUser(null);
  };

  const value: AuthContextType = {
    user,
    session,
    adminUser,
    loading,
    isAuthenticated: !!user,
    isAdmin: adminUser?.role === 'admin',
    signIn,
    signOut,
    refreshAdminUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook para usar o contexto de autenticação
 * 
 * @returns Contexto de autenticação
 * @throws Error se usado fora do AuthProvider
 * 
 * @example
 * ```typescript
 * import { useAuth } from '@/contexts/AuthContext';
 * 
 * function MyComponent() {
 *   const { user, isAuthenticated, signOut } = useAuth();
 *   
 *   if (!isAuthenticated) {
 *     return <LoginForm />;
 *   }
 *   
 *   return (
 *     <div>
 *       <p>Bem-vindo, {user?.email}</p>
 *       <button onClick={signOut}>Sair</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}
