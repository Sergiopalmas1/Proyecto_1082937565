import { NextRequest, NextResponse } from 'next/server';
import { withRole } from '@/lib/withAuth';
import { ReportsService, ReportError } from '@/lib/reportsService';
import { z } from 'zod';

const productionComparisonSchema = z.object({
  period1Start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido'),
  period1End: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido'),
  period2Start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido'),
  period2End: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido'),
  format: z.enum(['pdf', 'excel']).default('pdf'),
});

async function handler(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = productionComparisonSchema.parse(body);

    const reportsService = new ReportsService();
    const data = await reportsService.generateProductionComparison(validatedData);

    let fileData: Uint8Array;
    let contentType: string;
    let filename: string;

    if (validatedData.format === 'excel') {
      fileData = reportsService.generateProductionComparisonExcel(data, validatedData);
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      filename = `sig-bovino-produccion-comparativo-${new Date().toISOString().split('T')[0]}.xlsx`;
    } else {
      fileData = reportsService.generateProductionComparisonPDF(data, validatedData);
      contentType = 'application/pdf';
      filename = `sig-bovino-produccion-comparativo-${new Date().toISOString().split('T')[0]}.pdf`;
    }

    const normalizedFileData = new Uint8Array(fileData);

    return new NextResponse(new Blob([normalizedFileData]), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error('Error generando reporte de producción:', error);

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

export const POST = withRole(['admin', 'veterinario', 'operario'])(handler);