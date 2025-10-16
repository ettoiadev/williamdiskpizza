/**
 * Authentication Context
 * 
 * Context React para gerenciar estado global de autenticação.
 * Fornece acesso ao usuário atual e funções de auth em toda a aplicação.
 * 
 * @module contexts/AuthContext
 */

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
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
  
  // ✅ Flag para prevenir múltiplas chamadas simultâneas
  const loadingAdminRef = useRef(false);

  /**
   * Carregar dados do admin user com timeout e proteção contra chamadas duplicadas
   */
  const loadAdminUser = async (userId: string) => {
    // ✅ Prevenir múltiplas chamadas simultâneas
    if (loadingAdminRef.current) {
      console.log('[AuthContext] Já carregando admin user, pulando...');
      return;
    }
    
    try {
      loadingAdminRef.current = true;
      console.log('[AuthContext] Carregando admin user:', userId);
      
      // ✅ Timeout de 3 segundos (reduzido para mais rapidez)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout ao carregar admin user')), 3000)
      );
      
      const dataPromise = authService.getAdminUser(userId);
      
      const data = await Promise.race([dataPromise, timeoutPromise]) as any;
      
      if (data) {
        console.log('[AuthContext] Admin user carregado:', data.role);
        setAdminUser(data);
      } else {
        console.warn('[AuthContext] Usuário não encontrado na tabela admin_users');
        setAdminUser(null);
      }
    } catch (error) {
      console.error('[AuthContext] Erro ao carregar admin user:', error);
      // ✅ Definir como null em caso de erro para não bloquear
      setAdminUser(null);
    } finally {
      loadingAdminRef.current = false;
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

    // ✅ Garantia absoluta: forçar loading=false após 10 segundos
    const emergencyTimeout = setTimeout(() => {
      if (mounted) {
        console.warn('[AuthContext] TIMEOUT EMERGENCIAL - forçando loading=false');
        setLoading(false);
      }
    }, 10000);

    // Função async para inicializar autenticação
    const initAuth = async () => {
      try {
        console.log('[AuthContext] Inicializando autenticação...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) {
          console.log('[AuthContext] Componente desmontado, abortando');
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('[AuthContext] Sessão encontrada, carregando admin user...');
          // ✅ AGUARDAR o carregamento do admin user (com timeout de 3s)
          await loadAdminUser(session.user.id);
        } else {
          console.log('[AuthContext] Sem sessão ativa');
        }
        
        if (mounted) {
          console.log('[AuthContext] Autenticação inicializada');
          setLoading(false);
          clearTimeout(emergencyTimeout); // ✅ Cancelar timeout de emergência
        }
      } catch (error) {
        console.error('[AuthContext] Erro ao inicializar auth:', error);
        if (mounted) {
          setLoading(false);
          clearTimeout(emergencyTimeout); // ✅ Cancelar timeout de emergência
        }
      }
    };

    initAuth();

    // Escutar mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('[AuthContext] Auth state changed:', event);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // ✅ NÃO bloquear aqui - carregar async sem await
        loadAdminUser(session.user.id).catch(err => {
          console.error('[AuthContext] Erro ao carregar admin user:', err);
        });
      } else {
        setAdminUser(null);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(emergencyTimeout); // ✅ Limpar timeout ao desmontar
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
