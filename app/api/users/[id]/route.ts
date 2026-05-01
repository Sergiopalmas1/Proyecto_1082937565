import { NextRequest, NextResponse } from 'next/server';
import { withRole } from '@/lib/withAuth';
import { createServerSupabaseClient } from '@/lib/supabase';
import { updateUserSchema } from '@/lib/validators';

const extractId = (request: NextRequest) => {
  const url = new URL(request.url);
  const parts = url.pathname.split('/');
  return parts[parts.length - 1];
};

export const GET = withRole(['admin'])(async (request: NextRequest, context: any, user: any) => {
  const id = extractId(request);
  const { data, error } = await createServerSupabaseClient()
    .from('users')
    .select('id, name, email, role, is_active, must_change_password, last_login_at')
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  return NextResponse.json({ success: true, user: data }, { status: 200 });
});

export const PUT = withRole(['admin'])(async (request: NextRequest, context: any, currentUser: any) => {
  const id = extractId(request);
  const body = await request.json();
  const result = updateUserSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: 'Datos inválidos', issues: result.error.issues }, { status: 400 });
  }

  const updates = { ...result.data };
  if (updates.email) {
    updates.email = updates.email.toLowerCase();
  }

  const { data, error } = await createServerSupabaseClient()
    .from('users')
    .update(updates)
    .eq('id', id)
    .select('id, name, email, role, is_active, must_change_password, last_login_at')
    .single();

  if (error) {
    console.error('[PUT /api/users/:id] Error updating user:', error);
    if (error.code === '23505' || error.details?.includes('already exists')) {
      return NextResponse.json({ error: 'Ya existe un usuario con este correo' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Error al actualizar el usuario' }, { status: 500 });
  }

  return NextResponse.json({ success: true, user: data }, { status: 200 });
});

export const DELETE = withRole(['admin'])(async (request: NextRequest, context: any, currentUser: any) => {
  const id = extractId(request);

  if (id === currentUser.id) {
    return NextResponse.json(
      { error: 'No puedes eliminar tu propia cuenta' },
      { status: 400 }
    );
  }

  const { error } = await createServerSupabaseClient().from('users').delete().eq('id', id);

  if (error) {
    console.error('[DELETE /api/users/:id] Error deleting user:', error);
    return NextResponse.json({ error: 'Error al eliminar el usuario' }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Usuario eliminado correctamente' }, { status: 200 });
});
