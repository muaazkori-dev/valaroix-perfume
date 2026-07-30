'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingBag, Check, ShieldCheck, Truck, Sparkles, PenTool, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ValaroixBottleCanvas from './3d/ValaroixBottleCanvas';

export default function ProductDetailModal() {
  const { selectedProductModal, setSelectedProductModal, addToCart, setIsCheckoutOpen } = useCart();
  const [activeView, setActiveView] = useState('3d'); // 3d | visual
  const [selectedSize, setSelectedSize] = useState('100ml');
  const [engraving, setEngraving] = useState('');
  const [activeTab, setActiveTab] = useState('composition');

  if (!selectedProductModal) return null;

  const product = selectedProductModal;
  let price = product.price;
  if (selectedSize === '50ml') price = Math.round(product.price * 0.65);
  if (selectedSize === '250ml Extrait') price = Math.round(product.price * 1.8);

  const handleBuyNow = () => {
    addToCart(product, selectedSize, engraving);
    setSelectedProductModal(null);
    setIsCheckoutOpen(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedProductModal(null)}
          className="fixed inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal Content Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-4xl bg-valaroix-dark border border-valaroix-gold/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(212,175,55,0.25)] z-10 my-8 overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedProductModal(null)}
            className="absolute top-6 right-6 p-2 rounded-full glass-panel text-gray-400 hover:text-valaroix-gold z-30"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left 3D Interactive Stage / Visual Preview (6 Cols) */}
            <div className="lg:col-span-6 h-[420px] sm:h-[480px] relative rounded-2xl glass-panel border border-valaroix-gold/30 overflow-hidden flex items-center justify-center">
              
              {/* View Switcher Controls */}
              <div className="absolute top-4 left-4 z-20 flex gap-2">
                <button
                  onClick={() => setActiveView('3d')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                    activeView === '3d'
                      ? 'btn-gold shadow-md'
                      : 'bg-black/60 text-gray-300 border border-valaroix-gold/30'
                  }`}
                >
                  Interactive 3D Stage
                </button>
                <button
                  onClick={() => setActiveView('visual')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                    activeView === 'visual'
                      ? 'btn-gold shadow-md'
                      : 'bg-black/60 text-gray-300 border border-valaroix-gold/30'
                  }`}
                >
                  Visual Studio
                </button>
              </div>

              {activeView === '3d' ? (
                <ValaroixBottleCanvas interactive={true} />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-black via-valaroix-dark to-black p-6">
                  <div
                    className="w-32 h-48 rounded-xl border-2 flex flex-col items-center justify-between p-3 shadow-2xl"
                    style={{ borderColor: product.color }}
                  >
                    <div className="w-10 h-6 rounded bg-valaroix-gold/80" />
                    <span className="font-serif text-xs font-bold text-valaroix-gold tracking-widest">
                      VALAROIX
                    </span>
                    <div className="w-20 h-24 rounded-lg opacity-80" style={{ backgroundColor: product.color }} />
                  </div>
                </div>
              )}
            </div>

            {/* Right Product Details & E-Commerce Purchase Actions (6 Cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-valaroix-gold bg-valaroix-gold/10 px-3 py-1 rounded-full border border-valaroix-gold/30">
                  {product.tag || 'Extrait de Parfum'}
                </span>
                <h2 className="font-serif text-3xl font-bold text-white mt-2 mb-1">
                  {product.name}
                </h2>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center text-valaroix-gold font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1">{product.rating || 5.0}</span>
                  </div>
                  <span className="text-gray-400">({product.reviewsCount || 120} Verified VIP Reviews)</span>
                  <span className="text-valaroix-emerald font-semibold">• In Stock (Batch #904)</span>
                </div>
              </div>

              <p className="text-gray-300 text-xs font-light leading-relaxed">
                {product.description}
              </p>

              {/* Price & Volume Selector */}
              <div className="space-y-3 pt-2 border-t border-valaroix-gold/20">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs uppercase text-gray-400 tracking-wider">Select Bottle Volume:</span>
                  <span className="font-serif text-3xl font-bold text-gold-gradient">${price}</span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <div className="py-2 text-center text-xs font-bold rounded-xl bg-valaroix-gold text-valaroix-dark border border-valaroix-gold uppercase">
                    50 ml Luxury Glass Edition
                  </div>
                </div>
              </div>

              {/* Optional Custom Monogram Engraving Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-valaroix-gold font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5" /> Optional Laser Monogram Engraving (+$35)
                </label>
                <input
                  type="text"
                  maxLength={12}
                  value={engraving}
                  onChange={(e) => setEngraving(e.target.value)}
                  placeholder="e.g. V.A. 2026"
                  className="w-full bg-black border border-valaroix-gold/30 rounded-xl px-3.5 py-2 text-xs font-mono text-valaroix-gold uppercase focus:outline-none focus:border-valaroix-gold"
                />
              </div>

              {/* Purchase Action CTAs */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    addToCart(product, selectedSize, engraving);
                    setSelectedProductModal(null);
                  }}
                  className="btn-gold py-3.5 rounded-full flex items-center justify-center gap-2 text-xs uppercase font-bold tracking-wider"
                >
                  <ShoppingBag className="w-4 h-4" /> Add To Bag
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-3.5 rounded-full glass-panel hover:border-valaroix-gold text-valaroix-gold text-xs uppercase font-bold tracking-wider border-valaroix-gold/50"
                >
                  Buy Now Instant
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex justify-between items-center text-[10px] text-gray-400 pt-2 border-t border-valaroix-gold/15">
                <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-valaroix-gold" /> Free Courier Shipping</span>
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-valaroix-gold" /> Authenticity Guaranteed</span>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
