import React from 'react';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Package, FolderTree, ToggleLeft, ToggleRight, ArrowRight, ShieldCheck } from 'lucide-react';

async function getStats() {
  try {
    const totalProducts = await prisma.producto.count();
    const activeProducts = await prisma.producto.count({ where: { activo: true } });
    const inactiveProducts = totalProducts - activeProducts;
    const totalCategories = await prisma.categoria.count();

    return {
      totalProducts,
      activeProducts,
      inactiveProducts,
      totalCategories,
      dbConnected: true,
    };
  } catch (e) {
    return {
      totalProducts: 0,
      activeProducts: 0,
      inactiveProducts: 0,
      totalCategories: 0,
      dbConnected: false,
    };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      {/* Cabecera */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Panel de Resumen
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 font-light">
          Estado actual del catálogo y configuración de World Music.
        </p>
      </div>

      {/* Alerta de Base de Datos Desconectada */}
      {!stats.dbConnected && (
        <div className="p-5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl space-y-2">
          <h3 className="font-bold text-amber-800 dark:text-amber-400 text-sm">
            Conexión de Base de Datos no Configurada
          </h3>
          <p className="text-xs text-amber-700 dark:text-amber-500 font-light leading-relaxed">
            La aplicación no ha podido conectarse a Supabase PostgreSQL. Por favor, asegúrate de configurar las variables de entorno <code className="font-mono bg-amber-100 dark:bg-amber-950 px-1 py-0.5 rounded">DATABASE_URL</code> y <code className="font-mono bg-amber-100 dark:bg-amber-950 px-1 py-0.5 rounded">DIRECT_URL</code> en el archivo <code className="font-mono bg-amber-100 dark:bg-amber-950 px-1 py-0.5 rounded">.env</code> y aplicar las migraciones con <code className="font-mono bg-amber-100 dark:bg-amber-950 px-1 py-0.5 rounded">npm run db:setup</code>.
          </p>
        </div>
      )}

      {/* Tarjeta de Bienvenida */}
      <div className="bg-neutral-900 text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative z-10 max-w-xl space-y-4">
          <div className="p-2 bg-white/10 w-fit rounded-lg">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold">¡Hola, Administrador!</h2>
          <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
            Desde este panel puedes controlar el catálogo completo de instrumentos, importar productos desde archivos Excel, actualizar los números de WhatsApp para cotizaciones, cambiar las políticas de la tienda y gestionar la información de la academia.
          </p>
        </div>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Productos Totales */}
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase font-semibold tracking-wider block">Productos Totales</span>
            <span className="text-2xl font-black text-neutral-900 dark:text-white">{stats.totalProducts}</span>
          </div>
        </div>

        {/* Categorías */}
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <FolderTree className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase font-semibold tracking-wider block">Categorías</span>
            <span className="text-2xl font-black text-neutral-900 dark:text-white">{stats.totalCategories}</span>
          </div>
        </div>

        {/* Productos Activos */}
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <ToggleRight className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase font-semibold tracking-wider block">Activos</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.activeProducts}</span>
          </div>
        </div>

        {/* Productos Inactivos */}
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-500/10 text-red-650 dark:text-red-400 rounded-xl">
            <ToggleLeft className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase font-semibold tracking-wider block">Inactivos</span>
            <span className="text-2xl font-black text-neutral-900 dark:text-white">{stats.inactiveProducts}</span>
          </div>
        </div>
      </div>

      {/* Enlaces rápidos */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-850 dark:text-neutral-350">
          Accesos Rápidos
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/admin/productos"
            className="p-5 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 rounded-2xl flex items-center justify-between group transition-all shadow-sm"
          >
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Administrar Catálogo</h4>
              <p className="text-xs text-neutral-450 dark:text-neutral-500 font-light">Agrega, edita, elimina o importa productos desde Excel.</p>
            </div>
            <ArrowRight className="w-5 h-5 text-neutral-450 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/admin/configuracion"
            className="p-5 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 rounded-2xl flex items-center justify-between group transition-all shadow-sm"
          >
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Configurar Tienda</h4>
              <p className="text-xs text-neutral-450 dark:text-neutral-500 font-light">Actualiza datos de WhatsApp, redes sociales, academia y ubicación.</p>
            </div>
            <ArrowRight className="w-5 h-5 text-neutral-450 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>

    </div>
  );
}
