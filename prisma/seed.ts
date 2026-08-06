import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  // Usar PBKDF2 nativo para hashing seguro y 100% portable
  return crypto.pbkdf2Sync(password, 'world-music-salt-key', 10000, 64, 'sha512').toString('hex');
}

async function main() {
  console.log('Iniciando proceso de siembra (seed)...');

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

  const categoriasMap: { [key: string]: string } = {};

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
  const config = await prisma.configuracion.upsert({
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
      aboutHistory: 'Fundada en 2010, World Music nació de la pasión por acercar la música a todas las personas. Comenzamos como un pequeño taller y nos hemos convertido en una de las tiendas de instrumentos de referencia en la ciudad, combinando la venta de marcas de prestigio con una academia de formación musical integral.',
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

  // 4. Crear Productos de Muestra
  const productosMuestra = [
    {
      titulo: 'Guitarra Acústica Yamaha F310',
      descripcion: 'La guitarra acústica clásica ideal para principiantes y músicos intermedios. Excelente resonancia y afinación estable.',
      precio: 650.0,
      categoriaId: categoriasMap['guitarras'],
      imagen: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&auto=format&fit=crop&q=80',
      incluye: 'Guitarra Yamaha F310, funda de lona acolchada, púa (plectro) y llave de ajuste del alma.',
      slug: 'guitarra-acustica-yamaha-f310',
      activo: true,
      stock: 15,
    },
    {
      titulo: 'Ukelele Concierto de Caoba',
      descripcion: 'Ukelele tamaño concierto construido con madera de caoba seleccionada. Ofrece un tono cálido, dulce y con buen volumen.',
      precio: 180.0,
      categoriaId: categoriasMap['ukeleles'],
      imagen: 'https://images.unsplash.com/photo-1508186227413-bb1f58a117af?w=500&auto=format&fit=crop&q=80',
      incluye: 'Ukelele Concierto, funda de transporte con asas, afinador digital de clip y juego de cuerdas Aquila de repuesto.',
      slug: 'ukelele-concierto-de-caoba',
      activo: true,
      stock: 25,
    },
    {
      titulo: 'Bajo Eléctrico Fender Squier Affinity Jazz Bass',
      descripcion: 'Un excelente punto de entrada en la familia Fender. Sonido clásico con comodidad moderna y dos pastillas de bobina simple.',
      precio: 1250.0,
      categoriaId: categoriasMap['bajos'],
      imagen: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=500&auto=format&fit=crop&q=80',
      incluye: 'Bajo Squier Jazz Bass, cable de audio plug-plug de 3 metros, llaves de ajuste para puente y mástil.',
      slug: 'bajo-electrico-fender-squier-affinity-jazz-bass',
      activo: true,
      stock: 8,
    },
    {
      titulo: 'Teclado Sensitivo Roland GO:KEYS 61',
      descripcion: 'Teclado de 61 teclas sensitivas con más de 500 sonidos profesionales. Conectividad Bluetooth para tocar junto con tu smartphone.',
      precio: 1580.0,
      categoriaId: categoriasMap['teclados'],
      imagen: 'https://images.unsplash.com/photo-1552422535-c45813c61732?w=500&auto=format&fit=crop&q=80',
      incluye: 'Teclado Roland GO:KEYS, adaptador de corriente original, atril para partituras y manual de usuario en español.',
      slug: 'teclado-sensitivo-roland-go-keys-61',
      activo: true,
      stock: 6,
    },
    {
      titulo: 'Batería Acústica Pearl Roadshow 5 Cuerpos',
      descripcion: 'Batería completa de excelente calidad acústica. Cascos de álamo de 9 capas que entregan potencia y gran definición tonal.',
      precio: 2950.0,
      categoriaId: categoriasMap['baterias'],
      imagen: 'https://images.unsplash.com/photo-1524412513780-b462b2fe40f2?w=500&auto=format&fit=crop&q=80',
      incluye: 'Bombo de 22", toms de 10" y 12", tom de piso de 16", tarola de 14". Incluye platillos hi-hat de 14", crash de 16", atriles reforzados, pedal de bombo, baquetas y asiento.',
      slug: 'bateria-acustica-pearl-roadshow-5-cuerpos',
      activo: true,
      stock: 4,
    },
    {
      titulo: 'Violín Acústico Cremona SV-75 4/4',
      descripcion: 'Violín de tamaño completo ideal para estudiantes. Tapa de pino abeto y aros/fondo de arce para un sonido resonante y claro.',
      precio: 480.0,
      categoriaId: categoriasMap['violines'],
      imagen: 'https://images.unsplash.com/photo-1612222869049-d8ec83637a3c?w=500&auto=format&fit=crop&q=80',
      incluye: 'Violín SV-75, estuche rígido con interiores de felpa, arco de madera con crin natural y colofonia (pez/resina).',
      slug: 'violin-acustico-cremona-sv-75-4-4',
      activo: true,
      stock: 10,
    },
    {
      titulo: 'Afinador de Clip Joyo JT-01',
      descripcion: 'Afinador cromático digital de alta precisión para sujetar en el clavijero. Pantalla LCD retroiluminada de dos colores.',
      precio: 35.0,
      categoriaId: categoriasMap['afinadores'],
      imagen: 'https://images.unsplash.com/photo-1582200742183-4a159957d386?w=500&auto=format&fit=crop&q=80',
      incluye: 'Afinador Joyo JT-01, pila CR2032 y manual de instrucciones.',
      slug: 'afinador-de-clip-joyo-jt-01',
      activo: true,
      stock: 100,
    },
  ];

  for (const prod of productosMuestra) {
    await prisma.producto.upsert({
      where: { slug: prod.slug },
      update: prod,
      create: prod,
    });
  }
  console.log('Productos de muestra sembrados con éxito.');

  // 5. Configurar Row Level Security (RLS) en Supabase PostgreSQL
  console.log('Configurando políticas de seguridad a nivel de fila (RLS)...');
  try {
    // RLS para Producto
    await prisma.$executeRawUnsafe(`ALTER TABLE "Producto" ENABLE ROW LEVEL SECURITY;`);
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Permitir lectura publica de Productos" ON "Producto";`);
    await prisma.$executeRawUnsafe(`CREATE POLICY "Permitir lectura publica de Productos" ON "Producto" FOR SELECT USING (true);`);
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Permitir escritura a admins en Productos" ON "Producto";`);
    await prisma.$executeRawUnsafe(`CREATE POLICY "Permitir escritura a admins en Productos" ON "Producto" FOR ALL TO authenticated USING (true) WITH CHECK (true);`);

    // RLS para Categoria
    await prisma.$executeRawUnsafe(`ALTER TABLE "Categoria" ENABLE ROW LEVEL SECURITY;`);
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Permitir lectura publica de Categorias" ON "Categoria";`);
    await prisma.$executeRawUnsafe(`CREATE POLICY "Permitir lectura publica de Categorias" ON "Categoria" FOR SELECT USING (true);`);
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Permitir escritura a admins en Categorias" ON "Categoria";`);
    await prisma.$executeRawUnsafe(`CREATE POLICY "Permitir escritura a admins en Categorias" ON "Categoria" FOR ALL TO authenticated USING (true) WITH CHECK (true);`);

    // RLS para Configuracion
    await prisma.$executeRawUnsafe(`ALTER TABLE "Configuracion" ENABLE ROW LEVEL SECURITY;`);
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Permitir lectura publica de Configuracion" ON "Configuracion";`);
    await prisma.$executeRawUnsafe(`CREATE POLICY "Permitir lectura publica de Configuracion" ON "Configuracion" FOR SELECT USING (true);`);
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Permitir escritura a admins en Configuracion" ON "Configuracion";`);
    await prisma.$executeRawUnsafe(`CREATE POLICY "Permitir escritura a admins en Configuracion" ON "Configuracion" FOR ALL TO authenticated USING (true) WITH CHECK (true);`);

    // RLS para Administrador
    await prisma.$executeRawUnsafe(`ALTER TABLE "Administrador" ENABLE ROW LEVEL SECURITY;`);
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Permitir lectura a admins en Administrador" ON "Administrador";`);
    await prisma.$executeRawUnsafe(`CREATE POLICY "Permitir lectura a admins en Administrador" ON "Administrador" FOR SELECT TO authenticated USING (true);`);
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Permitir escritura a admins en Administrador" ON "Administrador";`);
    await prisma.$executeRawUnsafe(`CREATE POLICY "Permitir escritura a admins en Administrador" ON "Administrador" FOR ALL TO authenticated USING (true) WITH CHECK (true);`);

    console.log('Políticas de RLS configuradas con éxito en PostgreSQL.');
  } catch (error) {
    console.warn('Advertencia: No se pudieron aplicar las políticas SQL de RLS directamente. Esto es normal si estás usando una base de datos local de desarrollo sin el rol de administrador o extensión de Supabase. El sistema de base de datos sigue funcionando normalmente. Error:', error);
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
