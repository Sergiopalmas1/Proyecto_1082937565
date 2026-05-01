'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { useToast } from '@/components/ui';
import { apiFetch } from '@/lib/api';
import { SafeUser } from '@/lib/types';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'veterinario' | 'operario';
  is_active: boolean;
  must_change_password?: boolean;
  last_login_at?: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [saveError, setSaveError] = useState('');
  const { showToast } = useToast();
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'operario', is_active: true });
  const [newUserPassword, setNewUserPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter((item) => {
      if (roleFilter !== 'all' && item.role !== roleFilter) return false;
      if (statusFilter === 'active' && !item.is_active) return false;
      if (statusFilter === 'inactive' && item.is_active) return false;
      return true;
    });
  }, [users, roleFilter, statusFilter]);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          router.push('/login');
          return;
        }

        const data = await response.json();
        if (!data.user || data.user.role !== 'admin') {
          router.push('/dashboard');
          return;
        }

        setUser(data.user);
        await loadUsers();
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [router]);

  const loadUsers = async () => {
    try {
      const response = await apiFetch<{ users: AdminUser[] }>('/api/users');
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        setFetchError(response.error || 'No se pudieron cargar los usuarios');
        return;
      }
      setUsers(response.data?.users || []);
      setFetchError('');
    } catch {
      setFetchError('Error de conexión al cargar usuarios');
    }
  };

  const handleCreateUser = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaveError('');
    setSaving(true);

    try {
      const response = await apiFetch<{ user: AdminUser; temporary_password: string }>('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        setSaveError(response.error || 'No se pudo crear el usuario');
        return;
      }

      const data = response.data!;
      setUsers((prev) => [data.user, ...prev]);
      setNewUserPassword(data.temporary_password);
      setShowPasswordModal(true);
      setFormVisible(false);
      setNewUser({ name: '', email: '', role: 'operario', is_active: true });
      showToast('Usuario creado correctamente. Copia la contraseña temporal.', 'success');
    } catch {
      setSaveError('Error de red al crear usuario');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (userId: string, active: boolean) => {
    setSaving(true);
    try {
      const response = await apiFetch<{ user: AdminUser }>(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: active }),
      });

      if (!response.ok) {
        setFetchError(response.error || 'No se pudo actualizar el estado');
        return;
      }

      setUsers((prev) => prev.map((item) => (item.id === userId ? response.data!.user : item)));
      showToast('Estado actualizado correctamente', 'success');
    } catch {
      setFetchError('Error de red al actualizar estado');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.')) {
      return;
    }
    setSaving(true);
    try {
      const response = await apiFetch(`/api/users/${userId}`, { method: 'DELETE' });
      if (!response.ok) {
        setFetchError(response.error || 'No se pudo eliminar el usuario');
        return;
      }
      setUsers((prev) => prev.filter((item) => item.id !== userId));
      showToast('Usuario eliminado correctamente', 'success');
    } catch {
      setFetchError('Error de red al eliminar usuario');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5EFE0' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p style={{ color: '#2D5016' }}>Cargando administración...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout user={user}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#1F3A0D' }}>
              Administración de usuarios
            </h1>
            <p className="text-sm mt-2" style={{ color: '#6B5635' }}>
              Administra credenciales, estados y permisos de los usuarios de SIG Bovino.
            </p>
          </div>

          <button
            onClick={() => setFormVisible(!formVisible)}
            className="px-5 py-3 rounded-lg text-white font-medium"
            style={{ backgroundColor: '#2D5016' }}
          >
            {formVisible ? 'Cancelar' : 'Crear nuevo usuario'}
          </button>
        </div>

        {fetchError && (
          <div className="rounded-lg p-4 bg-red-50 border border-red-200 text-red-700">
            {fetchError}
          </div>
        )}


        {formVisible && (
          <section className="rounded-xl border p-6" style={{ backgroundColor: '#FFFFFF', borderColor: '#D4C7B0' }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#2D5016' }}>
              Nuevo usuario
            </h2>

            <form onSubmit={handleCreateUser} className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2C2416' }}>
                  Nombre completo
                </label>
                <input
                  value={newUser.name}
                  onChange={(event) => setNewUser((prev) => ({ ...prev, name: event.target.value }))}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: '#D4C7B0', color: '#2C2416' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2C2416' }}>
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(event) => setNewUser((prev) => ({ ...prev, email: event.target.value }))}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: '#D4C7B0', color: '#2C2416' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2C2416' }}>
                  Rol
                </label>
                <select
                  value={newUser.role}
                  onChange={(event) => setNewUser((prev) => ({ ...prev, role: event.target.value as 'admin' | 'veterinario' | 'operario' }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: '#D4C7B0', color: '#2C2416' }}
                >
                  <option value="admin">Administrador</option>
                  <option value="veterinario">Veterinario</option>
                  <option value="operario">Operario</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2C2416' }}>
                  Estado
                </label>
                <select
                  value={newUser.is_active ? 'active' : 'inactive'}
                  onChange={(event) => setNewUser((prev) => ({ ...prev, is_active: event.target.value === 'active' }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: '#D4C7B0', color: '#2C2416' }}
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Suspendido</option>
                </select>
              </div>

              {saveError && (
                <div className="md:col-span-2 rounded-lg p-3 bg-red-50 border border-red-200 text-red-700">
                  {saveError}
                </div>
              )}

              <div className="md:col-span-2 flex justify-end gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-lg text-white font-medium"
                  style={{ backgroundColor: '#2D5016' }}
                >
                  {saving ? 'Creando...' : 'Crear usuario'}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="rounded-xl border p-6" style={{ backgroundColor: '#FFFFFF', borderColor: '#D4C7B0' }}>
          <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <label className="text-sm font-medium" style={{ color: '#2C2416' }}>
                Filtrar por rol:
              </label>
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                className="px-4 py-2 border rounded-lg"
                style={{ borderColor: '#D4C7B0', color: '#2C2416' }}
              >
                <option value="all">Todos</option>
                <option value="admin">Administrador</option>
                <option value="veterinario">Veterinario</option>
                <option value="operario">Operario</option>
              </select>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <label className="text-sm font-medium" style={{ color: '#2C2416' }}>
                Estado:
              </label>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="px-4 py-2 border rounded-lg"
                style={{ borderColor: '#D4C7B0', color: '#2C2416' }}
              >
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="inactive">Suspendidos</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b px-4 py-3" style={{ color: '#2D5016' }}>Nombre</th>
                  <th className="border-b px-4 py-3" style={{ color: '#2D5016' }}>Email</th>
                  <th className="border-b px-4 py-3" style={{ color: '#2D5016' }}>Rol</th>
                  <th className="border-b px-4 py-3" style={{ color: '#2D5016' }}>Estado</th>
                  <th className="border-b px-4 py-3" style={{ color: '#2D5016' }}>Último acceso</th>
                  <th className="border-b px-4 py-3" style={{ color: '#2D5016' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
                      No hay usuarios que coincidan con los filtros.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="border-b px-4 py-3">
                        <div className="font-medium" style={{ color: '#2C2416' }}>{item.name}</div>
                        {item.must_change_password && (
                          <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">Cambio obligatorio</span>
                        )}
                      </td>
                      <td className="border-b px-4 py-3" style={{ color: '#2C2416' }}>{item.email}</td>
                      <td className="border-b px-4 py-3" style={{ color: '#2C2416' }}>{item.role}</td>
                      <td className="border-b px-4 py-3" style={{ color: '#2C2416' }}>
                        {item.is_active ? 'Activo' : 'Suspendido'}
                      </td>
                      <td className="border-b px-4 py-3 text-sm text-gray-600">
                        {item.last_login_at ? new Date(item.last_login_at).toLocaleString() : 'Nunca'}
                      </td>
                      <td className="border-b px-4 py-3 flex flex-wrap gap-2">
                        <button
                          onClick={() => handleToggleActive(item.id, !item.is_active)}
                          className="px-3 py-2 rounded-lg text-white text-xs font-medium"
                          style={{ backgroundColor: item.is_active ? '#B04F25' : '#2D5016' }}
                        >
                          {item.is_active ? 'Suspender' : 'Reactivar'}
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={item.id === user.id}
                          className="px-3 py-2 rounded-lg text-white text-xs font-medium"
                          style={{ backgroundColor: item.id === user.id ? '#A3A3A3' : '#9B1C1C' }}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1F3A0D' }}>
                Contraseña temporal creada
              </h2>
              <p className="mb-4 text-sm text-gray-700">
                Copia esta contraseña y entrégala al usuario. Solo se mostrará esta vez.
              </p>
              <div className="rounded-xl bg-gray-50 p-4 mb-4">
                <p className="font-mono break-all text-sm text-gray-900">{newUserPassword}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(newUserPassword);
                    showToast('Contraseña copiada al portapapeles.', 'success');
                  }}
                  className="px-5 py-3 rounded-lg text-white font-medium"
                  style={{ backgroundColor: '#2D5016' }}
                >
                  Copiar contraseña
                </button>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="px-5 py-3 rounded-lg border border-gray-300 text-gray-700"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
