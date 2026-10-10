'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, ShieldCheck, Award, Clock, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';

export const products = [
  {
    id: 'valaroix-noir-x',
    name: 'VALAROIX NOIR X',
    subtitle: 'Inspired by Dior Sauvage • 40% Pure Oil • Free Delivery',
    description: 'An intoxicating and magnetic blend of Calabrian Bergamot, spicy Sichuan Pepper, and French Lavender settling into rich Ambroxan and woody amber. Crafted with 40% pure fragrance oil.',
    startingPrice: { pkr: 2999, usd: 11 },
    image: '/products/noir-x.jpg',
    color: '#1e3a8a',
    isSoldOut: false,
    freeDelivery: true,
    oilConcentration: '40% Pure Oil',
    topNotes: 'Calabrian Bergamot, Sichuan Pepper, Reggio Citrus',
    heartNotes: 'Star Anise, Nutmeg, French Lavender, Geranium',
    baseNotes: 'Ambroxan, Warm Vanilla, Cedarwood, Amber',
    pricing: {
      '50ml': {
        '10h': { pkr: 2999, usd: 11, soldOut: false },
        '24h': { pkr: 3999, usd: 15, soldOut: true }
      }
    }
  },
  {
    id: 'valaroix-vertex',
    name: 'VALAROIX VERTEX',
    subtitle: 'Inspired by YSL Y EDP • 40% Pure Oil • Free Delivery',
    description: 'An electrifying and aristocratic signature blend of crisp green apple, zesty ginger, and aromatic sage resting upon dark tonka bean and smoky amberwood. Crafted with 40% pure fragrance oil.',
    startingPrice: { pkr: 3499, usd: 13 },
    image: '/products/vertex.jpg',
    color: '#1e3a8a',
    isSoldOut: false,
    freeDelivery: true,
    oilConcentration: '40% Pure Oil',
    topNotes: 'Crisp Green Apple, Fresh Ginger, Calabrian Bergamot',
    heartNotes: 'Aromatic Sage, Juniper Berries, Bourbon Geranium',
    baseNotes: 'Amber Wood, Tonka Bean, Cedarwood, Olibanum, Vetiver',
    pricing: {
      '50ml': {
        '10h': { pkr: 3499, usd: 13, soldOut: false },
        '24h': { pkr: 4499, usd: 16, soldOut: true }
      }
    }
  },
  {
    id: 'valaroix-classic-noir',
    name: 'VALAROIX SAUVAGE (CLASSIC)',
    subtitle: 'Royal Black & Gold Edition • 30% Pure Oil • Free Delivery',
    description: 'The iconic Valaroix Black & Gold flagship bottle. Calabrian Bergamot, nutmeg, and warm amber wood with 30% pure perfume oil concentration.',
    startingPrice: { pkr: 2499, usd: 9 },
    image: '/products/sauvage.jpg?v=2',
    color: '#d4af37',
    isSoldOut: false,
    freeDelivery: true,
    oilConcentration: '30% Pure Oil',
    topNotes: 'Calabrian Bergamot, Cinnamon, Nutmeg',
    heartNotes: 'Lavender, Damask Rose, Cardamom',
    baseNotes: 'Amber Wood, Sandalwood, Haitian Vetiver',
    pricing: {
      '50ml': {
        '10h': { pkr: 2499, usd: 9, soldOut: false },
        '24h': { pkr: 3499, usd: 13, soldOut: true }
      }
    }
  }
];

