import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${outfit.variable} h-full antialiased`} style={{ scrollBehavior: 'smooth' }}>
      <head>
        {/* Script para prevenir parpadeo (flash) de tema antes de la hidratación */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'light';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="font-sans min-h-full flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors">
        <ThemeProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-grow pt-20">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
