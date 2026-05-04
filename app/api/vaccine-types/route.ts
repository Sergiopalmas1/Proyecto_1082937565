/**
 * GET /api/vaccine-types
 * Obtiene todos los tipos de vacuna activos
 * Accesible para todos los roles autenticados
 */

import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import { getVaccineTypes } from '@/lib/vaccinationService';

export const GET = withAuth(async (request: Request) => {
  try {
    const vaccineTypes = await getVaccineTypes();

    return NextResponse.json({
      success: true,
      vaccine_types: vaccineTypes,
    });
  } catch (error) {
    console.error('Error obteniendo tipos de vacuna:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error interno del servidor',
      },
      { status: 500 }
    );
  }
});