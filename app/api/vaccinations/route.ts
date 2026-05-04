/**
 * GET/POST /api/vaccinations
 * Lista y registra vacunaciones
 * Solo para veterinario y admin
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withRole } from '@/lib/withAuth';
import { getVaccinations, registerVaccination } from '@/lib/vaccinationService';
import { createVaccinationSchema } from '@/lib/validators';
import { SafeUser } from '@/lib/types';

export const GET = withAuth(withRole(['admin', 'veterinario'])(
  async (request: NextRequest, context: any, user: SafeUser) => {
    try {
      const { searchParams } = new URL(request.url);
      const cattleId = searchParams.get('cattle_id');

      if (!cattleId) {
        return NextResponse.json(
          { success: false, error: 'Parámetro cattle_id requerido' },
          { status: 400 }
        );
      }

      const vaccinations = await getVaccinations(cattleId);

      return NextResponse.json({
        success: true,
        vaccinations,
      });
    } catch (error) {
      console.error('Error obteniendo vacunaciones:', error);
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

export const POST = withAuth(withRole(['admin', 'veterinario'])(
  async (request: NextRequest, context: any, user: SafeUser) => {
    try {
      const body = await request.json();

      // Validar schema
      const validationResult = createVaccinationSchema.safeParse(body);
      if (!validationResult.success) {
        return NextResponse.json(
          {
            success: false,
            error: 'Datos inválidos',
            details: validationResult.error.issues,
          },
          { status: 400 }
        );
      }

      const vaccination = await registerVaccination(validationResult.data, user.id);

      return NextResponse.json({
        success: true,
        vaccination,
      }, { status: 201 });
    } catch (error) {
      console.error('Error registrando vacunación:', error);

      // Determinar código de error apropiado
      let statusCode = 500;
      if (error instanceof Error) {
        if (error.message.includes('Solo se puede vacunar') ||
            error.message.includes('Esta vacuna solo puede aplicarse')) {
          statusCode = 400;
        } else if (error.message.includes('no encontrado')) {
          statusCode = 404;
        }
      }

      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Error interno del servidor',
        },
        { status: statusCode }
      );
    }
  }
));