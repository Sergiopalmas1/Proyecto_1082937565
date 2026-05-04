'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { SafeUser } from '@/lib/types';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          router.push('/login');
          return;
        }

        const result = await response.json();
        if (!result.user) {
          router.push('/login');
          return;
        }

        setUser(result.user);
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'No se pudo cambiar la contraseña');
        setSaving(false);
        return;
      }

      setSuccess('Contraseña actualizada. Serás redirigido al dashboard.');
      setTimeout(() => router.push('/dashboard'), 1200);
    } catch {
      setError('Error en la red. Intenta luego.');
    } finally {
      setSaving(false);
    }
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
      <div className="max-w-xl mx-auto rounded-xl p-6" style={{ backgroundColor: '#FAF7F2' }}>
        <h1 className="text-3xl font-bold mb-4" style={{ color: '#1F3A0D' }}>
          Cambiar contraseña obligatoria
        </h1>
        <p className="mb-6 text-sm" style={{ color: '#6B5635' }}>
          Debes actualizar tu contraseña temporal antes de continuar al dashboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium mb-1" style={{ color: '#2C2416' }}>
              Contraseña temporal actual
            </label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg"
              style={{ borderColor: '#D4C7B0', color: '#2C2416' }}
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium mb-1" style={{ color: '#2C2416' }}>
              Nueva contraseña
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-2 border rounded-lg"
              style={{ borderColor: '#D4C7B0', color: '#2C2416' }}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1" style={{ color: '#2C2416' }}>
              Confirmar nueva contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-2 border rounded-lg"
              style={{ borderColor: '#D4C7B0', color: '#2C2416' }}
            />
          </div>

          {error && (
            <div className="rounded-lg p-3 bg-red-50 border border-red-200 text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg p-3 bg-green-50 border border-green-200 text-green-700">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-lg text-white font-medium"
            style={{ backgroundColor: '#2D5016' }}
          >
            {saving ? 'Guardando...' : 'Actualizar contraseña'}
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
