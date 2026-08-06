import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return crypto.pbkdf2Sync(password, 'world-music-salt-key', 10000, 64, 'sha512').toString('hex');
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') 
    .replace(/[^\w\-]+/g, '') 
    .replace(/\-\-+/g, '-') 
    .replace(/^-+/, '') 
    .replace(/-+$/, '');
}

function detectCategorySlug(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('guitarra')) return 'guitarras';
  if (t.includes('bajo')) return 'bajos';
  if (t.includes('ukelele')) return 'ukeleles';
  if (t.includes('cuerda') || t.includes('naylon') || t.includes('nylon') || t.includes('1ra') || t.includes('2da') || t.includes('3ra') || t.includes('4ta') || t.includes('5ta') || t.includes('6ta') || t.includes('metal') || t.includes('cuerdas') || t.includes('orphee') || t.includes('alice') || t.includes('d\'addario') || t.includes('romeo')) return 'cuerdas';
  if (t.includes('afinador')) return 'afinadores';
  if (t.includes('funda') || t.includes('estuche') || t.includes('mochila') || t.includes('capo') || t.includes('capodastro')) return 'fundas';
  if (t.includes('pedal') || t.includes('efecto')) return 'pedales';
  if (t.includes('cable') || t.includes('plug') || t.includes('adaptador') || t.includes('canon') || t.includes('conector') || t.includes('jack')) return 'cables';
  if (t.includes('atril') || t.includes('soporte') || t.includes('pedestal')) return 'atriles';
  if (t.includes('parlante') || t.includes('ampli') || t.includes('combo') || t.includes('bocina') || t.includes('speaker')) return 'parlantes';
  if (t.includes('microfono') || t.includes('mic')) return 'microfonos';
  if (t.includes('violin') || t.includes('violín') || t.includes('arco') || t.includes('brea') || t.includes('cremona')) return 'violines';
  if (t.includes('teclado') || t.includes('piano') || t.includes('organeta')) return 'teclados';
  if (t.includes('bateria') || t.includes('batería') || t.includes('tambor') || t.includes('platillo') || t.includes('baqueta') || t.includes('tarola')) return 'baterias';
  if (t.includes('viento') || t.includes('flauta') || t.includes('saxo') || t.includes('trompeta') || t.includes('armonica') || t.includes('boquilla') || t.includes('quena') || t.includes('zampoña')) return 'viento';
  if (t.includes('parche') || t.includes('pandereta') || t.includes('cajon') || t.includes('cajón') || t.includes('conga') || t.includes('bongo') || t.includes('bongó') || t.includes('shaker') || t.includes('maraca') || t.includes('campana') || t.includes('guiro') || t.includes('güiro') || t.includes('cencerro')) return 'percusion';
  return 'otros';
}

