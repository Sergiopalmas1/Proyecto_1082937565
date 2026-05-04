'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SafeUser } from '@/lib/types';
import { ToastProvider } from '@/components/ui';

interface AppLayoutProps {
  user: SafeUser;
  children: React.ReactNode;
}

const navigationByRole = {
  admin: [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Animales', href: '/cattle', icon: '🐄' },
    { label: 'Bodegas', href: '/sheds', icon: '🏠' },
    { label: 'Producción', href: '/milk', icon: '🥛' },
    { label: 'Vacunación', href: '/vaccinations', icon: '💉' },
    { label: 'Reproducción', href: '/reproduction', icon: '🔄' },
    { label: 'Reportes', href: '/reports', icon: '📋' },
    { label: 'Usuarios', href: '/admin/users', icon: '👥' },
    { label: 'Auditoría', href: '/admin/audit', icon: '📝' },
  ],
  veterinario: [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Animales', href: '/cattle', icon: '🐄' },
    { label: 'Vacunación', href: '/vaccinations', icon: '💉' },
    { label: 'Reproducción', href: '/reproduction', icon: '🔄' },
    { label: 'Reportes', href: '/reports', icon: '📋' },
  ],
  operario: [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Animales', href: '/cattle', icon: '🐄' },
    { label: 'Producción', href: '/milk', icon: '🥛' },
    { label: 'Reportes', href: '/reports', icon: '📋' },
  ],
};

export function AppLayout({ user, children }: AppLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigation = navigationByRole[user.role];

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: '#F5EFE0' }}>
        {/* Sidebar - Desktop */}
        <aside
        className="hidden md:flex md:w-64 flex-col border-r p-6"
        style={{ backgroundColor: '#FAF7F2', borderColor: '#D4C7B0' }}
      >
        <h1 className="text-2xl font-bold mb-8" style={{ color: '#2D5016' }}>
          SIG Bovino
        </h1>
        <nav className="flex-1 space-y-2">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className="px-4 py-3 rounded-lg hover:bg-gray-100 transition flex items-center gap-3"
                style={{ color: '#2C2416' }}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>

        <div className="pt-4 border-t" style={{ borderColor: '#D4C7B0' }}>
          <div className="mb-4 text-sm" style={{ color: '#6B5635' }}>
            <p className="font-semibold">{user.name}</p>
            <p>{user.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 rounded-lg text-white text-sm font-medium transition"
            style={{ backgroundColor: '#2D5016' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1F3A0D';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2D5016';
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col pb-20 md:pb-0">
        {/* Header - Mobile */}
        <header className="md:hidden border-b p-4 flex justify-between items-center" style={{ backgroundColor: '#FAF7F2', borderColor: '#D4C7B0' }}>
          <h1 className="text-xl font-bold" style={{ color: '#2D5016' }}>
            SIG Bovino
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-2xl"
          >
            ☰
          </button>
        </header>

        {/* Mobile nav */}
        {sidebarOpen && (
          <nav className="md:hidden space-y-1 p-4" style={{ backgroundColor: '#FAF7F2' }}>
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className="px-4 py-3 rounded-lg hover:bg-gray-100 transition flex items-center gap-3"
                  style={{ color: '#2C2416' }}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            ))}
          </nav>
        )}

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>

      {/* Bottom nav - Mobile */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 border-t flex justify-around"
        style={{ backgroundColor: '#FAF7F2', borderColor: '#D4C7B0' }}
      >
        {navigation.slice(0, 5).map((item) => (
          <Link key={item.href} href={item.href} className="flex-1">
            <div className="flex flex-col items-center justify-center py-3 text-xs hover:bg-gray-100 transition">
              <span className="text-xl mb-1">{item.icon}</span>
              <span style={{ color: '#2C2416' }}>{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  </ToastProvider>
  );
}
