import './globals.css';
import { AnimationProvider } from '@/context/AnimationContext';
import { CartProvider } from '@/context/CartContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { AuthProvider } from '@/context/AuthContext';
import FloatingCartButton from '@/components/FloatingCartButton';

export const metadata = {
  metadataBase: new URL('https://valaroix.com'),
  title: {
    default: "VALAROIX — L'Elixir De Distinction | Luxury 3D Perfume Boutique",
    template: "%s | VALAROIX Parfums"
  },
  description: "Official VALAROIX Haute Parfumerie online boutique. Hand-crafted 3D luxury perfumes, Kashmiri Saffron, Damask Rose, and aged Royal Ambergris. Available in 10 Hours+ & 24 Hours+ Lasting Extrait De Parfum.",
  keywords: ["Valaroix", "Valaroix Perfume", "Valaroix Parfums", "Luxury Perfume Pakistan", "Dior Sauvage Impression", "Cedrat Boise Impression", "YSL Y Impression", "3D Perfume Store"],
  authors: [{ name: "VALAROIX Haute Parfumerie" }],
  creator: "VALAROIX",
  publisher: "VALAROIX",
  verification: {
    google: "bJs1cHNE0x9NprAc-KuKJkcZu2BJGe8MAtIrZDAY8kY",
  },
  openGraph: {
    title: "VALAROIX — L'Elixir De Distinction",
    description: "Official VALAROIX Haute Parfumerie 3D Luxury Perfume Store",
    url: 'https://valaroix.com',
    siteName: 'VALAROIX',
    images: [
      {
        url: '/logo.jpg',
        width: 800,
        height: 800,
        alt: 'VALAROIX Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/logo.jpg',
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  }
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name: 'VALAROIX Haute Parfumerie',
    url: 'https://valaroix.com',
    logo: 'https://valaroix.com/logo.jpg',
    description: 'Ultra-luxury 3D perfume boutique featuring 10 Hours+ and 24 Hours+ lasting extrait de parfum.',
    brand: {
      '@type': 'Brand',
      name: 'VALAROIX'
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'PKR',
      lowPrice: '2499',
      highPrice: '6499',
      offerCount: '3'
    }
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <meta name="google-site-verification" content="bJs1cHNE0x9NprAc-KuKJkcZu2BJGe8MAtIrZDAY8kY" />
        <link rel="icon" href="/logo.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-valaroix-dark text-gray-100 selection:bg-valaroix-gold selection:text-valaroix-dark">
        <CurrencyProvider>
          <AuthProvider>
            <AnimationProvider>
              <CartProvider>
                {children}
                <FloatingCartButton />
              </CartProvider>
            </AnimationProvider>
          </AuthProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
