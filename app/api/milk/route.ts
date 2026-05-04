import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import { MilkProductionService } from '@/lib/milkProductionService';
import { createMilkProductionSchema, CreateMilkProductionRequest } from '@/lib/validators';

// ============================================
// API ROUTE: /api/milk
// ============================================

// GET /api/milk - Lista producciones con filtros
export const GET = withAuth(async (request: NextRequest, context: any, user: any) => {
  try {
    const { searchParams } = new URL(request.url);
    const cattleId = searchParams.get('cattleId') || undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const shift = searchParams.get('shift') as 'mañana' | 'tarde' | undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const productions = await MilkProductionService.getMilkProductions({
      cattleId,
      startDate,
      endDate,
      shift,
      limit,
    });

    return NextResponse.json({ productions });
  } catch (error) {
    console.error('[GET /api/milk]', error);
    return NextResponse.json(
      { error: 'Error obteniendo producciones' },
      { status: 500 }
    );
  }
});

// POST /api/milk - Registra nueva producción
export const POST = withAuth(async (request: NextRequest, context: any, user: any) => {
  try {
    const body: CreateMilkProductionRequest = await request.json();

    // Validar entrada
    const validationResult = createMilkProductionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', issues: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { cattle_id, production_date, shift, liters } = validationResult.data;

    const production = await MilkProductionService.registerMilkProduction(
      cattle_id,
      production_date,
      shift,
      liters,
      user.id
    );

    return NextResponse.json(
      { production, message: 'Producción registrada exitosamente' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[POST /api/milk]', error);

    if (error.message?.includes('Solo las hembras') ||
        error.message?.includes('Solo animales activos') ||
        error.message?.includes('Ya existe registro') ||
        error.message?.includes('Litros deben estar')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (error.message?.includes('Animal no encontrado')) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Error registrando producción' },
      { status: 500 }
    );
  }
});