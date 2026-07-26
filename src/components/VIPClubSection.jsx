'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Crown, Gift, ShieldCheck, ArrowRight } from 'lucide-react';

export default function VIPClubSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-black via-valaroix-dark/95 to-black border-t border-b border-valaroix-gold/20 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-valaroix-gold/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel-gold text-valaroix-gold text-xs uppercase tracking-widest">
              <Crown className="w-4 h-4" /> Club Privé Royalty
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Unlock Paris Masterclasses & <span className="text-gold-gradient">Private Vault Access</span>
            </h2>

            <p className="text-gray-300 font-light text-sm sm:text-base leading-relaxed">
              Every Valaroix purchase earns membership points toward private olfactory tastings, complimentary bottle engraving, and exclusive invitations to limited 1-of-50 Reserve bottle releases.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="glass-panel p-4 rounded-2xl border-valaroix-gold/20 space-y-1">
                <Gift className="w-5 h-5 text-valaroix-gold" />
                <h4 className="font-serif text-sm font-bold text-white">Complimentary Samples</h4>
                <p className="text-[11px] text-gray-400">Receive 3 luxury 5ml travel sprays with every order</p>
              </div>

              <div className="glass-panel p-4 rounded-2xl border-valaroix-gold/20 space-y-1">
                <Crown className="w-5 h-5 text-valaroix-gold" />
                <h4 className="font-serif text-sm font-bold text-white">Vault Priority Pre-order</h4>
                <p className="text-[11px] text-gray-400">First access to rare harvest agarwood releases</p>
              </div>
            </div>

            <div className="pt-4">
              <button className="btn-gold px-8 py-4 rounded-full flex items-center gap-3 text-xs uppercase tracking-widest font-bold">
                Join Valaroix Club Privé <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 glass-panel-gold p-8 rounded-3xl border-valaroix-gold/40 text-center space-y-6 shadow-2xl relative">
            <div className="w-20 h-20 rounded-full bg-valaroix-gold/20 border-2 border-valaroix-gold flex items-center justify-center mx-auto text-valaroix-gold">
              <Crown className="w-10 h-10 animate-pulse-slow" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-valaroix-gold font-mono font-bold">Tier: Black Velvet Reserve</span>
              <h3 className="font-serif text-2xl font-bold text-white">VIP Royalty Membership</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Earn 10 VIP Crown Points for every $1 spent. Redeem for bespoke crystal decanters.
              </p>
            </div>

            <div className="pt-2 border-t border-valaroix-gold/30 flex justify-around text-xs font-mono text-valaroix-gold">
              <div>
                <span className="block text-white font-bold text-lg">2,850</span>
                <span className="text-[10px] text-gray-400 uppercase">Points Balance</span>
              </div>
              <div>
                <span className="block text-white font-bold text-lg">VIP Gold</span>
                <span className="text-[10px] text-gray-400 uppercase">Active Status</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
