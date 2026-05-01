import { createServerSupabaseClient } from '@/lib/supabase';
import { MilkProduction, MilkProductionWithCattle, ProductionAlert, ProductionAlertWithCattle } from '@/lib/types';
import { AuditService } from '@/lib/auditService';

export class MilkProductionService {
  /**
   * Registra una producción láctea (RN-02, RN-03, RN-06, RN-11)
   */
  static async registerMilkProduction(
    cattleId: string,
    productionDate: string,
    shift: 'mañana' | 'tarde',
    liters: number,
    userId: string
  ): Promise<MilkProduction> {
    const supabase = createServerSupabaseClient();

    // Validar que el animal existe y es hembra activa (RN-02 + RN-03)
    const { data: cattle, error: cattleError } = await supabase
      .from('cattle')
      .select('id, sex, status')
      .eq('id', cattleId)
      .single();

    if (cattleError || !cattle) {
      throw new Error('Animal no encontrado');
    }

    if (cattle.sex !== 'hembra') {
      throw new Error('Solo las hembras pueden tener registros de producción');
    }

    if (cattle.status !== 'activo') {
      throw new Error('Solo animales activos pueden tener registros de producción');
    }

    // Validar litros (RN-06)
    if (liters < 0 || liters > 60) {
      throw new Error('Litros deben estar entre 0 y 60');
    }

    // Insertar producción (RN-11 UNIQUE constraint previene duplicados)
    const { data: production, error: insertError } = await supabase
      .from('milk_production')
      .insert({
        cattle_id: cattleId,
        production_date: productionDate,
        shift,
        liters,
        recorded_by: userId,
      })
      .select()
      .single();

    if (insertError) {
      if (insertError.code === '23505') { // UNIQUE constraint violation
        throw new Error('Ya existe registro de producción para este animal, fecha y turno');
      }
      throw insertError;
    }

    // Auditoría
    await AuditService.auditCattleChange(cattleId, 'update', {
      production: { from: null, to: `${liters}L ${shift} ${productionDate}` }
    }, userId);

    // Detección de caída de producción (RN-12) - asíncrona
    this.checkProductionDrop(cattleId, production.id, liters, productionDate).catch(console.error);

    return production;
  }

  /**
   * Verifica caída de producción >20% (RN-12) - asíncrona
   */
  private static async checkProductionDrop(
    cattleId: string,
    productionId: string,
    currentLiters: number,
    productionDate: string
  ): Promise<void> {
    const supabase = createServerSupabaseClient();

    // Calcular promedio de los últimos 7 días (excluyendo el registro actual)
    const sevenDaysAgo = new Date(productionDate);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: recentProductions, error } = await supabase
      .from('milk_production')
      .select('liters')
      .eq('cattle_id', cattleId)
      .gte('production_date', sevenDaysAgo.toISOString().split('T')[0])
      .lt('production_date', productionDate); // Excluir el día actual

    if (error || !recentProductions || recentProductions.length === 0) {
      return; // No hay datos suficientes para comparar
    }

    const averageLiters = recentProductions.reduce((sum, p) => sum + p.liters, 0) / recentProductions.length;
    const dropPercentage = ((averageLiters - currentLiters) / averageLiters) * 100;

    if (dropPercentage > 20) {
      // Insertar alerta
      await supabase
        .from('production_alerts')
        .insert({
          cattle_id: cattleId,
          production_id: productionId,
          alert_type: 'production_drop',
          current_liters: currentLiters,
          average_liters: averageLiters,
          drop_percentage: dropPercentage,
        });
    }
  }

  /**
   * Obtiene producciones con filtros
   */
  static async getMilkProductions(
    filters: {
      cattleId?: string;
      startDate?: string;
      endDate?: string;
      shift?: 'mañana' | 'tarde';
      limit?: number;
    } = {}
  ): Promise<MilkProductionWithCattle[]> {
    const supabase = createServerSupabaseClient();

    let query = supabase
      .from('milk_production')
      .select(`
        *,
        cattle:cattle(id, code, name)
      `)
      .order('production_date', { ascending: false })
      .order('shift', { ascending: false });

    if (filters.cattleId) {
      query = query.eq('cattle_id', filters.cattleId);
    }

    if (filters.startDate) {
      query = query.gte('production_date', filters.startDate);
    }

    if (filters.endDate) {
      query = query.lte('production_date', filters.endDate);
    }

    if (filters.shift) {
      query = query.eq('shift', filters.shift);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  /**
   * Obtiene resumen de producción por período
   */
  static async getProductionSummary(
    startDate: string,
    endDate: string
  ): Promise<{
    total_productions: number;
    total_liters: number;
    average_per_production: number;
    productions_by_shift: Record<string, number>;
    top_producers: Array<{
      cattle_id: string;
      cattle_code: string;
      total_liters: number;
      production_count: number;
    }>;
  }> {
    const supabase = createServerSupabaseClient();

    const { data: productions, error } = await supabase
      .from('milk_production')
      .select(`
        liters,
        shift,
        cattle_id
      `)
      .gte('production_date', startDate)
      .lte('production_date', endDate);

    if (error) throw error;

    if (!productions || productions.length === 0) {
      return {
        total_productions: 0,
        total_liters: 0,
        average_per_production: 0,
        productions_by_shift: {},
        top_producers: [],
      };
    }

    // Obtener información de los animales
    const cattleIds = [...new Set(productions.map(p => p.cattle_id))];
    const { data: cattleData, error: cattleError } = await supabase
      .from('cattle')
      .select('id, code')
      .in('id', cattleIds);

    if (cattleError) throw cattleError;

    const cattleMap = new Map(cattleData?.map(c => [c.id, c]) || []);

    const totalLiters = productions.reduce((sum, p) => sum + p.liters, 0);
    const productionsByShift: Record<string, number> = {};
    const producerStats: Record<string, { totalLiters: number; count: number; code: string }> = {};

    productions.forEach(p => {
      productionsByShift[p.shift] = (productionsByShift[p.shift] || 0) + 1;

      const cattleId = p.cattle_id;
      const cattle = cattleMap.get(cattleId);
      if (cattle && !producerStats[cattleId]) {
        producerStats[cattleId] = { totalLiters: 0, count: 0, code: cattle.code };
      }
      if (producerStats[cattleId]) {
        producerStats[cattleId].totalLiters += p.liters;
        producerStats[cattleId].count += 1;
      }
    });

    const topProducers = Object.entries(producerStats)
      .map(([cattle_id, stats]) => ({
        cattle_id,
        cattle_code: stats.code,
        total_liters: stats.totalLiters,
        production_count: stats.count,
      }))
      .sort((a, b) => b.total_liters - a.total_liters)
      .slice(0, 10);

    return {
      total_productions: productions.length,
      total_liters: totalLiters,
      average_per_production: totalLiters / productions.length,
      productions_by_shift: productionsByShift,
      top_producers: topProducers,
    };
  }

  /**
   * Obtiene alertas de producción (solo admin)
   */
  static async getProductionAlerts(
    resolved: boolean = false
  ): Promise<ProductionAlertWithCattle[]> {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('production_alerts')
      .select(`
        *,
        cattle:cattle(id, code, name)
      `)
      .eq('is_resolved', resolved)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Marca alerta como resuelta (solo admin)
   */
  static async resolveAlert(alertId: string): Promise<void> {
    const supabase = createServerSupabaseClient();

    const { error } = await supabase
      .from('production_alerts')
      .update({ is_resolved: true })
      .eq('id', alertId);

    if (error) throw error;
  }
}