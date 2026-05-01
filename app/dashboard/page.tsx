'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, Button, EmptyState } from '@/components/ui';
import { SafeUser } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Obtener usuario actual
        const userResponse = await fetch('/api/auth/me');
        if (!userResponse.ok) {
          router.push('/login');
          return;
        }
        const userData = await userResponse.json();
        setUser(userData.user);

        // 2. Obtener datos del dashboard
        const dashResponse = await fetch('/api/dashboard');
        if (dashResponse.ok) {
          const dashData = await dashResponse.json();
          setDashboardData(dashData.data);
        }
      } catch (error) {
        console.error('Error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5EFE0' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p style={{ color: '#2D5016' }}>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout user={user}>
      <div className="space-y-8">
        {/* Título */}
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#1F3A0D' }}>
            Bienvenido, {user.name}
          </h1>
          <p style={{ color: '#6B5635' }}>
            Rol: <span className="font-semibold">{user.role === 'admin' ? 'Administrador' : user.role === 'veterinario' ? 'Veterinario' : 'Operario'}</span>
          </p>
        </div>

        {/* Dashboard por rol */}
        {user.role === 'admin' && <AdminDashboard data={dashboardData} />}
        {user.role === 'veterinario' && <VeterinarioDashboard data={dashboardData} />}
        {user.role === 'operario' && <OperarioDashboard data={dashboardData} />}
      </div>
    </AppLayout>
  );
}

function AdminDashboard({ data }: { data: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <div className="text-center">
          <p style={{ color: '#6B5635' }} className="text-sm mb-1">
            Total de animales
          </p>
          <p className="text-3xl font-bold" style={{ color: '#2D5016' }}>
            {data?.counts?.total_cattle || 0}
          </p>
        </div>
      </Card>

      <Card>
        <div className="text-center">
          <p style={{ color: '#6B5635' }} className="text-sm mb-1">
            Animales activos
          </p>
          <p className="text-3xl font-bold" style={{ color: '#2D5016' }}>
            {data?.counts?.active_cattle || 0}
          </p>
        </div>
      </Card>

      <Card>
        <div className="text-center">
          <p style={{ color: '#6B5635' }} className="text-sm mb-1">
            Bodegas
          </p>
          <p className="text-3xl font-bold" style={{ color: '#2D5016' }}>
            {data?.counts?.total_sheds || 0}
          </p>
        </div>
      </Card>

      <Card className="md:col-span-1">
        <div>
          <p style={{ color: '#2D5016' }} className="text-sm font-semibold mb-3">
            Alertas de vacunación
          </p>
          <p className="text-2xl font-bold" style={{ color: '#D97706' }}>
            {data?.alerts?.vaccination || 0}
          </p>
        </div>
      </Card>

      <Card className="md:col-span-1">
        <div>
          <p style={{ color: '#2D5016' }} className="text-sm font-semibold mb-3">
            Caídas de producción
          </p>
          <p className="text-2xl font-bold" style={{ color: '#B91C1C' }}>
            {data?.alerts?.production_drop || 0}
          </p>
        </div>
      </Card>

      <Card className="md:col-span-1">
        <div>
          <p style={{ color: '#2D5016' }} className="text-sm font-semibold mb-3">
            Eventos reproductivos
          </p>
          <p className="text-2xl font-bold" style={{ color: '#15803D' }}>
            {data?.alerts?.reproductive || 0}
          </p>
        </div>
      </Card>
    </div>
  );
}

function VeterinarioDashboard({ data }: { data: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <div>
          <p style={{ color: '#2D5016' }} className="text-sm font-semibold mb-3">
            Alertas de vacunación
          </p>
          <p className="text-3xl font-bold" style={{ color: '#D97706' }}>
            {data?.alerts?.vaccination || 0}
          </p>
        </div>
      </Card>

      <Card>
        <div>
          <p style={{ color: '#2D5016' }} className="text-sm font-semibold mb-3">
            Eventos reproductivos
          </p>
          <p className="text-3xl font-bold" style={{ color: '#15803D' }}>
            {data?.alerts?.reproductive || 0}
          </p>
        </div>
      </Card>

      <div className="md:col-span-2 p-4 rounded-lg bg-blue-50 border border-blue-200">
        <p style={{ color: '#1F3A0D' }} className="mb-2">
          ℹ️ Módulo de sanidad animal
        </p>
        <p style={{ color: '#6B5635' }} className="text-sm">
          En esta sección verá alertas de vacunación y eventos reproductivos del hato.
        </p>
      </div>
    </div>
  );
}

function OperarioDashboard({ data }: { data: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <div>
          <p style={{ color: '#2D5016' }} className="text-sm font-semibold mb-3">
            Registros de producción pendientes
          </p>
          <p className="text-3xl font-bold" style={{ color: '#2D5016' }}>
            {data?.pending?.milk_production || 0}
          </p>
        </div>
      </Card>

      <Card>
        <div>
          <p style={{ color: '#2D5016' }} className="text-sm font-semibold mb-3">
            Observaciones
          </p>
          <p className="text-3xl font-bold" style={{ color: '#2D5016' }}>
            {data?.pending?.observations || 0}
          </p>
        </div>
      </Card>

      <div className="md:col-span-2 p-4 rounded-lg bg-green-50 border border-green-200">
        <p style={{ color: '#1F3A0D' }} className="mb-2">
          ✓ Bienvenido al registro de producción
        </p>
        <p style={{ color: '#6B5635' }} className="text-sm">
          Desde el menú "Producción" puedes registrar los litros del ordeño de hoy.
        </p>
      </div>
    </div>
  );
}

