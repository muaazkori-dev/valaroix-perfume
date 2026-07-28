'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, Gift, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    applyPromo,
    promoCode,
    discount,
    subtotal,
    discountAmount,
    total,
    setIsCheckoutOpen
  } = useCart();

  const { formatPrice } = useCurrency();
  const [inputCode, setInputCode] = useState('');
  const [promoMessage, setPromoMessage] = useState(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const result = applyPromo(inputCode);
    setPromoMessage(result);
  };

  const freeGiftThreshold = 350;
  const progressPercent = Math.min(100, Math.round((subtotal / freeGiftThreshold) * 100));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-valaroix-dark border-l border-valaroix-gold/30 shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-6 border-b border-valaroix-gold/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-valaroix-gold" />
                <h2 className="font-serif text-xl font-bold text-white tracking-wide">
                  Your Valaroix Bag ({cart.reduce((sum, i) => sum + i.quantity, 0)})
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full glass-panel text-gray-400 hover:text-valaroix-gold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Gift Threshold Progress Bar */}
            <div className="px-6 py-3 bg-valaroix-gold/10 border-b border-valaroix-gold/20 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1.5 text-valaroix-gold font-medium">
                  <Gift className="w-4 h-4" /> VIP Complimentary Gift
                </span>
                <span className="text-gray-300 font-mono">
                  {subtotal >= freeGiftThreshold ? 'Unlocked!' : `${formatPrice(freeGiftThreshold - subtotal)} away`}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-valaroix-dark overflow-hidden border border-valaroix-gold/30">
                <div
                  className="h-full bg-gradient-to-r from-valaroix-amber to-valaroix-gold rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-full glass-panel border-valaroix-gold/30 flex items-center justify-center mx-auto text-valaroix-gold/50">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="text-gray-400 text-sm">Your luxury bag is currently empty.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="glass-panel p-4 rounded-2xl border-valaroix-gold/20 flex gap-4 items-center justify-between"
                  >
                    {/* Bottle Graphic */}
                    <div className="w-16 h-20 rounded-xl bg-black/60 border border-valaroix-gold/40 flex items-center justify-center shrink-0">
                      <div
                        className="w-8 h-12 rounded border flex flex-col items-center justify-center text-[7px] font-bold"
                        style={{ borderColor: item.color, color: item.color }}
                      >
                        V
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-sm font-bold text-white truncate">{item.name}</h4>
                      <p className="text-[11px] text-valaroix-gold font-light">{item.size}</p>
                      {item.engraving && (
                        <span className="inline-block mt-1 text-[10px] font-mono bg-valaroix-gold/15 text-valaroix-gold px-2 py-0.5 rounded border border-valaroix-gold/30">
                          Engraved: "{item.engraving}"
                        </span>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, -1)}
                          className="p-1 rounded glass-panel hover:text-valaroix-gold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-gray-200 px-2">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, 1)}
                          className="p-1 rounded glass-panel hover:text-valaroix-gold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Price & Delete */}
                    <div className="text-right space-y-2">
                      <span className="font-serif text-base font-bold text-gold-gradient">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="block text-gray-500 hover:text-red-400 ml-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout Button */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-valaroix-gold/20 bg-valaroix-dark/95 space-y-4">
                
                {/* Promo Code Form */}
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo Code (VALAROIX10)"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="flex-1 bg-black border border-valaroix-gold/30 rounded-xl px-3 py-2 text-xs font-mono text-valaroix-gold uppercase focus:outline-none focus:border-valaroix-gold"
                  />
                  <button type="submit" className="btn-gold px-4 py-2 rounded-xl text-xs uppercase font-bold">
                    Apply
                  </button>
                </form>

                {promoMessage && (
                  <p className={`text-[11px] font-medium ${promoMessage.success ? 'text-green-400' : 'text-red-400'}`}>
                    {promoMessage.message}
                  </p>
                )}

                {/* Subtotal Calculation */}
                <div className="space-y-1.5 text-xs text-gray-400 border-t border-valaroix-gold/15 pt-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-gray-200 font-mono">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-valaroix-gold">
                      <span>VIP Promo Discount (15%)</span>
                      <span className="font-mono">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-valaroix-gold/20">
                    <span>Total Investment</span>
                    <span className="font-serif text-xl text-gold-gradient">{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full btn-gold py-4 rounded-full flex items-center justify-center gap-3 text-xs uppercase tracking-widest font-bold shadow-2xl"
                >
                  Proceed To VIP Checkout <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
