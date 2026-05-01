import { NextRequest, NextResponse } from 'next/server';
import { withRole } from '@/lib/withAuth';
import { ReportsService, ReportError } from '@/lib/reportsService';

async function handler(req: NextRequest) {
  try {
    const reportsService = new ReportsService();
    const data = await reportsService.generateFiscalInventory();

    const fileData = reportsService.generateFiscalInventoryPDF(data);
    const filename = `sig-bovino-inventario-fiscal-${new Date().toISOString().split('T')[0]}.pdf`;
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
    console.error('Error generando reporte fiscal:', error);
    const status = error instanceof ReportError ? error.status : 500;

    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status }
    );
  }
}

export const GET = withRole(['admin'])(handler);