/**
 * Supabase Client Configuration
 * 
 * Configura e exporta o cliente do Supabase para uso em toda a aplicação.
 * Este cliente é utilizado para autenticação, consultas ao banco de dados e storage.
 * 
 * @module lib/supabase
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase URL e/ou Anon Key não configurados. Verifique o arquivo .env.local'
  );
}

/**
 * Cliente Supabase configurado com tipagem do Database
 * 
 * @example
 * ```typescript
 * import { supabase } from '@/lib/supabase';
 * 
 * // Buscar dados
 * const { data, error } = await supabase
 *   .from('site_content')
 *   .select('*');
 * ```
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
