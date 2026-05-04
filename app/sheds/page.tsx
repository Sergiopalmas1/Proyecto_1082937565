'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, Button, Badge, Table, Thead, Tbody, Tr, Th, Td, EmptyState, Modal } from '@/components/ui';
import { SafeUser, ShedWithCount } from '@/lib/types';

interface ShedFormData {
  name: string;
  type: string;
  surface_m2: string;
  max_capacity: string;
}

export default function ShedsPage() {
  const router = useRouter();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sheds, setSheds] = useState<ShedWithCount[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState<ShedFormData>({
    name: '',
    type: 'pastizal',
    surface_m2: '',
    max_capacity: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchSheds();
    }
  }, [user]);

  const fetchSheds = async () => {
    try {
      const response = await fetch('/api/sheds');
      if (response.ok) {
        const data = await response.json();
        setSheds(data.sheds);
      }
    } catch (error) {
      console.error('Error cargando bodegas:', error);
    }
  };

  const handleCreateShed = async () => {
    setFormErrors({});
    setCreating(true);

    try {
      const submitData = {
        name: formData.name,
        type: formData.type,
        surface_m2: formData.surface_m2 ? parseFloat(formData.surface_m2) : undefined,
        max_capacity: parseInt(formData.max_capacity),
      };

      const response = await fetch('/api/sheds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        setSheds([...sheds, { ...data.shed, current_count: 0 }]);
        setShowCreateModal(false);
        setFormData({
          name: '',
          type: 'pastizal',
          surface_m2: '',
          max_capacity: '',
        });
      } else {
        if (data.details) {
          const errors: Record<string, string> = {};
          data.details.forEach((issue: any) => {
            errors[issue.path[0]] = issue.message;
          });
          setFormErrors(errors);
        } else {
          setFormErrors({ general: data.error });
        }
      }
    } catch (error) {
      setFormErrors({ general: 'Error creando bodega' });
    } finally {
      setCreating(false);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      pastizal: 'Pastizal',
      establo: 'Establo',
      corral: 'Corral',
      enfermería: 'Enfermería',
      parto: 'Parto',
      otro: 'Otro',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getCapacityStatus = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return { variant: 'danger' as const, text: 'Crítico' };
    if (percentage >= 75) return { variant: 'warning' as const, text: 'Alto' };
    return { variant: 'success' as const, text: 'Normal' };
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5EFE0' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p style={{ color: '#2D5016' }}>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout user={user}>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold" style={{ color: '#1F3A0D' }}>
            Gestión de Bodegas
          </h1>
          {user.role === 'admin' && (
            <Button onClick={() => setShowCreateModal(true)}>
              Nueva Bodega
            </Button>
          )}
        </div>

        {sheds.length === 0 ? (
          <Card>
            <EmptyState
              icon="🏠"
              title="No hay bodegas registradas"
              description="Crea tu primera bodega para organizar tus animales"
            />
          </Card>
        ) : (
          <Card>
            <Table>
              <Thead>
                <Tr>
                  <Th>Nombre</Th>
                  <Th>Tipo</Th>
                  <Th>Superficie</Th>
                  <Th>Capacidad</Th>
                  <Th>Estado</Th>
                  <Th>Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {sheds.map((shed) => (
                  <Tr key={shed.id}>
                    <Td>{shed.name}</Td>
                    <Td>{getTypeLabel(shed.type)}</Td>
                    <Td>{shed.surface_m2 ? `${shed.surface_m2} m²` : 'N/A'}</Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <span>{shed.current_count}/{shed.max_capacity}</span>
                        <Badge {...getCapacityStatus(shed.current_count, shed.max_capacity)}>
                          {getCapacityStatus(shed.current_count, shed.max_capacity).text}
                        </Badge>
                      </div>
                    </Td>
                    <Td>
                      {shed.is_active ? (
                        <Badge variant="success">Activa</Badge>
                      ) : (
                        <Badge variant="danger">Inactiva</Badge>
                      )}
                    </Td>
                    <Td>
                      {user.role === 'admin' ? (
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm">
                            Editar
                          </Button>
                          <Button variant="danger" size="sm">
                            Eliminar
                          </Button>
                        </div>
                      ) : (
                        <span className="text-gray-500">Solo lectura</span>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Card>
        )}

        {/* Modal para crear bodega */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Nueva Bodega"
        >
          <div className="space-y-4">
            {formErrors.general && (
              <div className="text-red-600 text-sm">{formErrors.general}</div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ej: Pastizal Norte"
              />
              {formErrors.name && <div className="text-red-600 text-sm mt-1">{formErrors.name}</div>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="pastizal">Pastizal</option>
                <option value="establo">Establo</option>
                <option value="corral">Corral</option>
                <option value="enfermería">Enfermería</option>
                <option value="parto">Parto</option>
                <option value="otro">Otro</option>
              </select>
              {formErrors.type && <div className="text-red-600 text-sm mt-1">{formErrors.type}</div>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Superficie (m²) - Opcional</label>
              <input
                type="number"
                value={formData.surface_m2}
                onChange={(e) => setFormData({ ...formData, surface_m2: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ej: 5000"
                min="0"
                step="0.01"
              />
              {formErrors.surface_m2 && <div className="text-red-600 text-sm mt-1">{formErrors.surface_m2}</div>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Capacidad Máxima</label>
              <input
                type="number"
                value={formData.max_capacity}
                onChange={(e) => setFormData({ ...formData, max_capacity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ej: 50"
                min="1"
              />
              {formErrors.max_capacity && <div className="text-red-600 text-sm mt-1">{formErrors.max_capacity}</div>}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => setShowCreateModal(false)}
                disabled={creating}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateShed}
                disabled={creating}
              >
                {creating ? 'Creando...' : 'Crear Bodega'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
