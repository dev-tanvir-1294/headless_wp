import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/components/CartProvider';
import { AuthProvider } from '@/components/AuthProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getCategories } from '@/lib/woocommerce';
import type { WCCategory } from '@/lib/types';

export const metadata: Metadata = {
  title: {
    default: 'StichyX Store — Selling emotion not just product',
    template: '%s | StichyX Store',
  },
  description: 'StichyX Store — a headless WooCommerce storefront.',
};

async function getNavCategories(): Promise<WCCategory[]> {
  try {
    return await getCategories();
  } catch {
    return [];
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getNavCategories();

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <AuthProvider>
          <CartProvider>
            <Header categories={categories} />
            <main className="flex-1">{children}</main>
            <Footer categories={categories} />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
