'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Package, ArrowRight, MessageCircle, PhoneCall } from 'lucide-react';

export default function CustomPerfumeSection() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-[#0A0A0D] via-[#101016] to-[#0A0A0D] border-t border-[#D4AF37]/20 relative overflow-hidden text-white">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-black via-[#141419] to-black border border-[#D4AF37]/40 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* LEFT: CONTENT */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-[11px] font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                VALAROIX BESPOKE ATELIER
              </div>

              <h2 className="font-serif-mockup text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                Apni Pasand Ka Perfume <span className="text-[#D4AF37]">Khud Banwayen</span>
              </h2>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Koi bhi designer scent profile (Aventus, Baccarat, Oud Wood, Khamrah ya aapka apna manpasand clone) muntakhib karein aur luxury bottle mein banwayen. Humari team aap se khud contact karegi!
              </p>

              {/* 2 Core Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                  <Package className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs text-white block">Minimum 2 Bottles</strong>
                    <span className="text-[11px] text-gray-400">Aik hi flavour mein 2 bottles required</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                  <PhoneCall className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs text-white block">We Contact You Directly</strong>
                    <span className="text-[11px] text-gray-400">Team will reach out to confirm</span>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Link
                  href="/custom"
                  className="w-full sm:w-auto py-3.5 px-7 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B38728] text-black font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                  <span>Order Custom Perfume</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </Link>

                <a
                  href="https://wa.me/923029111856?text=Assalam-o-Alaikum%20VALAROIX!%20Mujhe%20apna%20custom%20perfume%20banwana%20hai%20(Min%202%20bottles)."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-3 px-5 rounded-2xl border border-[#25D366]/50 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Concierge</span>
                </a>
              </div>
            </div>

            {/* RIGHT: LUXURY VISUAL MOCKUP CARD */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-sm rounded-2xl p-4 bg-black/80 border border-[#D4AF37]/50 shadow-2xl">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl overflow-hidden bg-black/60 border border-white/10">
                    <img src="/products/zayvor.jpg" alt="Emerald Bottle" className="w-full h-32 object-cover" />
                    <span className="text-[9px] text-[#D4AF37] font-bold block text-center py-1">Emerald Crystal</span>
                  </div>
                  <div className="rounded-xl overflow-hidden bg-black/60 border border-white/10">
                    <img src="/products/noir-x.jpg" alt="Matte Noir Bottle" className="w-full h-32 object-cover" />
                    <span className="text-[9px] text-[#D4AF37] font-bold block text-center py-1">Matte Noir</span>
                  </div>
                </div>

                <div className="mt-3 p-3.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-center space-y-1">
                  <span className="text-[10px] text-gray-400 block font-mono">VALAROIX BESPOKE ATELIER</span>
                  <strong className="text-sm text-white font-serif tracking-wider block">
                    Hand-Crafted Pure Extrait Formula
                  </strong>
                  <span className="text-[11px] text-[#D4AF37] block font-semibold">Minimum 2 Bottles • 40% Pure Oil</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
