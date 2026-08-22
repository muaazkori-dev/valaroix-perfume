'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';

export default function FloatingCartButton() {
  const { cart, setIsCartOpen, total } = useCart();
  const { formatPrice } = useCurrency();

  const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  if (!cart || cart.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.button
        initial={{ scale: 0, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0, opacity: 0, y: 30 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-40 flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-3.5 bg-black/95 text-white rounded-full border border-[#D4AF37] shadow-[0_10px_30px_rgba(212,175,55,0.4)] backdrop-blur-lg group hover:border-[#D4AF37] transition-all cursor-pointer"
        aria-label="View Shopping Cart"
      >
        {/* Glowing Pulse Ring */}
        <span className="absolute -inset-1 rounded-full bg-[#D4AF37]/20 blur-sm pointer-events-none animate-pulse" />

        {/* Bag Icon with Counter Badge */}
        <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#D4AF37] text-black">
          <ShoppingBag className="w-4 h-4" />
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center shadow-md">
            {totalQuantity}
          </span>
        </div>

        {/* Price & Label */}
        <div className="flex flex-col text-left">
          <span className="text-[10px] text-[#D4AF37] uppercase font-bold tracking-wider leading-none">
            Cart ({totalQuantity})
          </span>
          <span className="font-serif font-extrabold text-xs sm:text-sm text-white leading-tight mt-0.5">
            {formatPrice(total)}
          </span>
        </div>

        {/* Arrow */}
        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors ml-1">
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </motion.button>
    </AnimatePresence>
  );
}
