'use client';

import React, { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { Search, SlidersHorizontal, ArrowUpDown, MessageCircle, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: string;
  titulo: string;
  descripcion: string | null;
  precio: number;
  imagen: string | null;
  slug: string;
  categoriaId: string | null;
  categoria?: { nombre: string } | null;
  imagenes?: string[];
}

interface Category {
  id: string;
  nombre: string;
  slug: string;
}

interface CatalogClientProps {
  initialProducts: Product[];
  categories: Category[];
  whatsappNumber: string;
}

export default function CatalogClient({
  initialProducts,
  categories,
  whatsappNumber,
}: CatalogClientProps) {
  // Filtros y Estados
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<string>('recientes');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Calcular límites de precio
  const { absoluteMinPrice, absoluteMaxPrice } = useMemo(() => {
    if (initialProducts.length === 0) return { absoluteMinPrice: 0, absoluteMaxPrice: 10000 };
    const prices = initialProducts.map((p) => p.precio);
    return {
      absoluteMinPrice: Math.min(...prices),
      absoluteMaxPrice: Math.max(...prices),
    };
  }, [initialProducts]);

  const [maxPrice, setMaxPrice] = useState<number>(absoluteMaxPrice);

  // Filtrado y Ordenación en tiempo real
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // 1. Filtro por búsqueda
    if (search.trim() !== '') {
      const term = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.titulo.toLowerCase().includes(term) ||
          (p.descripcion && p.descripcion.toLowerCase().includes(term))
      );
    }

    // 2. Filtro por categoría
    if (selectedCategory !== 'todos') {
      result = result.filter((p) => p.categoriaId === selectedCategory);
    }

    // 3. Filtro por precio
    result = result.filter((p) => p.precio <= maxPrice);

    // 4. Ordenación
    if (sortBy === 'precio-asc') {
      result.sort((a, b) => a.precio - b.precio);
    } else if (sortBy === 'precio-desc') {
      result.sort((a, b) => b.precio - a.precio);
    } else if (sortBy === 'recientes') {
      // Simulado por orden en base de datos (por defecto viene por fecha de creación desc)
      // Si quisiéramos ordenar estrictamente, necesitaríamos el campo de fecha, pero ya viene pre-ordenado
    } else if (sortBy === 'mas-vendidos') {
      // Reservado para futuras implementaciones, de momento ordena por ID para consistencia
      result.sort((a, b) => a.id.localeCompare(b.id));
    }

    return result;
  }, [initialProducts, search, selectedCategory, maxPrice, sortBy]);

  // Reiniciar todos los filtros
  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('todos');
    setMaxPrice(absoluteMaxPrice);
    setSortBy('recientes');
  };

  // Mensaje pre-rellenado para WhatsApp en buscador inteligente
  const getWhatsappQuoteUrl = () => {
    const formattedMsg = encodeURIComponent(
      `Hola.\n\nEstuve revisando el catálogo de su página web y no encontré el siguiente producto:\n\n"${search}"\n\nQuisiera saber si lo tienen disponible.\n\nMuchas gracias.`
    );
    return `https://wa.me/${whatsappNumber.replace(/\+/g, '').trim()}?text=${formattedMsg}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* SIDEBAR FILTERS (DESKTOP) */}
      <aside className="hidden lg:block lg:col-span-1 space-y-8 bg-neutral-50 dark:bg-neutral-900/30 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-900/60 h-fit">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200/50 dark:border-neutral-800">
          <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2 text-sm uppercase tracking-wider">
            <SlidersHorizontal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Filtros
          </h3>
          <button
            onClick={handleResetFilters}
            className="text-xs text-neutral-400 dark:text-neutral-500 hover:text-neutral-950 dark:hover:text-white flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reiniciar
          </button>
        </div>

        {/* Categorías */}
        <div className="space-y-3">
          <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 text-xs uppercase tracking-wider">Categorías</h4>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => setSelectedCategory('todos')}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'todos'
                  ? 'bg-emerald-600 dark:bg-emerald-500 text-white font-semibold shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              Todos los productos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 dark:bg-emerald-500 text-white font-semibold shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                }`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Rango de Precios */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 text-xs uppercase tracking-wider">Precio Máximo</h4>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              S/{maxPrice.toFixed(0)}
            </span>
          </div>
          <input
            type="range"
            min={absoluteMinPrice}
            max={absoluteMaxPrice}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-600 dark:accent-emerald-400"
          />
          <div className="flex justify-between text-[10px] text-neutral-400 dark:text-neutral-500">
            <span>S/{absoluteMinPrice.toFixed(0)}</span>
            <span>S/{absoluteMaxPrice.toFixed(0)}</span>
          </div>
        </div>
      </aside>

      {/* PRODUCT GRID & FILTERS PANEL (MOBILE & MAIN AREA) */}
      <div className="lg:col-span-3 space-y-6">
        {/* Barra superior de buscador y ordenamiento */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          {/* Buscador */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
            <input
              type="text"
              placeholder="Buscar guitarra, bajo, ukelele..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800/80 hover:border-neutral-200 dark:hover:border-neutral-700/80 focus:border-emerald-600 dark:focus:border-emerald-500 outline-none rounded-xl text-sm transition-colors shadow-sm"
            />
          </div>

          {/* Ordenador y Filtros Mobile */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="lg:hidden p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl text-sm font-semibold flex items-center gap-2 text-neutral-600 dark:text-neutral-300"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtros</span>
            </button>

            <div className="relative flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-neutral-400 dark:text-neutral-500 hidden sm:block" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-3 pr-8 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl text-sm font-semibold text-neutral-600 dark:text-neutral-300 outline-none focus:border-emerald-600 dark:focus:border-emerald-500 appearance-none cursor-pointer shadow-sm"
              >
                <option value="recientes">Más recientes</option>
                <option value="precio-asc">Menor precio</option>
                <option value="precio-desc">Mayor precio</option>
                <option value="mas-vendidos">Más vendidos</option>
              </select>
            </div>
          </div>
        </div>

        {/* FILTERS DRAW PANEL (MOBILE ONLY) */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-neutral-50 dark:bg-neutral-900/50 p-5 border border-neutral-100 dark:border-neutral-800 rounded-xl space-y-6 overflow-hidden"
            >
              {/* Categorías */}
              <div className="space-y-2">
                <h4 className="font-bold text-neutral-800 dark:text-neutral-200 text-xs uppercase tracking-wider">Categorías</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSelectedCategory('todos');
                      setMobileFiltersOpen(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      selectedCategory === 'todos'
                        ? 'bg-emerald-600 dark:bg-emerald-500 text-white'
                        : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200/50 dark:border-neutral-800'
                    }`}
                  >
                    Todos
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setMobileFiltersOpen(false);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        selectedCategory === cat.id
                          ? 'bg-emerald-600 dark:bg-emerald-500 text-white'
                          : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200/50 dark:border-neutral-800'
                      }`}
                    >
                      {cat.nombre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rango de Precios */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-neutral-800 dark:text-neutral-200 text-xs uppercase tracking-wider">Precio Máximo</h4>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">S/{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min={absoluteMinPrice}
                  max={absoluteMaxPrice}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-600 dark:accent-emerald-400"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RESULT AREA */}
        {filteredProducts.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProductCard
                    id={product.id}
                    titulo={product.titulo}
                    descripcion={product.descripcion}
                    precio={product.precio}
                    imagen={product.imagen}
                    slug={product.slug}
                    categoria={product.categoria}
                    imagenes={product.imagenes}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* BUSCADOR INTELIGENTE - SIN RESULTADOS */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800/80 rounded-2xl p-8 sm:p-12 text-center shadow-sm max-w-xl mx-auto space-y-6"
          >
            <div className="w-16 h-16 bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
              <Search className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-lg sm:text-xl text-neutral-900 dark:text-white">
                ¿No encontraste el instrumento que buscabas?
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
                No te preocupes. Escríbenos directamente por WhatsApp indicando qué instrumento o accesorio necesitas y lo cotizaremos o importaremos para ti de inmediato.
              </p>
            </div>

            {search.trim() && (
              <div className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-lg text-xs font-mono text-neutral-600 dark:text-neutral-400 inline-block border border-neutral-100 dark:border-neutral-900">
                Búsqueda: &ldquo;{search}&rdquo;
              </div>
            )}

            <div>
              <a
                href={getWhatsappQuoteUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-emerald-950/20 active:scale-95"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Cotizar por WhatsApp</span>
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
