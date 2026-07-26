'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, ShieldCheck, CreditCard, Lock, Sparkles, PackageCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '@/context/CartContext';

export default function CheckoutModal() {
  const { isCheckoutOpen, setIsCheckoutOpen, cart, total, clearCart } = useCart();
  const [step, setStep] = useState('form'); // form | success
  const [formData, setFormData] = useState({
    name: 'Lord Arthur Vance',
    email: 'arthur.vance@royal-valaroix.com',
    address: '45 Rue du Faubourg Saint-Honoré',
    city: 'Paris',
    country: 'France',
    cardNumber: '•••• •••• •••• 8842',
  });

  if (!isCheckoutOpen) return null;

  const handlePay = (e) => {
    e.preventDefault();
    setStep('success');

    // Trigger celebratory gold confetti
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#f3e5ab', '#ffffff', '#e67e22']
      });
    } catch (e) {}
  };

  const handleClose = () => {
    if (step === 'success') {
      clearCart();
    }
    setStep('form');
    setIsCheckoutOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-2xl bg-valaroix-dark border border-valaroix-gold/40 rounded-3xl p-8 shadow-[0_0_80px_rgba(212,175,55,0.2)] z-10"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 p-2 rounded-full glass-panel text-gray-400 hover:text-valaroix-gold"
          >
            <X className="w-5 h-5" />
          </button>

          {step === 'form' ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full glass-panel-gold border-valaroix-gold flex items-center justify-center text-valaroix-gold">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white">VIP Order Checkout</h3>
                  <p className="text-xs text-gray-400">Encrypted 256-bit SSL Luxury Courier Dispatch</p>
                </div>
              </div>

              <form onSubmit={handlePay} className="space-y-4">
                {/* Shipping Information */}
                <div className="glass-panel p-4 rounded-2xl border-valaroix-gold/20 space-y-3">
                  <span className="block text-xs uppercase tracking-widest text-valaroix-gold font-bold">
                    1. Express Delivery Destination
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Full Name"
                      className="bg-black/60 border border-valaroix-gold/30 rounded-xl px-3.5 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-valaroix-gold"
                    />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Email Address"
                      className="bg-black/60 border border-valaroix-gold/30 rounded-xl px-3.5 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-valaroix-gold"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Shipping Address"
                    className="w-full bg-black/60 border border-valaroix-gold/30 rounded-xl px-3.5 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-valaroix-gold"
                  />
                </div>

                {/* Card Payment Simulation */}
                <div className="glass-panel p-4 rounded-2xl border-valaroix-gold/20 space-y-3">
                  <span className="block text-xs uppercase tracking-widest text-valaroix-gold font-bold flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> 2. Secure Card Payment
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                    placeholder="Card Number"
                    className="w-full bg-black/60 border border-valaroix-gold/30 rounded-xl px-3.5 py-2.5 text-xs font-mono text-valaroix-gold focus:outline-none focus:border-valaroix-gold"
                  />
                </div>

                {/* Investment Total & Pay CTA */}
                <div className="pt-4 flex items-center justify-between">
                  <div>
                    <span className="block text-xs text-gray-400 uppercase">Total Investment</span>
                    <span className="font-serif text-3xl font-bold text-gold-gradient">${total}</span>
                  </div>

                  <button
                    type="submit"
                    className="btn-gold px-8 py-4 rounded-full text-xs uppercase font-bold tracking-widest flex items-center gap-2 shadow-2xl"
                  >
                    Confirm & Authorize ${total}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Order Success Receipt */
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 rounded-full glass-panel-gold border-2 border-valaroix-gold flex items-center justify-center mx-auto text-valaroix-gold animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-valaroix-gold font-bold">Order Confirmed</span>
                <h3 className="font-serif text-3xl font-bold text-white">Thank You, {formData.name}</h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  Your Valaroix order <strong>#VX-90842</strong> has been dispatched for handcrafted packaging in Grasse, France.
                </p>
              </div>

              {/* Order Receipt Box */}
              <div className="glass-panel p-4 rounded-2xl border-valaroix-gold/30 text-left text-xs font-mono space-y-2 max-w-md mx-auto">
                <div className="flex justify-between text-gray-400 border-b border-valaroix-gold/20 pb-2">
                  <span>Courier: DHL Luxury Express</span>
                  <span className="text-valaroix-gold">Tracking Ready</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Destination: {formData.address}, {formData.city}</span>
                </div>
                <div className="flex justify-between font-bold text-valaroix-gold pt-2 border-t border-valaroix-gold/20">
                  <span>Paid Total:</span>
                  <span>${total}</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="btn-gold px-8 py-3.5 rounded-full text-xs uppercase font-bold tracking-wider"
              >
                Return to Storefront
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
