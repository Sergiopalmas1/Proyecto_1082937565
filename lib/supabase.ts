/**
 * Clientes de Supabase para SIG Bovino
 * Server-side y client-side safe clients
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * Cliente de Supabase para servidor (con service role key)
 * ⚠️ NUNCA expongas en el cliente
 */
export const createServerSupabaseClient = () => {
  if (!supabaseServiceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY no configurada');
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey);
};

/**
 * Cliente de Supabase para cliente (con anon key)
 * Seguro para usar en navegador
 */
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
