import { NextRequest, NextResponse } from 'next/server';
import { withRole } from '@/lib/withAuth';
import { ReportsService, ReportError } from '@/lib/reportsService';
import { z } from 'zod';

const sanitaryReportSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido'),
});

async function handler(req: NextRequest) {
  try {
    const body = await req.json();
    const { startDate, endDate } = sanitaryReportSchema.parse(body);

    const reportsService = new ReportsService();
    const data = await reportsService.generateSanitaryReport(startDate, endDate);

    const fileData = reportsService.generateSanitaryReportPDF(data, startDate, endDate);
    const filename = `sig-bovino-sanitario-${startDate}-a-${endDate}.pdf`;
    const normalizedFileData = new Uint8Array(fileData);

    return new NextResponse(new Blob([normalizedFileData]), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error('Error generando reporte sanitario:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }

    const status = error instanceof ReportError ? error.status : 500;
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status }
    );
  }
}

export const POST = withRole(['admin', 'veterinario'])(handler);