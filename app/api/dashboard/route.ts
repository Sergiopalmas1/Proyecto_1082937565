/**
 * GET /api/dashboard
 * Retorna datos consolidados según el rol del usuario
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import { SafeUser } from '@/lib/types';
import { createServerSupabaseClient } from '@/lib/supabase';
import { ReproductionService } from '@/lib/reproductionService';
import { getVaccinationAlerts } from '@/lib/vaccinationService';

export const GET = withAuth(async (request: NextRequest, context: any, user: SafeUser) => {
  const supabase = createServerSupabaseClient();

  // Datos base para todos los roles
  const dashboardData = {
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
    },
  };

  // Datos específicos por rol
  if (user.role === 'admin') {
    // Obtener conteos
    const [cattleResult, shedsResult, alertsResult, vaccinationAlerts] = await Promise.all([
      supabase.from('cattle').select('*', { count: 'exact', head: true }),
      supabase.from('sheds').select('*', { count: 'exact', head: true }),
      supabase.from('production_alerts').select('*', { count: 'exact', head: true }).eq('is_resolved', false),
      getVaccinationAlerts(),
    ]);

    const activeCattleResult = await supabase
      .from('cattle')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'activo');

    const reproductiveCount = await ReproductionService.getReproductiveAlertCount();

    Object.assign(dashboardData, {
      alerts: {
        vaccination: vaccinationAlerts.length,
        production_drop: alertsResult.count || 0,
        reproductive: reproductiveCount,
      },
      counts: {
        total_cattle: cattleResult.count || 0,
        active_cattle: activeCattleResult.count || 0,
        total_sheds: shedsResult.count || 0,
      },
    });
  } else if (user.role === 'veterinario') {
    const vaccinationAlerts = await getVaccinationAlerts();
    const reproductiveCount = await ReproductionService.getReproductiveAlertCount();

    Object.assign(dashboardData, {
      alerts: {
        vaccination: vaccinationAlerts.length,
        reproductive: reproductiveCount,
      },
    });
  } else if (user.role === 'operario') {
    Object.assign(dashboardData, {
      pending: {
        milk_production: 0, // TODO: implementar lógica de pendientes
        observations: 0,
      },
    });
  }

  return NextResponse.json(
    {
      success: true,
      data: dashboardData,
    },
    { status: 200 }
  );
});
