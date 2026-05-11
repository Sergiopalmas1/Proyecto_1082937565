/**
 * Clientes de Supabase para SIG Bovino
 * Build-safe: getSupabaseClient() retorna null si faltan env vars (NO lanza error)
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import postgres from 'postgres';

let _client: SupabaseClient | null = null;
let _checked = false;

/**
 * Cliente build-safe: retorna SupabaseClient | null
 * NUNCA lanza error si faltan variables de entorno
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (_client) return _client;
  if (_checked) return null;

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASESUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  _checked = true;

  if (!url || !key) {
    console.warn('[supabase] No configurado — retornando null (build-safe)');
    return null;
  }

  _client = createClient(url, key, {
    auth: { persistSession: false },
  });

  return _client;
}

/**
 * Cliente estricto: lanza error si no hay config.
 * Solo usar en endpoints/API routes donde Supabase es obligatorio.
 */
export function requireSupabaseClient(): SupabaseClient {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase no configurado. Verificar SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY');
  }
  return client;
}

/**
 * Alias de compatibilidad — los servicios existentes usan createServerSupabaseClient()
 */
export const createServerSupabaseClient = requireSupabaseClient;

/**
 * Ejecuta SQL directo (DDL: CREATE TABLE, ALTER, etc.)
 * Usa el paquete postgres con POSTGRES_URL
 */
export async function executeSql(query: string): Promise<void> {
  const connString = process.env.POSTGRES_URL;

  if (!connString) {
    throw new Error('POSTGRES_URL no configurado');
  }

  const sql = postgres(connString, {
    ssl: 'require',
    connect_timeout: 10,
    idle_timeout: 5,
    max: 1,
  });

  try {
    await sql.unsafe(query);
  } finally {
    await sql.end();
  }
}
