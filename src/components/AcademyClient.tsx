'use client';

import React from 'react';
import { Music, Layers, Mic, Volume2, ShieldCheck, Compass, HelpCircle, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Course {
  name: string;
  description: string;
  iconName: string;
}

interface AcademyClientProps {
  courses: Course[];
  whatsappNumber: string;
}

export default function AcademyClient({ courses, whatsappNumber }: AcademyClientProps) {
  // Mapear los nombres de íconos estáticos a componentes Lucide
  const getIcon = (name: string) => {
    switch (name) {
      case 'guitar':
        return <Music className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'piano':
        return <Layers className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'canto':
        return <Mic className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'violin':
        return <Volume2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'drum':
        return <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'wind':
        return <Compass className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'bass':
        return <Music className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'ukulele':
        return <Music className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <HelpCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  const getWhatsappInquiryUrl = (courseName: string) => {
    const formattedMsg = encodeURIComponent(
      `Hola. Quisiera solicitar más información sobre las clases de "${courseName}" en su Academia de Música. Muchas gracias.`
    );
    return `https://wa.me/${whatsappNumber.replace(/\+/g, '').trim()}?text=${formattedMsg}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {courses.map((course, index) => (
        <motion.div
          key={course.name}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 hover:shadow-md dark:hover:shadow-neutral-950/20 transition-all flex flex-col justify-between group h-full"
        >
          <div className="space-y-4">
            <div className="p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800/80 rounded-xl w-fit group-hover:scale-105 transition-transform duration-300">
              {getIcon(course.iconName)}
            </div>
            <div className="space-y-2">
              <h4 className="font-extrabold text-neutral-900 dark:text-white text-base">
                Clases de {course.name}
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light line-clamp-3">
                {course.description}
              </p>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-neutral-50 dark:border-neutral-800/60">
            <a
              href={getWhatsappInquiryUrl(course.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-white dark:text-neutral-100 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Solicitar Información</span>
            </a>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