export default function ProductCatalog() {
  const { addToCart, setIsCheckoutOpen } = useCart();
  const { formatPrice } = useCurrency();

  const handleQuickAdd = (product) => {
    if (product.isSoldOut) return;
    addToCart(product, '50ml', 'None', '10h');
  };

  const handleBuyNow = (product) => {
    if (product.isSoldOut) return;
    addToCart(product, '50ml', 'None', '10h');
  };

  return (
    <div>
      {/* 1. LUXURY OBSIDIAN VELVET SECTION WITH DUAL GOLD & BLUE AURA */}
      <section id="shop" className="py-16 sm:py-24 bg-[#0A0A0D] text-white relative overflow-hidden border-t border-[#D4AF37]/20">
        
        {/* Atmospheric Ambient Lighting Gradients */}
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
              HAUTE PARFUMERIE COLLECTION
            </span>
            <h2 className="font-serif-mockup text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              DISCOVER OUR FRAGRANCES
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-light max-w-lg mx-auto">
              40% & 30% Pure Extrait De Parfum • Masterfully Blended for Extreme Longevity • Free Nationwide Delivery
            </p>
          </div>

          {/* Product Cards Grid (3 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {products.map((product) => {
              const isBlueEdition = product.id.includes('noir-x') || product.id.includes('vertex');

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={`rounded-3xl p-5 border flex flex-col justify-between space-y-5 transition-all duration-500 group relative overflow-hidden backdrop-blur-md shadow-2xl hover:-translate-y-1.5 ${
                    isBlueEdition
                      ? 'bg-[#0E1118]/95 border-blue-500/25 hover:border-blue-400/60 hover:shadow-[0_0_40px_rgba(30,64,175,0.3)]'
                      : 'bg-[#13110E]/95 border-[#D4AF37]/30 hover:border-[#D4AF37]/70 hover:shadow-[0_0_40px_rgba(212,175,55,0.25)]'
                  } ${product.isSoldOut ? 'opacity-85' : ''}`}
                >
                  {/* Subtle Top Collection Tag */}
                  <div className="flex items-center justify-between gap-2 z-20">
                    {isBlueEdition ? (
                      <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-sky-300 bg-sky-950/80 border border-sky-500/40 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        🌊 Azure Edition • 40% Oil
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-[#D4AF37] bg-[#D4AF37]/15 border border-[#D4AF37]/40 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        👑 Royal Gold • 30% Oil
                      </span>
                    )}

                    {product.isSoldOut && (
                      <span className="bg-red-600 text-white text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-lg tracking-wider">
                        SOLD OUT
                      </span>
                    )}
                  </div>

                  <div className="space-y-4 text-center">
                    
                    {/* Bottle Image Showcase with Ambient Aura */}
                    <Link
                      href={`/product/${product.id}`}
                      className="block relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden bg-black/85 border border-white/5 p-3 group-hover:border-white/15 transition-all flex items-center justify-center"
                    >
                      {/* Dynamic Ambient Aura Behind Bottle */}
                      <div
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[65px] pointer-events-none transition-all duration-700 group-hover:scale-125 ${
                          isBlueEdition
                            ? 'bg-blue-600/35 group-hover:bg-blue-500/50'
                            : 'bg-[#D4AF37]/30 group-hover:bg-[#D4AF37]/45'
                        }`}
                      />

                      <img
                        src={product.image}
                        alt={product.name}
                        className="relative z-10 w-full h-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-700 drop-shadow-2xl"
                      />

                      {product.isSoldOut && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
                          <span className="bg-red-600 text-white text-xs font-bold uppercase px-4 py-1.5 rounded-full shadow-2xl tracking-widest">
                            SOLD OUT
                          </span>
                        </div>
                      )}
                    </Link>

                    {/* Title & Badges */}
                    <div className="space-y-1.5">
                      <Link
                        href={`/product/${product.id}`}
                        className="font-serif-mockup font-bold text-lg text-white tracking-wider hover:text-[#D4AF37] transition-colors block"
                      >
                        {product.name}
                      </Link>
                      
                      <p className="text-[11px] text-gray-400 font-sans leading-relaxed line-clamp-1">
                        {product.subtitle}
                      </p>
                      
                      {/* Free Delivery Pill */}
                      <div className="flex items-center justify-center gap-1.5 pt-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                          <Truck className="w-3 h-3 text-emerald-400" /> Free Nationwide Delivery
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="pt-1">
                      <span className="font-serif-mockup font-extrabold text-xl text-white tracking-wider">
                        {formatPrice(product.startingPrice)}
                      </span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        50ml Extrait De Parfum • {product.oilConcentration || '30% Pure Oil'}
                      </span>
                    </div>

                  </div>

                  {/* Direct Action Buttons */}
                  <div className="pt-2 border-t border-white/10">
                    {product.isSoldOut ? (
                      <button
                        disabled
                        className="w-full py-3.5 rounded-xl bg-gray-800 text-gray-500 text-xs font-bold uppercase tracking-wider cursor-not-allowed"
                      >
                        Currently Sold Out
                      </button>
                    ) : (
                      <button
                        onClick={() => handleQuickAdd(product)}
                        className="w-full py-3.5 rounded-xl btn-mockup-gold text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all active:scale-95 cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4 text-[#0D0D0D]" /> Add to Cart
                      </button>
                    )}
                  </div>

                </motion.div>
              );
            })}
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
