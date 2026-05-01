/**
 * GET /api/auth/me
 * Retorna el usuario autenticado actual
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import { SafeUser } from '@/lib/types';

export const GET = withAuth(async (request: NextRequest, context: any, user: SafeUser) => {
  return NextResponse.json(
    {
      success: true,
      user,
    },
    { status: 200 }
  );
});
