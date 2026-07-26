'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Heart, ShoppingBag, Eye, Star, Sparkles, Filter } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { products } from './ProductCatalog';

export default function ShopCatalogPage() {
  const { addToCart, setSelectedProductModal, wishlist, toggleWishlist } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('bestseller');

  const categories = ['All', 'Oud & Woods', 'Rose & Floral', 'Amber & Spice', 'Sandalwood & Vanilla'];

  // Filter products by search & category
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.topNotes.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'Oud & Woods') return matchesSearch && (p.name.includes('Oud') || p.topNotes.includes('Oud'));
    if (selectedCategory === 'Rose & Floral') return matchesSearch && (p.name.includes('Rose') || p.topNotes.includes('Rose'));
    if (selectedCategory === 'Amber & Spice') return matchesSearch && (p.name.includes('Elixir') || p.topNotes.includes('Saffron'));
    if (selectedCategory === 'Sandalwood & Vanilla') return matchesSearch && (p.name.includes('Santal') || p.topNotes.includes('Sandalwood'));
    
    return matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // default bestseller
  });

  return (
    <section id="shop" className="py-24 bg-valaroix-dark border-t border-valaroix-gold/20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel-gold text-valaroix-gold text-xs uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Full Boutique Catalog
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Explore All <span className="text-gold-gradient">Valaroix Parfums</span>
          </h2>
        </div>

        {/* Filter Controls Bar */}
        <div className="glass-panel p-4 rounded-3xl border-valaroix-gold/30 mb-12 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Live Search Bar */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-valaroix-gold absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by scent notes (e.g. Saffron, Oud, Rose, Sandalwood)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black border border-valaroix-gold/30 rounded-2xl pl-11 pr-4 py-3 text-xs text-gray-200 focus:outline-none focus:border-valaroix-gold font-sans"
              />
            </div>

            {/* Sort By Dropdown */}
            <div className="md:col-span-6 flex justify-end gap-3 items-center">
              <span className="text-xs text-gray-400 font-mono hidden sm:inline">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-black border border-valaroix-gold/30 rounded-2xl px-4 py-3 text-xs text-gray-200 focus:outline-none focus:border-valaroix-gold font-sans"
              >
                <option value="bestseller">Bestselling Royal Reserve</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Patron Rating</option>
              </select>
            </div>

          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-valaroix-gold/15">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'btn-gold shadow-md'
                    : 'bg-black/60 text-gray-400 border border-valaroix-gold/20 hover:text-valaroix-gold'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sortedProducts.map((product) => {
            const isWishlisted = wishlist.some((w) => w.id === product.id);

            return (
              <motion.div
                key={product.id}
                whileHover={{ y: -6 }}
                className="glass-panel p-6 rounded-3xl border-valaroix-gold/25 hover:border-valaroix-gold flex flex-col justify-between group shadow-xl relative"
              >
                {/* Top Actions: Wishlist Heart + Tag */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-valaroix-gold bg-valaroix-gold/10 px-2.5 py-1 rounded-full border border-valaroix-gold/30">
                    {product.tag}
                  </span>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-2 rounded-full glass-panel transition-all ${
                      isWishlisted ? 'text-red-500 border-red-500/50' : 'text-gray-400 hover:text-valaroix-gold'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div>
                  {/* Bottle Visual Canvas Card */}
                  <div
                    onClick={() => setSelectedProductModal(product)}
                    className="w-full h-56 rounded-2xl bg-gradient-to-b from-black to-valaroix-dark flex items-center justify-center relative overflow-hidden mb-6 border border-valaroix-gold/20 group-hover:border-valaroix-gold/50 cursor-pointer"
                  >
                    <div
                      className="w-20 h-32 rounded-xl border-2 flex flex-col items-center justify-between p-2 shadow-2xl"
                      style={{ borderColor: product.color }}
                    >
                      <div className="w-6 h-5 rounded-sm bg-valaroix-gold/80" />
                      <span className="font-serif text-[10px] tracking-widest text-valaroix-gold font-bold">
                        VALAROIX
                      </span>
                      <div className="w-12 h-14 rounded-md opacity-80" style={{ backgroundColor: product.color }} />
                    </div>

                    {/* Quick Inspect Button Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="btn-gold px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xl">
                        <Eye className="w-4 h-4" /> Quick Inspect 3D
                      </span>
                    </div>
                  </div>

                  {/* Title & Notes */}
                  <h3
                    onClick={() => setSelectedProductModal(product)}
                    className="font-serif text-xl font-bold text-white group-hover:text-valaroix-gold transition-colors cursor-pointer mb-1"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-valaroix-gold/80 font-light mb-3">
                    {product.subtitle}
                  </p>

                  <div className="flex items-center gap-2 mb-4 text-xs text-gray-400">
                    <div className="flex items-center text-valaroix-gold font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="ml-1">{product.rating}</span>
                    </div>
                    <span>({product.reviewsCount} reviews)</span>
                  </div>
                </div>

                {/* Price & Add to Cart */}
                <div className="pt-4 border-t border-valaroix-gold/20 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase">Price</span>
                    <span className="font-serif text-2xl font-bold text-gold-gradient">
                      ${product.price}
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(product, '100ml')}
                    className="btn-gold px-4 py-2.5 rounded-full flex items-center gap-2 text-xs uppercase font-semibold"
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
