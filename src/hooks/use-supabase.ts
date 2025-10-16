/**
 * Supabase Hook
 * 
 * Hook customizado para facilitar o uso do Supabase Client na aplicação.
 * Fornece acesso ao cliente e estado de autenticação de forma reativa.
 * 
 * @module hooks/use-supabase
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

/**
 * Estado de autenticação
 */
interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

/**
 * Hook para acessar o cliente Supabase e estado de autenticação
 * 
 * @returns {Object} Cliente Supabase e estado de autenticação
 * 
 * @example
 * ```typescript
 * const { user, session, loading } = useSupabase();
 * 
 * if (loading) return <Spinner />;
 * if (!user) return <LoginForm />;
 * 
 * return <Dashboard user={user} />;
 * ```
 */
export const useSupabase = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    // Buscar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        user: session?.user ?? null,
        session,
        loading: false,
      });
    });

    // Escutar mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState({
        user: session?.user ?? null,
        session,
        loading: false,
      });
    });

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    supabase,
    ...authState,
  };
};

/**
 * Hook para verificar se o usuário está autenticado
 * 
 * @returns {boolean} True se o usuário está autenticado
 * 
 * @example
 * ```typescript
 * const isAuthenticated = useAuth();
 * 
 * if (!isAuthenticated) {
 *   return <Navigate to="/admin/login" />;
 * }
 * ```
 */
export const useAuth = (): boolean => {
  const { user } = useSupabase();
  return !!user;
};

/**
 * Hook para obter o usuário atual
 * 
 * @returns {User | null} Usuário atual ou null
 * 
 * @example
 * ```typescript
 * const user = useUser();
 * 
 * if (user) {
 *   console.log(`Usuário logado: ${user.email}`);
 * }
 * ```
 */
export const useUser = (): User | null => {
  const { user } = useSupabase();
  return user;
};
