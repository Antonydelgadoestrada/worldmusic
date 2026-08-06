import React from 'react';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const revalidate = 60; // Revalidar cada 60 segundos (ISR)

async function getWhatsappNumber() {
  try {
    const config = await prisma.configuracion.findUnique({
      where: { id: 'default' },
      select: { whatsappNumber: true },
    });
    return config?.whatsappNumber || '51989947606';
  } catch {
    return '51989947606';
  }
}

export default async function TerminosCondicionesPage() {
  const whatsappNumber = await getWhatsappNumber();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Botón de retorno */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Inicio</span>
        </Link>
      </div>

      {/* Encabezado */}
      <div className="border-b border-neutral-100 dark:border-neutral-900 pb-8 mb-10 space-y-4">
        <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl w-fit">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Términos y Condiciones de Uso
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-500">
          Última actualización: 06 de agosto de 2026
        </p>
      </div>

      {/* Contenido Legal */}
      <div className="prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed text-neutral-600 dark:text-neutral-450 font-light space-y-6">
        <p>
          Bienvenido(a) a <strong>World Music</strong>. Al acceder y utilizar este sitio web, aceptas los presentes Términos y Condiciones. Si no estás de acuerdo con alguno de ellos, te recomendamos no utilizar nuestros servicios.
        </p>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            1. Información General
          </h2>
          <p>
            Este sitio web tiene como finalidad la comercialización de instrumentos musicales, accesorios, equipos de audio y productos relacionados con la música a través de cotizaciones y pedidos digitales directos a nuestro canal de WhatsApp.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            2. Productos
          </h2>
          <p>
            Nos esforzamos por mostrar imágenes, características, descripciones y precios lo más precisos posible en nuestro catálogo virtual. Sin embargo:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Las fotografías son referenciales y pueden presentar ligeras variaciones respecto al producto físico.</li>
            <li>Los colores de los acabados de madera o pintura pueden variar según la pantalla del dispositivo.</li>
            <li>La disponibilidad de stock de marcas importadas puede cambiar sin previo aviso.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            3. Precios
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Todos los precios del catálogo están expresados en Soles (S/), salvo indicación distinta.</li>
            <li>Los precios incluyen los impuestos de ley (IGV) que correspondan según la legislación peruana.</li>
            <li>Nos reservamos el derecho de modificar precios en cualquier momento, sin afectar pedidos que ya hayan sido coordinados y confirmados previamente por WhatsApp.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            4. Compras y Pedidos
          </h2>
          <p>
            Al enviar un pedido de cotización desde nuestro carrito hacia WhatsApp, el cliente inicia un proceso de compra directa. Para completar la orden, el cliente deberá proporcionar información de entrega veraz y actualizada.
          </p>
          <p>
            Una compra se considera confirmada únicamente cuando el pago (mediante transferencia bancaria, Yape, Plin o depósito) haya sido validado por nuestro equipo comercial y el pedido sea aceptado formalmente.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            5. Medios de Pago
          </h2>
          <p>
            Aceptamos transferencias interbancarias directas, billeteras digitales y otros medios de pago coordinados al momento de confirmar el pedido por WhatsApp.
          </p>
          <p>
            En caso de detectarse operaciones sospechosas, comprobantes falsos o posibles fraudes de pago, podremos cancelar o suspender el pedido de inmediato para proteger tanto al cliente como a la seguridad del negocio.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            6. Envíos y Entregas
          </h2>
          <p>
            Realizamos envíos a nivel nacional en el Perú bajo la modalidad coordinada con el comprador.
          </p>
          <p>
            Los tiempos de entrega son estimados y pueden variar debido a:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>La ubicación geográfica del cliente (provincias, zonas alejadas).</li>
            <li>Retrasos imprevistos del operador logístico o courier seleccionado.</li>
            <li>Casos fortuitos, de fuerza mayor o eventos climáticos.</li>
          </ul>
          <p>
            Una vez entregado el paquete a la empresa de transporte (como Olva Courier, Shalom, entre otras), cualquier retraso o percance atribuible al traslado estará sujeto a las condiciones y términos de servicio de la empresa de transporte correspondiente.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            7. Cambios y Devoluciones
          </h2>
          <p>
            Se aceptarán cambios o devoluciones únicamente cuando:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>El instrumento o accesorio presente defectos o fallas evidentes de fabricación.</li>
            <li>Se haya enviado un modelo, color o producto diferente al solicitado en la confirmación del pedido.</li>
          </ul>
          <p>
            No se aceptarán devoluciones por:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Daños ocasionados por un mal uso, afinación excesiva o golpes al instrumento.</li>
            <li>Rotura de cuerdas, caídas del producto o manipulación incorrecta del alma del mástil.</li>
            <li>Desgaste natural del producto (como el acabado de los trastes o el puente).</li>
            <li>Instrumentos usados o que muestren señales claras de manipulación sin su empaque original.</li>
          </ul>
          <p>
            El cliente deberá comunicar cualquier inconveniente dentro del plazo establecido de 7 días calendario para proceder con la evaluación de cambio.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            8. Garantía de Instrumentos
          </h2>
          <p>
            Los productos nuevos cuentan con la garantía ofrecida por el fabricante (generalmente de 1 año contra defectos de fabricación) o el respaldo directo de nuestra tienda en accesorios según el tipo de artículo.
          </p>
          <p>
            La garantía no cubre daños ocasionados por:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Uso indebido o calibraciones caseras erróneas.</li>
            <li>Modificaciones o reparaciones electrónicas realizadas por talleres o terceros no autorizados.</li>
            <li>Accidentes de transporte de uso personal.</li>
            <li>Exposición directa a humedad extrema, luz solar directa, líquidos, o condiciones de almacenamiento inadecuadas que dañen la madera del instrumento.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            9. Responsabilidad
          </h2>
          <p>
            En <strong>World Music</strong> no nos hacemos responsables por:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Daños físicos derivados de un uso incorrecto de los amplificadores o accesorios electrónicos.</li>
            <li>Instalaciones de pastillas (pickups) o reparaciones realizadas por personal no autorizado.</li>
            <li>Pérdidas de negocio u oportunidades debidas a retrasos de entrega imputables a terceros.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            10. Propiedad Intelectual
          </h2>
          <p>
            Todo el contenido del sitio web, incluyendo fotografías del catálogo, logotipos, marca, diseños, textos y material gráfico, es propiedad de <strong>World Music</strong> o de sus proveedores afiliados y se encuentra debidamente protegido por la legislación vigente de propiedad intelectual.
          </p>
          <p>
            Queda estrictamente prohibida su reproducción total o parcial con fines lucrativos o comerciales sin autorización previa por escrito.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            11. Protección de Datos Personales
          </h2>
          <p>
            La información y datos de contacto proporcionados por los clientes en los formularios de cotización serán utilizados únicamente para:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Procesar los pedidos y formular la cotización a WhatsApp.</li>
            <li>Coordinar el despacho o el recojo del instrumento.</li>
            <li>Brindar atención de servicio post-venta y soporte.</li>
            <li>Enviar ofertas especiales y anuncios comerciales de la tienda o academia cuando el cliente haya dado su consentimiento explícito.</li>
          </ul>
          <p>
            Toda la información será tratada de manera estrictamente confidencial y conforme a la Ley N° 29733 (Ley de Protección de Datos Personales en el Perú).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            12. Modificaciones de los Términos
          </h2>
          <p>
            Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones serán publicadas de inmediato en este sitio web y entrarán en vigencia desde el momento de su publicación.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            13. Jurisdicción y Legislación Aplicable
          </h2>
          <p>
            Estos Términos y Condiciones se rigen por las leyes vigentes de la República del Perú. Cualquier controversia, reclamo o disputa legal relacionada con las transacciones o el uso de la plataforma será resuelta de mutuo acuerdo y, en su defecto, bajo la jurisdicción de los tribunales competentes de Lima, Perú.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            14. Canales de Contacto
          </h2>
          <p>
            Si tienes dudas o deseas realizar consultas sobre estos Términos y Condiciones de Uso, puedes comunicarte con nosotros directamente a través de nuestro celular de atención o enviando un mensaje directo a nuestro canal de WhatsApp:
          </p>
          <div className="pt-2">
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
            >
              <span>Contactar por WhatsApp</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
