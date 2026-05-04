/**
 * POST /api/vaccinations/mass
 * Registra vacunaciones masivas
 * Solo para veterinario y admin
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withRole } from '@/lib/withAuth';
import { registerMassVaccination } from '@/lib/vaccinationService';
import { massVaccinationSchema } from '@/lib/validators';
import { SafeUser } from '@/lib/types';

export const POST = withAuth(withRole(['admin', 'veterinario'])(
  async (request: NextRequest, context: any, user: SafeUser) => {
    try {
      const body = await request.json();

      // Validar schema
      const validationResult = massVaccinationSchema.safeParse(body);
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

      const result = await registerMassVaccination(validationResult.data, user.id);

      return NextResponse.json({
        success: true,
        result,
      }, { status: 201 });
    } catch (error) {
      console.error('Error en vacunación masiva:', error);
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