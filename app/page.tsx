'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Verificar sesión y redirigir
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          // Usuario autenticado, ir al dashboard
          router.push('/dashboard');
        } else {
          // No autenticado, ir al login
          router.push('/login');
        }
      } catch {
        // Error, ir al login
        router.push('/login');
      }
    };

    checkSession();
  }, [router]);

  // Mostrar loader mientras se verifica
  return (
    <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5EFE0' }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700 mx-auto mb-4"></div>
        <p style={{ color: '#2D5016' }}>Cargando SIG Bovino...</p>
      </div>
    </main>
  );
}
