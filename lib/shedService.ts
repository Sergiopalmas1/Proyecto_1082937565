/**
 * Servicio de bodegas para SIG Bovino
 * Maneja operaciones CRUD de bodegas con validación de capacidad
 */

import { createServerSupabaseClient } from '@/lib/supabase';
import { Shed, ShedWithCount } from '@/lib/types';

/**
 * Obtener todas las bodegas activas con conteo actual de animales
 */
export async function getSheds(): Promise<ShedWithCount[]> {
  const supabase = createServerSupabaseClient();

  // Obtener bodegas con conteo de animales activos
  const { data: sheds, error } = await supabase
    .from('sheds')
    .select(`
      *,
      cattle: cattle(count)
    `)
    .eq('is_active', true)
    .order('name');

  if (error) {
    throw new Error(`Error obteniendo bodegas: ${error.message}`);
  }

  // Transformar el resultado para incluir current_count
  return sheds.map((shed: any) => ({
    ...shed,
    current_count: shed.cattle?.[0]?.count || 0,
  }));
}

/**
 * Obtener una bodega por ID con conteo actual
 */
export async function getShedById(id: string): Promise<ShedWithCount | null> {
  const supabase = createServerSupabaseClient();

  const { data: shed, error } = await supabase
    .from('sheds')
    .select(`
      *,
      cattle: cattle(count)
    `)
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No encontrado
    }
    throw new Error(`Error obteniendo bodega: ${error.message}`);
  }

  return {
    ...shed,
    current_count: shed.cattle?.[0]?.count || 0,
  };
}

/**
 * Crear una nueva bodega
 */
export async function createShed(shedData: Omit<Shed, 'id' | 'is_active' | 'created_at'>): Promise<Shed> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('sheds')
    .insert([shedData])
    .select()
    .single();

  if (error) {
    throw new Error(`Error creando bodega: ${error.message}`);
  }

  return data;
}

/**
 * Actualizar una bodega existente
 */
export async function updateShed(id: string, updates: Partial<Omit<Shed, 'id' | 'is_active' | 'created_at'>>): Promise<Shed> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('sheds')
    .update(updates)
    .eq('id', id)
    .eq('is_active', true)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Bodega no encontrada o inactiva');
    }
    throw new Error(`Error actualizando bodega: ${error.message}`);
  }

  return data;
}

/**
 * Eliminar una bodega (soft delete si tiene animales)
 */
export async function deleteShed(id: string): Promise<void> {
  const supabase = createServerSupabaseClient();

  // Verificar si tiene animales asignados
  const { count: animalCount, error: countError } = await supabase
    .from('cattle')
    .select('*', { count: 'exact', head: true })
    .eq('shed_id', id)
    .eq('status', 'activo');

  if (countError) {
    throw new Error(`Error verificando animales: ${countError.message}`);
  }

  if (animalCount && animalCount > 0) {
    // Soft delete: marcar como inactiva
    const { error } = await supabase
      .from('sheds')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      throw new Error(`Error desactivando bodega: ${error.message}`);
    }
  } else {
    // Hard delete: eliminar físicamente
    const { error } = await supabase
      .from('sheds')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error eliminando bodega: ${error.message}`);
    }
  }
}