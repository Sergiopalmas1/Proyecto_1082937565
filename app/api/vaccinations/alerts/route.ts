/**
 * GET /api/vaccinations/alerts
 * Obtiene alertas de vacunaciones próximas (dentro de 7 días)
 * Solo para veterinario y admin
 */

import { NextResponse } from 'next/server';
import { withAuth, withRole } from '@/lib/withAuth';
import { getVaccinationAlerts } from '@/lib/vaccinationService';

export const GET = withAuth(withRole(['admin', 'veterinario'])(
  async (request: Request) => {
    try {
      const alerts = await getVaccinationAlerts();

      return NextResponse.json({
        success: true,
        alerts,
      });
    } catch (error) {
      console.error('Error obteniendo alertas de vacunación:', error);
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Error interno del servidor',
        },
        { status: 500 }
      );
    }
  }
));