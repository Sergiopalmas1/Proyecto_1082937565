import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import { createShedSchema } from '@/lib/validators';
import { getSheds, createShed } from '@/lib/shedService';
import { SafeUser } from '@/lib/types';

/**
 * GET /api/sheds
 * Obtener lista de bodegas activas con conteo de animales
 */
export const GET = withAuth(async (request: NextRequest, context: any, user: SafeUser) => {
  try {
    const sheds = await getSheds();
    return NextResponse.json({ sheds });
  } catch (error) {
    console.error('Error obteniendo bodegas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/sheds
 * Crear una nueva bodega (solo admin)
 */
export const POST = withAuth(async (request: NextRequest, context: any, user: SafeUser) => {
  try {
    // Solo admin puede crear bodegas
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'No autorizado para crear bodegas' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validar datos de entrada
    const validationResult = createShedSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const newShed = await createShed(validationResult.data);

    return NextResponse.json(
      { shed: newShed, message: 'Bodega creada exitosamente' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creando bodega:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
});