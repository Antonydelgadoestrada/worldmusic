# World Music - Catálogo Virtual y Academia de Música

Plataforma web premium, profesional y completamente responsive para una tienda de instrumentos musicales, accesorios y academia de música. Desarrollada con **Next.js 15**, **Prisma ORM**, **Tailwind CSS** y **Supabase** (Base de datos PostgreSQL, Autenticación y Storage).

El sistema está diseñado como un **catálogo virtual** en el que los clientes acumulan productos en el carrito y finalizan el pedido enviándolo formateado mediante un mensaje directo a **WhatsApp**.

---

## 🚀 Características Clave

1. **Ajuste de Tema**: Cambio dinámico entre Modo Claro (Blanco premium) y Modo Oscuro (Negro elegante) con persistencia en `LocalStorage`.
2. **Buscador Inteligente**: Si un usuario busca un instrumento y no hay resultados, se muestra una tarjeta premium para cotizar/importar dicho producto por WhatsApp, capturando automáticamente el texto escrito.
3. **Checkout por WhatsApp**: Envía el carrito estructurado indicando títulos, cantidades, subtotal y total de manera profesional.
4. **Academia de Música**: Sección informativa de cursos con consultas personalizadas por WhatsApp.
5. **Panel Administrador Protegido**:
   * Login seguro mediante **Supabase Auth** respaldado por tabla de privilegios de administrador.
   * Gestión completa de productos (CRUD: Crear, Leer, Actualizar, Eliminar).
   * Almacenamiento de imágenes integrado con **Supabase Storage** con fallback de URL directa.
   * **Importador de Excel**: Permite subir un archivo `.xlsx` para agregar o actualizar precios masivamente.
   * **Exportador de Catálogo**: Descarga el catálogo completo en formato Excel con un solo clic.
   * **Configuración sin Código**: Permite editar números de contacto, horarios, redes sociales, mapas y políticas de la tienda desde el panel.

---

## 🛠️ Stack Tecnológico

* **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide React, React Hook Form, Zod.
* **Backend**: Next.js Server Actions y Route Protection Middleware.
* **Base de Datos & Servicios**: Supabase (PostgreSQL, Auth y Storage).
* **ORM**: Prisma.
* **Procesamiento de Archivos**: SheetJS (`xlsx`).

---

## 💻 Instalación y Configuración Local

### 1. Clonar el repositorio e instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto basándote en el archivo `.env.example`:
```env
# Conexión de Base de Datos para Prisma (Supabase PostgreSQL)
# Se requiere usar el pooler de conexiones (puerto 6543 con ?pgbouncer=true) para DATABASE_URL
DATABASE_URL="postgres://postgres.[YOUR_PROJECT_ID]:[YOUR_PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Se requiere usar la conexión directa (puerto 5432) para DIRECT_URL (migraciones)
DIRECT_URL="postgres://postgres.[YOUR_PROJECT_ID]:[YOUR_PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Supabase API y Llaves de autenticación
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR_PROJECT_ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOi..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."
```

### 3. Configurar Supabase Storage
1. Accede a tu panel de **Supabase Console** (`https://supabase.com`).
2. Ve a la sección **Storage** y crea un nuevo **Bucket**.
3. Nómbralo estrictamente: `instrumentos-images`.
4. Asegúrate de configurarlo como **Public** (para que las imágenes cargadas por el administrador sean legibles por el cliente final).

### 4. Configurar la base de datos (Migración y Siembra)
Ejecuta el siguiente comando para aplicar el esquema de base de datos a PostgreSQL y poblarlo con categorías, configuración por defecto, administrador y productos de muestra:
```bash
npm run db:setup
```

* **Credenciales del Administrador por Defecto**:
  * **Email**: `admin@worldmusic.com`
  * **Contraseña**: `Admin123456!`
  *(El primer inicio de sesión registrará de manera transparente la cuenta en Supabase Auth basándose en esta semilla).*

### 5. Iniciar servidor de desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la tienda.

---

## 📦 Despliegue en Vercel

1. Crea un nuevo proyecto en **Vercel** conectado a tu repositorio Git.
2. Agrega las mismas variables de entorno declaradas en el archivo `.env` en la sección **Environment Variables** de Vercel.
3. Asegúrate de correr la inicialización de la base de datos en Vercel o de haberla corrido localmente antes de desplegar. El comando de build estándar en Vercel ejecutará `next build`.
4. ¡Listo! Vercel detectará la configuración de Next.js y compilará la aplicación de manera óptima.
