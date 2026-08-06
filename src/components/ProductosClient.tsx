'use client';

import React, { useState, useTransition, useMemo } from 'react';
import {
  saveProductAction,
  deleteProductAction,
  toggleProductActiveAction,
  importExcelProductsAction
} from '@/app/admin/actions';
import { createClient } from '@/lib/supabase/client';
import {
  Search,
  Plus,
  FileSpreadsheet,
  Download,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Upload,
  Loader2,
  X,
  FileDown
} from 'lucide-react';
import Image from 'next/image';
import * as XLSX from 'xlsx';

interface Product {
  id: string;
  titulo: string;
  descripcion: string | null;
  precio: number;
  imagen: string | null;
  incluye: string | null;
  slug: string;
  activo: boolean;
  stock: number;
  categoriaId: string | null;
  categoria?: { nombre: string } | null;
}

interface Category {
  id: string;
  nombre: string;
  slug: string;
}

interface ProductosClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductosClient({ initialProducts, categories }: ProductosClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [isPending, startTransition] = useTransition();

  // Modales
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);

  // Formulario Producto
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    titulo: '',
    descripcion: '',
    precio: 0,
    categoriaId: '',
    imagen: '',
    incluye: '',
    stock: 0,
    activo: true,
  });

  // Carga de Archivos
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  // Resumen de Importación Excel
  const [importSummary, setImportSummary] = useState<{
    added: number;
    updated: number;
    errors: number;
    success: boolean;
  } | null>(null);

  // Cliente Supabase
  const supabase = createClient();

  // Filtrado de Productos en Cliente
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.titulo.toLowerCase().includes(search.toLowerCase()) || 
        (p.descripcion && p.descripcion.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || p.categoriaId === selectedCategory;
      const matchesActive =
        activeFilter === 'all' ||
        (activeFilter === 'active' && p.activo) ||
        (activeFilter === 'inactive' && !p.activo);

      return matchesSearch && matchesCategory && matchesActive;
    });
  }, [products, search, selectedCategory, activeFilter]);

  // ABRIR CREACIÓN
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setProductForm({
      titulo: '',
      descripcion: '',
      precio: 0,
      categoriaId: categories[0]?.id || '',
      imagen: '',
      incluye: '',
      stock: 0,
      activo: true,
    });
    setUploadMessage('');
    setIsProductModalOpen(true);
  };

  // ABRIR EDICIÓN
  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      titulo: prod.titulo,
      descripcion: prod.descripcion || '',
      precio: prod.precio,
      categoriaId: prod.categoriaId || '',
      imagen: prod.imagen || '',
      incluye: prod.incluye || '',
      stock: prod.stock,
      activo: prod.activo,
    });
    setUploadMessage('');
    setIsProductModalOpen(true);
  };

  // ACCIÓN GUARDAR PRODUCTO
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const dataToSave = {
        id: editingProduct?.id,
        ...productForm,
      };

      const res = await saveProductAction(dataToSave);
      if (res.success && res.product) {
        const savedProd = res.product as Product;
        // Encontrar nombre de la categoría localmente para actualizar vista sin recargar
        const catName = categories.find((c) => c.id === savedProd.categoriaId)?.nombre || '';
        const populatedProd = {
          ...savedProd,
          categoria: catName ? { nombre: catName } : null,
        };

        if (editingProduct) {
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? populatedProd : p))
          );
        } else {
          setProducts((prev) => [populatedProd, ...prev]);
        }
        setIsProductModalOpen(false);
      } else {
        alert(res.error || 'Ocurrió un error al guardar el producto.');
      }
    });
  };

  // ACCIÓN ELIMINAR PRODUCTO
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente el producto "${name}"?`)) {
      return;
    }

    startTransition(async () => {
      const res = await deleteProductAction(id);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(res.error || 'Error al eliminar el producto.');
      }
    });
  };

  // CAMBIAR ESTADO ACTIVO/INACTIVO
  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    // Optimista en el cliente
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, activo: newStatus } : p))
    );

    const res = await toggleProductActiveAction(id, newStatus);
    if (!res.success) {
      // Revertir en caso de error
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, activo: currentStatus } : p))
      );
      alert(res.error || 'Error al cambiar estado.');
    }
  };

  // CONTROLADOR DE SUBIDA DE IMAGEN A SUPABASE STORAGE
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadMessage('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `productos/${fileName}`;

      // Subir archivo al bucket 'instrumentos-images'
      const { error: uploadError } = await supabase.storage
        .from('instrumentos-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('instrumentos-images')
        .getPublicUrl(filePath);

      setProductForm((prev) => ({ ...prev, imagen: publicUrl }));
      setUploadMessage('¡Imagen cargada correctamente en Supabase Storage!');
    } catch (err: any) {
      console.error('Error al subir imagen:', err);
      setUploadMessage(
        'Error: No se pudo subir. Verifica que el bucket público "instrumentos-images" esté creado en tu consola de Supabase.'
      );
    } finally {
      setUploadingImage(false);
    }
  };

  // IMPORTACIÓN DE EXCEL (CLIENT SIDE PARSE + BATCH SERVER ACTION)
  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportSummary(null);
    const reader = new FileReader();

    reader.onload = async (evt) => {
      startTransition(async () => {
        try {
          const data = new Uint8Array(evt.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          if (!jsonData.length) {
            alert('El archivo Excel está vacío o no tiene el formato correcto.');
            return;
          }

          // Parsear dinámicamente columnas aproximadas (Título, Precio, Qué incluye)
          const parsedList = jsonData.map((row: any) => {
            const keys = Object.keys(row);
            const titleKey = keys.find(
              (k) => k.toLowerCase().includes('tit') || k.toLowerCase().includes('tít')
            );
            const priceKey = keys.find((k) => k.toLowerCase().includes('prec'));
            const includeKey = keys.find(
              (k) =>
                k.toLowerCase().includes('inclu') ||
                k.toLowerCase().includes('que') ||
                k.toLowerCase().includes('qué')
            );

            const rawPrice = priceKey ? parseFloat(row[priceKey]) : 0;

            return {
              titulo: titleKey ? String(row[titleKey]).trim() : '',
              precio: isNaN(rawPrice) ? 0 : rawPrice,
              incluye: includeKey ? String(row[includeKey]).trim() : '',
            };
          }).filter((p) => p.titulo !== '');

          if (parsedList.length === 0) {
            alert('No se encontraron filas válidas con la columna "Título".');
            return;
          }

          // Ejecutar Server Action para importación
          const res = await importExcelProductsAction(parsedList);

          if (res.success) {
            setImportSummary({
              added: res.added || 0,
              updated: res.updated || 0,
              errors: res.errors || 0,
              success: true,
            });

            // Refrescar lista de productos del cliente de forma optimista (volver a consultar o simular)
            // Para simplificar, forzamos recarga suave del dashboard para obtener todos los campos adicionales
            alert('¡Importación completada! Revisa el resumen.');
            window.location.reload();
          } else {
            alert('Error en importación: ' + res.error);
          }
        } catch (err: any) {
          alert('Error de lectura de archivo Excel: ' + err.message);
        }
      });
    };

    reader.readAsArrayBuffer(file);
  };

  // EXPORTACIÓN DEL CATÁLOGO A EXCEL
  const handleExportCatalog = () => {
    const dataToExport = products.map((p) => ({
      Título: p.titulo,
      Precio: p.precio,
      'Qué incluye': p.incluye || '',
      Categoría: p.categoria?.nombre || 'Sin categoría',
      Descripción: p.descripcion || '',
      Stock: p.stock,
      Estado: p.activo ? 'Activo' : 'Inactivo',
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Catálogo Completo');
    
    // Generar y descargar el archivo
    XLSX.writeFile(workbook, 'catalogo-world-music.xlsx');
  };

  return (
    <div className="space-y-6">
      
      {/* Botones de acción y filtros */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white dark:bg-neutral-900 p-4 border border-neutral-100 dark:border-neutral-800 rounded-2xl shadow-sm">
        
        {/* Buscador */}
        <div className="relative flex-grow max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-450" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-emerald-600 outline-none rounded-xl text-sm transition-colors"
          />
        </div>

        {/* Filtros de Categoría y Estado */}
        <div className="flex flex-wrap gap-2.5 items-center">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 outline-none rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-350 cursor-pointer"
          >
            <option value="all">Todas las Categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>

          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as any)}
            className="px-3 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 outline-none rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-350 cursor-pointer"
          >
            <option value="all">Todos los Estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>

          {/* Exportación */}
          <button
            onClick={handleExportCatalog}
            className="p-2.5 border border-neutral-250 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-white text-neutral-600 dark:text-neutral-300 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold"
            title="Exportar catálogo en Excel"
          >
            <FileDown className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar</span>
          </button>

          {/* Carga Excel */}
          <button
            onClick={() => {
              setImportSummary(null);
              setIsExcelModalOpen(true);
            }}
            className="px-4 py-2.5 border border-neutral-250 dark:border-neutral-850 hover:border-emerald-600 text-neutral-700 dark:text-neutral-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Importar Excel</span>
          </button>

          {/* Crear Producto */}
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white dark:text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Producto</span>
          </button>
        </div>

      </div>

      {/* Tabla de Productos */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-950 text-neutral-400 dark:text-neutral-500 text-[10px] font-bold uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-850">
                <th className="py-4 px-6">Imagen</th>
                <th className="py-4 px-6">Título</th>
                <th className="py-4 px-6">Categoría</th>
                <th className="py-4 px-6">Precio</th>
                <th className="py-4 px-6">Stock</th>
                <th className="py-4 px-6 text-center">Estado</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-850 text-sm">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-950/20 transition-colors">
                    {/* Imagen */}
                    <td className="py-3.5 px-6">
                      <div className="relative w-12 h-12 bg-neutral-100 dark:bg-neutral-950 rounded-lg overflow-hidden border border-neutral-200/40">
                        <Image
                          src={p.imagen || 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&auto=format&fit=crop&q=80'}
                          alt={p.titulo}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    </td>

                    {/* Título */}
                    <td className="py-3.5 px-6 font-bold text-neutral-900 dark:text-white max-w-xs truncate">
                      {p.titulo}
                    </td>

                    {/* Categoría */}
                    <td className="py-3.5 px-6 text-neutral-500 dark:text-neutral-400 font-medium">
                      {p.categoria?.nombre || 'Sin categoría'}
                    </td>

                    {/* Precio */}
                    <td className="py-3.5 px-6 font-bold text-neutral-900 dark:text-white">
                      S/{p.precio.toFixed(2)}
                    </td>

                    {/* Stock */}
                    <td className="py-3.5 px-6 font-medium text-neutral-500 dark:text-neutral-450">
                      {p.stock} u.
                    </td>

                    {/* Estado Activo */}
                    <td className="py-3.5 px-6 text-center">
                      <button
                        onClick={() => handleToggleActive(p.id, p.activo)}
                        className={`mx-auto flex transition-colors ${
                          p.activo ? 'text-emerald-600' : 'text-neutral-400'
                        }`}
                        title={p.activo ? 'Desactivar producto' : 'Activar producto'}
                      >
                        {p.activo ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                      </button>
                    </td>

                    {/* Acciones */}
                    <td className="py-3.5 px-6 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-2 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-400 rounded-lg text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors inline-flex"
                        title="Editar producto"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id, p.titulo)}
                        className="p-2 border border-red-200 dark:border-red-950/20 hover:border-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-red-600 transition-colors inline-flex"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400 dark:text-neutral-500 font-light">
                    No se encontraron productos en el catálogo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: EXCEL IMPORT */}
      {isExcelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 max-w-md w-full p-6 sm:p-8 space-y-6 relative shadow-lg">
            <button
              onClick={() => setIsExcelModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-950 rounded-full text-neutral-400"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-extrabold text-lg text-neutral-900 dark:text-white">
              Importar Catálogo desde Excel
            </h3>
            
            <div className="space-y-4">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
                Sube un archivo Excel (.xlsx). El sistema leerá automáticamente las columnas. Columnas requeridas: <strong className="font-semibold text-neutral-700 dark:text-neutral-200">Título</strong>, <strong className="font-semibold text-neutral-700 dark:text-neutral-200">Precio</strong> y <strong className="font-semibold text-neutral-700 dark:text-neutral-200">Qué incluye</strong>.
              </p>

              <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 text-center hover:border-emerald-500 transition-colors relative">
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleExcelImport}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-neutral-400 mx-auto" />
                  <span className="block text-xs font-semibold text-neutral-600 dark:text-neutral-350">
                    Haga clic o arrastre el archivo aquí
                  </span>
                  <span className="text-[10px] text-neutral-400 block">Soporta formatos .xlsx y .xls</span>
                </div>
              </div>

              {/* Loader */}
              {isPending && (
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Procesando archivo Excel y base de datos...</span>
                </div>
              )}

              {/* Resumen */}
              {importSummary && (
                <div className="bg-neutral-50 dark:bg-neutral-950 p-4 border border-neutral-100 dark:border-neutral-900 rounded-xl space-y-2.5 text-xs">
                  <h4 className="font-bold text-neutral-850 dark:text-neutral-250">Resumen del Proceso:</h4>
                  <ul className="space-y-1 font-semibold text-neutral-500 dark:text-neutral-400">
                    <li className="text-emerald-600">Nuevos agregados: {importSummary.added}</li>
                    <li className="text-blue-600">Precios actualizados: {importSummary.updated}</li>
                    <li className="text-red-500">Errores / Omitidos: {importSummary.errors}</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CREACIÓN / EDICIÓN DE PRODUCTO */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 max-w-2xl w-full p-6 sm:p-8 space-y-6 relative shadow-lg my-10 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-950 rounded-full text-neutral-400"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-extrabold text-lg text-neutral-900 dark:text-white">
              {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Titulo */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-550 dark:text-neutral-400 uppercase tracking-wider">Título del Producto</label>
                  <input
                    type="text"
                    required
                    value={productForm.titulo}
                    onChange={(e) => setProductForm((p) => ({ ...p, titulo: e.target.value }))}
                    placeholder="Guitarra Yamaha F310..."
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-emerald-600 outline-none rounded-xl text-sm transition-colors"
                  />
                </div>

                {/* Categoría */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-550 dark:text-neutral-400 uppercase tracking-wider">Categoría</label>
                  <select
                    value={productForm.categoriaId}
                    onChange={(e) => setProductForm((p) => ({ ...p, categoriaId: e.target.value }))}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-emerald-600 outline-none rounded-xl text-sm transition-colors cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Precio */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-550 dark:text-neutral-400 uppercase tracking-wider">Precio (S/)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min="0"
                    value={productForm.precio}
                    onChange={(e) => setProductForm((p) => ({ ...p, precio: parseFloat(e.target.value) || 0 }))}
                    placeholder="650.00"
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-emerald-600 outline-none rounded-xl text-sm transition-colors"
                  />
                </div>

                {/* Stock */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-550 dark:text-neutral-400 uppercase tracking-wider">Stock Disponible</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.stock}
                    onChange={(e) => setProductForm((p) => ({ ...p, stock: parseInt(e.target.value) || 0 }))}
                    placeholder="10"
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-emerald-600 outline-none rounded-xl text-sm transition-colors"
                  />
                </div>

                {/* Activo */}
                <div className="space-y-1.5 flex flex-col justify-end pb-1.5">
                  <label className="flex items-center gap-3 cursor-pointer text-sm font-semibold text-neutral-700 dark:text-neutral-350">
                    <input
                      type="checkbox"
                      checked={productForm.activo}
                      onChange={(e) => setProductForm((p) => ({ ...p, activo: e.target.checked }))}
                      className="w-4 h-4 accent-emerald-600"
                    />
                    <span>Producto visible en el catálogo</span>
                  </label>
                </div>

                {/* Imagen (Carga / URL) */}
                <div className="space-y-2 sm:col-span-2 border-t border-neutral-100 dark:border-neutral-800 pt-4">
                  <label className="block text-xs font-bold text-neutral-550 dark:text-neutral-400 uppercase tracking-wider">Imagen del Instrumento</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                    {/* Carga de Archivo */}
                    <div className="space-y-2 bg-neutral-50 dark:bg-neutral-950/50 p-4 border border-neutral-100 dark:border-neutral-800/80 rounded-xl">
                      <span className="block text-xs font-semibold text-neutral-600">Subir a Supabase Storage:</span>
                      <div className="flex items-center gap-3">
                        <label className="px-4 py-2 border border-neutral-250 dark:border-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300 font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1.5 transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Seleccionar archivo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                        {uploadingImage && <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />}
                      </div>
                      {uploadMessage && (
                        <p className="text-[10px] text-neutral-500 font-medium leading-relaxed mt-1">
                          {uploadMessage}
                        </p>
                      )}
                    </div>

                    {/* Pegar URL Directa */}
                    <div className="space-y-1.5 bg-neutral-50 dark:bg-neutral-950/50 p-4 border border-neutral-100 dark:border-neutral-800/80 rounded-xl">
                      <span className="block text-xs font-semibold text-neutral-600 mb-1">O escribe URL de imagen directamente:</span>
                      <input
                        type="text"
                        value={productForm.imagen}
                        onChange={(e) => setProductForm((p) => ({ ...p, imagen: e.target.value }))}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 focus:border-emerald-600 outline-none rounded-lg text-xs transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Descripcion */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-550 dark:text-neutral-400 uppercase tracking-wider">Descripción del Producto</label>
                  <textarea
                    value={productForm.descripcion}
                    onChange={(e) => setProductForm((p) => ({ ...p, descripcion: e.target.value }))}
                    placeholder="Escribe características generales de afinación, maderas, pastillas, sonido..."
                    rows={3}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-emerald-600 outline-none rounded-xl text-sm transition-colors"
                  />
                </div>

                {/* Qué incluye */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-550 dark:text-neutral-400 uppercase tracking-wider">¿Qué incluye?</label>
                  <textarea
                    value={productForm.incluye}
                    onChange={(e) => setProductForm((p) => ({ ...p, incluye: e.target.value }))}
                    placeholder="Incluye funda acolchada, afinador digital, púa, llaves de ajuste..."
                    rows={2}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-emerald-600 outline-none rounded-xl text-sm transition-colors"
                  />
                </div>
              </div>

              {/* Botones de Envío */}
              <div className="flex gap-3 justify-end pt-4 border-t border-neutral-100 dark:border-neutral-850">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-3 border border-neutral-250 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white dark:text-neutral-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors disabled:opacity-50"
                >
                  {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingProduct ? 'Guardar Cambios' : 'Crear Producto'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
