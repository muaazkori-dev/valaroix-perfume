'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, ShoppingBag, Clock, Truck, ShieldCheck, LogOut, Award, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';

export default function CustomerAccountModal() {
  const { isAccountModalOpen, setIsAccountModalOpen, user, userOrders, signOut } = useAuth();
  const { formatPrice } = useCurrency();

  if (!isAccountModalOpen) return null;

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'VIP Patron';
  const email = user?.email || 'patron@valaroix.com';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAccountModalOpen(false)}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Account Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-valaroix-dark border border-valaroix-gold/30 rounded-3xl p-8 shadow-[0_0_60px_rgba(212,175,55,0.2)] z-10 space-y-8 max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={() => setIsAccountModalOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full glass-panel text-gray-400 hover:text-valaroix-gold"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 glass-panel-gold rounded-2xl border border-valaroix-gold/40">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-full bg-valaroix-gold text-valaroix-dark font-serif font-bold text-2xl flex items-center justify-center shadow-xl">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-white leading-tight">{displayName}</h3>
                <span className="text-xs text-valaroix-gold font-mono">{email}</span>
                <span className="inline-block mt-1 ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-valaroix-gold/20 text-valaroix-gold border border-valaroix-gold/40">
                  👑 VIP Royal Privé Member
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                signOut();
                setIsAccountModalOpen(false);
              }}
              className="px-4 py-2 rounded-xl glass-panel text-xs text-red-400 hover:text-red-300 border-red-500/30 flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>

          {/* Order History Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-valaroix-gold" /> Your Order History ({userOrders.length})
              </h4>
              <span className="text-xs text-gray-400 font-mono">Live Order Tracking</span>
            </div>

            {userOrders.length === 0 ? (
              <div className="text-center py-12 glass-panel rounded-2xl border-valaroix-gold/20">
                <ShoppingBag className="w-10 h-10 text-valaroix-gold/40 mx-auto mb-3" />
                <p className="text-sm text-gray-400">No past orders found in your VIP vault yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order) => (
                  <div
                    key={order.id}
                    className="glass-panel p-6 rounded-2xl border-valaroix-gold/30 space-y-4 shadow-xl"
                  >
                    {/* Order Meta Header */}
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-valaroix-gold/20 pb-3 text-xs">
                      <div>
                        <span className="font-mono text-valaroix-gold font-bold text-sm">Order #{order.id}</span>
                        <span className="block text-gray-400 text-[11px] mt-0.5">Placed on {order.date}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5" /> {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Purchased Items List */}
                    <div className="space-y-3">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-white">{item.name}</span>
                            {order.engraving && (
                              <span className="block text-[10px] text-valaroix-gold font-mono">
                                Laser Engraved: "{order.engraving}"
                              </span>
                            )}
                          </div>
                          <span className="font-serif text-sm font-bold text-gold-gradient">
                            {formatPrice(item.pricePkr || order.totalPkr)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order Total & DHL Courier Link */}
                    <div className="pt-3 border-t border-valaroix-gold/15 flex justify-between items-center text-xs">
                      <div className="text-gray-400 font-mono">
                        Courier: <span className="text-valaroix-gold font-bold">{order.trackingCode || 'DHL-EXPRESS-PK'}</span>
                      </div>
                      <div className="font-serif text-base font-bold text-white">
                        Total: <span className="text-gold-gradient">{formatPrice(order.totalPkr)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
