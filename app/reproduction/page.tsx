'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, Button, Badge, EmptyState, Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui';
import { ReproductiveEvent, ReproductiveEventType, ReproductiveStatusItem, SafeUser } from '@/lib/types';

const EVENT_ICONS: Record<ReproductiveEventType, string> = {
  celo: '🌸',
  'preñez': '🤰',
  parto: '🐄',
  lactancia: '🍼',
  'vacía': '🌾',
};

const EVENT_LABELS: Record<ReproductiveEventType, string> = {
  celo: 'Celo',
  'preñez': 'Preñez',
  parto: 'Parto',
  lactancia: 'Lactancia',
  'vacía': 'Vacía',
};

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'vacía', label: 'Vacía' },
  { value: 'celo', label: 'Celo' },
  { value: 'preñez', label: 'Preñez' },
  { value: 'parto', label: 'Parto' },
  { value: 'lactancia', label: 'Lactancia' },
];

export default function ReproductionPage() {
  const router = useRouter();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [animals, setAnimals] = useState<ReproductiveStatusItem[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<ReproductiveStatusItem | null>(null);
  const [timeline, setTimeline] = useState<ReproductiveEvent[]>([]);
  const [filterState, setFilterState] = useState('all');
  const [eventType, setEventType] = useState<ReproductiveEventType>('celo');
  const [eventDate, setEventDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [expectedBirth, setExpectedBirth] = useState('');
  const [customExpectedBirth, setCustomExpectedBirth] = useState(false);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const loadAnimals = useCallback(async () => {
    try {
      setLoading(true);
      const params = filterState !== 'all' ? `?state=${filterState}` : '';
      const response = await fetch(`/api/reproduction${params}`);
      if (!response.ok) throw new Error('No se pudo cargar la lista reproductive');
      const data = await response.json();
      setAnimals(data.items || []);
      if (!selectedAnimal && data.items?.length > 0) {
        setSelectedAnimal(data.items[0]);
      }
    } catch (error) {
      console.error('Error cargando reproducción:', error);
    } finally {
      setLoading(false);
    }
  }, [filterState, selectedAnimal]);

  const loadTimeline = useCallback(async (cattleId: string) => {
    if (!cattleId) return;
    try {
      const response = await fetch(`/api/reproduction?cattle_id=${cattleId}`);
      if (!response.ok) throw new Error('No se pudo cargar el historial reproductivo');
      const data = await response.json();
      setTimeline(data.timeline || []);
    } catch (error) {
      console.error('Error cargando timeline:', error);
      setTimeline([]);
    }
  }, []);

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

  useEffect(() => {
    loadAnimals();
  }, [loadAnimals]);

  useEffect(() => {
    if (selectedAnimal) {
      loadTimeline(selectedAnimal.cattle_id);
    }
  }, [selectedAnimal, loadTimeline]);

  useEffect(() => {
    if (eventType !== 'preñez') {
      setExpectedBirth('');
      setCustomExpectedBirth(false);
      return;
    }

    if (customExpectedBirth) return;

    const date = new Date(eventDate);
    date.setDate(date.getDate() + 283);
    setExpectedBirth(date.toISOString().split('T')[0]);
  }, [eventType, eventDate, customExpectedBirth]);

  const warningMessage = useMemo(() => {
    if (!selectedAnimal) return '';
    if (eventType === 'parto' && selectedAnimal.last_event_type !== 'preñez') {
      return 'Advertencia: el último evento no es preñez. Registra el parto solo si hay justificación clínica.';
    }
    if (eventType === 'lactancia' && selectedAnimal.last_event_type !== 'parto') {
      return 'Advertencia: no se encontró un parto reciente en el historial. Registra lactancia solo si corresponde.';
    }
    return '';
  }, [eventType, selectedAnimal]);

  const handleSelectAnimal = (animal: ReproductiveStatusItem) => {
    setSelectedAnimal(animal);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedAnimal) return;
    setSaving(true);

    try {
      const response = await fetch('/api/reproduction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cattle_id: selectedAnimal.cattle_id,
          event_type: eventType,
          event_date: eventDate,
          expected_birth: eventType === 'preñez' ? expectedBirth : undefined,
          notes: notes || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error registrando evento reproductivo');
      }

      await loadAnimals();
      await loadTimeline(selectedAnimal.cattle_id);
      setNotes('');
      alert('Evento reproductivo registrado exitosamente');
    } catch (error: any) {
      alert(error.message || 'Error registrando evento reproductivo');
    } finally {
      setSaving(false);
    }
  };

  const selectedAnimalIndex = animals.findIndex(item => item.cattle_id === selectedAnimal?.cattle_id);

  return (
    <AppLayout user={user as SafeUser}>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Estado Reproductivo</h1>
          <p className="text-gray-600">Consulta el estado actual de cada hembra activa y registra eventos reproductivos con trazabilidad completa.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <Card>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Hembras activas</h2>
                  <p className="text-sm text-gray-600">Filtra por estado actual deducido del último evento.</p>
                </div>

                <select
                  value={filterState}
                  onChange={(e) => setFilterState(e.target.value)}
                  className="w-full md:w-44 px-3 py-2 border border-gray-300 rounded-md bg-white"
                >
                  {STATUS_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {loading ? (
                <div className="py-12 text-center text-gray-500">Cargando hembras reproductivas...</div>
              ) : animals.length === 0 ? (
                <EmptyState
                  title="No hay hembras activas"
                  description="Asegúrate de tener hembras activas registradas para trabajar el estado reproductivo."
                />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>Código</Th>
                        <Th>Nombre</Th>
                        <Th>Estado actual</Th>
                        <Th>Último evento</Th>
                        <Th>Parto esperado</Th>
                        <Th>Acción</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {animals.map((animal) => (
                      <Tr key={animal.cattle_id}>
                          <Td>{animal.cattle_code}</Td>
                          <Td>{animal.cattle_name || 'Sin nombre'}</Td>
                          <Td>
                            <Badge variant={animal.current_state === 'vacía' ? 'default' : 'success'}>
                              {EVENT_ICONS[animal.current_state]} {EVENT_LABELS[animal.current_state]}
                            </Badge>
                          </Td>
                          <Td>{animal.last_event_date || 'Sin historial'}</Td>
                          <Td>{animal.expected_birth || '-'}</Td>
                          <Td>
                            <Button size="sm" onClick={() => handleSelectAnimal(animal)}>
                              Seleccionar
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </div>
              )}
            </Card>

            {selectedAnimal && (
              <Card>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Ficha reproductiva</h2>
                    <p className="text-sm text-gray-600 mb-4">Estado actual deducido: <span className="font-semibold">{EVENT_LABELS[selectedAnimal.current_state]}</span></p>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p><span className="font-semibold">Código:</span> {selectedAnimal.cattle_code}</p>
                      <p><span className="font-semibold">Nombre:</span> {selectedAnimal.cattle_name || 'Sin nombre'}</p>
                      <p><span className="font-semibold">Último evento:</span> {selectedAnimal.last_event_type ? EVENT_LABELS[selectedAnimal.last_event_type] : 'Sin datos'}</p>
                      <p><span className="font-semibold">Fecha evento:</span> {selectedAnimal.last_event_date || 'N/A'}</p>
                      <p><span className="font-semibold">Parto esperado:</span> {selectedAnimal.expected_birth || 'N/A'}</p>
                      {selectedAnimal.last_notes && <p><span className="font-semibold">Notas:</span> {selectedAnimal.last_notes}</p>}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Registrar nuevo evento</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de evento</label>
                        <select
                          value={eventType}
                          onChange={(e) => setEventType(e.target.value as ReproductiveEventType)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          {Object.entries(EVENT_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha del evento</label>
                        <input
                          type="date"
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      {eventType === 'preñez' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha estimada de parto</label>
                          <input
                            type="date"
                            value={expectedBirth}
                            onChange={(e) => {
                              setExpectedBirth(e.target.value);
                              setCustomExpectedBirth(true);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="Observaciones clínicas o detalles adicionales"
                        />
                      </div>

                      {warningMessage && (
                        <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800">
                          {warningMessage}
                        </div>
                      )}

                      <Button type="submit" disabled={saving}>
                        {saving ? 'Registrando...' : 'Registrar evento'}
                      </Button>
                    </form>
                  </div>
                </div>
              </Card>
            )}
          </div>

          <aside className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline reproductivo</h2>
              {selectedAnimal ? (
                timeline.length === 0 ? (
                  <p className="text-sm text-gray-600">Selecciona una hembra para ver su historial.</p>
                ) : (
                  <div className="space-y-3">
                    {timeline.map(event => (
                      <div key={event.id} className="border border-gray-200 rounded-lg p-3 bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-base font-semibold text-gray-900">
                            {EVENT_ICONS[event.event_type]} {EVENT_LABELS[event.event_type]}
                          </div>
                          <span className="text-xs text-gray-500">{event.event_date}</span>
                        </div>
                        {event.expected_birth && (
                          <p className="text-sm text-gray-600">Parto estimado: {event.expected_birth}</p>
                        )}
                        {event.notes && <p className="text-sm text-gray-700 mt-2">{event.notes}</p>}
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <EmptyState
                  title="Selecciona una hembra"
                  description="Elige una hembra activa para ver su línea de eventos reproductivos."
                />
              )}
            </Card>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}
