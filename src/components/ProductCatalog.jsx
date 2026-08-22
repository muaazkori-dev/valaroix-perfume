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
    name: 'VALAROIX SAUVAGE IMPERIAL',
    subtitle: 'Inspired by Dior Sauvage • Spicy Bergamot & Wild Lavender',
    description: 'An intoxicating blend of Calabrian Bergamot, Nutmeg, and French Lavender layered over raw Amber Wood and Haitian Vetiver.',
    startingPrice: { pkr: 2699, usd: 10 },
    image: '/products/sauvage.jpg',
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
  },
  {
    id: 'valaroix-cedrat-boise-extreme',
    name: 'CEDRAT BOISE EXTREME',
    subtitle: 'Inspired by Mancera Cedrat Boise • Sicilian Citrus & Leather',
    description: 'Zesty Lemon of Sicily, Blackcurrant, and Cold Spiced Wood melting into a rich Leather and White Musk heart.',
    startingPrice: { pkr: 2999, usd: 11 },
    image: '/products/cedrat.jpg',
    color: '#e0a96d',
    isSoldOut: true,
    freeDelivery: true,
    oilConcentration: '30% Pure Oil',
    topNotes: 'Sicilian Lemon, Blackcurrant, Spicy Notes',
    heartNotes: 'Fruity Notes, Jasmine Leaf, Patchouli',
    baseNotes: 'Tuscan Leather, Cedarwood, Oakmoss, Vanilla',
    pricing: {
      '50ml': {
        '10h': { pkr: 2999, usd: 11, soldOut: true },
        '24h': { pkr: 3999, usd: 15, soldOut: true }
      }
    }
  },
  {
    id: 'valaroix-ysl-y',
    name: 'VALAROIX Y (YSL Y)',
    subtitle: 'Inspired by Yves Saint Laurent Y EDP • Crisp Apple & Amber Wood',
    description: 'Fresh crisp Apple, vibrant Ginger, and aromatic Sage resting upon rich Vetiver, Tonka Bean, and smoky Amberwood.',
    startingPrice: { pkr: 3300, usd: 12 },
    image: '/products/ysly.jpg',
    color: '#1e3a8a',
    isSoldOut: false,
    freeDelivery: true,
    oilConcentration: '30% Pure Oil',
    topNotes: 'Crisp Apple, Fresh Ginger, Bergamot',
    heartNotes: 'Sage, Juniper Berries, Geranium',
    baseNotes: 'Amberwood, Tonka Bean, Cedarwood, Vetiver',
    pricing: {
      '50ml': {
        '10h': { pkr: 3300, usd: 12, soldOut: false },
        '24h': { pkr: 4300, usd: 16, soldOut: true }
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
    setIsCheckoutOpen(true);
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
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  {product.isSoldOut ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl bg-gray-200 text-gray-500 text-xs font-bold uppercase tracking-wider cursor-not-allowed"
                    >
                      Currently Sold Out
                    </button>
                  ) : (
                    <>
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
                    </>
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
