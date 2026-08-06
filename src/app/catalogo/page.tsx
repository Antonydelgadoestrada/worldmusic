import React from 'react';
import prisma from '@/lib/prisma';
import CatalogClient from '@/components/CatalogClient';

// Fallbacks de datos en caso de que la base de datos no esté conectada
const FALLBACK_CATEGORIES = [
  { id: '1', nombre: 'Guitarras', slug: 'guitarras' },
  { id: '2', nombre: 'Bajos', slug: 'bajos' },
  { id: '3', nombre: 'Ukeleles', slug: 'ukeleles' },
  { id: '4', nombre: 'Teclados', slug: 'teclados' },
  { id: '5', nombre: 'Baterías', slug: 'baterias' },
  { id: '6', nombre: 'Violines', slug: 'violines' },
  { id: '7', nombre: 'Afinadores', slug: 'afinadores' },
];

const FALLBACK_PRODUCTS = [
  {
    id: 'p1',
    titulo: 'Guitarra Acústica Yamaha F310',
    descripcion: 'La guitarra acústica clásica ideal para principiantes y músicos intermedios.',
    precio: 650.0,
    categoriaId: '1',
    categoria: { nombre: 'Guitarras' },
    imagen: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&auto=format&fit=crop&q=80',
    incluye: 'Guitarra Yamaha F310, funda de lona acolchada, púa y llaves.',
    slug: 'guitarra-acustica-yamaha-f310',
    activo: true,
    stock: 15,
  },
  {
    id: 'p2',
    titulo: 'Ukelele Concierto de Caoba',
    descripcion: 'Ukelele tamaño concierto construido con madera de caoba seleccionada.',
    precio: 180.0,
    categoriaId: '3',
    categoria: { nombre: 'Ukeleles' },
    imagen: 'https://images.unsplash.com/photo-1508186227413-bb1f58a117af?w=500&auto=format&fit=crop&q=80',
    incluye: 'Ukelele Concierto, funda de transporte, afinador digital y juego de repuesto.',
    slug: 'ukelele-concierto-de-caoba',
    activo: true,
    stock: 25,
  },
  {
    id: 'p3',
    titulo: 'Bajo Eléctrico Fender Squier Affinity Jazz Bass',
    descripcion: 'Un excelente punto de entrada en la familia Fender. Sonido clásico con comodidad moderna.',
    precio: 1250.0,
    categoriaId: '2',
    categoria: { nombre: 'Bajos' },
    imagen: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=500&auto=format&fit=crop&q=80',
    incluye: 'Bajo Squier Jazz Bass, cable de audio plug-plug.',
    slug: 'bajo-electrico-fender-squier-affinity-jazz-bass',
    activo: true,
    stock: 8,
  },
  {
    id: 'p4',
    titulo: 'Teclado Sensitivo Roland GO:KEYS 61',
    descripcion: 'Teclado de 61 teclas sensitivas con más de 500 sonidos profesionales.',
    precio: 1580.0,
    categoriaId: '4',
    categoria: { nombre: 'Teclados' },
    imagen: 'https://images.unsplash.com/photo-1552422535-c45813c61732?w=500&auto=format&fit=crop&q=80',
    incluye: 'Teclado Roland GO:KEYS, adaptador de corriente, atril para partituras.',
    slug: 'teclado-sensitivo-roland-go-keys-61',
    activo: true,
    stock: 6,
  },
];

async function getCatalogData() {
  try {
    const categories = await prisma.categoria.findMany({
      orderBy: { nombre: 'asc' },
    });
    const products = await prisma.producto.findMany({
      where: { activo: true },
      include: { categoria: true },
      orderBy: { createdAt: 'desc' },
    });
    
    // Obtener número de whatsapp configurado
    const config = await prisma.configuracion.findUnique({
      where: { id: 'default' },
      select: { whatsappNumber: true },
    });

    return {
      categories: categories.length ? categories : FALLBACK_CATEGORIES,
      products: products.length ? products : FALLBACK_PRODUCTS,
      whatsappNumber: config?.whatsappNumber || '51989947606',
    };
  } catch (e) {
    console.warn('Error al cargar datos del catálogo de la BD. Usando fallbacks:', e);
    return {
      categories: FALLBACK_CATEGORIES,
      products: FALLBACK_PRODUCTS,
      whatsappNumber: '51989947606',
    };
  }
}

export default async function CatalogPage() {
  const { categories, products, whatsappNumber } = await getCatalogData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Encabezado */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Catálogo de <span className="text-emerald-600 dark:text-emerald-400">Instrumentos</span>
        </h1>
        <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 mt-2 font-light">
          Explora nuestra selección exclusiva, filtra tus preferencias y cotiza por WhatsApp.
        </p>
      </div>

      {/* Componente de Filtrado Interactivo (Cliente) */}
      <CatalogClient
        initialProducts={products}
        categories={categories}
        whatsappNumber={whatsappNumber}
      />
    </div>
  );
}
