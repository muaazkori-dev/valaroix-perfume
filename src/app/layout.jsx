import './globals.css';
import { AnimationProvider } from '@/context/AnimationContext';
import { CartProvider } from '@/context/CartContext';
import { CurrencyProvider } from '@/context/CurrencyContext';

export const metadata = {
  title: "VALAROIX — L'Elixir De Distinction | Haute Parfumerie",
  description: "Experience ultra-luxury 3D perfume craftsmanship. Hand-faceted crystal glass bottles, Kashmiri Saffron, and pure aged Cambodian Oud.",
  keywords: ["Perfume", "Luxury Perfume", "3D Perfume Website", "Valaroix", "Haute Parfumerie", "Oud", "Grasse Rose"],
  icons: {
    icon: '/logo.jpg',
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="icon" href="/logo.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
      </head>
      <body className="bg-valaroix-dark text-gray-100 selection:bg-valaroix-gold selection:text-valaroix-dark">
        <CurrencyProvider>
          <AnimationProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AnimationProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
