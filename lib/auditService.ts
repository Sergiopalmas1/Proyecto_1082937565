import { createServerSupabaseClient } from '@/lib/supabase';
import { CattleAudit } from '@/lib/types';

// ============================================
// SERVICIO DE AUDITORÍA — FASE 4
// ============================================

export class AuditService {

  /**
   * Registra un cambio en la auditoría de animales (RN-08)
   */
  static async auditCattleChange(
    cattleId: string,
    action: 'create' | 'update' | 'status_change' | 'delete',
    changes: Record<string, { from: any; to: any }>,
    userId: string
  ): Promise<void> {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase
      .from('cattle_audit')
      .insert({
        cattle_id: cattleId,
        action,
        changes,
        changed_by: userId,
      });

    if (error) throw error;
  }

  /**
   * Obtiene el historial de auditoría de un animal específico
   */
  static async getCattleAudit(cattleId: string): Promise<CattleAudit[]> {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('cattle_audit')
      .select(`
        *,
        changed_by_user:users!changed_by(name, email)
      `)
      .eq('cattle_id', cattleId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Obtiene el historial de auditoría global (solo admin)
   */
  static async getGlobalAudit(limit: number = 100): Promise<CattleAudit[]> {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('cattle_audit')
      .select(`
        *,
        cattle:cattle(code, name),
        changed_by_user:users!changed_by(name, email)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Obtiene estadísticas de auditoría por período
   */
  static async getAuditStats(startDate: string, endDate: string): Promise<{
    total_changes: number;
    changes_by_action: Record<string, number>;
    changes_by_user: Record<string, number>;
  }> {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('cattle_audit')
      .select('action, changed_by')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (error) throw error;

    const stats = {
      total_changes: data?.length || 0,
      changes_by_action: {} as Record<string, number>,
      changes_by_user: {} as Record<string, number>,
    };

    for (const audit of data || []) {
      // Contar por acción
      stats.changes_by_action[audit.action] = (stats.changes_by_action[audit.action] || 0) + 1;

      // Contar por usuario
      if (audit.changed_by) {
        stats.changes_by_user[audit.changed_by] = (stats.changes_by_user[audit.changed_by] || 0) + 1;
      }
    }

    return stats;
  }
}

export async function recordAudit(_entry: unknown): Promise<void> {
  // Registro de auditoría en el sistema: placeholder para integraciones futuras.
  return;
}
