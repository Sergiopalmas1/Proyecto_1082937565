'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, Button, EmptyState } from '@/components/ui';
import { SafeUser } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setError(null);
        // 1. Obtener usuario actual
        const userResponse = await fetch('/api/auth/me', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!userResponse.ok) {
          if (isMounted) {
            setUser(null);
            setLoading(false);
            // Redirigir después de un pequeño delay para evitar problemas de contexto
            setTimeout(() => {
              if (isMounted) router.push('/login');
            }, 100);
          }
          return;
        }

        const userData = await userResponse.json();
        if (isMounted) {
          setUser(userData.user);

          // 2. Obtener datos del dashboard
          try {
            const dashResponse = await fetch('/api/dashboard', {
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            if (dashResponse.ok) {
              const dashData = await dashResponse.json();
              if (isMounted) {
                setDashboardData(dashData.data);
              }
            }
          } catch (dashError) {
            console.error('Error cargando datos del dashboard:', dashError);
            if (isMounted) {
              setDashboardData(null);
            }
          } finally {
            if (isMounted) {
              setLoading(false);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching auth:', error);
        if (isMounted) {
          setError('Error al cargar el dashboard');
          setLoading(false);
          setTimeout(() => {
            if (isMounted) router.push('/login');
          }, 100);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
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

  if (!user || !user.role) {
    return (
      <EmptyState title="Error" description="No se pudo cargar la información del usuario. Intenta iniciar sesión nuevamente." />
    );
  }

  return (
    <AppLayout user={user}>
      <div className="space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-gray-200 pb-6"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            👋 Bienvenido, {user.name}
          </h1>
          <p className="text-gray-600">
            Rol: <span className="font-semibold text-gray-900">{user.role === 'admin' ? '👨‍💼 Administrador' : user.role === 'veterinario' ? '👨‍⚕️ Veterinario' : '👷 Operario'}</span>
          </p>
        </motion.div>

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
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <Card variant="elevated">
            <div className="text-center">
              <div className="text-4xl mb-2">🐄</div>
              <p className="text-gray-600 text-sm mb-1">Total de animales</p>
              <p className="text-4xl font-bold text-gray-900">{data?.counts?.total_cattle || 0}</p>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card variant="elevated">
            <div className="text-center">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-gray-600 text-sm mb-1">Animales activos</p>
              <p className="text-4xl font-bold text-green-600">{data?.counts?.active_cattle || 0}</p>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card variant="elevated">
            <div className="text-center">
              <div className="text-4xl mb-2">🏠</div>
              <p className="text-gray-600 text-sm mb-1">Bodegas</p>
              <p className="text-4xl font-bold text-blue-600">{data?.counts?.total_sheds || 0}</p>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="outlined" className="border-amber-200 bg-amber-50">
          <div>
            <p className="text-amber-900 text-sm font-semibold mb-2">💉 Alertas de vacunación</p>
            <p className="text-3xl font-bold text-amber-600">{data?.alerts?.vaccination || 0}</p>
          </div>
        </Card>

        <Card variant="outlined" className="border-red-200 bg-red-50">
          <div>
            <p className="text-red-900 text-sm font-semibold mb-2">📉 Caídas de producción</p>
            <p className="text-3xl font-bold text-red-600">{data?.alerts?.production_drop || 0}</p>
          </div>
        </Card>

        <Card variant="outlined" className="border-emerald-200 bg-emerald-50">
          <div>
            <p className="text-emerald-900 text-sm font-semibold mb-2">🔄 Eventos reproductivos</p>
            <p className="text-3xl font-bold text-emerald-600">{data?.alerts?.reproductive || 0}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function VeterinarioDashboard({ data }: { data: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card variant="elevated">
        <div>
          <p className="text-gray-600 text-sm mb-2">💉 Alertas de vacunación</p>
          <p className="text-4xl font-bold text-amber-600">{data?.alerts?.vaccination || 0}</p>
        </div>
      </Card>

      <Card variant="elevated">
        <div>
          <p className="text-gray-600 text-sm mb-2">🔄 Eventos reproductivos</p>
          <p className="text-4xl font-bold text-green-600">{data?.alerts?.reproductive || 0}
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
          <p className="text-gray-600 text-sm mb-2">📝 Observaciones</p>
          <p className="text-4xl font-bold text-blue-600">{data?.pending?.observations || 0}</p>
        </div>
      </Card>

      <div className="md:col-span-2 p-4 rounded-lg bg-green-50 border-2 border-green-200">
        <p className="text-green-900 font-semibold mb-2">✓ Bienvenido al registro de producción</p>
        <p className="text-green-700 text-sm">Desde el menú "Producción" puedes registrar los litros del ordeño de hoy.</p>
      </div>
    </div>
  );
}

