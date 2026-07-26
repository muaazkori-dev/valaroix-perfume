'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles, Star, Check, Box } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const products = [
  {
    id: 'valaroix-elixir-noir',
    name: 'Valaroix Elixir Noir',
    subtitle: 'Extrait de Parfum • Flagship Royal Edition',
    price: 285,
    rating: 5.0,
    reviewsCount: 142,
    color: '#d4af37',
    tag: 'Bestseller',
    description: 'Our signature masterpiece. Infused with 24k gold leaf particles, Kashmiri Saffron, and 40-year aged Cambodian Oud.',
    topNotes: 'Saffron, Bergamot, Pink Pepper',
    baseNotes: 'Ambergris, Cambodian Oud, Vanilla'
  },
  {
    id: 'valaroix-aureum-oud',
    name: 'Valaroix Aureum Oud',
    subtitle: 'Extrait de Parfum • Imperial Reserve',
    price: 340,
    rating: 4.9,
    reviewsCount: 98,
    color: '#e67e22',
    tag: 'Rare Batch',
    description: 'Distilled from ultra-rare Koh Kong Agarwood trees with wild acacia honey and dark smoked frankincense.',
    topNotes: 'Smoked Honey, Cardamom',
    baseNotes: 'Pure Wild Oud, Benzoin, Leather'
  },
  {
    id: 'valaroix-rose-imperial',
    name: 'Valaroix Rose Imperial',
    subtitle: 'Extrait de Parfum • Grasse Harvest',
    price: 295,
    rating: 4.95,
    reviewsCount: 116,
    color: '#e0a96d',
    tag: 'Limited 500 Bottles',
    description: 'Hand-picked Damask Rose petals from Grasse harvested at 5:00 AM, layered over warm amber velvet.',
    topNotes: 'Damask Rose, Raspberry',
    baseNotes: 'Bulgarian Rose, White Musk, Patchouli'
  },
  {
    id: 'valaroix-santal-royal',
    name: 'Valaroix Santal Royal',
    subtitle: 'Extrait de Parfum • Sacred Wood',
    price: 270,
    rating: 4.88,
    reviewsCount: 84,
    color: '#10b981',
    tag: 'Editor Choice',
    description: 'Creamy Mysore Sandalwood balanced with bourbon vanilla bean and golden cedarwood.',
    topNotes: 'Violet Leaf, Cardamom',
    baseNotes: 'Mysore Sandalwood, Bourbon Vanilla, Amber'
  }
];

export default function ProductCatalog() {
  const { addToCart } = useCart();
  const [selectedSizes, setSelectedSizes] = useState({});

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  return (
    <section id="catalog" className="py-24 relative overflow-hidden bg-black/95">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel-gold text-valaroix-gold text-xs uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Private Vault Collection
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Flagship <span className="text-gold-gradient">Valaroix Parfums</span>
          </h2>
          <p className="text-gray-400 font-light text-sm sm:text-base">
            Each bottle comes housed in an obsidian velvet presentation box accompanied by a certificate of authenticity signed by our Master Perfumer.
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            const currentSize = selectedSizes[product.id] || '100ml';
            let calculatedPrice = product.price;
            if (currentSize === '50ml') calculatedPrice = Math.round(product.price * 0.65);
            if (currentSize === '250ml Extrait') calculatedPrice = Math.round(product.price * 1.8);

            return (
              <motion.div
                key={product.id}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="glass-panel p-6 rounded-3xl border-valaroix-gold/25 hover:border-valaroix-gold flex flex-col justify-between group shadow-xl relative"
              >
                {/* Tag Badge */}
                <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-valaroix-gold/20 border border-valaroix-gold/40 text-[10px] uppercase font-bold tracking-wider text-valaroix-gold">
                  {product.tag}
                </div>

                <div>
                  {/* Bottle Visual Stage Placeholder with Color Tint Glow */}
                  <div className="w-full h-56 rounded-2xl bg-gradient-to-b from-valaroix-dark to-black/80 flex items-center justify-center relative overflow-hidden mb-6 border border-valaroix-gold/20 group-hover:border-valaroix-gold/50 transition-all duration-300">
                    <div
                      className="absolute inset-0 opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
                      style={{ backgroundColor: product.color }}
                    />
                    
                    {/* Bottle Icon Graphic */}
                    <div className="relative z-10 flex flex-col items-center gap-2 text-center">
                      <div
                        className="w-20 h-32 rounded-xl border-2 flex flex-col items-center justify-between p-2 shadow-2xl backdrop-blur-md"
                        style={{ borderColor: product.color }}
                      >
                        <div className="w-6 h-5 rounded-sm bg-valaroix-gold/80 border border-valaroix-gold" />
                        <span className="font-serif text-[10px] tracking-widest text-valaroix-gold font-bold uppercase">
                          VALAROIX
                        </span>
                        <div
                          className="w-12 h-14 rounded-md opacity-80"
                          style={{ backgroundColor: product.color }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Product Title & Subtitle */}
                  <div className="space-y-1 mb-3">
                    <h3 className="font-serif text-xl font-bold text-white group-hover:text-valaroix-gold transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-valaroix-gold/80 font-light">
                      {product.subtitle}
                    </p>
                  </div>

                  {/* Ratings */}
                  <div className="flex items-center gap-2 mb-4 text-xs text-gray-400">
                    <div className="flex items-center text-valaroix-gold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="ml-1 font-bold">{product.rating}</span>
                    </div>
                    <span>({product.reviewsCount} VIP reviews)</span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-xs font-light leading-relaxed mb-6 line-clamp-3">
                    {product.description}
                  </p>

                  {/* Size Selector */}
                  <div className="space-y-1.5 mb-6">
                    <span className="block text-[10px] text-gray-400 uppercase tracking-widest">Select Bottle Volume:</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['50ml', '100ml', '250ml Extrait'].map((size) => (
                        <button
                          key={size}
                          onClick={() => handleSizeSelect(product.id, size)}
                          className={`py-1.5 text-[10px] font-semibold rounded-lg border transition-all ${
                            currentSize === size
                              ? 'bg-valaroix-gold text-valaroix-dark border-valaroix-gold'
                              : 'bg-valaroix-dark/80 text-gray-300 border-valaroix-gold/30 hover:border-valaroix-gold'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price & Add to Cart Button */}
                <div className="pt-4 border-t border-valaroix-gold/20 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase">Price</span>
                    <span className="font-serif text-2xl font-bold text-gold-gradient">
                      ${calculatedPrice}
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(product, currentSize)}
                    className="btn-gold px-4 py-2.5 rounded-full flex items-center gap-2 text-xs uppercase tracking-wider font-semibold"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add To Bag
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
