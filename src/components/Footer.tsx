'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Youtube, Phone, MapPin, Clock, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-100 dark:border-neutral-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Columna 1: Logo e Historia corta */}
          <div className="space-y-4">
            <span className="font-extrabold text-xl tracking-wider text-neutral-900 dark:text-white uppercase">
              World <span className="text-emerald-600 dark:text-emerald-400">Music</span>
            </span>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Todo lo que necesitas para hacer música, en un solo lugar. Ofrecemos instrumentos de alta calidad y educación musical premium para todos los niveles.
            </p>
            {/* Redes Sociales */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://facebook.com/worldmusicpe"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:shadow-sm rounded-full transition-all border border-neutral-100 dark:border-neutral-800"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/worldmusicpe"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:shadow-sm rounded-full transition-all border border-neutral-100 dark:border-neutral-800"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/worldmusicpe"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:shadow-sm rounded-full transition-all border border-neutral-100 dark:border-neutral-800"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com/@worldmusicpe"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:shadow-sm rounded-full transition-all border border-neutral-100 dark:border-neutral-800"
                aria-label="TikTok"
              >
                {/* Icono TikTok simple en SVG */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.63 4.15 1.13 1.2 2.69 1.94 4.31 2.07v3.86a9.07 9.07 0 0 1-5.08-1.57c-.02 2.76-.01 5.51-.02 8.27-.07 1.98-.78 3.96-2.18 5.37-1.74 1.83-4.32 2.71-6.84 2.37-2.67-.32-5.11-2.18-5.99-4.73-1.07-2.92-.37-6.47 1.76-8.7 1.63-1.79 4.14-2.67 6.54-2.31v3.91c-1.3-.34-2.76-.08-3.79.79-1.07 1.01-1.39 2.7-.75 4.04.59 1.34 2.07 2.18 3.51 2.01 1.48-.11 2.73-1.29 2.92-2.76.08-1.63.03-3.27.05-4.91V0z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              Nuestra Tienda
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/catalogo" className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Ver Catálogo
                </Link>
              </li>
              <li>
                <Link href="/academia" className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Academia de Música
                </Link>
              </li>
              <li>
                <Link href="/#nosotros" className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/#ubicacion" className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Ubicación y Mapas
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Políticas */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              Políticas de Compra
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#politicas" className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Garantías
                </Link>
              </li>
              <li>
                <Link href="/#politicas" className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Cambios y Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/#politicas" className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              Contacto y Horarios
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-neutral-500 dark:text-neutral-400">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <span>Av. Larco 123, Miraflores, Lima</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-neutral-500 dark:text-neutral-400">
                <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>+51 989 947 606</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-neutral-500 dark:text-neutral-400">
                <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>info@worldmusic.com</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-neutral-500 dark:text-neutral-400">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-neutral-700 dark:text-neutral-300">Lun - Sáb: 9 AM - 8 PM</p>
                  <p>Dom: 10 AM - 5 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Derechos de Autor */}
        <div className="border-t border-neutral-100 dark:border-neutral-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            &copy; {currentYear} World Music S.A.C. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-xs text-neutral-400 dark:text-neutral-500">
            <Link href="/admin" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Intranet Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
