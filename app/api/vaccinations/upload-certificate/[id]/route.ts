/**
 * POST /api/vaccinations/upload-certificate/[id]
 * Sube certificado PDF para una vacunación
 * Solo para veterinario y admin
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withRole } from '@/lib/withAuth';
import { uploadVaccinationCertificate } from '@/lib/vaccinationService';
import { SafeUser } from '@/lib/types';

interface RouteParams {
  params: {
    id: string;
  };
}

export const POST = withAuth(withRole(['admin', 'veterinario'])(
  async (request: NextRequest, context: RouteParams, user: SafeUser) => {
    try {
      const vaccinationId = context.params.id;

      const formData = await request.formData();
      const certificateFile = formData.get('certificate') as File;

      if (!certificateFile) {
        return NextResponse.json(
          { success: false, error: 'Archivo de certificado requerido' },
          { status: 400 }
        );
      }

      // Validar tipo y tamaño
      if (certificateFile.type !== 'application/pdf') {
        return NextResponse.json(
          { success: false, error: 'Solo se permiten archivos PDF' },
          { status: 400 }
        );
      }

      if (certificateFile.size > 5 * 1024 * 1024) { // 5MB
        return NextResponse.json(
          { success: false, error: 'Archivo no puede superar 5MB' },
          { status: 400 }
        );
      }

      const certificatePath = await uploadVaccinationCertificate(
        vaccinationId,
        certificateFile,
        user.id
      );

      return NextResponse.json({
        success: true,
        certificate_path: certificatePath,
      });
    } catch (error) {
      console.error('Error subiendo certificado:', error);

      let statusCode = 500;
      if (error instanceof Error && error.message.includes('no encontrada')) {
        statusCode = 404;
      }

      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Error interno del servidor',
        },
        { status: statusCode }
      );
    }
  }
));