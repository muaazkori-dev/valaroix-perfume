'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';

export default function AddToCartToast() {
  const { lastAddedProduct, setLastAddedProduct, setIsCartOpen, cart } = useCart();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (lastAddedProduct) {
      const timer = setTimeout(() => {
        setLastAddedProduct(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [lastAddedProduct, setLastAddedProduct]);

  return (
    <AnimatePresence>
      {lastAddedProduct && (
        <motion.div
          initial={{ y: -80, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -80, opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-black/95 text-white p-3.5 sm:p-4 rounded-2xl border border-[#D4AF37] shadow-[0_12px_40px_rgba(212,175,55,0.35)] backdrop-blur-xl flex items-center gap-3.5"
        >
          {/* Animated Gold Glow */}
          <span className="absolute -inset-0.5 rounded-2xl bg-[#D4AF37]/20 blur-sm pointer-events-none animate-pulse" />

          {/* Product Thumbnail */}
          <div className="relative w-12 h-12 rounded-xl bg-[#1A1A1A] border border-[#D4AF37]/40 p-1 shrink-0 overflow-hidden flex items-center justify-center">
            <img
              src={lastAddedProduct.image || '/products/sauvage.jpg'}
              alt={lastAddedProduct.name}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold tracking-wide">
              <CheckCircle2 className="w-3.5 h-3.5" /> Added to Cart!
            </div>
            <h4 className="font-serif font-bold text-xs sm:text-sm text-white truncate mt-0.5">
              {lastAddedProduct.name}
            </h4>
            <span className="text-[10px] text-[#D4AF37] font-mono block">
              {formatPrice(lastAddedProduct.price)} • Free Delivery
            </span>
          </div>

          {/* Action: Open Cart */}
          <button
            onClick={() => {
              setLastAddedProduct(null);
              setIsCartOpen(true);
            }}
            className="px-3 py-2 rounded-xl btn-mockup-gold text-[10px] sm:text-xs font-bold text-black uppercase tracking-wider shrink-0 flex items-center gap-1 shadow-lg"
          >
            <span>Cart ({cart.length})</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
