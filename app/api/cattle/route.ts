import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import { CattleService } from '@/lib/cattleService';
import { createCattleSchema, CreateCattleRequest } from '@/lib/validators';
import { SafeUser } from '@/lib/types';

// ============================================
// API ROUTE: /api/cattle
// ============================================

// GET /api/cattle - Lista todos los animales
export const GET = withAuth(async (request: NextRequest, context: any, user: SafeUser) => {
  try {
    const cattle = await CattleService.getCattle();
    return NextResponse.json(cattle);
  } catch (error) {
    console.error('Error fetching cattle:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
});

// POST /api/cattle - Crea un nuevo animal
export const POST = withAuth(async (request: NextRequest, context: any, user: SafeUser) => {
  try {
    // Solo admin puede crear animales
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'No autorizado. Solo administradores pueden crear animales.' },
        { status: 403 }
      );
    }

    const body: CreateCattleRequest = await request.json();

    // Validar con Zod
    const validatedData = createCattleSchema.parse(body);

    // Crear animal
    const cattle = await CattleService.createCattle(validatedData, user.id);

    return NextResponse.json(cattle, { status: 201 });
  } catch (error: any) {
    console.error('Error creating cattle:', error);

    // Manejar errores específicos
    if (error.message?.includes('código')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    if (error.message?.includes('madre') || error.message?.includes('padre')) {
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