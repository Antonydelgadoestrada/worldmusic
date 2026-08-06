'use client';

import React, { useState, useTransition } from 'react';
import { updateConfigAction } from '@/app/admin/actions';
import { Save, Phone, MapPin, Info, BookOpen, ShieldCheck, Loader2 } from 'lucide-react';

interface ConfigType {
  whatsappNumber: string;
  whatsappMessage: string | null;
  address: string;
  googleMapsUrl: string;
  facebookUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  youtubeUrl: string | null;
  aboutHistory: string | null;
  aboutMission: string | null;
  aboutVision: string | null;
  aboutValues: string | null;
  academyInfo: string | null;
  policyGarantias: string | null;
  policyCambios: string | null;
  policyDevoluciones: string | null;
  policyHorarios: string | null;
  policyContacto: string | null;
}

export default function ConfiguracionForm({ config }: { config: ConfigType }) {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<'contacto' | 'nosotros' | 'academia' | 'politicas'>('contacto');
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  // Estados locales para los campos
  const [formData, setFormData] = useState({
    whatsappNumber: config.whatsappNumber,
    whatsappMessage: config.whatsappMessage || '',
    address: config.address,
    googleMapsUrl: config.googleMapsUrl,
    facebookUrl: config.facebookUrl || '',
    instagramUrl: config.instagramUrl || '',
    tiktokUrl: config.tiktokUrl || '',
    youtubeUrl: config.youtubeUrl || '',
    aboutHistory: config.aboutHistory || '',
    aboutMission: config.aboutMission || '',
    aboutVision: config.aboutVision || '',
    aboutValues: config.aboutValues || '',
    academyInfo: config.academyInfo || '',
    policyGarantias: config.policyGarantias || '',
    policyCambios: config.policyCambios || '',
    policyDevoluciones: config.policyDevoluciones || '',
    policyHorarios: config.policyHorarios || '',
    policyContacto: config.policyContacto || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    startTransition(async () => {
      const res = await updateConfigAction(formData);
      if (res.success) {
        setStatus({ success: true, message: '¡Configuración guardada y publicada con éxito!' });
      } else {
        setStatus({ success: false, message: res.error || 'Ocurrió un error al guardar.' });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Botón de Guardado Flotante o Destacado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-neutral-900 p-4 border border-neutral-100 dark:border-neutral-800 rounded-2xl shadow-sm">
        <span className="text-xs font-semibold text-neutral-450">
          Asegúrate de guardar los cambios antes de salir de la pestaña.
        </span>
        <button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white dark:text-neutral-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>Guardar Cambios</span>
        </button>
      </div>

      {status && (
        <div
          className={`p-4 rounded-xl text-xs font-bold border ${
            status.success
              ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-250 text-emerald-650 dark:text-emerald-400'
              : 'bg-red-50 dark:bg-red-950/20 border-red-250 text-red-650 dark:text-red-400'
          }`}
        >
          {status.message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto gap-2 pb-px">
        {[
          { id: 'contacto', name: 'Contacto y WhatsApp', icon: Phone },
          { id: 'nosotros', name: 'Nosotros / Identidad', icon: Info },
          { id: 'academia', name: 'Academia', icon: BookOpen },
          { id: 'politicas', name: 'Políticas', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs sm:text-sm uppercase tracking-wider shrink-0 transition-colors whitespace-nowrap ${
                isActive
                  ? 'border-emerald-650 text-emerald-650 dark:border-emerald-450 dark:text-emerald-450'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Contenido de Tabs */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-850 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
        
        {/* TAB 1: CONTACTO Y REDES */}
        {activeTab === 'contacto' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-550 dark:text-neutral-400 uppercase tracking-wider">Número de WhatsApp</label>
              <input
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                required
                placeholder="51989947606"
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-emerald-600 outline-none rounded-xl text-sm transition-colors"
              />
              <p className="text-[10px] text-neutral-400">Ingresar en código de país y sin símbolos ni espacios (ej. 51989947606 para Perú).</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-550 dark:text-neutral-400 uppercase tracking-wider">Dirección Física</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Av. Larco 123, Miraflores, Lima, Perú"
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-emerald-600 outline-none rounded-xl text-sm transition-colors"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-bold text-neutral-550 dark:text-neutral-400 uppercase tracking-wider">Enlace del Iframe de Google Maps</label>
              <textarea
                name="googleMapsUrl"
                value={formData.googleMapsUrl}
                onChange={handleChange}
                required
                rows={2}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-emerald-600 outline-none rounded-xl text-sm transition-colors"
              />
              <p className="text-[10px] text-neutral-400">Pegar únicamente el atributo &ldquo;src&rdquo; de la etiqueta iframe provista por Google Maps al presionar Compartir &gt; Insertar Mapa.</p>
            </div>

            {/* Enlaces de Redes Sociales */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-550 dark:text-neutral-400 uppercase tracking-wider">Facebook URL</label>
              <input
                name="facebookUrl"
                value={formData.facebookUrl}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-emerald-600 outline-none rounded-xl text-sm transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-550 dark:text-neutral-400 uppercase tracking-wider">Instagram URL</label>
              <input
                name="instagramUrl"
                value={formData.instagramUrl}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-emerald-600 outline-none rounded-xl text-sm transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-550 dark:text-neutral-400 uppercase tracking-wider">TikTok URL</label>
              <input
                name="tiktokUrl"
                value={formData.tiktokUrl}
                onChange={handleChange}
                placeholder="https://tiktok.com/@..."
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-emerald-600 outline-none rounded-xl text-sm transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-550 dark:text-neutral-400 uppercase tracking-wider">YouTube URL</label>
              <input
                name="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={handleChange}
                placeholder="https://youtube.com/..."
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-emerald-600 outline-none rounded-xl text-sm transition-colors"
              />
            </div>
          </div>
        )}

        {/* TAB 2: NOSOTROS / IDENTIDAD */}
        {activeTab === 'nosotros' && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-550 dark:text-neutral-400 uppercase tracking-wider">Nuestra Historia</label>
              <textarea
                name="aboutHistory"
                value={formData.aboutHistory}
                onChange={handleChange}
                rows={4}
                placeholder="Resumen histórico de la empresa..."
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-emerald-600 outline-none rounded-xl text-sm transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-550 dark:text-neutral-400 uppercase tracking-wider">Misión</label>
                <textarea
                  name="aboutMission"
                  value={formData.aboutMission}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Misión corporativa..."
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-emerald-600 outline-none rounded-xl text-sm transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-550 dark:text-neutral-400 uppercase tracking-wider">Visión</label>
                <textarea
                  name="aboutVision"
                  value={formData.aboutVision}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Visión corporativa..."
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-emerald-600 outline-none rounded-xl text-sm transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-550 dark:text-neutral-400 uppercase tracking-wider">Valores de la empresa</label>
              <input
                name="aboutValues"
                value={formData.aboutValues}
                onChange={handleChange}
                placeholder="Pasión, Excelencia, Compromiso, Confianza, Calidad"
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-emerald-600 outline-none rounded-xl text-sm transition-colors"
              />
              <p className="text-[10px] text-neutral-400">Ingresar los valores separados por comas para que se rendericen como etiquetas individuales.</p>
            </div>
          </div>
        )}

        {/* TAB 3: ACADEMIA */}
        {activeTab === 'academia' && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-550 dark:text-neutral-400 uppercase tracking-wider">Información de la Academia</label>
              <textarea
                name="academyInfo"
                value={formData.academyInfo}
                onChange={handleChange}
                rows={4}
                placeholder="Describe horarios, precios especiales, metodologías de las clases..."
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-emerald-600 outline-none rounded-xl text-sm transition-colors"
              />
            </div>
          </div>
        )}

        {/* TAB 4: POLÍTICAS DE LA TIENDA */}
        {activeTab === 'politicas' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-550 dark:text-neutral-400 uppercase tracking-wider">Garantías</label>
                <textarea
                  name="policyGarantias"
                  value={formData.policyGarantias}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Detalles sobre las garantías de productos..."
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-emerald-600 outline-none rounded-xl text-sm transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-550 dark:text-neutral-400 uppercase tracking-wider">Cambios</label>
                <textarea
                  name="policyCambios"
                  value={formData.policyCambios}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Términos para cambios de mercadería..."
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-emerald-600 outline-none rounded-xl text-sm transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-550 dark:text-neutral-400 uppercase tracking-wider">Devoluciones</label>
                <textarea
                  name="policyDevoluciones"
                  value={formData.policyDevoluciones}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Condiciones de reembolsos o créditos..."
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-emerald-600 outline-none rounded-xl text-sm transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-550 dark:text-neutral-400 uppercase tracking-wider">Horarios comerciales</label>
                <textarea
                  name="policyHorarios"
                  value={formData.policyHorarios}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Lunes a Viernes de..."
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-emerald-600 outline-none rounded-xl text-sm transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-550 dark:text-neutral-400 uppercase tracking-wider">Contacto Detallado (Pie de Página)</label>
              <input
                name="policyContacto"
                value={formData.policyContacto}
                onChange={handleChange}
                placeholder="Teléfono: ... | Celular/WhatsApp: ... | Email: ..."
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-emerald-600 outline-none rounded-xl text-sm transition-colors"
              />
            </div>
          </div>
        )}

      </div>
    </form>
  );
}
