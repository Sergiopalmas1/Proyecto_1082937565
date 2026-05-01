import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import { MilkProductionService } from '@/lib/milkProductionService';

// ============================================
// API ROUTE: /api/milk/summary
// ============================================

// GET /api/milk/summary - Obtiene resumen de producción por período
export const GET = withAuth(async (request: NextRequest, context: any, user: any) => {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Se requieren startDate y endDate' },
        { status: 400 }
      );
    }

    const summary = await MilkProductionService.getProductionSummary(startDate, endDate);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('[GET /api/milk/summary]', error);
    return NextResponse.json(
      { error: 'Error obteniendo resumen' },
      { status: 500 }
    );
  }
});