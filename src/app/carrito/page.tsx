import React from 'react';
import prisma from '@/lib/prisma';
import CartClient from '@/components/CartClient';

async function getWhatsappNumber() {
  try {
    const config = await prisma.configuracion.findUnique({
      where: { id: 'default' },
      select: { whatsappNumber: true },
    });
    return config?.whatsappNumber || '51989947606';
  } catch {
    return '51989947606';
  }
}

export default async function CartPage() {
  const whatsappNumber = await getWhatsappNumber();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Tu <span className="text-emerald-600 dark:text-emerald-400">Carrito</span> de Compras
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2 font-light">
          Revisa tus productos seleccionados y finaliza tu cotización por WhatsApp.
        </p>
      </div>

      <CartClient whatsappNumber={whatsappNumber} />
    </div>
  );
}
