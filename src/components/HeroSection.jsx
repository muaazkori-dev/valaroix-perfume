'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section id="hero" className="relative w-full bg-[#0D0D0D] py-8 sm:py-16 lg:py-24 overflow-hidden border-b border-[#D4AF37]/20">
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
              <span className="text-[#D4AF37]">ELEGANCE</span>
            </h1>

            <p className="text-[#888888] text-sm sm:text-base lg:text-lg font-light leading-relaxed max-w-lg">
              Discover premium fragrances crafted to leave a lasting impression.
            </p>
          </div>

          <div className="pt-1 sm:pt-2">
            <a
              href="#shop"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl btn-mockup-gold text-xs uppercase font-bold tracking-widest shadow-xl"
            >
              <span>SHOP NOW</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: HIGH-RES LUXURY PERFUME BOTTLE SHOWCASE (NO 3D CANVAS) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-6 relative flex items-center justify-center"
        >
          <div className="relative w-full max-w-sm sm:max-w-md h-[300px] xs:h-[340px] sm:h-[450px] lg:h-[500px] rounded-3xl overflow-hidden bg-[#1A1A1A] border border-[#D4AF37]/30 shadow-2xl flex items-center justify-center p-3 sm:p-6 group">
            
            {/* Dramatic Ambient Glow Behind Bottle */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-[#D4AF37]/10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 sm:w-72 h-56 sm:h-72 bg-[#D4AF37]/15 rounded-full blur-[70px] sm:blur-[90px] pointer-events-none" />

            {/* High-Res Master Perfume Image */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
              <img
                src="/products/sauvage.jpg"
                alt="Valaroix Sauvage Imperial"
                className="w-full h-full object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Bottom Floating Perfume Tag */}
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-20 bg-black/90 backdrop-blur-md p-2.5 sm:p-3.5 rounded-2xl border border-[#D4AF37]/40 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="font-serif-mockup font-bold text-white text-xs sm:text-sm block truncate">Valaroix Sauvage Imperial</span>
                <span className="text-[9px] sm:text-[10px] text-[#D4AF37] uppercase font-semibold block truncate">Pure Extrait De Parfum (30% Oil) • Free Delivery</span>
              </div>
              <span className="font-serif-mockup font-bold text-[#D4AF37] text-xs sm:text-sm shrink-0 ml-2">Rs. 2,699</span>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
