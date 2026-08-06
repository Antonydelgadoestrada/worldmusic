import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/ProductDetailClient';

const FALLBACK_PRODUCTS = [
  {
    id: 'p1',
    titulo: 'Guitarra Acústica Yamaha F310',
    descripcion: 'La guitarra acústica clásica ideal para principiantes y músicos intermedios. Excelente resonancia y afinación estable.',
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
    descripcion: 'Ukelele tamaño concierto construido con madera de caoba seleccionada. Ofrece un tono cálido y dulce.',
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
    descripcion: 'Un excelente punto de entrada en la familia Fender. Sonido clásico con comodidad moderna y dos pastillas Jazz.',
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
    descripcion: 'Teclado de 61 teclas sensitivas con más de 500 sonidos profesionales y Bluetooth.',
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

async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.producto.findUnique({
      where: { slug },
      include: { categoria: true },
    });
    
    if (product) return product;
  } catch (e) {
    console.warn(`Error buscando producto por slug "${slug}". Buscando en fallbacks.`, e);
  }

  // Si no se encuentra o falla la BD, buscar en fallback
  return FALLBACK_PRODUCTS.find((p) => p.slug === slug) || null;
}

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

// Configurar metadatos dinámicos SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  if (!product) {
    return {
      title: 'Producto No Encontrado | World Music',
    };
  }

  return {
    title: `${product.titulo} | World Music`,
    description: product.descripcion || `Adquiere tu ${product.titulo} al mejor precio en World Music. Catálogo virtual de instrumentos musicales.`,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const whatsappNumber = await getWhatsappNumber();

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ProductDetailClient product={product} whatsappNumber={whatsappNumber} />
    </div>
  );
}
