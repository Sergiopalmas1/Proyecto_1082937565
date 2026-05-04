import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import { CattleService } from '@/lib/cattleService';
import { updateCattleSchema, statusChangeSchema, UpdateCattleRequest, StatusChangeRequest } from '@/lib/validators';
import { SafeUser } from '@/lib/types';

// ============================================
// API ROUTE: /api/cattle/[id]
// ============================================

// GET /api/cattle/[id] - Obtiene un animal específico
export const GET = withAuth(async (request: NextRequest, context: any, user: SafeUser) => {
  try {
    const { id } = context.params;

    const cattle = await CattleService.getCattleById(id);

    if (!cattle) {
      return NextResponse.json(
        { error: 'Animal no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(cattle);
  } catch (error) {
    console.error('Error fetching cattle:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
});

// PUT /api/cattle/[id] - Actualiza un animal
export const PUT = withAuth(async (request: NextRequest, context: any, user: SafeUser) => {
  try {
    const { id } = context.params;

    // Solo admin puede actualizar animales
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'No autorizado. Solo administradores pueden actualizar animales.' },
        { status: 403 }
      );
    }

    const body: UpdateCattleRequest = await request.json();

    // Validar con Zod
    const validatedData = updateCattleSchema.parse(body);

    // Actualizar animal
    const cattle = await CattleService.updateCattle(id, validatedData, user.id);

    return NextResponse.json(cattle);
  } catch (error: any) {
    console.error('Error updating cattle:', error);

    // Manejar errores específicos
    if (error.message?.includes('encontrado')) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    if (error.message?.includes('código')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    if (error.message?.includes('madre') || error.message?.includes('padre') || error.message?.includes('ciclo')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (error.message?.includes('capacidad')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    if (error.message?.includes('dado de baja')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Error de validación Zod
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
});

// DELETE /api/cattle/[id] - Elimina un animal
export const DELETE = withAuth(async (request: NextRequest, context: any, user: SafeUser) => {
  try {
    const { id } = context.params;
    const user = context.user;

    // Solo admin puede eliminar animales
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'No autorizado. Solo administradores pueden eliminar animales.' },
        { status: 403 }
      );
    }

    await CattleService.deleteCattle(id, user.id);

    return NextResponse.json({ message: 'Animal eliminado exitosamente' });
  } catch (error: any) {
    console.error('Error deleting cattle:', error);

    if (error.message?.includes('encontrado')) {
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

// ============================================
// RUTAS ADICIONALES PARA FUNCIONALIDAD ESPECÍFICA
// ============================================

// PATCH /api/cattle/[id]/status - Cambia el estado de un animal
export async function PATCH(request: NextRequest, context: any) {
  return withAuth(async (request: NextRequest, context: any) => {
    try {
      const { id } = context.params;
      const user = context.user;

      // Solo admin puede cambiar estado
      if (user.role !== 'admin') {
        return NextResponse.json(
          { error: 'No autorizado. Solo administradores pueden cambiar el estado.' },
          { status: 403 }
        );
      }

      const body: StatusChangeRequest = await request.json();

      // Validar con Zod
      const validatedData = statusChangeSchema.parse(body);

      // Cambiar estado
      const cattle = await CattleService.changeCattleStatus(id, validatedData, user.id);

      return NextResponse.json(cattle);
    } catch (error: any) {
      console.error('Error changing cattle status:', error);

      if (error.message?.includes('encontrado')) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }

      // Error de validación Zod
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Datos inválidos', details: error.errors },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      );
    }
  })(request, context);
}