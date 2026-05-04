'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, Button, EmptyState } from '@/components/ui';
import { SafeUser } from '@/lib/types';

export default function ReportsPage() {
  const router = useRouter();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    production: {
      period1Start: '',
      period1End: '',
      period2Start: '',
      period2End: '',
      format: 'pdf' as 'pdf' | 'excel',
    },
    sanitary: {
      startDate: '',
      endDate: '',
    },
  });

  // Cargar usuario
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          router.push('/login');
        }
      } catch {
        router.push('/login');
      }
    };
    fetchUser();
  }, [router]);

  const handleProductionReport = async (format: 'pdf' | 'excel') => {
    setLoading(prev => ({ ...prev, [`production-${format}`]: true }));

    try {
      const data = { ...formData.production, format };

      const response = await fetch('/api/reports/production-comparison', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error generando reporte');
      }

      // Descargar el archivo
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sig-bovino-produccion-comparativo-${new Date().toISOString().split('T')[0]}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      alert('Reporte generado exitosamente');
    } catch (error: any) {
      alert(error.message || 'Error generando reporte');
    } finally {
      setLoading(prev => ({ ...prev, [`production-${format}`]: false }));
    }
  };

  const handleSanitaryReport = async () => {
    setLoading(prev => ({ ...prev, sanitary: true }));

    try {
      const response = await fetch('/api/reports/sanitary-ica', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData.sanitary),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error generando reporte');
      }

      // Descargar el archivo
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sig-bovino-sanitario-${formData.sanitary.startDate}-a-${formData.sanitary.endDate}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      alert('Reporte sanitario generado exitosamente');
    } catch (error: any) {
      alert(error.message || 'Error generando reporte');
    } finally {
      setLoading(prev => ({ ...prev, sanitary: false }));
    }
  };

  const handleFiscalReport = async () => {
    setLoading(prev => ({ ...prev, fiscal: true }));

    try {
      const response = await fetch('/api/reports/fiscal-inventory');

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error generando reporte');
      }

      // Descargar el archivo
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sig-bovino-inventario-fiscal-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      alert('Reporte fiscal generado exitosamente');
    } catch (error: any) {
      alert(error.message || 'Error generando reporte');
    } finally {
      setLoading(prev => ({ ...prev, fiscal: false }));
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout user={user}>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reportes y Exportación</h1>
          <p className="text-gray-600">Genera reportes oficiales en PDF y Excel para diferentes necesidades.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Reporte Comparativo de Producción */}
          <Card>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">📊 Comparativo de Producción</h2>
              <p className="text-sm text-gray-600">Compara producción de leche entre dos períodos</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Período 1</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={formData.production.period1Start}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      production: { ...prev.production, period1Start: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="date"
                    value={formData.production.period1End}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      production: { ...prev.production, period1End: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Período 2</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={formData.production.period2Start}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      production: { ...prev.production, period2Start: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="date"
                    value={formData.production.period2End}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      production: { ...prev.production, period2End: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleProductionReport('pdf')}
                  disabled={loading['production-pdf']}
                  className="flex-1"
                >
                  {loading['production-pdf'] ? 'Generando...' : '📄 PDF'}
                </Button>
                <Button
                  onClick={() => handleProductionReport('excel')}
                  disabled={loading['production-excel']}
                  variant="secondary"
                  className="flex-1"
                >
                  {loading['production-excel'] ? 'Generando...' : '📊 Excel'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Reporte Sanitario ICA */}
          {(user.role === 'admin' || user.role === 'veterinario') && (
            <Card>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">🏥 Sanitario para ICA</h2>
                <p className="text-sm text-gray-600">Historial de vacunaciones para entidad regulatoria</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={formData.sanitary.startDate}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        sanitary: { ...prev.sanitary, startDate: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input
                      type="date"
                      value={formData.sanitary.endDate}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        sanitary: { ...prev.sanitary, endDate: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSanitaryReport}
                  disabled={loading.sanitary}
                  className="w-full"
                >
                  {loading.sanitary ? 'Generando...' : '📄 Generar Reporte PDF'}
                </Button>
              </div>
            </Card>
          )}

          {/* Reporte Inventario Fiscal */}
          {user.role === 'admin' && (
            <Card>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">💰 Inventario Valorado</h2>
                <p className="text-sm text-gray-600">Inventario fiscal para declaración de renta</p>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Genera un reporte completo del inventario bovino con valores estimados
                  para efectos fiscales.
                </p>

                <Button
                  onClick={handleFiscalReport}
                  disabled={loading.fiscal}
                  className="w-full"
                >
                  {loading.fiscal ? 'Generando...' : '📄 Generar Reporte PDF'}
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Mensaje cuando no hay reportes disponibles */}
        {user.role === 'operario' && (
          <div className="mt-8">
            <EmptyState
              icon="📊"
              title="Reportes disponibles"
              description="Como operario, tienes acceso al reporte comparativo de producción. Los reportes sanitario y fiscal están disponibles solo para veterinarios y administradores."
            />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
