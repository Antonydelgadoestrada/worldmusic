import React from 'react';
import prisma from '@/lib/prisma';
import ConfiguracionForm from '@/components/ConfiguracionForm';

const DEFAULT_CONFIG = {
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
};

async function getConfig() {
  try {
    const config = await prisma.configuracion.findUnique({
      where: { id: 'default' },
    });
    return config || DEFAULT_CONFIG;
  } catch (e) {
    console.warn('Error al leer configuraciones de la BD, usando fallback:', e);
    return DEFAULT_CONFIG;
  }
}

export default async function AdminConfigPage() {
  const config = await getConfig();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Configuración General
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 font-light">
          Administra la información de la web, ubicación, academia y políticas sin tocar código.
        </p>
      </div>

      <ConfiguracionForm config={config} />
    </div>
  );
}
