'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SafeUser } from '@/lib/types';
import { ToastProvider } from '@/components/ui';
import {
  AppLogo,
  AuditIcon,
  BarnIcon,
  DashboardIcon,
  MilkIcon,
  ReportIcon,
  ReproductionIcon,
  UserGroupIcon,
  CowIcon,
  SyringeIcon,
} from '@/components/ui/Icons';

interface AppLayoutProps {
  user: SafeUser;
  children: React.ReactNode;
}

type NavigationItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const navigationByRole: Record<string, NavigationItem[]> = {
  admin: [
    { label: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
    { label: 'Animales', href: '/cattle', icon: CowIcon },
    { label: 'Bodegas', href: '/sheds', icon: BarnIcon },
    { label: 'Producción', href: '/milk', icon: MilkIcon },
    { label: 'Vacunación', href: '/vaccinations', icon: SyringeIcon },
    { label: 'Reproducción', href: '/reproduction', icon: ReproductionIcon },
    { label: 'Reportes', href: '/reports', icon: ReportIcon },
    { label: 'Usuarios', href: '/admin/users', icon: UserGroupIcon },
    { label: 'Auditoría', href: '/admin/audit', icon: AuditIcon },
  ],
  veterinario: [
    { label: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
    { label: 'Animales', href: '/cattle', icon: CowIcon },
    { label: 'Vacunación', href: '/vaccinations', icon: SyringeIcon },
    { label: 'Reproducción', href: '/reproduction', icon: ReproductionIcon },
    { label: 'Reportes', href: '/reports', icon: ReportIcon },
  ],
  operario: [
    { label: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
    { label: 'Animales', href: '/cattle', icon: CowIcon },
    { label: 'Producción', href: '/milk', icon: MilkIcon },
    { label: 'Reportes', href: '/reports', icon: ReportIcon },
  ],
};

export function AppLayout({ user, children }: AppLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigation = user?.role ? navigationByRole[user.role] : [];

  if (!user || !user.role) {
    return <div>Error: Usuario no válido</div>;
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex md:w-64 flex-col border-r bg-white shadow-lg">
          <div className="p-6 border-b border-emerald-100 bg-emerald-50">
            <AppLogo className="text-emerald-900" />
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="px-4 py-3 rounded-2xl hover:bg-emerald-100 transition-colors duration-200 flex items-center gap-3 text-slate-700 hover:text-emerald-800">
                  <item.icon className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t space-y-3">
            <div className="px-4 py-3 bg-gray-50 rounded-lg">
              <p className="font-semibold text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500 mt-1 capitalize">{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg"
            >
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col pb-20 md:pb-0">
          {/* Header - Mobile */}
          <header className="md:hidden border-b bg-white/95 shadow-sm p-4 flex justify-between items-center">
            <AppLogo className="text-emerald-900" />
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-2xl text-slate-700 hover:text-emerald-700 transition-colors"
              aria-label="Abrir menú"
            >
              ☰
            </button>
          </header>

          {/* Mobile nav */}
          {sidebarOpen && (
            <nav className="md:hidden space-y-1 p-4 bg-white border-b">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div
                    className="px-4 py-3 rounded-lg hover:bg-emerald-50 transition-colors flex items-center gap-3 text-slate-700 hover:text-emerald-700"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5 text-emerald-600" />
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
          className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-white shadow-lg flex justify-around"
        >
          {navigation.slice(0, 5).map((item) => (
            <Link key={item.href} href={item.href} className="flex-1">
              <div className="flex flex-col items-center justify-center py-3 text-xs hover:bg-emerald-50 transition-colors text-slate-700 hover:text-emerald-700">
                <item.icon className="w-5 h-5 mb-1 text-emerald-600" />
                <span>{item.label}</span>
              </div>
          </Link>
        ))}
      </nav>
    </div>
  </ToastProvider>
  );
}
