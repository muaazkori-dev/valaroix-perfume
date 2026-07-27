'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles, Star, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const products = [
  {
    id: 'sauvage',
    name: 'Valaroix Sauvage Imperial',
    subtitle: 'Inspired by Sauvage • Royal Spicy Fresh',
    price10h: 185,
    price24h: 245,
    price: 185,
    rating: 4.98,
    reviewsCount: 312,
    color: '#d4af37', // Gold
    tag: 'Bestseller #1',
    description: 'An iconic raw freshness meets warm amber resins. Radiant Calabrian Bergamot laced with Sichuan Pepper and rare Ambroxan fixing.',
    topNotes: 'Calabrian Bergamot, Sichuan Pepper, Pink Grapefruit',
    heartNotes: 'Lavender, Star Anise, Nutmeg, Patchouli',
    baseNotes: 'Ambroxan, Aged Cedarwood, Vanilla Absolute',
    accentGrad: 'from-amber-500/20 to-yellow-600/10'
  },
  {
    id: 'cedrat-boise',
    name: 'Valaroix Cedrat Boise',
    subtitle: 'Inspired by Cedrat Boise • Woody Citrus & Leather',
    price10h: 195,
    price24h: 265,
    price: 195,
    rating: 4.95,
    reviewsCount: 248,
    color: '#e67e22', // Amber Orange
    tag: 'Collector Reserve',
    description: 'A vibrant blend of Sicilian Citrus, Blackcurrant, and Cold-pressed Spices resting on a luxurious bed of White Leather and Sandalwood.',
    topNotes: 'Sicilian Lemon, Blackcurrant, Bergamot, Spicy Notes',
    heartNotes: 'Fruity Accords, Water Jasmine, Patchouli Leaf',
    baseNotes: 'White Leather, Cedarwood, Oakmoss, Vanilla, Amber',
    accentGrad: 'from-orange-500/20 to-amber-700/10'
  },
  {
    id: 'ysl-y',
    name: 'Valaroix YSL Y Elixir',
    subtitle: 'Inspired by YSL Y • Modern Aromatic Amberwood',
    price10h: 210,
    price24h: 285,
    price: 210,
    rating: 4.97,
    reviewsCount: 194,
    color: '#06b6d4', // Royal Cyan/Sapphire
    tag: 'New Release',
    description: 'A bold, deep aromatic scent combining crisp White Ginger, Diva Lavender, and rich Amberwood for an unforgettable signature aura.',
    topNotes: 'White Ginger, Crisp Apple, Bergamot',
    heartNotes: 'Diva Lavender, Geranium Absolute, Clary Sage',
    baseNotes: 'Amberwood, Olibanum Incense, Tonka Bean',
    accentGrad: 'from-cyan-500/20 to-blue-700/10'
  }
];

export default function ProductCatalog() {
  const { addToCart } = useCart();

  return (
    <section id="catalog" className="py-24 relative overflow-hidden bg-black/95">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel-gold text-valaroix-gold text-xs uppercase tracking-widest font-bold">
            <Sparkles className="w-4 h-4" /> Three Flagship Masterpiece Fragrances
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Valaroix <span className="text-gold-gradient">Signature Editions</span>
          </h2>
          <p className="text-gray-400 font-light text-sm sm:text-base">
            Click on any fragrance to open its dedicated page with 10 Hours+ vs 24 Hours+ Lasting options and 50ml / 100ml bottle sizes.
          </p>
        </div>

        {/* 3 Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="glass-panel p-7 rounded-3xl border-valaroix-gold/25 hover:border-valaroix-gold flex flex-col justify-between group shadow-2xl relative"
            >
              {/* Tag Badge */}
              <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-valaroix-gold/20 border border-valaroix-gold/40 text-[10px] uppercase font-bold tracking-wider text-valaroix-gold">
                {product.tag}
              </div>

              <div>
                {/* Product Bottle Clickable Stage */}
                <Link href={`/product/${product.id}`} className="block group cursor-pointer">
                  <div className="w-full h-64 rounded-2xl bg-gradient-to-b from-valaroix-dark to-black flex items-center justify-center relative overflow-hidden mb-6 border border-valaroix-gold/20 group-hover:border-valaroix-gold transition-all duration-300">
                    <div
                      className={`absolute inset-0 bg-gradient-to-tr ${product.accentGrad} opacity-30 group-hover:opacity-60 transition-opacity duration-500 blur-xl`}
                    />
                    
                    {/* Bottle Icon Graphic */}
                    <div className="relative z-10 flex flex-col items-center gap-2 text-center group-hover:scale-105 transition-transform duration-300">
                      <div
                        className="w-24 h-36 rounded-xl border-2 flex flex-col items-center justify-between p-2.5 shadow-2xl bg-black/60 backdrop-blur-md"
                        style={{ borderColor: product.color }}
                      >
                        <div className="w-8 h-6 rounded-sm bg-valaroix-gold/90 border border-valaroix-gold shadow-md" />
                        <span className="font-serif text-[10px] tracking-[0.2em] text-valaroix-gold font-bold uppercase">
                          VALAROIX
                        </span>
                        <div
                          className="w-14 h-16 rounded-md opacity-85 shadow-inner"
                          style={{ backgroundColor: product.color }}
                        />
                      </div>
                      
                      <span className="text-[10px] uppercase font-mono text-valaroix-gold tracking-widest bg-black/80 px-3 py-1 rounded-full border border-valaroix-gold/30 mt-2">
                        Click For Options & Page ➔
                      </span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="space-y-1 mb-3">
                    <h3 className="font-serif text-2xl font-bold text-white group-hover:text-valaroix-gold transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-valaroix-gold/90 font-medium">
                      {product.subtitle}
                    </p>
                  </div>
                </Link>

                {/* Ratings */}
                <div className="flex items-center gap-2 mb-4 text-xs text-gray-400">
                  <div className="flex items-center text-valaroix-gold font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="ml-1">{product.rating}</span>
                  </div>
                  <span>({product.reviewsCount} VIP Reviews)</span>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-xs font-light leading-relaxed mb-6 line-clamp-3">
                  {product.description}
                </p>

                {/* Feature Highlights: Lasting Options Badge */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <Clock className="w-4 h-4 text-valaroix-gold" />
                    <span className="font-semibold text-gray-200">Available Lasting Editions:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-xl bg-valaroix-dark border border-valaroix-gold/20 text-center text-gray-300 font-medium">
                      ⚡ 10 Hours+ Lasting
                    </div>
                    <div className="p-2 rounded-xl bg-valaroix-gold/15 border border-valaroix-gold text-center text-valaroix-gold font-bold">
                      🔥 24 Hours+ Lasting
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer: Price & Link to Product Page */}
              <div className="pt-4 border-t border-valaroix-gold/20 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] text-gray-400 uppercase">Starting From</span>
                  <span className="font-serif text-2xl font-bold text-gold-gradient">
                    ${product.price}
                  </span>
                </div>

                <Link
                  href={`/product/${product.id}`}
                  className="btn-gold px-5 py-3 rounded-full flex items-center gap-2 text-xs uppercase tracking-wider font-bold shadow-lg"
                >
                  View Options <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
