import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withRole } from '@/lib/withAuth';
import { MilkProductionService } from '@/lib/milkProductionService';
import { resolveAlertSchema, ResolveAlertRequest } from '@/lib/validators';

// ============================================
// API ROUTE: /api/production-alerts
// ============================================

// GET /api/production-alerts - Lista alertas (solo admin)
export const GET = withRole(['admin'])(async (request: NextRequest, context: any, user: any) => {
  try {
    const { searchParams } = new URL(request.url);
    const resolved = searchParams.get('resolved') === 'true';

    const alerts = await MilkProductionService.getProductionAlerts(resolved);

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error('[GET /api/production-alerts]', error);
    return NextResponse.json(
      { error: 'Error obteniendo alertas' },
      { status: 500 }
    );
  }
});

// POST /api/production-alerts/resolve - Marca alerta como resuelta (solo admin)
export const POST = withRole(['admin'])(async (request: NextRequest, context: any, user: any) => {
  try {
    const body: ResolveAlertRequest = await request.json();

    // Validar entrada
    const validationResult = resolveAlertSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', issues: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { alert_id } = validationResult.data;

    await MilkProductionService.resolveAlert(alert_id);

    return NextResponse.json(
      { message: 'Alerta marcada como resuelta' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[POST /api/production-alerts/resolve]', error);
    return NextResponse.json(
      { error: 'Error resolviendo alerta' },
      { status: 500 }
    );
  }
});