import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import prisma from '@/lib/prisma';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'World Music | Tienda de Instrumentos Musicales y Academia',
  description: 'Todo lo que necesitas para hacer música, en un solo lugar. Venta de instrumentos musicales y accesorios de alta calidad. Academia de música en Lima.',
  keywords: 'instrumentos musicales, guitarras, teclados, baterias, ukeleles, academia de musica, clases de musica, lima, miraflores, peru',
};

async function getFooterConfig() {
  try {
    const config = await prisma.configuracion.findUnique({
      where: { id: 'default' },
      select: {
        address: true,
        whatsappNumber: true,
        facebookUrl: true,
        instagramUrl: true,
        tiktokUrl: true,
        youtubeUrl: true,
        policyContacto: true,
        policyHorarios: true,
      },
    });
    return config;
  } catch (e) {
    console.warn('Error cargando config en RootLayout:', e);
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const footerConfig = await getFooterConfig();

  return (
    <html lang="es" className={`${outfit.variable} h-full antialiased`} style={{ scrollBehavior: 'smooth' }}>
      <body className="font-sans min-h-full flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors">
        <ThemeProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-grow pt-20">
              {children}
            </main>
            <Footer config={footerConfig} />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
