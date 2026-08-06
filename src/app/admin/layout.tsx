'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logoutAdminAction } from './actions';
import {
  Music,
  LayoutDashboard,
  Package,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  const handleLogout = async () => {
    const res = await logoutAdminAction();
    if (res.success) {
      router.push('/admin/login');
      router.refresh();
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  const sidebarLinks = [
    { name: 'Resumen', href: '/admin', icon: LayoutDashboard },
    { name: 'Productos', href: '/admin/productos', icon: Package },
    { name: 'Configuración', href: '/admin/configuracion', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col md:flex-row transition-colors">
      
      {/* HEADER MOBILE */}
      <header className="md:hidden bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 px-4 py-4 flex items-center justify-between sticky top-0 z-40">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="p-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 rounded-lg">
            <Music className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-sm tracking-wider text-neutral-950 dark:text-white uppercase">
            World Music Admin
          </span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-neutral-600 dark:text-neutral-350"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* MENU MOBILE PANEL */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 px-4 py-4 space-y-3 z-30 relative">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-emerald-600 text-white'
                    : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleLogout();
            }}
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      )}

      {/* SIDEBAR (DESKTOP) */}
      <aside className="hidden md:flex md:w-64 bg-white dark:bg-neutral-900 border-r border-neutral-100 dark:border-neutral-800 flex-col justify-between p-6 shrink-0 h-screen sticky top-0">
        <div className="space-y-8">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-2">
            <div className="p-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 rounded-xl">
              <Music className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-base tracking-wider text-neutral-950 dark:text-white uppercase">
              World Music <span className="text-emerald-600">Admin</span>
            </span>
          </Link>

          {/* Enlaces */}
          <nav className="space-y-1.5">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-emerald-600 dark:bg-emerald-500 text-white'
                      : 'text-neutral-650 dark:text-neutral-350 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Acciones de Footer */}
        <div className="space-y-4">
          <Link
            href="/"
            className="block text-center text-xs font-semibold text-neutral-450 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Ir a la Web Pública
          </Link>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-grow p-6 sm:p-10 md:h-screen md:overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
