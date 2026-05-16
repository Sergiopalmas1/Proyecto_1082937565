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
        <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">
          Bitácora de Cambios
        </h1>

        <div 
          className="border border-slate-200 dark:border-slate-700 rounded-xl p-6"
          style={{
            backgroundColor: 'white',
            color: 'black'
          }}
        >
          <style>{`
            html.dark [data-audit-card] {
              background-color: #0f172a !important;
              color: white !important;
            }
          `}</style>
          <div data-audit-card className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="mb-4 text-5xl">📝</div>
            <h2 className="text-2xl font-semibold mb-3 text-inherit">Auditoría del sistema</h2>
            <p className="text-sm text-inherit max-w-xl">
              Auditoría activa para registrar cambios en animales, bodegas y procesos del sistema.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
