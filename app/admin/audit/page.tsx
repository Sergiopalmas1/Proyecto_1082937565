'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, EmptyState } from '@/components/ui';
import { SafeUser } from '@/lib/types';

export default function AuditPage() {
  const router = useRouter();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);

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
        <h1 className="text-3xl font-bold mb-6" style={{ color: '#1F3A0D' }}>
          Bitácora de Cambios
        </h1>

        <Card>
          <EmptyState
            icon="📝"
            title="Auditoría del sistema"
            description="Esta funcionalidad se implementará en la Fase 4 — Registro y Gestión de Animales"
          />
        </Card>
      </div>
    </AppLayout>
  );
}
