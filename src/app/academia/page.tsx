import React from 'react';
import prisma from '@/lib/prisma';

export const revalidate = 60; // Revalidar cada 60 segundos (ISR)
import {
  BookOpen,
  Music,
  UserCheck,
  Award,
  Layers,
  Sparkles,
  Play,
  CheckCircle2,
  Mic,
  Smile,
  Compass
} from 'lucide-react';
import AcademyClient from '@/components/AcademyClient';

interface Course {
  name: string;
  description: string;
  iconName: string;
}

const COURSES: Course[] = [
  {
    name: 'Guitarra',
    description: 'Aprende técnicas clásicas, acústicas y eléctricas. Desde acordes básicos hasta solos complejos y teoría musical.',
    iconName: 'guitar',
  },
  {
    name: 'Piano / Teclado',
    description: 'Domina las teclas con lectura de partituras, teoría de armonía y técnicas de ejecución para música clásica y moderna.',
    iconName: 'piano',
  },
  {
    name: 'Canto / Técnica Vocal',
    description: 'Desarrolla tu voz de forma segura con técnicas de respiración, afinación, proyección escénica y control de vibrato.',
    iconName: 'canto',
  },
  {
    name: 'Violín',
    description: 'Ejecución técnica y postura correcta. Desarrolla oído absoluto y domina repertorios clásicos y folclóricos.',
    iconName: 'violin',
  },
  {
    name: 'Percusión / Batería',
    description: 'Domina el tempo y la rítmica. Clases prácticas en sets profesionales abarcando rock, jazz, ritmos latinos y más.',
    iconName: 'drum',
  },
  {
    name: 'Instrumentos de viento',
    description: 'Estudia flauta, saxofón o trompeta. Enfoque en embocadura, control de flujo de aire y lectura melódica.',
    iconName: 'wind',
  },
  {
    name: 'Bajo Eléctrico',
    description: 'El alma rítmica del grupo. Aprende escalas, técnicas de slap, improvisación y cómo acoplarte con la batería.',
    iconName: 'bass',
  },
  {
    name: 'Ukelele',
    description: 'Divertido, práctico e ideal para todas las edades. Aprende rasgueos, acordes y tus canciones favoritas en tiempo récord.',
    iconName: 'ukulele',
  },
];

async function getAcademyData() {
  try {
    const config = await prisma.configuracion.findUnique({
      where: { id: 'default' },
      select: { whatsappNumber: true, academyInfo: true },
    });
    return {
      whatsappNumber: config?.whatsappNumber || '51989947606',
      academyInfo: config?.academyInfo || 'Inscripción: S/30 | Mensualidad: S/150. Clases personalizadas de 1 hora.',
    };
  } catch {
    return {
      whatsappNumber: '51989947606',
      academyInfo: 'Inscripción: S/30 | Mensualidad: S/150. Clases personalizadas de 1 hora.',
    };
  }
}

export default async function AcademyPage() {
  const { whatsappNumber, academyInfo } = await getAcademyData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Cabecera Principal */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-widest">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Formación Musical Premium</span>
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Academia de Música <span className="text-emerald-600 dark:text-emerald-400">World Music</span>
        </h1>
        <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 font-light leading-relaxed max-w-2xl mx-auto">
          Encuentra tu ritmo, desarrolla tu talento e intégrate al maravilloso mundo del arte. Contamos con profesores altamente calificados, ambientes equipados y metodologías para todas las edades.
        </p>
      </div>

      {/* Tarjeta de Precios Destacada */}
      <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-900 rounded-3xl p-6 sm:p-8 mb-16 flex flex-col md:flex-row justify-between items-center gap-8 shadow-sm">
        <div className="space-y-3 text-center md:text-left">
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white">
            Precios y Matrícula Abierta
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-light max-w-lg leading-relaxed">
            {academyInfo} Nuestras tarifas son altamente accesibles, estructuradas para ofrecerte la mejor relación calidad-precio y facilidades de pago mensual sin contratos forzosos.
          </p>
        </div>
        <div className="flex gap-4 sm:gap-6 shrink-0 w-full sm:w-auto justify-center">
          <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 text-center w-28 sm:w-32 shadow-sm">
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block mb-1">Matrícula</span>
            <span className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">S/30</span>
            <span className="text-[8px] text-neutral-400 block mt-1">Pago único anual</span>
          </div>
          <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 text-center w-28 sm:w-32 shadow-sm">
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block mb-1">Mensualidad</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">S/150</span>
            <span className="text-[8px] text-neutral-400 block mt-1">4 clases al mes</span>
          </div>
        </div>
      </div>

      {/* Lista de Cursos (Interactivo) */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-900 pb-3 flex items-center gap-2">
          <Music className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Elige el instrumento que deseas aprender
        </h3>
        
        {/* Componente cliente para renderizar y animar las tarjetas de cursos */}
        <AcademyClient courses={COURSES} whatsappNumber={whatsappNumber} />
      </div>

      {/* Características / Por qué elegirnos */}
      <div className="mt-24 pt-16 border-t border-neutral-100 dark:border-neutral-900 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit">
            <UserCheck className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-neutral-900 dark:text-white text-base">Profesores calificados</h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
            Nuestros instructores son egresados del Conservatorio Nacional o músicos profesionales activos con amplia experiencia pedagógica con niños, jóvenes y adultos.
          </p>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit">
            <Award className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-neutral-900 dark:text-white text-base">Método Personalizado</h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
            Avanza a tu propio ritmo. El plan de estudio se adapta a tus gustos musicales (clásico, popular, rock, jazz) y tus metas personales.
          </p>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit">
            <Layers className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-neutral-900 dark:text-white text-base">Clases 100% Prácticas</h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
            Desde la primera sesión estarás tocando tu instrumento favorito. Complementamos la práctica con teoría y audiciones anuales.
          </p>
        </div>
      </div>
    </div>
  );
}
