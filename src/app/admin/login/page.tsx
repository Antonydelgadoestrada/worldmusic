'use client';

import React, { useActionState, useEffect, useState } from 'react';
import { loginAdminAction } from '../actions';
import { Music, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/admin';

  const [showPassword, setShowPassword] = useState(false);
  
  // React 19 useActionState hook
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const res = await loginAdminAction(prevState, formData);
      if (res?.success) {
        router.push(nextPath);
        router.refresh();
      }
      return res;
    },
    null
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850 p-8 sm:p-10 rounded-3xl shadow-sm space-y-8">
        
        {/* Encabezado Logo */}
        <div className="text-center space-y-2">
          <div className="p-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 rounded-2xl w-fit mx-auto shadow-sm">
            <Music className="w-6 h-6" />
          </div>
          <h1 className="font-extrabold text-xl tracking-wider text-neutral-950 dark:text-white uppercase pt-2">
            World Music <span className="text-emerald-600 dark:text-emerald-400">Intranet</span>
          </h1>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 font-light">
            Inicia sesión con tus credenciales de administrador.
          </p>
        </div>

        {/* Formulario */}
        <form action={formAction} className="space-y-5">
          {state?.error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-semibold rounded-xl">
              {state.error}
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              defaultValue="admin@worldmusic.com"
              placeholder="admin@worldmusic.com"
              className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-350 dark:hover:border-neutral-700/80 focus:border-emerald-600 dark:focus:border-emerald-500 outline-none rounded-xl text-sm transition-colors"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5 relative">
            <label htmlFor="password" className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                defaultValue="Admin123456!"
                placeholder="••••••••"
                className="w-full pl-4 pr-12 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-350 dark:hover:border-neutral-700/80 focus:border-emerald-600 dark:focus:border-emerald-500 outline-none rounded-xl text-sm transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-450 hover:text-neutral-700 dark:hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Botón Ingresar */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white dark:text-neutral-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Validando...</span>
              </>
            ) : (
              <span>Ingresar al Panel</span>
            )}
          </button>
        </form>

        {/* Retorno */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-xs text-neutral-400 hover:text-neutral-800 dark:hover:text-white transition-colors font-medium"
          >
            Volver a la Tienda
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    }>
      <AdminLoginContent />
    </React.Suspense>
  );
}
