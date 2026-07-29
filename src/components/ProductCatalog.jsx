'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ShoppingBag, Eye, Star, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';

export const products = [
  {
    id: 'valaroix-sauvage-imperial',
    name: 'Valaroix Sauvage Imperial',
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
      },
      '100ml': {
        '10h': { pkr: 4499, usd: 16 },
        '24h': { pkr: 6499, usd: 23 }
      }
    }
  },
  {
    id: 'valaroix-cedrat-boise-extreme',
    name: 'Valaroix Cedrat Boise Extreme',
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
      },
      '100ml': {
        '10h': { pkr: 4499, usd: 16 },
        '24h': { pkr: 6499, usd: 23 }
      }
    }
  },
  {
    id: 'valaroix-aventu-royal',
    name: 'Valaroix Aventu Royal',
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
      },
      '100ml': {
        '10h': { pkr: 4499, usd: 16 },
        '24h': { pkr: 6499, usd: 23 }
      }
    }
  },
  {
    id: 'valaroix-baccarat-amber-540',
    name: 'Valaroix Baccarat Amber 540',
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
      },
      '100ml': {
        '10h': { pkr: 4499, usd: 16 },
        '24h': { pkr: 6499, usd: 23 }
      }
    }
  }
];

export default function ProductCatalog() {
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  const handleQuickAdd = (product) => {
    addToCart(product, '50ml', 'None', '10h');
  };

  return (
    <section id="shop" className="py-24 relative overflow-hidden bg-[#08080c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel-gold text-valaroix-gold text-xs uppercase tracking-widest font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Haute Parfumerie Collection
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Curated <span className="text-gold-gradient">Masterpiece Scents</span>
          </h2>
          <p className="text-gray-400 font-light text-sm sm:text-base font-sans">
            Hand-poured 3D crystal bottles with 24k gold atomizers. Formulated with rare French essential oils.
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-panel p-5 rounded-3xl border-valaroix-gold/25 flex flex-col justify-between space-y-4 hover:border-valaroix-gold/60 transition-all shadow-xl group"
            >
              <div className="space-y-3">
                
                {/* Product Image Container */}
                <Link href={`/product/${product.id}`} className="block relative w-full h-64 rounded-2xl overflow-hidden bg-black border border-valaroix-gold/30">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-valaroix-gold/40 text-[10px] text-valaroix-gold font-bold uppercase tracking-wider">
                    Pure Extrait
                  </div>
                </Link>

                {/* Meta & Title */}
                <div>
                  <h3 className="font-serif-luxury font-bold text-lg text-white group-hover:text-valaroix-gold transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mt-1 font-sans">
                    {product.subtitle}
                  </p>
                </div>

                {/* Scent Notes Badge */}
                <div className="p-2.5 rounded-xl bg-black/60 border border-valaroix-gold/15 text-[11px] text-gray-300 font-sans space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-valaroix-gold font-bold block">Key Notes:</span>
                  <span className="block truncate">{product.topNotes}</span>
                </div>

              </div>

              {/* Price & Action Buttons */}
              <div className="pt-2 border-t border-valaroix-gold/20 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase font-sans">Starting From</span>
                    <span className="font-serif-luxury text-xl font-bold text-gold-gradient">
                      {formatPrice(product.startingPrice)}
                    </span>
                  </div>
                  
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/30">
                    Free Delivery
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleQuickAdd(product)}
                    className="btn-gold py-2.5 px-3 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Add
                  </button>

                  <Link
                    href={`/product/${product.id}`}
                    className="py-2.5 px-3 rounded-xl glass-panel border-valaroix-gold/40 text-valaroix-gold hover:bg-valaroix-gold hover:text-valaroix-dark text-xs font-bold uppercase flex items-center justify-center gap-1 transition-all"
                  >
                    <span>Details</span> <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
