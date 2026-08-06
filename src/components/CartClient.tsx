'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Trash2, MessageCircle, ArrowRight, ShoppingBag, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CartClientProps {
  whatsappNumber: string;
}

export default function CartClient({ whatsappNumber }: CartClientProps) {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount } = useCart();
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      setError('Por favor, ingresa tu nombre para continuar.');
      return;
    }
    setError('');

    // Formatear mensaje para WhatsApp
    let productLines = '';
    cart.forEach((item) => {
      productLines += `• ${item.titulo}\nCantidad: ${item.quantity}\nPrecio: S/${(item.precio * item.quantity).toFixed(2)}\n\n`;
    });

    const fullMessage = `Hola.\n\nDeseo cotizar los siguientes productos:\n\n${productLines}TOTAL:\nS/${cartTotal.toFixed(2)}\n\nMi nombre es: ${userName}\n\nMuchas gracias.`;
    
    const formattedMsg = encodeURIComponent(fullMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\+/g, '').trim()}?text=${formattedMsg}`;

    // Abrir WhatsApp en pestaña nueva
    window.open(whatsappUrl, '_blank');
  };

  if (cart.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-100 dark:border-neutral-900 rounded-3xl p-12 text-center space-y-6"
      >
        <div className="w-16 h-16 bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h3 className="font-extrabold text-xl text-neutral-900 dark:text-white">Tu carrito está vacío</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-light max-w-sm mx-auto">
            Aún no has agregado ningún instrumento o accesorio. Explora nuestro catálogo virtual para empezar.
          </p>
        </div>
        <div>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-50 dark:hover:bg-neutral-200 dark:text-neutral-950 text-white font-bold text-sm rounded-xl transition-all shadow-sm"
          >
            <span>Ver Catálogo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Lista de Productos (2/3 de pantalla) */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-neutral-100 dark:border-neutral-900">
          <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500">
            {cartCount} {cartCount === 1 ? 'producto' : 'productos'} en el carrito
          </span>
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Vaciar Carrito</span>
          </button>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="bg-white dark:bg-neutral-900 p-4 border border-neutral-100 dark:border-neutral-800 rounded-2xl flex gap-4 items-center"
              >
                {/* Imagen */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-neutral-50 dark:bg-neutral-950 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={item.imagen || 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&auto=format&fit=crop&q=80'}
                    alt={item.titulo}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-grow min-w-0">
                  <Link href={`/catalogo/${item.slug}`} className="font-bold text-neutral-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 text-sm sm:text-base transition-colors line-clamp-1">
                    {item.titulo}
                  </Link>
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                    S/{item.precio.toFixed(2)}
                  </p>
                </div>

                {/* Controles de Cantidad */}
                <div className="flex items-center gap-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-white dark:bg-neutral-950">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1.5 text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold text-neutral-900 dark:text-white w-6 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1.5 text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Eliminar */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-neutral-400 dark:text-neutral-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Eliminar producto"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Resumen y Envío por WhatsApp (1/3 de pantalla) */}
      <div className="bg-neutral-50 dark:bg-neutral-900/50 p-6 border border-neutral-100 dark:border-neutral-900 rounded-3xl space-y-6">
        <h3 className="font-extrabold text-lg text-neutral-900 dark:text-white border-b border-neutral-200/50 dark:border-neutral-800 pb-3">
          Resumen de Cotización
        </h3>

        {/* Cuentas */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
            <span>Productos ({cartCount})</span>
            <span>S/{cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
            <span>Envío / Comisión</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 uppercase text-[10px] tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded">Gratis</span>
          </div>
          <div className="border-t border-neutral-200/50 dark:border-neutral-800 pt-3 flex justify-between text-base font-extrabold text-neutral-900 dark:text-white">
            <span>Total estimado</span>
            <span>S/{cartTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Formulario de Checkout */}
        <form onSubmit={handleCheckout} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Tu Nombre Completo
            </label>
            <input
              id="name"
              type="text"
              required
              placeholder="Ej. Juan Pérez"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              className="w-full px-4 py-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 focus:border-emerald-600 dark:focus:border-emerald-500 outline-none rounded-xl text-sm transition-colors shadow-sm"
            />
            {error && <p className="text-[11px] font-medium text-red-500">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white dark:text-neutral-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-emerald-950/10 transition-all active:scale-98"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Finalizar pedido</span>
          </button>
        </form>

        <p className="text-[10px] text-neutral-400 dark:text-neutral-500 text-center leading-relaxed font-light">
          Al hacer clic, se abrirá WhatsApp con el pedido redactado para que lo envíes. No se realizará ningún cargo online.
        </p>
      </div>
    </div>
  );
}
