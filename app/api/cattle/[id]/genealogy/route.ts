import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import { CattleService } from '@/lib/cattleService';
import { SafeUser } from '@/lib/types';

// ============================================
// API ROUTE: /api/cattle/[id]/genealogy
// ============================================

// GET /api/cattle/[id]/genealogy - Obtiene el árbol genealógico
export const GET = withAuth(async (request: NextRequest, context: any, user: SafeUser) => {
  try {
    const { id } = context.params;

    const genealogyTree = await CattleService.getGenealogyTree(id);

    if (!genealogyTree) {
      return NextResponse.json(
        { error: 'Animal no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(genealogyTree);
  } catch (error) {
    console.error('Error fetching genealogy:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
});