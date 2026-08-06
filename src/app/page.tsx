import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import {
  Compass,
  Award,
  BookOpen,
  Calendar,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  RefreshCw,
  Clock,
  HeartHandshake
} from 'lucide-react';
import HomeClientAnimations from '@/components/HomeClientAnimations';

// Fallbacks estáticos si la base de datos no está inicializada o configurada
const DEFAULT_CONFIG = {
  aboutHistory: 'Fundada en 2010, World Music nació de la pasión por acercar la música a todas las personas. Comenzamos como un pequeño taller de luthería y nos hemos convertido en una de las tiendas de instrumentos de referencia en la ciudad, combinando la venta de marcas de prestigio con una academia de formación musical integral.',
  aboutMission: 'Proveer instrumentos musicales de la más alta calidad y ofrecer una formación musical excepcional, inspirando a la próxima generación de músicos en nuestro país.',
  aboutVision: 'Ser la cadena líder en tiendas de instrumentos y academia de música a nivel nacional, reconocida por la excelencia en el servicio al cliente y metodologías de aprendizaje innovadoras.',
  aboutValues: 'Pasión por la música, Excelencia, Compromiso con la educación, Confianza y Calidad.',
  address: 'Av. Larco 123, Miraflores, Lima, Perú',
  googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.756209503417!2d-77.03176712398555!3d-12.128802888114294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c81604a434c3%3A0x6b24d67362bf7d7!2sParque%20Kennedy!5e0!3m2!1ses-419!2spe!4v1700000000000!5m2!1ses-419!2spe',
  whatsappNumber: '51989947606',
  policyGarantias: 'Todos nuestros instrumentos nuevos cuentan con garantía de fábrica de 1 año contra defectos de fabricación. No cubre daños por mal uso o condiciones climáticas extremas.',
  policyCambios: 'Se permiten cambios dentro de los primeros 7 días calendario posteriores a la compra, siempre y cuando el instrumento esté en perfectas condiciones y con su empaque original sin abrir.',
  policyDevoluciones: 'Las devoluciones son válidas únicamente por fallas de fábrica que no puedan ser reparadas bajo la garantía. Se emitirá una nota de crédito o reembolso según corresponda.',
  policyHorarios: 'Lunes a Sábado: 9:00 AM - 8:00 PM | Domingos: 10:00 AM - 5:00 PM',
  policyContacto: 'Teléfono: (01) 444-5555 | Celular/WhatsApp: +51 989 947 606 | Email: info@worldmusic.com',
};

async function getConfig() {
  try {
    const config = await prisma.configuracion.findUnique({
      where: { id: 'default' },
    });
    return config || DEFAULT_CONFIG;
  } catch (e) {
    console.warn('Usando configuración fallback. Base de datos no conectada:', e);
    return DEFAULT_CONFIG;
  }
}

