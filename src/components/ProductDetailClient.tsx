'use client';

import React, { useState } from 'react';
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
  const imageUrl = product.imagen || fallbackImage;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      titulo: product.titulo,
      precio: product.precio,
      imagen: imageUrl,
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Imagen del Producto */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-sm"
        >
          <Image
            src={imageUrl}
            alt={product.titulo}
            fill
            sizes="(max-w-7xl) 50vw, 100vw"
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Detalles del Producto */}
        <div className="space-y-6 lg:py-4">
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
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
              En stock ({product.stock} unidades)
            </span>
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

            {/* Botón de Envío al Carrito */}
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
          </div>
        </div>
      </div>
    </div>
  );
}
