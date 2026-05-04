/**
 * POST /api/auth/logout
 * Cierra la sesión del usuario
 */

import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Eliminar cookie de sesión
    await clearSessionCookie();

    return NextResponse.json(
      {
        success: true,
        message: 'Sesión cerrada correctamente',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[POST /api/auth/logout]', error);
    return NextResponse.json(
      { error: 'Error al cerrar sesión' },
      { status: 500 }
    );
  }
}
