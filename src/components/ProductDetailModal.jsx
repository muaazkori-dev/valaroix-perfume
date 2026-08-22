'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingBag, Check, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function ProductDetailModal() {
  const { selectedProductModal, setSelectedProductModal, addToCart, setIsCheckoutOpen } = useCart();
  const [selectedSize, setSelectedSize] = useState('50ml');

  if (!selectedProductModal) return null;

  const product = selectedProductModal;
  const price = product.startingPrice?.pkr || product.price;

  const handleBuyNow = () => {
    if (product.isSoldOut) {
      alert('This item is currently sold out!');
      return;
    }
    addToCart(product, selectedSize, '');
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
            
            {/* Left High-Res Perfume Image Showcase (6 Cols) */}
            <div className="lg:col-span-6 h-[380px] sm:h-[440px] relative rounded-2xl bg-[#1A1A1A] border border-valaroix-gold/30 overflow-hidden flex items-center justify-center p-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain rounded-xl shadow-2xl"
              />
              {product.isSoldOut && (
                <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold uppercase px-3 py-1 rounded-full shadow-lg">
                  SOLD OUT
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

              {/* Purchase Action CTAs */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    addToCart(product, selectedSize, '');
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
