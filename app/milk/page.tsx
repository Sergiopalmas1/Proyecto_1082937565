'use client';

import { useState, useEffect, useCallback } from 'react';
import { MilkProductionWithCattle, ProductionAlertWithCattle } from '@/lib/types';

interface FemaleCattle {
  id: string;
  code: string;
  name?: string;
  shed_name?: string;
}

export default function MilkProductionPage() {
  const [females, setFemales] = useState<FemaleCattle[]>([]);
  const [productions, setProductions] = useState<MilkProductionWithCattle[]>([]);
  const [alerts, setAlerts] = useState<ProductionAlertWithCattle[]>([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedShift, setSelectedShift] = useState<'mañana' | 'tarde'>('mañana');
  const [selectedShed, setSelectedShed] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  // Cargar hembras activas
  const loadFemales = useCallback(async () => {
    try {
      const response = await fetch('/api/cattle?status=activo&sex=hembra');
      if (response.ok) {
        const data = await response.json();
        setFemales(data.cattle.map((c: any) => ({
          id: c.id,
          code: c.code,
          name: c.name,
          shed_name: c.shed?.name,
        })));
      }
    } catch (error) {
      console.error('Error cargando hembras:', error);
    }
  }, []);

  // Cargar producciones existentes
  const loadProductions = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        production_date: selectedDate,
        shift: selectedShift,
      });
      const response = await fetch(`/api/milk?${params}`);
      if (response.ok) {
        const data = await response.json();
        setProductions(data.productions);
      }
    } catch (error) {
      console.error('Error cargando producciones:', error);
    }
  }, [selectedDate, selectedShift]);

  // Cargar alertas (solo admin)
  const loadAlerts = useCallback(async () => {
    try {
      const response = await fetch('/api/production-alerts?resolved=false');
      if (response.ok) {
        const data = await response.json();
        setAlerts(data.alerts);
      }
    } catch (error) {
      // Silenciar error si no es admin
    }
  }, []);

  useEffect(() => {
    loadFemales();
    loadAlerts();
  }, [loadFemales, loadAlerts]);

  useEffect(() => {
    loadProductions();
  }, [loadProductions]);

  // Filtrar hembras por bodega
  const filteredFemales = selectedShed
    ? females.filter(f => f.shed_name === selectedShed)
    : females;

  // Obtener producción existente para un animal
  const getExistingProduction = (cattleId: string) => {
    return productions.find(p => p.cattle_id === cattleId);
  };

  // Registrar producción
  const registerProduction = async (cattleId: string, liters: number) => {
    if (liters < 0 || liters > 60) return;

    setSaving(prev => ({ ...prev, [cattleId]: true }));

    try {
      const response = await fetch('/api/milk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cattle_id: cattleId,
          production_date: selectedDate,
          shift: selectedShift,
          liters,
        }),
      });

      if (response.ok) {
        await loadProductions(); // Recargar producciones
        await loadAlerts(); // Recargar alertas por si se generó una
      } else {
        const error = await response.json();
        alert(error.error || 'Error registrando producción');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error registrando producción');
    } finally {
      setSaving(prev => ({ ...prev, [cattleId]: false }));
    }
  };

  // Resolver alerta
  const resolveAlert = async (alertId: string) => {
    try {
      const response = await fetch('/api/production-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alert_id: alertId }),
      });

      if (response.ok) {
        await loadAlerts();
      }
    } catch (error) {
      console.error('Error resolviendo alerta:', error);
    }
  };

  // Opciones de bodega únicas
  const shedOptions = Array.from(new Set(females.map(f => f.shed_name).filter(Boolean)));

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Registro de Producción Láctea
        </h1>

        {/* Controles */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Turno
              </label>
              <select
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.target.value as 'mañana' | 'tarde')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="mañana">Mañana</option>
                <option value="tarde">Tarde</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bodega
              </label>
              <select
                value={selectedShed}
                onChange={(e) => setSelectedShed(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas las bodegas</option>
                {shedOptions.map(shed => (
                  <option key={shed} value={shed}>{shed}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={loadProductions}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Cargando...' : 'Actualizar'}
              </button>
            </div>
          </div>
        </div>

        {/* Alertas */}
        {alerts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-medium text-red-800 mb-2">
              ⚠️ Alertas de Producción
            </h3>
            <div className="space-y-2">
              {alerts.map(alert => (
                <div key={alert.id} className="flex items-center justify-between bg-white p-3 rounded border">
                  <div>
                    <span className="font-medium">{alert.cattle.code}</span>
                    {alert.cattle.name && <span className="text-gray-600"> - {alert.cattle.name}</span>}
                    <span className="text-red-600 ml-2">
                      ↓ {alert.drop_percentage.toFixed(1)}% ({alert.current_liters}L vs {alert.average_liters.toFixed(1)}L promedio)
                    </span>
                  </div>
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Resolver
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lista de animales */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Hembras Activas ({filteredFemales.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredFemales.map(female => {
              const existing = getExistingProduction(female.id);
              const isSaving = saving[female.id];

              return (
                <div key={female.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                        {female.code}
                      </code>
                      {female.name && (
                        <span className="text-gray-900">{female.name}</span>
                      )}
                      {female.shed_name && (
                        <span className="text-sm text-gray-500">• {female.shed_name}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {existing ? (
                      <div className="text-green-600 font-medium">
                        ✓ {existing.liters}L registrado
                      </div>
                    ) : (
                      <>
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          max="60"
                          step="0.1"
                          placeholder="0.0"
                          disabled={isSaving}
                          onBlur={(e) => {
                            const liters = parseFloat(e.target.value);
                            if (!isNaN(liters) && liters > 0) {
                              registerProduction(female.id, liters);
                            }
                          }}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                        />
                        <span className="text-gray-500 text-sm">L</span>
                        {isSaving && (
                          <div className="text-blue-600 text-sm">Guardando...</div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredFemales.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500">
              No hay hembras activas en esta bodega
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
