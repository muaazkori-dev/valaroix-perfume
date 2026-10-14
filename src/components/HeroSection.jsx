'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function HeroSection() {
  const { isSapphire, isEmerald } = useTheme();

  return (
    <section
      id="hero"
      className={`relative w-full py-8 sm:py-16 lg:py-24 overflow-hidden border-b transition-colors duration-500 ${
        isEmerald
          ? 'bg-[#04120B] border-emerald-500/30'
          : isSapphire
          ? 'bg-[#050814] border-blue-500/30'
          : 'bg-[#0D0D0D] border-[#D4AF37]/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* LEFT COLUMN: HERO TEXT & SHOP NOW CTA */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-6 space-y-4 sm:space-y-6 text-left"
        >
          <div className="space-y-2.5 sm:space-y-4">
            <h1 className="font-serif-mockup text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              SCENT OF <br />
              <span
                className={`transition-colors duration-500 ${
                  isEmerald
                    ? 'text-emerald-400 drop-shadow-[0_0_35px_rgba(16,185,129,0.6)]'
                    : isSapphire
                    ? 'text-blue-400 drop-shadow-[0_0_35px_rgba(59,130,246,0.6)]'
                    : 'text-[#D4AF37]'
                }`}
              >
                ELEGANCE
              </span>
            </h1>

            <p className="text-[#888888] text-sm sm:text-base lg:text-lg font-light leading-relaxed max-w-lg">
              Discover premium fragrances crafted to leave a lasting impression.
            </p>
          </div>

          <div className="pt-1 sm:pt-2">
            <a
              href="#shop"
              className={`inline-flex items-center gap-2.5 px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl text-xs uppercase font-bold tracking-widest shadow-xl transition-all ${
                isEmerald
                  ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-700 text-white shadow-emerald-500/40 hover:brightness-110'
                  : isSapphire
                  ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white shadow-blue-500/40 hover:brightness-110'
                  : 'btn-mockup-gold'
              }`}
            >
              <span>SHOP NOW</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: HIGH-RES LUXURY PERFUME BOTTLE SHOWCASE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-6 relative flex items-center justify-center"
        >
          <div
            className={`relative w-full max-w-sm sm:max-w-md h-[340px] xs:h-[380px] sm:h-[480px] lg:h-[520px] rounded-3xl overflow-hidden border shadow-2xl flex items-center justify-center p-3 sm:p-6 group transition-all duration-500 ${
              isEmerald
                ? 'bg-[#071F13] border-emerald-500/50 shadow-[0_0_60px_rgba(16,185,129,0.35)]'
                : isSapphire
                ? 'bg-[#070D22] border-blue-500/50 shadow-[0_0_60px_rgba(37,99,235,0.35)]'
                : 'bg-[#111111] border-[#D4AF37]/40 shadow-2xl'
            }`}
          >
            
            {/* Dramatic Ambient Glow Behind Bottle */}
            <div
              className={`absolute inset-0 transition-all duration-500 ${
                isEmerald
                  ? 'bg-gradient-to-t from-[#04120B] via-transparent to-emerald-500/25'
                  : isSapphire
                  ? 'bg-gradient-to-t from-[#050814] via-transparent to-blue-500/25'
                  : 'bg-gradient-to-t from-black via-transparent to-[#D4AF37]/15'
              }`}
            />
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-500 ${
                isEmerald
                  ? 'w-72 sm:w-96 h-72 sm:h-96 bg-emerald-600/40 blur-[90px] sm:blur-[120px] shadow-[0_0_80px_rgba(16,185,129,0.6)]'
                  : isSapphire
                  ? 'w-72 sm:w-96 h-72 sm:h-96 bg-blue-600/40 blur-[90px] sm:blur-[120px] shadow-[0_0_80px_rgba(37,99,235,0.6)]'
                  : 'w-64 sm:w-80 h-64 sm:h-80 bg-[#D4AF37]/20 blur-[80px] sm:blur-[100px]'
              }`}
            />

            {/* High-Res Master Perfume Image (Full Bottle Uncropped) */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pb-14 sm:pb-12 p-2">
              <img
                src="/products/valaroix-noir-vertex-duo.jpg"
                alt="Valaroix Noir X & Vertex"
                className="w-full h-full object-contain rounded-2xl group-hover:scale-105 transition-transform duration-700 max-h-[420px] drop-shadow-2xl"
              />
            </div>

            {/* Bottom Floating Perfume Tag */}
            <div
              className={`absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-20 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border flex items-center justify-between gap-2 shadow-xl transition-all duration-500 ${
                isEmerald
                  ? 'bg-[#04120B]/95 border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.4)]'
                  : isSapphire
                  ? 'bg-[#050814]/95 border-blue-500/60 shadow-[0_0_25px_rgba(37,99,235,0.4)]'
                  : 'bg-black/95 border-[#D4AF37]/50'
              }`}
            >
              <div className="min-w-0">
                <span className="font-serif-mockup font-bold text-white text-xs sm:text-sm block truncate">
                  VALAROIX — NOIR X & VERTEX
                </span>
                <span
                  className={`text-[9px] sm:text-[10px] uppercase font-semibold block truncate ${
                    isEmerald ? 'text-emerald-400' : isSapphire ? 'text-blue-400' : 'text-[#D4AF37]'
                  }`}
                >
                  Signature Extrait De Parfum • 40% Pure Oil • Free Delivery
                </span>
              </div>
              <span
                className={`font-serif-mockup font-bold text-xs sm:text-sm shrink-0 ml-2 ${
                  isEmerald ? 'text-emerald-300' : isSapphire ? 'text-blue-300' : 'text-[#D4AF37]'
                }`}
              >
                From Rs. 2,999
              </span>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
