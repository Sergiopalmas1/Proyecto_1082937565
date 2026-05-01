'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, Button, Badge, Table, Thead, Tbody, Tr, Th, Td, EmptyState, Modal, useToast } from '@/components/ui';
import { CattleWithDetails } from '@/lib/types';
import { CreateCattleRequest } from '@/lib/validators';
import { apiFetch } from '@/lib/api';

interface CattleListResponse {
  cattle: CattleWithDetails[];
  total: number;
}

const PAGE_SIZE = 50;

export default function CattlePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [cattle, setCattle] = useState<CattleWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const [formData, setFormData] = useState<CreateCattleRequest>({
    code: '',
    name: '',
    sex: 'hembra',
    birth_date: '',
    breed: '',
    color: '',
    weight_kg: undefined,
    shed_id: '',
    dam_id: '',
    sire_id: '',
    estimated_value: undefined,
    notes: '',
  });

  useEffect(() => {
    const q = searchParams.get('q') || '';
    const pageNumber = Number(searchParams.get('page') || '1');
    setSearchInput(q);
    setSearchQuery(q);
    setPage(pageNumber > 0 ? pageNumber : 1);
  }, [searchParams]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams();
      if (searchInput) params.set('q', searchInput);
      params.set('page', '1');
      router.replace(`/cattle?${params.toString()}`);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [router, searchInput]);

  useEffect(() => {
    const fetchCattle = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryString = new URLSearchParams();
        if (searchQuery) queryString.set('q', searchQuery);
        queryString.set('page', String(page));
        queryString.set('pageSize', String(PAGE_SIZE));

        const response = await apiFetch<CattleListResponse>(`/api/cattle?${queryString.toString()}`);

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          if (response.status === 403) {
            showToast(response.error || 'Acceso denegado', 'error');
            return;
          }
          throw new Error(response.error || 'Error cargando animales');
        }

        setCattle(response.data?.cattle || []);
        setTotalCount(response.data?.total || 0);
      } catch (err: any) {
        setError(err.message || 'Error al cargar animales');
      } finally {
        setLoading(false);
      }
    };

    fetchCattle();
  }, [page, searchQuery, router, showToast]);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleCreateCattle = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await apiFetch<CattleWithDetails>('/api/cattle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        showToast(response.error || 'Error al crear animal', 'error');
        return;
      }

      showToast('Animal registrado exitosamente', 'success');
      setShowCreateModal(false);
      setFormData({
        code: '',
        name: '',
        sex: 'hembra',
        birth_date: '',
        breed: '',
        color: '',
        weight_kg: undefined,
        shed_id: '',
        dam_id: '',
        sire_id: '',
        estimated_value: undefined,
        notes: '',
      });
      setPage(1);
      router.replace('/cattle?page=1');
    } catch (err: any) {
      showToast(err.message || 'Error al crear animal', 'error');
    }
  };

  const handleDeleteCattle = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar este animal?')) return;

    try {
      const response = await apiFetch(`/api/cattle/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        showToast(response.error || 'Error al eliminar animal', 'error');
        return;
      }

      showToast('Animal eliminado correctamente', 'success');
      router.replace(`/cattle?page=${page}`);
    } catch (err: any) {
      showToast(err.message || 'Error al eliminar animal', 'error');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'activo':
        return <Badge variant="success">Activo</Badge>;
      case 'baja':
        return <Badge variant="warning">Baja</Badge>;
      case 'vendido':
        return <Badge variant="info">Vendido</Badge>;
      case 'muerto':
        return <Badge variant="danger">Muerto</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const formatAge = (years: number, months: number) => {
    if (years > 0) {
      return `${years}a ${months}m`;
    }
    return `${months}m`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => router.refresh()}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Animales</h1>
          <p className="text-gray-600 mt-1">Administra el inventario bovino de tu finca.</p>
        </div>

        {user?.role === 'admin' && (
          <Button onClick={() => setShowCreateModal(true)}>Nuevo Animal</Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{totalCount}</div>
            <div className="text-sm text-gray-600">Total Animales</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {cattle.filter((c) => c.status === 'activo').length}
            </div>
            <div className="text-sm text-gray-600">Activos</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {cattle.filter((c) => c.sex === 'hembra' && c.status === 'activo').length}
            </div>
            <div className="text-sm text-gray-600">Hembras Activas</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {cattle.filter((c) => c.offspring_count && c.offspring_count > 0).length}
            </div>
            <div className="text-sm text-gray-600">Con Crías</div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">
            Buscar animales
          </label>
          <input
            id="search"
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Buscar por código, nombre o bodega"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>{totalCount} resultados</span>
          <span>|</span>
          <span>Página {page} de {totalPages}</span>
        </div>
      </div>

      {cattle.length === 0 ? (
        <EmptyState
          title="No hay animales que coincidan"
          description="Ajusta la búsqueda o crea un nuevo animal para comenzar a gestionar tu hato."
          action={
            user?.role === 'admin' ? (
              <Button onClick={() => setShowCreateModal(true)}>Registrar animal</Button>
            ) : null
          }
        />
      ) : (
        <Card>
          <Table>
            <Thead>
              <Tr>
                <Th>Código</Th>
                <Th>Nombre</Th>
                <Th>Sexo</Th>
                <Th>Edad</Th>
                <Th>Raza</Th>
                <Th>Bodega</Th>
                <Th>Estado</Th>
                <Th>Crías</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {cattle.map((animal) => (
                <Tr key={animal.id}>
                  <Td>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                      {animal.code}
                    </code>
                  </Td>
                  <Td>{animal.name || 'Sin nombre'}</Td>
                  <Td>
                    <Badge variant={animal.sex === 'hembra' ? 'success' : 'info'}>
                      {animal.sex}
                    </Badge>
                  </Td>
                  <Td>
                    {animal.age_years !== undefined && animal.age_months !== undefined
                      ? formatAge(animal.age_years, animal.age_months)
                      : 'N/A'}
                  </Td>
                  <Td>{animal.breed || 'N/A'}</Td>
                  <Td>{animal.shed?.name || 'Sin asignar'}</Td>
                  <Td>{getStatusBadge(animal.status)}</Td>
                  <Td>
                    {animal.offspring_count ? (
                      <Badge variant="default">{animal.offspring_count}</Badge>
                    ) : (
                      <span className="text-gray-400">0</span>
                    )}
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="secondary" size="sm">
                        Ver
                      </Button>
                      {user?.role === 'admin' && (
                        <>
                          <Button variant="secondary" size="sm">
                            Editar
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleDeleteCattle(animal.id)}>
                            Eliminar
                          </Button>
                        </>
                      )}
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Card>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-gray-600">
          Mostrando {cattle.length} de {totalCount} animales.
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            disabled={page <= 1}
            onClick={() => router.replace(`/cattle?q=${encodeURIComponent(searchQuery)}&page=${page - 1}`)}
          >
            Anterior
          </Button>
          <Button
            variant="secondary"
            disabled={page >= totalPages}
            onClick={() => router.replace(`/cattle?q=${encodeURIComponent(searchQuery)}&page=${page + 1}`)}
          >
            Siguiente
          </Button>
        </div>
      </div>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Registrar Nuevo Animal">
        <form onSubmit={handleCreateCattle} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ej: V001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Nombre del animal"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sexo *</label>
              <select
                required
                value={formData.sex}
                onChange={(e) => setFormData({ ...formData, sex: e.target.value as 'macho' | 'hembra' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="hembra">Hembra</option>
                <option value="macho">Macho</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento *</label>
              <input
                type="date"
                required
                value={formData.birth_date}
                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Raza</label>
              <input
                type="text"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ej: Holstein"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ej: Blanco y negro"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
              <input
                type="number"
                step="0.1"
                value={formData.weight_kg || ''}
                onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value ? parseFloat(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ej: 450.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor Estimado</label>
              <input
                type="number"
                step="0.01"
                value={formData.estimated_value || ''}
                onChange={(e) => setFormData({ ...formData, estimated_value: e.target.value ? parseFloat(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ej: 2500000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Observaciones adicionales..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancelar
            </Button>
            <Button type="submit">Registrar Animal</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
