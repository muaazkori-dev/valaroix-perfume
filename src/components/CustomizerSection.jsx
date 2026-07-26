'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, PenTool, Gift, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CustomizerSection() {
  const { addToCart } = useCart();
  const [selectedFragrance, setSelectedFragrance] = useState('valaroix-elixir-noir');
  const [size, setSize] = useState('100ml');
  const [engravingText, setEngravingText] = useState('V.A. 2026');
  const [boxColor, setBoxColor] = useState('Obsidian Velvet');

  const basePrice = 320;
  const customFee = engravingText ? 35 : 0;
  const totalPrice = basePrice + customFee;

  const handleAddCustomToCart = () => {
    const customProduct = {
      id: 'valaroix-custom-bespoke',
      name: `Bespoke Valaroix (${selectedFragrance.replace('valaroix-', '').replace('-', ' ').toUpperCase()})`,
      subtitle: `Engraved: "${engravingText || 'None'}" • ${boxColor}`,
      price: totalPrice,
      color: '#d4af37'
    };
    addToCart(customProduct, size, engravingText);
  };

  return (
    <section id="customizer" className="py-24 relative overflow-hidden bg-valaroix-dark/95 border-t border-valaroix-gold/20">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel-gold text-valaroix-gold text-xs uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Bespoke Atelier
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Craft Your <span className="text-gold-gradient">Monogrammed Bottle</span>
          </h2>
          <p className="text-gray-400 font-light text-sm sm:text-base">
            Customize your 24k gold medallion with diamond laser engraving. Handcrafted by master artisans in France.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Live Engraving Interactive Preview Card */}
          <div className="lg:col-span-6 glass-panel p-8 rounded-3xl border-valaroix-gold/30 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
            <div className="text-center space-y-2 mb-6">
              <span className="text-[10px] uppercase tracking-widest text-valaroix-gold">Live Laser Engraving Preview</span>
              <h3 className="font-serif text-2xl font-bold text-white">Valaroix Bespoke Bottle</h3>
            </div>

            {/* 3D Bottle Medallion Preview Graphic */}
            <div className="w-64 h-80 rounded-2xl bg-gradient-to-b from-black via-valaroix-dark to-black border border-valaroix-gold/40 flex flex-col items-center justify-center relative shadow-2xl p-6">
              
              {/* Crystal Cap */}
              <div className="w-16 h-12 rounded-lg bg-valaroix-gold/30 border border-valaroix-gold mb-2 backdrop-blur-md flex items-center justify-center shadow-lg">
                <div className="w-8 h-2 bg-valaroix-gold/60 rounded" />
              </div>

              {/* Bottle Body */}
              <div className="w-48 h-56 rounded-xl bg-valaroix-dark/90 border-2 border-valaroix-gold/50 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
                <div className="absolute inset-0 bg-gradient-to-b from-valaroix-gold/10 via-transparent to-valaroix-gold/20" />

                {/* Golden Engraved Medallion Plaque */}
                <div className="w-36 py-3 px-2 rounded-lg bg-gradient-to-r from-valaroix-gold via-valaroix-goldLight to-valaroix-goldDark border border-amber-200 text-valaroix-dark text-center shadow-2xl relative z-10 transform scale-105">
                  <span className="block font-serif text-[10px] tracking-[0.2em] font-bold">VALAROIX</span>
                  <span className="block font-mono text-xs font-bold text-black border-t border-b border-valaroix-dark/30 py-1 my-1 tracking-widest uppercase">
                    {engravingText || 'YOUR NAME'}
                  </span>
                  <span className="block text-[8px] tracking-widest">EXTRAIT DE PARFUM</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-valaroix-gold/90">
              <ShieldCheck className="w-4 h-4" /> <span>Complimentary Certificate of Authenticity Included</span>
            </div>
          </div>

          {/* Right Column: Customizer Controls */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Control 1: Select Scent Formula */}
            <div className="glass-panel p-6 rounded-2xl border-valaroix-gold/20 space-y-3">
              <label className="block text-xs uppercase tracking-widest text-valaroix-gold font-bold">
                1. Select Olfactory Formula
              </label>
              <select
                value={selectedFragrance}
                onChange={(e) => setSelectedFragrance(e.target.value)}
                className="w-full bg-valaroix-dark border border-valaroix-gold/40 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-valaroix-gold"
              >
                <option value="valaroix-elixir-noir">Valaroix Elixir Noir (Saffron & Ambergris)</option>
                <option value="valaroix-aureum-oud">Valaroix Aureum Oud (Wild Cambodian Agarwood)</option>
                <option value="valaroix-rose-imperial">Valaroix Rose Imperial (Grasse Damask Rose)</option>
                <option value="valaroix-santal-royal">Valaroix Santal Royal (Mysore Sandalwood)</option>
              </select>
            </div>

            {/* Control 2: Custom Engraving Input */}
            <div className="glass-panel p-6 rounded-2xl border-valaroix-gold/20 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase tracking-widest text-valaroix-gold font-bold flex items-center gap-2">
                  <PenTool className="w-3.5 h-3.5" /> 2. Diamond Monogram Laser Engraving
                </label>
                <span className="text-[10px] text-gray-400">Max 12 Characters</span>
              </div>
              <input
                type="text"
                maxLength={12}
                value={engravingText}
                onChange={(e) => setEngravingText(e.target.value)}
                placeholder="e.g. V.A. 2026"
                className="w-full bg-valaroix-dark border border-valaroix-gold/40 rounded-xl px-4 py-3 text-sm font-mono text-valaroix-gold tracking-widest uppercase focus:outline-none focus:border-valaroix-gold"
              />
            </div>

            {/* Control 3: Gift Box Velvet Color */}
            <div className="glass-panel p-6 rounded-2xl border-valaroix-gold/20 space-y-3">
              <label className="block text-xs uppercase tracking-widest text-valaroix-gold font-bold flex items-center gap-2">
                <Gift className="w-3.5 h-3.5" /> 3. Luxury Presentation Velvet Box
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Obsidian Velvet', 'Imperial Emerald', 'Royal Crimson'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setBoxColor(color)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all ${
                      boxColor === color
                        ? 'bg-valaroix-gold/20 text-valaroix-gold border-valaroix-gold'
                        : 'bg-valaroix-dark text-gray-400 border-valaroix-gold/20 hover:border-valaroix-gold/50'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Total & Add Bespoke to Bag */}
            <div className="p-6 rounded-2xl glass-panel-gold border-valaroix-gold flex items-center justify-between shadow-2xl">
              <div>
                <span className="block text-xs text-gray-400 uppercase">Bespoke Total</span>
                <span className="font-serif text-3xl font-bold text-gold-gradient">
                  ${totalPrice}
                </span>
              </div>

              <button
                onClick={handleAddCustomToCart}
                className="btn-gold px-8 py-4 rounded-full flex items-center gap-3 text-xs uppercase font-bold tracking-wider"
              >
                <ShoppingBag className="w-4 h-4" /> Order Bespoke Bottle
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
