'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, ArrowLeft, CheckCircle2, MessageCircle, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';

interface ProductDetailProps {
  product: {
    id: string;
    titulo: string;
    descripcion: string | null;
    precio: number;
    imagen: string | null;
    imagenes?: string[];
    incluye: string | null;
    slug: string;
    stock: number;
    categoria?: { nombre: string } | null;
  };
  whatsappNumber: string;
}

export default function ProductDetailClient({ product, whatsappNumber }: ProductDetailProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const fallbackImage = 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&auto=format&fit=crop&q=80';
  const [activeImage, setActiveImage] = useState(product.imagen || fallbackImage);

  // Combinar imagen principal y las imágenes secundarias del array de la galería
  const allImages = [product.imagen, ...(product.imagenes || [])].filter(Boolean) as string[];

  // Carrusel automático cada 3 segundos (se reinicia si el usuario interactúa manualmente)
  useEffect(() => {
    if (allImages.length <= 1) return;

    const interval = setInterval(() => {
      setActiveImage((current) => {
        const currentIndex = allImages.indexOf(current);
        const nextIndex = (currentIndex + 1) % allImages.length;
        return allImages[nextIndex];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [activeImage, allImages]);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      titulo: product.titulo,
      precio: product.precio,
      imagen: product.imagen || fallbackImage,
      slug: product.slug,
    }, quantity);
    
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const getWhatsappInquiryUrl = () => {
    const formattedMsg = encodeURIComponent(
      `Hola. Deseo obtener más información sobre el producto "${product.titulo}" (S/${product.precio.toFixed(2)}) publicado en su catálogo web. ¿Tienen disponibilidad actual? Muchas gracias.`
    );
    return `https://wa.me/${whatsappNumber.replace(/\+/g, '').trim()}?text=${formattedMsg}`;
  };

  return (
    <div className="space-y-8 py-4">
      {/* Botón de Retorno */}
      <Link
        href="/catalogo"
        className="inline-flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al Catálogo</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Galería de Imágenes (Columna Izquierda - Más Angosta) */}
        <div className="lg:col-span-5 space-y-4">
          <motion.div
            key={activeImage} // Provoca re-animación al cambiar de foto
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-sm"
          >
            <Image
              src={activeImage}
              alt={product.titulo}
              fill
              sizes="(max-w-7xl) 40vw, 100vw"
              className="object-contain p-4"
              priority
            />
          </motion.div>

          {/* Miniaturas de la Galería */}
          {allImages.length > 1 && (
            <div className="flex flex-wrap gap-2.5 pt-1">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImage === img
                      ? 'border-emerald-600 dark:border-emerald-450 ring-2 ring-emerald-500/10 scale-95'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Miniatura ${idx + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detalles del Producto (Columna Derecha - Más Ancha) */}
        <div className="lg:col-span-7 space-y-6 lg:py-2">
          <div className="space-y-2">
            {product.categoria && (
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/15">
                {product.categoria.nombre}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white leading-tight">
              {product.titulo}
            </h1>
          </div>

          {/* Calificación y Disponibilidad (Estética) */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center text-amber-500 gap-0.5">
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-neutral-400 dark:text-neutral-500 ml-1.5">(Recomendado)</span>
            </div>
            <div className="h-3 w-px bg-neutral-200 dark:bg-neutral-800" />
            {product.stock > 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                Disponible
              </span>
            ) : (
              <span className="text-rose-600 dark:text-rose-450 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-450" />
                No disponible
              </span>
            )}
          </div>

          {/* Precio */}
          <div className="bg-neutral-50 dark:bg-neutral-900/50 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-900 flex justify-between items-center">
            <div>
              <span className="text-xs text-neutral-400 dark:text-neutral-500 block mb-0.5">Precio de Catálogo</span>
              <span className="text-3xl font-extrabold text-neutral-900 dark:text-white">
                S/{product.precio.toFixed(2)}
              </span>
            </div>
            <a
              href={getWhatsappInquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Consultar Stock</span>
            </a>
          </div>

          {/* Descripción */}
          {product.descripcion && (
            <div className="space-y-2">
              <h3 className="font-bold text-neutral-800 dark:text-neutral-200 text-sm uppercase tracking-wider">
                Descripción
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
                {product.descripcion}
              </p>
            </div>
          )}

          {/* Qué Incluye */}
          {product.incluye && (
            <div className="space-y-3 p-5 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-900 rounded-2xl">
              <h3 className="font-bold text-neutral-800 dark:text-neutral-200 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ¿Qué incluye esta compra?
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
                {product.incluye}
              </p>
            </div>
          )}

          {/* Agregar al Carrito e Interacciones */}
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-900 flex flex-col sm:flex-row gap-4 items-center">
            {/* Control de Cantidad */}
            {product.stock > 0 && (
              <div className="flex items-center border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-white dark:bg-neutral-950">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors font-bold"
                >
                  -
                </button>
                <span className="px-5 text-sm font-bold text-neutral-900 dark:text-white w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors font-bold"
                >
                  +
                </button>
              </div>
            )}

            {/* Botón de Envío al Carrito */}
            {product.stock > 0 ? (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className={`w-full sm:flex-grow py-3.5 px-6 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
                  added
                    ? 'bg-emerald-700 dark:bg-emerald-600 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-50 dark:hover:bg-neutral-200 dark:text-neutral-950 dark:hover:text-black text-white'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{added ? '¡Añadido al Carrito!' : 'Agregar al Carrito'}</span>
              </motion.button>
            ) : (
              <button
                disabled
                className="w-full py-3.5 px-6 font-bold rounded-xl text-sm flex items-center justify-center gap-2 bg-neutral-100 dark:bg-neutral-900 text-neutral-450 dark:text-neutral-500 cursor-not-allowed border border-neutral-205 dark:border-neutral-800"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>No disponible</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
