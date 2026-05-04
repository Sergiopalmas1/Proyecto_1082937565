import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withRole } from '@/lib/withAuth';
import { ReproductionService } from '@/lib/reproductionService';
import { CreateReproductiveEventRequest } from '@/lib/types';

export const GET = withAuth(withRole(['admin', 'veterinario'])(
  async (request: NextRequest, context: any, user) => {
    try {
      const url = new URL(request.url);
      const cattleId = url.searchParams.get('cattle_id');
      const stateFilter = url.searchParams.get('state') || undefined;

      if (cattleId) {
        const timeline = await ReproductionService.getReproductiveTimeline(cattleId);
        return NextResponse.json({ timeline });
      }

      const items = await ReproductionService.getReproductiveStatus(stateFilter);
      return NextResponse.json({ items });
    } catch (error: any) {
      console.error('Error en /api/reproduction GET:', error);
      return NextResponse.json(
        { error: error.message || 'Error interno del servidor' },
        { status: 500 }
      );
    }
  }
));

export const POST = withAuth(withRole(['admin', 'veterinario'])(
  async (request: NextRequest, context: any, user) => {
    try {
      const body = (await request.json()) as CreateReproductiveEventRequest;
      const event = await ReproductionService.registerReproductiveEvent(body, user.id);
      return NextResponse.json(event, { status: 201 });
    } catch (error: any) {
      console.error('Error en /api/reproduction POST:', error);

      if (error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Datos inválidos', details: error.errors },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: error.message || 'Error interno del servidor' },
        { status: 400 }
      );
    }
  }
));
