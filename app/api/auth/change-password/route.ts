/**
 * POST /api/auth/change-password
 * Permite al usuario autenticado cambiar su contraseña
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import { changePasswordSchema } from '@/lib/validators';
import { createServerSupabaseClient } from '@/lib/supabase';
import { verifyPassword, hashPassword } from '@/lib/auth';
import { SafeUser } from '@/lib/types';

export const POST = withAuth(async (request: NextRequest, context: any, user: SafeUser) => {
  try {
    // 1. Validar body
    const body = await request.json();
    const result = changePasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', issues: result.error.issues },
        { status: 400 }
      );
    }

    const { current_password, new_password } = result.data;

    // 2. Obtener usuario actual desde BD
    const supabase = createServerSupabaseClient();
    const { data: userData, error: queryError } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', user.id)
      .single();

    if (queryError || !userData) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // 3. Verificar que la contraseña actual es correcta
    const currentPasswordValid = await verifyPassword(
      current_password,
      userData.password_hash
    );

    if (!currentPasswordValid) {
      return NextResponse.json(
        { error: 'Contraseña actual incorrecta' },
        { status: 401 }
      );
    }

    // 4. Hashear nueva contraseña
    const newPasswordHash = await hashPassword(new_password);

    // 5. Actualizar contraseña en la BD y resetear must_change_password
    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: newPasswordHash, must_change_password: false })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error al actualizar contraseña:', updateError);
      return NextResponse.json(
        { error: 'Error al cambiar la contraseña' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Contraseña actualizada correctamente',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[POST /api/auth/change-password]', error);
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
});
