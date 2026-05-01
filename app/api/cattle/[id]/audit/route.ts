import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withRole } from '@/lib/withAuth';
import { CattleService } from '@/lib/cattleService';
import { SafeUser } from '@/lib/types';

// ============================================
// API ROUTE: /api/cattle/[id]/audit
// ============================================

// GET /api/cattle/[id]/audit - Obtiene el historial de auditoría (solo admin)
export const GET = withRole(['admin'])(async (request: NextRequest, context: any, user: SafeUser) => {
  try {
    const { id } = context.params;

    const auditHistory = await CattleService.getCattleAudit(id);

    return NextResponse.json(auditHistory);
  } catch (error) {
    console.error('Error fetching audit:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
});