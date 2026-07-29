'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, SlidersHorizontal, Expand } from 'lucide-react';
import ValaroixBottleCanvas from './3d/ValaroixBottleCanvas';
import { useAnimation } from '@/context/AnimationContext';

export default function HeroSection({ onOpenAdmin }) {
  const { settings } = useAnimation();

  return (
    <section id="hero" className="relative w-full min-h-screen flex items-center pt-8 sm:pt-12 pb-12 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-valaroix-gold/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        
        {/* Left Column: Text & Hero CTAs */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-6 space-y-8 text-left"
        >
          {/* Luxury Tag */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel-gold">
            <Sparkles className="w-4 h-4 text-valaroix-gold" />
            <span className="text-xs uppercase tracking-[0.25em] text-valaroix-gold font-medium">
              Haute Parfumerie • Pure Amber Extrait
            </span>
          </div>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              VALAROIX
              <span className="block font-serif text-3xl sm:text-5xl lg:text-6xl text-gold-gradient italic font-normal mt-2">
                {settings.heroTitle || "L'Elixir De Distinction"}
              </span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg font-light leading-relaxed max-w-xl">
              {settings.heroSubtitle || "Encased in hand-faceted crystal glass with 24k gold leaf atomizer. A sensory symphony of rare Damask Rose and aged Royal Ambergris."}
            </p>
          </div>

          {/* Scent Highlights Pill */}
          <div className="grid grid-cols-3 gap-4 pt-2 max-w-md">
            <div className="glass-panel p-3 rounded-xl border-valaroix-gold/20 text-center">
              <span className="block text-[10px] text-valaroix-gold uppercase tracking-wider">Top Note</span>
              <span className="text-xs font-semibold text-gray-200">Kashmiri Saffron</span>
            </div>
            <div className="glass-panel p-3 rounded-xl border-valaroix-gold/20 text-center">
              <span className="block text-[10px] text-valaroix-gold uppercase tracking-wider">Heart Note</span>
              <span className="text-xs font-semibold text-gray-200">Damask Rose</span>
            </div>
            <div className="glass-panel p-3 rounded-xl border-valaroix-gold/20 text-center">
              <span className="block text-[10px] text-valaroix-gold uppercase tracking-wider">Base Note</span>
              <span className="text-xs font-semibold text-gray-200">Aged Oud Wood</span>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href="#catalog"
              className="btn-gold px-8 py-4 rounded-full flex items-center gap-3 text-sm tracking-wider uppercase font-bold"
            >
              Acquire Fragrance <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={onOpenAdmin}
              className="px-6 py-4 rounded-full glass-panel hover:border-valaroix-gold text-valaroix-gold text-sm tracking-wider uppercase flex items-center gap-2.5 transition-all duration-300 font-bold"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Customize 3D Lighting
            </button>
          </div>

          {/* Live Theme Badge */}
          <div className="flex items-center gap-3 text-xs text-gray-500 pt-2">
            <span className="w-2 h-2 rounded-full bg-valaroix-emerald animate-ping" />
            <span>Active 3D Preset: <strong className="text-valaroix-gold font-medium">{settings.activeThemeName || "Obsidian Gold"}</strong></span>
          </div>
        </motion.div>

        {/* Right Column: Gentle Auto-Rotating 3D Stage (Clicking opens Full 360 Inspector Page) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="lg:col-span-6 h-[520px] sm:h-[620px] relative flex items-center justify-center"
        >
          <div className="w-full h-full relative rounded-3xl overflow-hidden glass-panel border border-valaroix-gold/30 shadow-[0_0_50px_rgba(212,175,55,0.15)] group">
            
            {/* Click to open 360 interactive inspector badge */}
            <Link
              href="/admin"
              className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-valaroix-gold/40 text-xs text-valaroix-gold hover:bg-valaroix-gold hover:text-valaroix-dark transition-all duration-300 shadow-lg font-bold"
            >
              <Expand className="w-3.5 h-3.5" />
              <span>Click for Full 360° 3D Inspector ↗</span>
            </Link>

            {/* Live WebGL Three.js Canvas (Smooth Ambient Auto-Rotation without Mouse Tilt Disruption) */}
            <ValaroixBottleCanvas interactive={false} enableMouseTilt={false} />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
