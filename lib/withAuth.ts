/**
 * Middleware withAuth para proteger rutas API
 * Valida JWT y devuelve el usuario autenticado
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromCookie, verifyJWT, clearSessionCookie } from './auth';
import { SafeUser } from './types';
import { createServerSupabaseClient } from './supabase';

/**
 * Proteger ruta API con autenticación obligatoria
 * Valida el JWT y devuelve al usuario desde la base de datos
 */
export function withAuth(
  handler: (request: NextRequest, context: any, user: SafeUser) => Promise<Response>
) {
  return async (request: NextRequest, context: any): Promise<Response> => {
  try {
    // 1. Obtener token de la cookie
    const token = await getTokenFromCookie();
    if (!token) {
      return NextResponse.json(
        { error: 'Sin autenticación. Inicia sesión.' },
        { status: 401 }
      );
    }

    // 2. Verificar y decodificar JWT
    const payload = await verifyJWT(token);
    if (!payload) {
      // Token expirado o inválido
      await clearSessionCookie();
      return NextResponse.json(
        { error: 'Sesión expirada. Inicia sesión nuevamente.' },
        { status: 401 }
      );
    }

    // 3. Obtener usuario desde la base de datos
    const supabase = createServerSupabaseClient();
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, name, email, role, is_active, must_change_password')
      .eq('id', payload.userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // 4. Verificar que el usuario está activo
    if (!userData.is_active) {
      await clearSessionCookie();
      return NextResponse.json(
        { error: 'Usuario suspendido' },
        { status: 403 }
      );
    }

    // 5. Pasar usuario autenticado al handler
    const safeUser: SafeUser = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      is_active: userData.is_active,
    };

    return handler(request, context, safeUser);
  } catch (error) {
    console.error('[withAuth] Error:', error);
    return NextResponse.json(
      { error: 'Error en autenticación' },
      { status: 500 }
    );
  }
  };
}

/**
 * Proteger ruta API con autenticación y control de roles
 * Valida el JWT, obtiene el usuario y verifica permisos de rol
 */
export function withRole(allowedRoles: string[]) {
  return function(handler: (request: NextRequest, context: any, user: SafeUser) => Promise<Response>) {
    return withAuth(async (request: NextRequest, context: any, user: SafeUser) => {
      // Verificar rol del usuario
      if (!allowedRoles.includes(user.role)) {
        return NextResponse.json(
          { error: 'Acceso denegado. Rol insuficiente.' },
          { status: 403 }
        );
      }

      return handler(request, context, user);
    });
  };
}
