'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, ShieldCheck, Award, Clock, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';

export const products = [
  {
    id: 'valaroix-sauvage-imperial',
    name: 'OUD NOIR (SAUVAGE IMPERIAL)',
    subtitle: 'Inspired by Sauvage Elixir • Spicy Bergamot & Wild Lavender',
    description: 'An intoxicating blend of Calabrian Bergamot, Nutmeg, and French Lavender layered over raw Amber Wood and Haitian Vetiver.',
    startingPrice: { pkr: 2499, usd: 9 },
    image: '/products/sauvage.jpg',
    color: '#d4af37',
    topNotes: 'Calabrian Bergamot, Cinnamon, Nutmeg',
    heartNotes: 'Lavender, Damask Rose, Cardamom',
    baseNotes: 'Amber Wood, Sandalwood, Haitian Vetiver',
    pricing: {
      '50ml': {
        '10h': { pkr: 2499, usd: 9 },
        '24h': { pkr: 3499, usd: 13 }
      }
    }
  },
  {
    id: 'valaroix-cedrat-boise-extreme',
    name: 'CEDRAT BOISE EXTREME',
    subtitle: 'Inspired by Mancera Cedrat Boise • Sicilian Citrus & Leather',
    description: 'Zesty Lemon of Sicily, Blackcurrant, and Cold Spiced Wood melting into a rich Leather and White Musk heart.',
    startingPrice: { pkr: 2499, usd: 9 },
    image: '/products/cedrat.jpg',
    color: '#e0a96d',
    topNotes: 'Sicilian Lemon, Blackcurrant, Spicy Notes',
    heartNotes: 'Fruity Notes, Jasmine Leaf, Patchouli',
    baseNotes: 'Tuscan Leather, Cedarwood, Oakmoss, Vanilla',
    pricing: {
      '50ml': {
        '10h': { pkr: 2499, usd: 9 },
        '24h': { pkr: 3499, usd: 13 }
      }
    }
  },
  {
    id: 'valaroix-aventu-royal',
    name: 'BLEU INTENSE (AVENTU ROYAL)',
    subtitle: 'Inspired by Creed Aventus • Smoky Pineapple & Birch Wood',
    description: 'Sensational French Pineapple and Italian Bergamot infused with Birch Wood smoke and Spanish Oakmoss.',
    startingPrice: { pkr: 2499, usd: 9 },
    image: '/products/aventu.jpg',
    color: '#d4af37',
    topNotes: 'French Pineapple, Bergamot, Blackcurrant',
    heartNotes: 'Dry Birch, Moroccan Jasmine, Patchouli',
    baseNotes: 'Musk, Oakmoss, Ambergris, Vanilla',
    pricing: {
      '50ml': {
        '10h': { pkr: 2499, usd: 9 },
        '24h': { pkr: 3499, usd: 13 }
      }
    }
  },
  {
    id: 'valaroix-baccarat-amber-540',
    name: 'AMBRE ROYAL (BACCARAT 540)',
    subtitle: 'Inspired by Baccarat Rouge 540 • Saffron & Cotton Candy Amber',
    description: 'Luminous Saffron and Egyptian Jasmine woven over Amberwood crystals and fresh Fir Resin.',
    startingPrice: { pkr: 2499, usd: 9 },
    image: '/products/baccarat.jpg',
    color: '#e2e8f0',
    topNotes: 'Grandiflorum Jasmine, Kashmiri Saffron',
    heartNotes: 'Amberwood, Ambergris Accord',
    baseNotes: 'Fir Resin, Cedarwood',
    pricing: {
      '50ml': {
        '10h': { pkr: 2499, usd: 9 },
        '24h': { pkr: 3499, usd: 13 }
      }
    }
  }
];

export default function ProductCatalog() {
  const { addToCart, setIsCheckoutOpen } = useCart();
  const { formatPrice } = useCurrency();

  const handleQuickAdd = (product) => {
    addToCart(product, '50ml', 'None', '10h');
  };

  const handleBuyNow = (product) => {
    addToCart(product, '50ml', 'None', '10h');
    setIsCheckoutOpen(true);
  };

  return (
    <div>
      {/* 1. EXACT MOCKUP SOFT CREAM SECTION (#F7F4EE) FOR OUR COLLECTION */}
      <section id="shop" className="py-20 bg-[#F7F4EE] text-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          {/* Section Header */}
          <div className="text-center space-y-2 max-w-2xl mx-auto mb-14">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
              OUR COLLECTION
            </span>
            <h2 className="font-serif-mockup text-3xl sm:text-4xl font-extrabold text-[#0D0D0D] tracking-tight">
              DISCOVER OUR BEST SELLERS
            </h2>
          </div>

          {/* Product Cards Grid on Soft Cream Background */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-xl transition-all group"
              >
                <div className="space-y-3 text-center">
                  
                  {/* Bottle Image */}
                  <Link href={`/product/${product.id}`} className="block relative w-full h-56 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Title */}
                  <div>
                    <Link href={`/product/${product.id}`} className="font-serif-mockup font-bold text-base text-[#0D0D0D] tracking-wider hover:text-[#D4AF37] transition-colors block">
                      {product.name}
                    </Link>
                    <span className="block text-[10px] text-[#6B6B6B] uppercase tracking-widest mt-1 font-sans font-medium">
                      50ML EXTRAIT DE PARFUM
                    </span>
                  </div>

                  {/* Price */}
                  <div className="pt-1">
                    <span className="font-bold text-sm text-[#0D0D0D] tracking-wider">
                      {formatPrice(product.startingPrice)}
                    </span>
                  </div>

                </div>

                {/* 2 Clean Direct Action Buttons: Buy Now & Add to Cart */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleBuyNow(product)}
                    className="w-full py-2.5 rounded-xl btn-mockup-gold text-xs font-bold uppercase tracking-wider shadow-md"
                  >
                    Buy Now
                  </button>

                  <button
                    onClick={() => handleQuickAdd(product)}
                    className="w-full py-2.5 rounded-xl btn-mockup-outline text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                  </button>
                </div>

              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 2. EXACT MOCKUP TRUST BADGES SECTION (#0D0D0D RICH BLACK) */}
      <section className="py-16 bg-[#0D0D0D] border-t border-b border-[#D4AF37]/20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          
          <div className="space-y-2 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] mb-1">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-serif-mockup font-bold text-xs uppercase tracking-wider text-white">PREMIUM QUALITY</h4>
            <p className="text-[11px] text-[#6B6B6B] max-w-[180px]">Finest ingredients from around the world</p>
          </div>

          <div className="space-y-2 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] mb-1">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="font-serif-mockup font-bold text-xs uppercase tracking-wider text-white">LONG LASTING</h4>
            <p className="text-[11px] text-[#6B6B6B] max-w-[180px]">Fragrances that stay with you all day</p>
          </div>

          <div className="space-y-2 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] mb-1">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-serif-mockup font-bold text-xs uppercase tracking-wider text-white">FAST DELIVERY</h4>
            <p className="text-[11px] text-[#6B6B6B] max-w-[180px]">Quick & secure delivery across Pakistan</p>
          </div>

          <div className="space-y-2 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] mb-1">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h4 className="font-serif-mockup font-bold text-xs uppercase tracking-wider text-white">EASY RETURNS</h4>
            <p className="text-[11px] text-[#6B6B6B] max-w-[180px]">Hassle free returns within 7 days</p>
          </div>

        </div>
      </section>
    </div>
  );
}
