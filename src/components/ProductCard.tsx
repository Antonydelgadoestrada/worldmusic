
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';

export interface ProductCardProps {
  id: string;
  titulo: string;
  descripcion: string | null;
  precio: number;
  imagen: string | null;
  slug: string;
  categoria?: { nombre: string } | null;
  incluye?: string | null;
  imagenes?: string[];
}

export default function ProductCard({
  id,
  titulo,
  descripcion,
  precio,
  imagen,
  slug,
  categoria,
  imagenes,
}: ProductCardProps) {
  const { addToCart } = useCart();

  const fallbackImage = 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&auto=format&fit=crop&q=80';

  // Combinar imagen principal e imágenes de galería de forma única
  const allImages = React.useMemo(() => {
    return Array.from(new Set([imagen, ...(imagenes || [])].filter((img): img is string => !!img)));
  }, [imagen, imagenes]);

  const [currentImageIdx, setCurrentImageIdx] = React.useState(0);

  // Ciclar la imagen de vista previa cada 3 segundos si hay múltiples fotos
  React.useEffect(() => {
    if (allImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % allImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [allImages]);

  const imageUrl = allImages[currentImageIdx] || fallbackImage;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id,
      titulo,
      precio,
      imagen: imageUrl,
      slug,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      className="group relative bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl overflow-hidden hover:shadow-lg dark:hover:shadow-neutral-950/30 transition-all duration-300 flex flex-col h-full"
    >
      {/* Contenedor de Imagen */}
      <Link href={`/catalogo/${slug}`} className="block relative aspect-square overflow-hidden bg-neutral-50 dark:bg-neutral-950">
        <Image
          src={imageUrl}
          alt={titulo}
          fill
          sizes="(max-w-7xl) 33vw, 50vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Indicadores de Galería (Puntos) */}
        {allImages.length > 1 && (
          <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 bg-black/40 dark:bg-black/60 backdrop-blur-[2px] px-2 py-1 rounded-full border border-white/10">
            {allImages.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${currentImageIdx === idx
                    ? 'bg-white scale-110'
                    : 'bg-white/40'
                  }`}
              />
            ))}
          </div>
        )}

        {/* Badge de Categoría */}
        {categoria && (
          <span className="absolute top-3 left-3 z-10 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm text-[10px] font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-widest px-2.5 py-1 rounded-full border border-neutral-100/50 dark:border-neutral-800/50">
            {categoria.nombre}
          </span>
        )}
      </Link>

      {/* Información del Producto */}
      <div className="p-5 flex flex-col flex-grow">
        <Link href={`/catalogo/${slug}`} className="block group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          <h3 className="font-bold text-neutral-900 dark:text-white text-base line-clamp-1 mb-1.5">
            {titulo}
          </h3>
        </Link>

        {descripcion && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-4 leading-relaxed">
            {descripcion}
          </p>
        )}

        {/* Precio */}
        <div className="mt-auto pt-3 border-t border-neutral-50 dark:border-neutral-800/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">Precio</span>
            <span className="font-extrabold text-lg text-neutral-900 dark:text-white">
              S/{precio.toFixed(2)}
            </span>
          </div>

          {/* Acciones */}
          <div className="flex gap-2">
            <Link
              href={`/catalogo/${slug}`}
              className="p-2 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-400 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg transition-colors"
              title="Ver Detalles"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Añadir</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
