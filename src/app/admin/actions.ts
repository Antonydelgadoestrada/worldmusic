'use server';

import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';

function hashPassword(password: string): string {
  return crypto.pbkdf2Sync(password, 'world-music-salt-key', 10000, 64, 'sha512').toString('hex');
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Reemplazar espacios con -
    .replace(/[^\w\-]+/g, '') // Eliminar caracteres no alfanuméricos
    .replace(/\-\-+/g, '-') // Reemplazar múltiples - con uno solo
    .replace(/^-+/, '') // Eliminar - al principio
    .replace(/-+$/, ''); // Eliminar - al final
}

// 1. INICIAR SESIÓN ADMIN
export async function loginAdminAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Por favor, completa todos los campos.' };
  }

  try {
    const supabase = await createClient();

    // Validar contra nuestra tabla de Administrador
    const adminRecord = await prisma.administrador.findUnique({
      where: { email },
    });

    if (!adminRecord) {
      return { error: 'Acceso denegado: No estás registrado como administrador en la base de datos.' };
    }

    const hashed = hashPassword(password);
    if (adminRecord.password !== hashed) {
      return { error: 'Credenciales incorrectas.' };
    }

    // Intentar iniciar sesión en Supabase Auth
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      // Si la cuenta no existe en Supabase Auth, la creamos al vuelo ya que ya pasó el control de nuestra base de datos
      if (authError.message.includes('Invalid login credentials') || authError.message.includes('Email not confirmed')) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              nombre: adminRecord.nombre,
            },
          },
        });

        if (signUpError) {
          return { error: 'Error al registrar credenciales en Supabase Auth: ' + signUpError.message };
        }

        // Reintentar login inmediatamente tras registro
        const { error: retryError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (retryError) {
          return { error: 'Error al iniciar sesión tras autorregistro: ' + retryError.message };
        }

        return { success: true };
      }

      return { error: 'Credenciales inválidas en Supabase Auth: ' + authError.message };
    }

    return { success: true };
  } catch (e: any) {
    console.error('Error en loginAdminAction:', e);
    return { error: 'Error del servidor: ' + e.message };
  }
}

// 2. CERRAR SESIÓN ADMIN
export async function logoutAdminAction() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return { success: true };
  } catch (e: any) {
    console.error('Error en logoutAdminAction:', e);
    return { error: 'Error al cerrar sesión' };
  }
}

// 3. GUARDAR / EDITAR PRODUCTO
export async function saveProductAction(productData: {
  id?: string;
  titulo: string;
  descripcion?: string;
  precio: number;
  categoriaId: string;
  imagen?: string;
  incluye?: string;
  stock?: number;
  activo?: boolean;
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'No autorizado.' };
    }

    const generatedSlug = slugify(productData.titulo);

    if (productData.id) {
      // Editar existente
      const updated = await prisma.producto.update({
        where: { id: productData.id },
        data: {
          titulo: productData.titulo,
          descripcion: productData.descripcion,
          precio: Number(productData.precio),
          categoriaId: productData.categoriaId || null,
          imagen: productData.imagen,
          incluye: productData.incluye,
          stock: productData.stock !== undefined ? Number(productData.stock) : 0,
          activo: productData.activo !== undefined ? productData.activo : true,
          slug: generatedSlug,
        },
      });
      revalidatePath('/catalogo');
      revalidatePath(`/catalogo/${updated.slug}`);
      return { success: true, product: updated };
    } else {
      // Crear nuevo
      const created = await prisma.producto.create({
        data: {
          titulo: productData.titulo,
          descripcion: productData.descripcion,
          precio: Number(productData.precio),
          categoriaId: productData.categoriaId || null,
          imagen: productData.imagen,
          incluye: productData.incluye,
          stock: productData.stock !== undefined ? Number(productData.stock) : 0,
          activo: productData.activo !== undefined ? productData.activo : true,
          slug: generatedSlug,
        },
      });
      revalidatePath('/catalogo');
      return { success: true, product: created };
    }
  } catch (e: any) {
    console.error('Error en saveProductAction:', e);
    return { error: 'Error al guardar el producto: ' + e.message };
  }
}

// 4. ELIMINAR PRODUCTO
export async function deleteProductAction(id: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'No autorizado.' };
    }

    const deleted = await prisma.producto.delete({
      where: { id },
    });
    
    revalidatePath('/catalogo');
    return { success: true, product: deleted };
  } catch (e: any) {
    console.error('Error en deleteProductAction:', e);
    return { error: 'Error al eliminar el producto: ' + e.message };
  }
}

// 5. CAMBIAR ESTADO ACTIVO
export async function toggleProductActiveAction(id: string, activo: boolean) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'No autorizado.' };
    }

    const updated = await prisma.producto.update({
      where: { id },
      data: { activo },
    });

    revalidatePath('/catalogo');
    revalidatePath(`/catalogo/${updated.slug}`);
    return { success: true };
  } catch (e: any) {
    console.error('Error en toggleProductActiveAction:', e);
    return { error: 'Error: ' + e.message };
  }
}

// 6. ACTUALIZAR CONFIGURACIÓN DE LA TIENDA
export async function updateConfigAction(configData: {
  whatsappNumber: string;
  whatsappMessage?: string;
  address: string;
  googleMapsUrl: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  aboutHistory?: string;
  aboutMission?: string;
  aboutVision?: string;
  aboutValues?: string;
  academyInfo?: string;
  policyGarantias?: string;
  policyCambios?: string;
  policyDevoluciones?: string;
  policyHorarios?: string;
  policyContacto?: string;
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'No autorizado.' };
    }

    const config = await prisma.configuracion.upsert({
      where: { id: 'default' },
      update: configData,
      create: {
        id: 'default',
        ...configData,
      },
    });

    // Revalidar las páginas afectadas para refrescar el caché estático en producción
    revalidatePath('/');
    revalidatePath('/catalogo');
    revalidatePath('/academia');
    revalidatePath('/carrito');

    return { success: true, config };
  } catch (e: any) {
    console.error('Error en updateConfigAction:', e);
    return { error: 'Error al actualizar configuración: ' + e.message };
  }
}

// 7. IMPORTAR PRODUCTOS DESDE EXCEL
export async function importExcelProductsAction(productsList: {
  titulo: string;
  precio: number;
  incluye?: string;
}[]) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'No autorizado.' };
    }

    let added = 0;
    let updated = 0;
    let errors = 0;

    for (const row of productsList) {
      if (!row.titulo || isNaN(Number(row.precio))) {
        errors++;
        continue;
      }

      const generatedSlug = slugify(row.titulo);

      try {
        // Verificar si existe por título o slug
        const existing = await prisma.producto.findFirst({
          where: {
            OR: [
              { titulo: row.titulo },
              { slug: generatedSlug }
            ]
          }
        });

        if (existing) {
          // Si existe, actualizar precio e incluye
          await prisma.producto.update({
            where: { id: existing.id },
            data: {
              precio: Number(row.precio),
              incluye: row.incluye || existing.incluye
            }
          });
          updated++;
        } else {
          // Si no existe, crear como nuevo
          await prisma.producto.create({
            data: {
              titulo: row.titulo,
              precio: Number(row.precio),
              incluye: row.incluye || '',
              slug: generatedSlug,
              activo: true,
              stock: 0
            }
          });
          added++;
        }
      } catch (e) {
        console.error('Error importando producto de Excel:', e);
        errors++;
      }
    }

    revalidatePath('/catalogo');
    return { success: true, added, updated, errors };
  } catch (e: any) {
    console.error('Error en importExcelProductsAction:', e);
    return { error: 'Error del servidor: ' + e.message };
  }
}
