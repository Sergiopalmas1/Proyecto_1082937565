/**
 * POST /api/auth/login
 * Endpoint de login
 */

import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validators';
import { createServerSupabaseClient } from '@/lib/supabase';
import { verifyPassword, createJWT, setSessionCookie } from '@/lib/auth';
import { SafeUser } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // 1. Validar body con Zod
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos', issues: result.error.issues },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // 2. Buscar usuario por email
    const supabase = createServerSupabaseClient();
    const { data: user, error: queryError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    // Error genérico para no revelar si el email existe
    if (queryError || !user) {
      return NextResponse.json(
        { error: 'Email o contraseña incorrectos' },
        { status: 401 }
      );
    }

    // 3. Verificar contraseña
    const passwordValid = await verifyPassword(password, user.password_hash);
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Email o contraseña incorrectos' },
        { status: 401 }
      );
    }

    // 4. Verificar que el usuario está activo
    if (!user.is_active) {
      return NextResponse.json(
        { error: 'Tu usuario ha sido suspendido' },
        { status: 403 }
      );
    }

    // 5. Crear JWT
    const token = await createJWT(user.id, user.email, user.role);

    // 6. Establecer cookie de sesión
    await setSessionCookie(token);

    // 7. Actualizar last_login_at
    await supabase
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id);

    // 8. Retornar usuario sin password
    const safeUser: SafeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
      must_change_password: user.must_change_password,
      last_login_at: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: `Bienvenido ${user.name}`,
        user: safeUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[POST /api/auth/login]', error);
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}
