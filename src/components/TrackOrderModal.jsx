'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Truck, CheckCircle2, MapPin, PackageCheck, Search, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function TrackOrderModal() {
  const { isTrackOrderOpen, setIsTrackOrderOpen } = useCart();
  const [orderId, setOrderId] = useState('VX-90842');
  const [searched, setSearched] = useState(true);

  if (!isTrackOrderOpen) return null;

  const handleTrack = (e) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsTrackOrderOpen(false)}
          className="fixed inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-xl bg-valaroix-dark border border-valaroix-gold/40 rounded-3xl p-8 shadow-[0_0_80px_rgba(212,175,55,0.25)] z-10"
        >
          <button
            onClick={() => setIsTrackOrderOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full glass-panel text-gray-400 hover:text-valaroix-gold"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full glass-panel-gold border border-valaroix-gold flex items-center justify-center text-valaroix-gold">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">Track VIP Order</h3>
                <p className="text-xs text-gray-400">DHL Express Luxury Air Courier Tracking</p>
              </div>
            </div>

            <form onSubmit={handleTrack} className="flex gap-2">
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter Order # (e.g. VX-90842)"
                className="flex-1 bg-black border border-valaroix-gold/30 rounded-xl px-4 py-3 text-xs font-mono text-valaroix-gold uppercase focus:outline-none focus:border-valaroix-gold"
              />
              <button type="submit" className="btn-gold px-6 py-3 rounded-xl text-xs uppercase font-bold flex items-center gap-2">
                <Search className="w-4 h-4" /> Track
              </button>
            </form>

            {searched && (
              <div className="space-y-6 pt-2">
                {/* Status Header */}
                <div className="glass-panel p-4 rounded-2xl border-valaroix-gold/30 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase">Tracking Number</span>
                    <span className="font-mono text-sm font-bold text-valaroix-gold">{orderId}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] text-gray-400 uppercase">Estimated Delivery</span>
                    <span className="text-xs font-bold text-green-400">Tomorrow by 12:00 PM</span>
                  </div>
                </div>

                {/* Timeline Progress */}
                <div className="space-y-4 relative pl-6 border-l-2 border-valaroix-gold/30 ml-3">
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-valaroix-gold border-2 border-valaroix-dark" />
                    <h4 className="text-xs font-bold text-white">Order Formulated & Hand-filled in Grasse, France</h4>
                    <p className="text-[10px] text-gray-400">Batch #904 maceration completed • Certificate #482 signed</p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-valaroix-gold border-2 border-valaroix-dark" />
                    <h4 className="text-xs font-bold text-white">Hand-Sealed in Obsidian Velvet Presentation Box</h4>
                    <p className="text-[10px] text-gray-400">Custom diamond laser engraving verified</p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-valaroix-amber border-2 border-valaroix-dark animate-pulse" />
                    <h4 className="text-xs font-bold text-valaroix-gold">In Transit - DHL Express Luxury Flight #708</h4>
                    <p className="text-[10px] text-gray-400">En route to destination airport hub</p>
                  </div>

                  <div className="relative opacity-50">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-gray-600 border-2 border-valaroix-dark" />
                    <h4 className="text-xs font-bold text-gray-400">Out for White-Glove VIP Courier Delivery</h4>
                    <p className="text-[10px] text-gray-500">Scheduled for priority morning delivery</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