async function main() {
  console.log('Iniciando proceso de siembra (seed) desde catalogo_agente.md...');

  // 1. Crear Administrador por defecto
  const adminEmail = 'admin@worldmusic.com';
  const adminPasswordHash = hashPassword('Admin123456!');
  
  const admin = await prisma.administrador.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      nombre: 'Administrador Principal',
      email: adminEmail,
      password: adminPasswordHash,
    },
  });
  console.log(`Administrador por defecto verificado: ${admin.email}`);

  // 2. Crear Categorías
  const categoriasData = [
    { nombre: 'Guitarras', slug: 'guitarras' },
    { nombre: 'Bajos', slug: 'bajos' },
    { nombre: 'Ukeleles', slug: 'ukeleles' },
    { nombre: 'Teclados', slug: 'teclados' },
    { nombre: 'Baterías', slug: 'baterias' },
    { nombre: 'Percusión', slug: 'percusion' },
    { nombre: 'Instrumentos de viento', slug: 'viento' },
    { nombre: 'Violines', slug: 'violines' },
    { nombre: 'Accesorios', slug: 'accesorios' },
    { nombre: 'Micrófonos', slug: 'microfonos' },
    { nombre: 'Parlantes', slug: 'parlantes' },
    { nombre: 'Audio Profesional', slug: 'audio-profesional' },
    { nombre: 'Cables', slug: 'cables' },
    { nombre: 'Atriles', slug: 'atriles' },
    { nombre: 'Afinadores', slug: 'afinadores' },
    { nombre: 'Pedales', slug: 'pedales' },
    { nombre: 'Cuerdas', slug: 'cuerdas' },
    { nombre: 'Fundas', slug: 'fundas' },
    { nombre: 'Otros', slug: 'otros' },
  ];

  const categoriasMap: { [slug: string]: string } = {};

  for (const cat of categoriasData) {
    const createdCat = await prisma.categoria.upsert({
      where: { slug: cat.slug },
      update: { nombre: cat.nombre },
      create: cat,
    });
    categoriasMap[cat.slug] = createdCat.id;
  }
  console.log('Categorías creadas o actualizadas con éxito.');

  // 3. Crear Configuración por defecto
  await prisma.configuracion.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      whatsappNumber: '51989947606',
      whatsappMessage: 'Hola. Deseo cotizar los siguientes productos:',
      address: 'Av. Larco 123, Miraflores, Lima, Perú',
      googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.756209503417!2d-77.03176712398555!3d-12.128802888114294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c81604a434c3%3A0x6b24d67362bf7d7!2sParque%20Kennedy!5e0!3m2!1ses-419!2spe!4v1700000000000!5m2!1ses-419!2spe',
      facebookUrl: 'https://facebook.com/worldmusicpe',
      instagramUrl: 'https://instagram.com/worldmusicpe',
      tiktokUrl: 'https://tiktok.com/@worldmusicpe',
      youtubeUrl: 'https://youtube.com/worldmusicpe',
      aboutHistory: 'Fundada en 2010, World Music nació de la pasión por acercar la música a todas las personas. Comenzamos como un pequeño taller de luthería y nos hemos convertido en una de las tiendas de instrumentos de referencia en la ciudad, combinando la venta de marcas de prestigio con una academia de formación musical integral.',
      aboutMission: 'Proveer instrumentos musicales de la más alta calidad y ofrecer una formación musical excepcional, inspirando a la próxima generación de músicos en nuestro país.',
      aboutVision: 'Ser la cadena líder en tiendas de instrumentos y academia de música a nivel nacional, reconocida por la excelencia en el servicio al cliente y metodologías de aprendizaje innovadoras.',
      aboutValues: 'Pasión por la música, Excelencia, Compromiso con la educación, Confianza y Calidad.',
      academyInfo: 'Inscripción: S/30 | Mensualidad: S/150. Clases personalizadas de 1 hora, una o dos veces por semana, dictadas por músicos profesionales en ambientes equipados.',
      policyGarantias: 'Todos nuestros instrumentos nuevos cuentan con garantía de fábrica de 1 año contra defectos de fabricación. No cubre daños por mal uso o condiciones climáticas extremas.',
      policyCambios: 'Se permiten cambios dentro de los primeros 7 días calendario posteriores a la compra, siempre y cuando el instrumento esté en perfectas condiciones y con su empaque original sin abrir.',
      policyDevoluciones: 'Las devoluciones son válidas únicamente por fallas de fábrica que no puedan ser reparadas bajo la garantía. Se emitirá una nota de crédito o reembolso según corresponda.',
      policyHorarios: 'Lunes a Sábado: 9:00 AM - 8:00 PM | Domingos: 10:00 AM - 5:00 PM',
      policyContacto: 'Teléfono: (01) 444-5555 | Celular/WhatsApp: +51 989 947 606 | Email: info@worldmusic.com',
    },
  });
  console.log('Configuración por defecto de la tienda guardada.');

  // 4. Leer y parsear catalogo_agente.md
  console.log('Limpiando productos anteriores...');
  await prisma.producto.deleteMany({});

  const filePath = path.join(process.cwd(), 'catalogo_agente.md');
  if (!fs.existsSync(filePath)) {
    console.error(`Error: No se encontró el archivo ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Dividir el archivo por "## " para obtener cada producto
  const sections = content.split('## ').slice(1); // Ignorar el primer encabezado "# Catálogo de Productos"
  
  console.log(`Parseando ${sections.length} secciones de productos...`);
  
  const createdSlugs = new Set<string>();
  let productsCount = 0;

  for (const section of sections) {
    const lines = section.split('\n');
    const headerTitle = lines[0].trim();
    if (!headerTitle) continue;

    // Buscar el valor del campo producto y precio
    let titulo = headerTitle;
    let precio = 0;
    
    for (const line of lines) {
      const cleanLine = line.trim();
      if (cleanLine.startsWith('- **Producto:**')) {
        titulo = cleanLine.replace('- **Producto:**', '').trim();
      } else if (cleanLine.startsWith('- **Precio:**')) {
        const rawPrice = cleanLine.replace('- **Precio:**', '').trim();
        precio = parseFloat(rawPrice) || 0;
      }
    }

    if (!titulo) continue;

    // Detectar categoría automáticamente
    const categorySlug = detectCategorySlug(titulo);
    const categoriaId = categoriasMap[categorySlug] || categoriasMap['otros'];

    // Generar un slug único
    let slug = slugify(titulo);
    let count = 1;
    while (createdSlugs.has(slug)) {
      slug = `${slugify(titulo)}-${count}`;
      count++;
    }
    createdSlugs.add(slug);

    // Crear el producto en la BD
    await prisma.producto.create({
      data: {
        titulo,
        precio,
        descripcion: `Instrumento / Accesorio musical. Consulta detalles de stock e importación por WhatsApp.`,
        incluye: 'Instrumento / Accesorio detallado según el título del catálogo.',
        imagen: null, // Dejadas como no obligatorias para que las cargues tú
        slug,
        activo: true,
        stock: 5,
        categoriaId,
      },
    });

    productsCount++;
  }

  console.log(`¡Siembra de base de datos exitosa! Se cargaron ${productsCount} productos.`);

  // 5. Configurar Row Level Security (RLS) en Supabase PostgreSQL
  console.log('Configurando políticas de seguridad a nivel de fila (RLS)...');
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "Producto" ENABLE ROW LEVEL SECURITY;`);
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Permitir lectura publica de Productos" ON "Producto";`);
    await prisma.$executeRawUnsafe(`CREATE POLICY "Permitir lectura publica de Productos" ON "Producto" FOR SELECT USING (true);`);
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Permitir escritura a admins en Productos" ON "Producto";`);
    await prisma.$executeRawUnsafe(`CREATE POLICY "Permitir escritura a admins en Productos" ON "Producto" FOR ALL TO authenticated USING (true) WITH CHECK (true);`);

    await prisma.$executeRawUnsafe(`ALTER TABLE "Categoria" ENABLE ROW LEVEL SECURITY;`);
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Permitir lectura publica de Categorias" ON "Categoria";`);
    await prisma.$executeRawUnsafe(`CREATE POLICY "Permitir lectura publica de Categorias" ON "Categoria" FOR SELECT USING (true);`);
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Permitir escritura a admins en Categorias" ON "Categoria";`);
    await prisma.$executeRawUnsafe(`CREATE POLICY "Permitir escritura a admins en Categorias" ON "Categoria" FOR ALL TO authenticated USING (true) WITH CHECK (true);`);

    await prisma.$executeRawUnsafe(`ALTER TABLE "Configuracion" ENABLE ROW LEVEL SECURITY;`);
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Permitir lectura publica de Configuracion" ON "Configuracion";`);
    await prisma.$executeRawUnsafe(`CREATE POLICY "Permitir lectura publica de Configuracion" ON "Configuracion" FOR SELECT USING (true);`);
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Permitir escritura a admins en Configuracion" ON "Configuracion";`);
    await prisma.$executeRawUnsafe(`CREATE POLICY "Permitir escritura a admins en Configuracion" ON "Configuracion" FOR ALL TO authenticated USING (true) WITH CHECK (true);`);

    await prisma.$executeRawUnsafe(`ALTER TABLE "Administrador" ENABLE ROW LEVEL SECURITY;`);
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Permitir lectura a admins en Administrador" ON "Administrador";`);
    await prisma.$executeRawUnsafe(`CREATE POLICY "Permitir lectura a admins en Administrador" ON "Administrador" FOR SELECT TO authenticated USING (true);`);
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Permitir escritura a admins en Administrador" ON "Administrador";`);
    await prisma.$executeRawUnsafe(`CREATE POLICY "Permitir escritura a admins en Administrador" ON "Administrador" FOR ALL TO authenticated USING (true) WITH CHECK (true);`);

    console.log('Políticas de RLS configuradas con éxito en PostgreSQL.');
  } catch (error) {
    console.warn('Advertencia: No se pudieron aplicar las políticas SQL de RLS directamente:', error);
  }

  console.log('¡Siembra completada con éxito!');
}

main()
  .catch((e) => {
    console.error('Error al sembrar la base de datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
