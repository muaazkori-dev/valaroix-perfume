'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';

export default function CartDrawer() {
  const router = useRouter();
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, total } = useCart();
  const { formatPrice } = useCurrency();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex z-50">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-full sm:max-w-md bg-valaroix-dark border-l border-valaroix-gold/30 shadow-2xl flex flex-col justify-between"
          >
            {/* 1. Header */}
            <div className="p-4 sm:p-6 border-b border-valaroix-gold/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full glass-panel-gold border-valaroix-gold text-valaroix-gold">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white">Shopping Cart</h3>
                  <span className="text-xs text-valaroix-gold font-mono">{cart.length} Fragrance Items</span>
                </div>
              </div>

              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full glass-panel text-gray-400 hover:text-valaroix-gold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <ShoppingBag className="w-12 h-12 text-valaroix-gold/30 mx-auto" />
                  <p className="text-sm text-gray-400">Your cart is currently empty.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="btn-gold px-6 py-2.5 rounded-full text-xs uppercase font-bold"
                  >
                    Browse Collection
                  </button>
                </div>
              ) : (
                cart.map((item) => {
                  const itemId = item.cartItemId || item.id;
                  const itemPrice = item.exactPkr || item.price || 2699;
                  return (
                    <div
                      key={itemId}
                      className="p-3.5 sm:p-4 rounded-2xl glass-panel border-valaroix-gold/20 flex gap-3 sm:gap-4 items-center"
                    >
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-valaroix-gold/40 p-1 bg-black shrink-0 overflow-hidden">
                        <img src={item.image || '/products/sauvage.jpg'} alt={item.name} className="w-full h-full object-contain rounded-lg" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-xs sm:text-sm text-white truncate">{item.name}</h4>
                        <span className="text-[11px] text-valaroix-gold font-mono block">
                          50ml • 30% Oil Concentration
                        </span>
                        <span className="font-bold text-white text-xs sm:text-sm block mt-1">
                          {formatPrice(itemPrice * (item.quantity || 1))}
                        </span>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <button
                          onClick={() => removeFromCart(itemId)}
                          className="text-gray-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="flex items-center border border-valaroix-gold/30 rounded-lg overflow-hidden bg-black text-xs">
                          <button
                            onClick={() => updateQuantity(itemId, -1)}
                            className="px-2 py-0.5 text-gray-400 hover:text-white"
                          >
                            -
                          </button>
                          <span className="px-2 font-mono text-white font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(itemId, 1)}
                            className="px-2 py-0.5 text-gray-400 hover:text-white"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* 3. Footer & Checkout CTA */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-6 border-t border-valaroix-gold/20 space-y-4 bg-black/95">
                <div className="flex justify-between items-center text-sm font-bold gap-2">
                  <span className="text-gray-400 uppercase tracking-wider">Subtotal</span>
                  <span className="font-serif text-xl sm:text-2xl text-gold-gradient shrink-0">{formatPrice(total)}</span>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="w-full btn-gold py-3.5 sm:py-4 rounded-2xl text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2 shadow-2xl"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-valaroix-gold/80 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-valaroix-gold" />
                  <span>Free Express Courier Delivery Included</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
