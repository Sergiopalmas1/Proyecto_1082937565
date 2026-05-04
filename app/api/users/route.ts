import { NextRequest, NextResponse } from 'next/server';
import { withRole } from '@/lib/withAuth';
import { createServerSupabaseClient } from '@/lib/supabase';
import { createUserSchema } from '@/lib/validators';
import { generateTemporaryPassword, hashPassword } from '@/lib/auth';

export const GET = withRole(['admin'])(async (request: NextRequest, context: any, user: any) => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, role, is_active, must_change_password, last_login_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[GET /api/users] Error fetching users:', error);
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 });
  }

  return NextResponse.json({ success: true, users: data }, { status: 200 });
});

export const POST = withRole(['admin'])(async (request: NextRequest, context: any, user: any) => {
  try {
    const body = await request.json();
    const result = createUserSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Datos inválidos', issues: result.error.issues }, { status: 400 });
    }

    const { name, email, role, is_active = true } = result.data;
    const temporaryPassword = generateTemporaryPassword(12);
    const password_hash = await hashPassword(temporaryPassword);

    const { data: newUser, error } = await createServerSupabaseClient()
      .from('users')
      .insert([
        {
          name,
          email: email.toLowerCase(),
          role,
          password_hash,
          is_active,
          must_change_password: true,
        },
      ])
      .select('id, name, email, role, is_active, must_change_password, last_login_at')
      .single();

    if (error) {
      console.error('[POST /api/users] Error creating user:', error);
      return NextResponse.json(
        {
          error:
            error.code === '23505' || error.details?.includes('already exists')
              ? 'Ya existe un usuario con este correo'
              : 'Error al crear el usuario',
        },
        { status: error.code === '23505' ? 409 : 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: newUser,
        temporary_password: temporaryPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/users] Unexpected error:', error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
});
