'use client';

import { useState, useEffect, useCallback } from 'react';
import { VaccineType, VaccinationWithCattle, VaccinationAlert } from '@/lib/types';

interface Cattle {
  id: string;
  code: string;
  name?: string;
  sex: 'macho' | 'hembra';
  status: string;
}

export default function VaccinationsPage() {
  const [vaccineTypes, setVaccineTypes] = useState<VaccineType[]>([]);
  const [cattle, setCattle] = useState<Cattle[]>([]);
  const [alerts, setAlerts] = useState<VaccinationAlert[]>([]);
  const [selectedCattle, setSelectedCattle] = useState<string[]>([]);
  const [selectedVaccineType, setSelectedVaccineType] = useState<string>('');
  const [appliedDate, setAppliedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [dose, setDose] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [massLoading, setMassLoading] = useState(false);

  // Cargar tipos de vacuna
  const loadVaccineTypes = useCallback(async () => {
    try {
      const response = await fetch('/api/vaccine-types');
      if (response.ok) {
        const data = await response.json();
        setVaccineTypes(data.vaccine_types);
      }
    } catch (error) {
      console.error('Error cargando tipos de vacuna:', error);
    }
  }, []);

  // Cargar animales activos
  const loadCattle = useCallback(async () => {
    try {
      const response = await fetch('/api/cattle?status=activo');
      if (response.ok) {
        const data = await response.json();
        setCattle(data.cattle);
      }
    } catch (error) {
      console.error('Error cargando animales:', error);
    }
  }, []);

  // Cargar alertas
  const loadAlerts = useCallback(async () => {
    try {
      const response = await fetch('/api/vaccinations/alerts');
      if (response.ok) {
        const data = await response.json();
        setAlerts(data.alerts);
      }
    } catch (error) {
      // Silenciar error si no es admin/veterinario
    }
  }, []);

  useEffect(() => {
    loadVaccineTypes();
    loadCattle();
    loadAlerts();
  }, [loadVaccineTypes, loadCattle, loadAlerts]);

  // Registrar vacunación individual
  const registerVaccination = async (cattleId: string) => {
    if (!selectedVaccineType) return;

    setLoading(true);
    try {
      const response = await fetch('/api/vaccinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cattle_id: cattleId,
          vaccine_type_id: selectedVaccineType,
          applied_date: appliedDate,
          dose: dose || undefined,
          notes: notes || undefined,
        }),
      });

      if (response.ok) {
        alert('Vacunación registrada exitosamente');
        await loadAlerts(); // Recargar alertas
        setSelectedCattle([]); // Limpiar selección
      } else {
        const error = await response.json();
        alert(error.error || 'Error registrando vacunación');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error registrando vacunación');
    } finally {
      setLoading(false);
    }
  };

  // Registrar vacunación masiva
  const registerMassVaccination = async () => {
    if (selectedCattle.length === 0 || !selectedVaccineType) return;

    setMassLoading(true);
    try {
      const response = await fetch('/api/vaccinations/mass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cattle_ids: selectedCattle,
          vaccine_type_id: selectedVaccineType,
          applied_date: appliedDate,
          dose: dose || undefined,
          notes: notes || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const result = data.result;

        let message = `Vacunación masiva completada:\n`;
        message += `Solicitados: ${result.total_requested}\n`;
        message += `Aplicados: ${result.total_applied}\n`;

        if (result.skipped.length > 0) {
          message += `\nOmitidos:\n`;
          result.skipped.forEach((skip: { cattle_code: string; reason: string }) => {
            message += `- ${skip.cattle_code}: ${skip.reason}\n`;
          });
        }

        alert(message);
        await loadAlerts(); // Recargar alertas
        setSelectedCattle([]); // Limpiar selección
      } else {
        const error = await response.json();
        alert(error.error || 'Error en vacunación masiva');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error en vacunación masiva');
    } finally {
      setMassLoading(false);
    }
  };

  // Toggle selección de animal
  const toggleCattleSelection = (cattleId: string) => {
    setSelectedCattle(prev =>
      prev.includes(cattleId)
        ? prev.filter(id => id !== cattleId)
        : [...prev, cattleId]
    );
  };

  // Filtrar animales según restricción de sexo de la vacuna
  const selectedVaccine = vaccineTypes.find(v => v.id === selectedVaccineType);
  const filteredCattle = selectedVaccine?.allowed_sex
    ? cattle.filter(c => c.sex === selectedVaccine.allowed_sex)
    : cattle;

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Gestión de Vacunaciones
        </h1>

        {/* Alertas */}
        {alerts.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">
              ⚠️ Próximas Vacunaciones
            </h3>
            <div className="space-y-2">
              {alerts.map(alert => (
                <div key={`${alert.cattle_id}-${alert.vaccine_type_name}`} className="flex items-center justify-between bg-white p-3 rounded border">
                  <div>
                    <span className="font-medium">{alert.cattle_code}</span>
                    {alert.cattle_name && <span className="text-gray-600"> - {alert.cattle_name}</span>}
                    <span className="text-yellow-600 ml-2">
                      {alert.vaccine_type_name} vence en {alert.days_until_due} días ({alert.next_dose_date})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formulario de vacunación */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Registrar Vacunación
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Vacuna *
              </label>
              <select
                value={selectedVaccineType}
                onChange={(e) => setSelectedVaccineType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar vacuna</option>
                {vaccineTypes.map(vaccine => (
                  <option key={vaccine.id} value={vaccine.id}>
                    {vaccine.name} {vaccine.is_mandatory && '(Obligatoria)'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Aplicación *
              </label>
              <input
                type="date"
                value={appliedDate}
                onChange={(e) => setAppliedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dosis
              </label>
              <input
                type="text"
                value={dose}
                onChange={(e) => setDose(e.target.value)}
                placeholder="Ej: 2ml"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observaciones"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {selectedVaccine && selectedVaccine.allowed_sex && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
              <p className="text-blue-800 text-sm">
                ℹ️ Esta vacuna solo puede aplicarse a {selectedVaccine.allowed_sex === 'hembra' ? 'hembras' : 'machos'}.
                Los animales de otro sexo han sido filtrados.
              </p>
            </div>
          )}

          {/* Lista de animales */}
          <div className="mb-4">
            <h3 className="text-md font-medium text-gray-900 mb-2">
              Seleccionar Animales ({selectedCattle.length} seleccionados)
            </h3>
            <div className="max-h-60 overflow-y-auto border border-gray-300 rounded p-2">
              {filteredCattle.length === 0 ? (
                <p className="text-gray-500 text-sm">No hay animales disponibles para esta vacuna</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {filteredCattle.map(animal => (
                    <label key={animal.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCattle.includes(animal.id)}
                        onChange={() => toggleCattleSelection(animal.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <code className="text-sm font-mono bg-gray-100 px-1 rounded">
                          {animal.code}
                        </code>
                        {animal.name && <span className="text-gray-600 ml-1">{animal.name}</span>}
                        <span className="text-xs text-gray-500 ml-1">({animal.sex})</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex space-x-4">
            <button
              onClick={() => selectedCattle.forEach(id => registerVaccination(id))}
              disabled={selectedCattle.length === 0 || !selectedVaccineType || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registrando...' : `Vacunar Individual (${selectedCattle.length})`}
            </button>

            <button
              onClick={registerMassVaccination}
              disabled={selectedCattle.length === 0 || !selectedVaccineType || massLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {massLoading ? 'Procesando...' : `Vacunar Masiva (${selectedCattle.length})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}