export default async function HomePage() {
  const config = await getConfig();

  return (
    <div className="overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center bg-neutral-900 text-white overflow-hidden">
        {/* Imagen de fondo con Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1600&auto=format&fit=crop&q=80"
            alt="Instrumentos musicales de World Music"
            fill
            priority
            className="object-cover opacity-30 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/70 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 lg:py-32">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Calidad y Confianza Garantizada</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Todo lo que necesitas para hacer música,{' '}
              <span className="text-emerald-500">en un solo lugar.</span>
            </h1>
            <p className="text-base sm:text-xl text-neutral-300 font-light max-w-2xl leading-relaxed">
              Explora nuestro catálogo virtual premium y cotiza al instante por WhatsApp. Encuentra instrumentos seleccionados por profesionales y potencia tu aprendizaje con nuestra academia.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link
                href="/catalogo"
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-center font-bold rounded-xl transition-all shadow-md hover:shadow-emerald-900/20 active:scale-95"
              >
                Ver Catálogo
              </Link>
              <Link
                href="/academia"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-center font-bold rounded-xl transition-all border border-white/20 backdrop-blur-sm active:scale-95"
              >
                Academia de Música
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NOSOTROS SECTION */}
      <section id="nosotros" className="py-20 md:py-28 bg-white dark:bg-neutral-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-emerald-600 dark:text-emerald-400 text-xs font-extrabold tracking-widest uppercase">
              Nosotros
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Pasión por la música y excelencia educativa
            </p>
            <div className="h-1 w-12 bg-emerald-600 dark:bg-emerald-400 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Foto de la tienda / Luthería */}
            <div className="relative h-[350px] sm:h-[480px] rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-950 shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80"
                alt="Showroom de World Music"
                fill
                sizes="(max-w-7xl) 50vw, 100vw"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Historia e Identidad */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">Nuestra Historia</h3>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed font-light text-sm sm:text-base">
                  {config.aboutHistory}
                </p>
              </div>

              {/* Mision y Vision */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-5 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-neutral-100 dark:border-neutral-900">
                  <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg w-fit mb-3.5">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-neutral-900 dark:text-white text-base mb-2">Misión</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {config.aboutMission}
                  </p>
                </div>

                <div className="p-5 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-neutral-100 dark:border-neutral-900">
                  <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg w-fit mb-3.5">
                    <Award className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-neutral-900 dark:text-white text-base mb-2">Visión</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {config.aboutVision}
                  </p>
                </div>
              </div>

              {/* Valores */}
              <div className="pt-2">
                <h4 className="font-bold text-neutral-900 dark:text-white text-sm uppercase tracking-wider mb-3">
                  Nuestros Valores
                </h4>
                <div className="flex flex-wrap gap-2">
                  {config.aboutValues?.split(',').map((val: string) => (
                    <span
                      key={val.trim()}
                      className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 rounded-md"
                    >
                      {val.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. POLÍTICAS DE LA TIENDA */}
      <section id="politicas" className="py-20 bg-neutral-50 dark:bg-neutral-900/30 border-y border-neutral-100 dark:border-neutral-900/50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-emerald-600 dark:text-emerald-400 text-xs font-extrabold tracking-widest uppercase">
              Políticas
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Garantías y Condiciones de Compra
            </p>
            <div className="h-1 w-12 bg-emerald-600 dark:bg-emerald-400 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Garantías */}
            <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex flex-col">
              <div className="p-3 bg-emerald-100/50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-2xl w-fit mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-3">Garantías</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
                {config.policyGarantias}
              </p>
            </div>

            {/* Cambios y Devoluciones */}
            <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex flex-col">
              <div className="p-3 bg-emerald-100/50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-2xl w-fit mb-5">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-3">Cambios y Devoluciones</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
                {config.policyCambios} <br className="mb-2" /> {config.policyDevoluciones}
              </p>
            </div>

            {/* Horarios y Atención */}
            <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex flex-col">
              <div className="p-3 bg-emerald-100/50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-2xl w-fit mb-5">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-3">Horarios de Atención</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-light mb-4">
                {config.policyHorarios}
              </p>
              <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800/50 space-y-1 text-xs text-neutral-400 dark:text-neutral-500">
                <p>Contacto inmediato:</p>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">{config.policyContacto?.split('|')[1]?.replace('Celular/WhatsApp:', '').trim()}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. UBICACIÓN SECTION (GOOGLE MAPS) */}
      <section id="ubicacion" className="py-20 md:py-28 bg-white dark:bg-neutral-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-center">
            {/* Detalles de Ubicación */}
            <div className="lg:col-span-1 space-y-6">
              <div className="space-y-3">
                <h2 className="text-emerald-600 dark:text-emerald-400 text-xs font-extrabold tracking-widest uppercase">
                  Ubicación
                </h2>
                <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                  Visítanos en nuestra Tienda
                </p>
                <div className="h-1 w-12 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
              </div>
              
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
                Contamos con estacionamiento vigilado, showroom interactivo y áreas de prueba acústica para que ensayes tu instrumento antes de cotizar.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-neutral-900 dark:text-white text-sm">Dirección Principal</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light mt-0.5">{config.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-neutral-900 dark:text-white text-sm">Celular / WhatsApp</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light mt-0.5">+{config.whatsappNumber}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-neutral-900 dark:text-white text-sm">Correo Electrónico</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light mt-0.5">info@worldmusic.com</p>
                  </div>
                </div>
              </div>

              {/* Botón de Google Maps */}
              <div className="pt-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition-all active:scale-95 shadow-sm"
                >
                  <Compass className="w-4 h-4" />
                  <span>Cómo llegar</span>
                </a>
              </div>
            </div>

            {/* Google Maps Iframe */}
            <div className="lg:col-span-2 relative h-[350px] sm:h-[450px] w-full rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-900/80 shadow-md">
              <iframe
                src={config.googleMapsUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="filter dark:invert dark:grayscale dark:contrast-75"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECCIÓN REDES SOCIALES CALL TO ACTION */}
      <section className="bg-emerald-900 text-white py-16 sm:py-20 relative overflow-hidden">
        {/* Background micro-pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl w-fit mx-auto">
            <HeartHandshake className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            ¿Quieres estar al tanto de talleres y novedades?
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 max-w-xl mx-auto font-light leading-relaxed">
            Síguenos en nuestras redes sociales oficiales. Compartimos consejos para el cuidado de tus instrumentos, demostraciones de equipos y fechas de inscripciones a la academia.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <a
              href="https://facebook.com/worldmusicpe"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-white hover:bg-neutral-50 text-neutral-900 font-bold rounded-xl transition-all text-sm shadow-sm"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com/worldmusicpe"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-white hover:bg-neutral-50 text-neutral-900 font-bold rounded-xl transition-all text-sm shadow-sm"
            >
              Instagram
            </a>
            <a
              href="https://tiktok.com/@worldmusicpe"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-white hover:bg-neutral-50 text-neutral-900 font-bold rounded-xl transition-all text-sm shadow-sm"
            >
              TikTok
            </a>
            <a
              href="https://youtube.com/worldmusicpe"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-white hover:bg-neutral-50 text-neutral-900 font-bold rounded-xl transition-all text-sm shadow-sm"
            >
              YouTube
            </a>
          </div>
        </div>
      </section>
      
      {/* Animaciones de entrada del lado del cliente (hidratación pasiva) */}
      <HomeClientAnimations />
    </div>
  );
}
