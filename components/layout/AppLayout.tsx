'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { SafeUser } from '@/lib/types';
import { ToastProvider } from '@/components/ui';
import {
  AppLogo,
  ArrowLeftIcon,
  AuditIcon,
  BarnIcon,
  DashboardIcon,
  MilkIcon,
  MoonIcon,
  ReportIcon,
  ReproductionIcon,
  SunIcon,
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
  icon: React.ComponentType<{ className?: string }>;
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
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigation = user?.role ? navigationByRole[user.role] : [];
  const showDashboardButton = pathname !== '/dashboard';

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const initialDark =
      savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(initialDark);
    document.documentElement.classList.toggle('dark', initialDark);
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDarkMode;
    setIsDarkMode(nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme);
    localStorage.setItem('theme', nextTheme ? 'dark' : 'light');
  };

  if (!user || !user.role) {
    return <div>Error: Usuario no válido</div>;
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col md:flex-row bg-[var(--page-background)] transition-colors duration-300">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex md:w-64 flex-col border-r border-[var(--border)] bg-emerald-50 dark:bg-slate-900 shadow-lg transition-colors duration-300">
          <div className="p-6 border-b border-emerald-200 dark:border-slate-700 bg-emerald-100 dark:bg-slate-800">
            <AppLogo className="text-emerald-900 dark:text-emerald-300" />
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="px-4 py-3 rounded-2xl hover:bg-emerald-200 dark:hover:bg-slate-700 transition-colors duration-200 flex items-center gap-3 text-emerald-900 dark:text-emerald-100 hover:text-emerald-900 dark:hover:text-emerald-200">
                  <item.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-emerald-200 dark:border-slate-700 space-y-3 bg-emerald-100 dark:bg-slate-800">
            <div className="px-4 py-3 rounded-lg bg-emerald-200 dark:bg-slate-700">
              <p className="font-semibold text-emerald-900 dark:text-emerald-100">{user.name}</p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1 capitalize">{user.role}</p>
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
          <header className="md:hidden border-b border-emerald-200 dark:border-slate-700 bg-emerald-50 dark:bg-slate-900 shadow-sm p-4 flex justify-between items-center transition-colors duration-300">
            <AppLogo className="text-emerald-900 dark:text-emerald-300" />
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-2xl text-emerald-900 hover:text-emerald-700 dark:text-emerald-200 dark:hover:text-emerald-300 transition-colors"
              aria-label="Abrir menú"
            >
              ☰
            </button>
          </header>

          {/* Mobile nav */}
          {sidebarOpen && (
            <nav className="md:hidden space-y-1 p-4 bg-emerald-100 dark:bg-slate-800 border-b border-emerald-200 dark:border-slate-700 transition-colors duration-300">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div
                    className="px-4 py-3 rounded-lg hover:bg-emerald-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-3 text-emerald-900 dark:text-emerald-100 hover:text-emerald-900 dark:hover:text-emerald-200"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              ))}
            </nav>
          )}

          {/* Page content */}
          <main className="flex-1 p-4 md:p-8">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                {showDashboardButton && (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-800 dark:border-emerald-600 bg-emerald-800 dark:bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white dark:text-white shadow-sm transition hover:bg-emerald-900 dark:hover:bg-emerald-600"
                  >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Dashboard
                  </Link>
                )}
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-800 dark:border-emerald-600 bg-emerald-800 dark:bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white dark:text-white shadow-sm transition hover:bg-emerald-900 dark:hover:bg-emerald-600"
              >
                {isDarkMode ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
                {isDarkMode ? 'Modo claro' : 'Modo oscuro'}
              </button>
            </div>
            {children}
          </main>
        </div>

        {/* Bottom nav - Mobile */}
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 border-t border-emerald-200 dark:border-slate-700 bg-emerald-50 dark:bg-slate-900 shadow-lg flex justify-around transition-colors duration-300"
        >
          {navigation.slice(0, 5).map((item) => (
            <Link key={item.href} href={item.href} className="flex-1">
              <div className="flex flex-col items-center justify-center py-3 text-xs hover:bg-emerald-200 dark:hover:bg-slate-800 transition-colors text-emerald-900 dark:text-emerald-100 hover:text-emerald-900 dark:hover:text-emerald-200">
                <item.icon className="w-5 h-5 mb-1 text-emerald-600 dark:text-emerald-400" />
                <span>{item.label}</span>
              </div>
          </Link>
        ))}
      </nav>
    </div>
  </ToastProvider>
  );
}
