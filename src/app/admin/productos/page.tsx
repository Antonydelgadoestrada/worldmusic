import React from 'react';
import prisma from '@/lib/prisma';
import ProductosClient from '@/components/ProductosClient';

export const dynamic = 'force-dynamic';

async function getProductsData() {
  try {
    const products = await prisma.producto.findMany({
      include: {
        categoria: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const categories = await prisma.categoria.findMany({
      orderBy: {
        nombre: 'asc',
      },
    });

    return { products, categories };
  } catch (e) {
    console.error('Error al leer productos de la base de datos:', e);
    return { products: [], categories: [] };
  }
}

export default async function AdminProductsPage() {
  const { products, categories } = await getProductsData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Gestión de Catálogo
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 font-light">
            Agrega nuevos instrumentos, modifica precios o importa datos masivamente desde Excel.
          </p>
        </div>
      </div>

      <ProductosClient initialProducts={products} categories={categories} />
    </div>
  );
}
