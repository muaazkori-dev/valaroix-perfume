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
    subtitle: 'Extrait De Parfum • Crafted For Lasting Impressions',
    description: 'An intoxicating and magnetic blend of Calabrian Bergamot, spicy aromatic lavender, and deep smoky amber wood crafted for supreme projection.',
    startingPrice: { pkr: 2699, usd: 10 },
    image: '/products/noir-x.jpg',
    color: '#1e3a8a',
    isSoldOut: false,
    freeDelivery: true,
    oilConcentration: '30% Pure Oil',
    topNotes: 'Calabrian Bergamot, Spicy Pepper, Elemi',
    heartNotes: 'Lavender, Pink Pepper, Vetiver, Patchouli',
    baseNotes: 'Raw Amber Wood, Cedar, Ambroxan',
    pricing: {
      '50ml': {
        '10h': { pkr: 2699, usd: 10, soldOut: false },
        '24h': { pkr: 3699, usd: 14, soldOut: true }
      }
    }
  },
  {
    id: 'valaroix-vertex',
    name: 'VALAROIX VERTEX',
    subtitle: 'Extrait De Parfum • Crafted For Lasting Impressions',
    description: 'An electrifying signature scent engineered for supreme longevity, blending crisp citrus zest with rich aristocratic woods and seductive amber.',
    startingPrice: { pkr: 2699, usd: 10 },
    image: '/products/vertex.jpg',
    color: '#1e3a8a',
    isSoldOut: false,
    freeDelivery: true,
    oilConcentration: '30% Pure Oil',
    topNotes: 'Sicilian Citrus, Sparkling Grapefruit, Fresh Mint',
    heartNotes: 'Fresh Ginger, Nutmeg, Jasmine, Cardamom',
    baseNotes: 'Rich Incense, Vetiver, Cedarwood, Sandalwood',
    pricing: {
      '50ml': {
        '10h': { pkr: 2699, usd: 10, soldOut: false },
        '24h': { pkr: 3699, usd: 14, soldOut: true }
      }
    }
  },
  {
    id: 'valaroix-classic-noir',
    name: 'VALAROIX CLASSIC (BLACK & GOLD)',
    subtitle: 'Royal Black & Gold Edition • Spicy Bergamot & Wild Lavender',
    description: 'The iconic Valaroix Black & Gold flagship bottle. Warm oriental amber, French lavender, and rich tonka bean with lasting regal presence.',
    startingPrice: { pkr: 2699, usd: 10 },
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
        '10h': { pkr: 2699, usd: 10, soldOut: false },
        '24h': { pkr: 3699, usd: 14, soldOut: true }
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
      {/* 1. EXACT MOCKUP SOFT CREAM SECTION (#F7F4EE) FOR OUR COLLECTION */}
      <section id="shop" className="py-12 sm:py-20 bg-[#F7F4EE] text-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          {/* Section Header */}
          <div className="text-center space-y-2 max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
              OUR COLLECTION
            </span>
            <h2 className="font-serif-mockup text-2xl sm:text-4xl font-extrabold text-[#0D0D0D] tracking-tight">
              DISCOVER OUR BEST SELLERS
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              30% Pure Extrait De Parfum • Free Nationwide Delivery
            </p>
          </div>

          {/* Product Cards Grid (3 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className={`bg-white rounded-2xl p-5 border shadow-sm flex flex-col justify-between space-y-4 hover:shadow-xl transition-all group relative overflow-hidden ${
                  product.isSoldOut ? 'border-red-200/80 opacity-90' : 'border-black/5'
                }`}
              >
                {/* Sold Out Watermark / Badge if entire product is sold out */}
                {product.isSoldOut && (
                  <div className="absolute top-4 right-4 z-20 bg-red-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-lg tracking-wider">
                    SOLD OUT
                  </div>
                )}

                <div className="space-y-3 text-center">
                  
                  {/* Bottle Image (Full Uncropped Bottle) */}
                  <Link href={`/product/${product.id}`} className="block relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden bg-[#0D0D0D] border border-black/10 p-2 group-hover:border-[#D4AF37]/40 transition-all flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.isSoldOut && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-red-600 text-white text-xs font-bold uppercase px-4 py-1.5 rounded-full shadow-2xl tracking-widest">
                          SOLD OUT
                        </span>
                      </div>
                    )}
                  </Link>

                  {/* Title & Badges */}
                  <div>
                    <Link href={`/product/${product.id}`} className="font-serif-mockup font-bold text-base text-[#0D0D0D] tracking-wider hover:text-[#D4AF37] transition-colors block">
                      {product.name}
                    </Link>
                    <span className="block text-[10px] text-[#6B6B6B] uppercase tracking-widest mt-1 font-sans font-medium">
                      50ML • 30% OIL CONCENTRATION
                    </span>
                    
                    {/* Free Delivery Tag */}
                    <div className="flex items-center justify-center gap-1.5 mt-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        <Truck className="w-3 h-3 text-emerald-600" /> Free Delivery
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="pt-1">
                    <span className="font-bold text-base text-[#0D0D0D] tracking-wider">
                      {formatPrice(product.startingPrice)}
                    </span>
                    <span className="text-[10px] text-gray-500 block">10h: {formatPrice(product.pricing['50ml']['10h'])} | 24h: {formatPrice(product.pricing['50ml']['24h'])} <span className="text-red-500 font-bold">(Sold Out)</span></span>
                  </div>

                </div>

                {/* Direct Action Buttons */}
                <div className="pt-2 border-t border-gray-100">
                  {product.isSoldOut ? (
                    <button
                      disabled
                      className="w-full py-3 rounded-xl bg-gray-200 text-gray-500 text-xs font-bold uppercase tracking-wider cursor-not-allowed"
                    >
                      Currently Sold Out
                    </button>
                  ) : (
                    <button
                      onClick={() => handleQuickAdd(product)}
                      className="w-full py-3 rounded-xl btn-mockup-gold text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                    >
                      <ShoppingBag className="w-4 h-4" /> Add to Cart
                    </button>
                  )}
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
