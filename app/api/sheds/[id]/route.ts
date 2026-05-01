import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import { updateShedSchema } from '@/lib/validators';
import { getShedById, updateShed, deleteShed } from '@/lib/shedService';
import { SafeUser } from '@/lib/types';

/**
 * GET /api/sheds/[id]
 * Obtener una bodega específica con conteo de animales
 */
export const GET = withAuth(async (request: NextRequest, context: any, user: SafeUser) => {
  try {
    const { id } = context.params;

    const shed = await getShedById(id);
    if (!shed) {
      return NextResponse.json(
        { error: 'Bodega no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ shed });
  } catch (error) {
    console.error('Error obteniendo bodega:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
});

/**
 * PUT /api/sheds/[id]
 * Actualizar una bodega (solo admin)
 */
export const PUT = withAuth(async (request: NextRequest, context: any, user: SafeUser) => {
  try {
    // Solo admin puede actualizar bodegas
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'No autorizado para actualizar bodegas' },
        { status: 403 }
      );
    }

    const { id } = context.params;
    const body = await request.json();

    // Validar datos de entrada
    const validationResult = updateShedSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const updatedShed = await updateShed(id, validationResult.data);

    return NextResponse.json({
      shed: updatedShed,
      message: 'Bodega actualizada exitosamente'
    });
  } catch (error: any) {
    console.error('Error actualizando bodega:', error);

    if (error.message?.includes('no encontrada')) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
});

/**
 * DELETE /api/sheds/[id]
 * Eliminar una bodega (solo admin)
 */
export const DELETE = withAuth(async (request: NextRequest, context: any, user: SafeUser) => {
  try {
    // Solo admin puede eliminar bodegas
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'No autorizado para eliminar bodegas' },
        { status: 403 }
      );
    }

    const { id } = context.params;

    await deleteShed(id);

    return NextResponse.json({
      message: 'Bodega eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando bodega:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
});