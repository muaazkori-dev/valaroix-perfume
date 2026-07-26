'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Sparkles, Feather, ShieldAlert } from 'lucide-react';

const fragranceData = {
  top: {
    title: 'Top Notes (The First Impression)',
    subtitle: 'Evaporates in first 15-30 minutes',
    notes: [
      { name: 'Kashmiri Saffron', origin: 'Srinagar, India', intensity: '95%', description: 'Warm, golden, leather-spiced undertones harvested at dawn.' },
      { name: 'Sicilian Bergamot', origin: 'Calabria, Italy', intensity: '85%', description: 'Crisp citrus sparkle providing immediate luminous opening.' },
      { name: 'Pink Pepper', origin: 'Réunion Island', intensity: '75%', description: 'Vibrant, rosy spice boosting radiance.' },
    ],
  },
  heart: {
    title: 'Heart Notes (The Soul)',
    subtitle: 'Blooms 30 minutes in & lingers for 4 hours',
    notes: [
      { name: 'Royal Damask Rose', origin: 'Grasse, France', intensity: '98%', description: 'Deep velvet crimson petals extracted through ancient cold enfleurage.' },
      { name: 'Wild French Jasmine', origin: 'Provence, France', intensity: '90%', description: 'Intoxicating floral warmth with creamy silk facets.' },
      { name: 'Smoky Amber Resin', origin: 'Socotra Island', intensity: '88%', description: 'Warm balsams imparting regal luxury density.' },
    ],
  },
  base: {
    title: 'Base Notes (The Legacy)',
    subtitle: 'Anchors the perfume for 24+ hours on skin',
    notes: [
      { name: 'Aged Cambodian Oud', origin: 'Koh Kong, Cambodia', intensity: '100%', description: 'Distilled from 40-year-old wild agarwood, deeply resinous.' },
      { name: 'Golden Ambergris', origin: 'Pacific Ocean', intensity: '96%', description: 'Rare oceanic amber fixing the sillage into unforgettable aura.' },
      { name: 'Mysore Sandalwood', origin: 'Karnataka, India', intensity: '92%', description: 'Butter-soft sacred wood creating eternal warmth.' },
    ],
  },
};

export default function FragranceNotesSection() {
  const [activeTab, setActiveTab] = useState('top');

  return (
    <section id="notes" className="py-24 relative overflow-hidden bg-valaroix-dark/90 border-t border-b border-valaroix-gold/20">
      {/* Background Subtle Shimmer */}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-gold text-valaroix-gold text-xs uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Olfactory Composition
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            The Scent Pyramid of <span className="text-gold-gradient">Valaroix</span>
          </h2>
          <p className="text-gray-400 font-light text-sm sm:text-base">
            Every drop is crafted over 180 days of maceration in French oak casks to achieve unprecedented olfactory longevity.
          </p>
        </div>

        {/* Pyramid Selector Tabs */}
        <div className="flex justify-center gap-3 mb-12">
          {Object.keys(fragranceData).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-6 py-3 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300 ${
                activeTab === key
                  ? 'btn-gold shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                  : 'glass-panel text-gray-400 hover:text-valaroix-gold'
              }`}
            >
              {key === 'top' && '1. Top Notes'}
              {key === 'heart' && '2. Heart Notes'}
              {key === 'base' && '3. Base Notes'}
            </button>
          ))}
        </div>

        {/* Note Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {fragranceData[activeTab].notes.map((note, idx) => (
            <motion.div
              key={note.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="glass-panel p-6 rounded-2xl border-valaroix-gold/30 hover:border-valaroix-gold transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] tracking-widest uppercase text-valaroix-gold font-mono bg-valaroix-gold/10 px-2.5 py-1 rounded-full border border-valaroix-gold/30">
                  {note.origin}
                </span>
                <div className="flex items-center gap-1 text-valaroix-amber text-xs font-bold">
                  <Flame className="w-3.5 h-3.5" /> {note.intensity} Sillage
                </div>
              </div>

              <h3 className="font-serif text-xl font-bold text-white group-hover:text-valaroix-gold transition-colors mb-2">
                {note.name}
              </h3>

              <p className="text-gray-400 text-xs font-light leading-relaxed mb-6">
                {note.description}
              </p>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] text-gray-500">
                  <span>Extraction Purity</span>
                  <span className="text-valaroix-gold font-medium">Extrait Grade A+</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-valaroix-dark/90 overflow-hidden border border-valaroix-gold/20">
                  <div
                    className="h-full bg-gradient-to-r from-valaroix-amber to-valaroix-gold rounded-full"
                    style={{ width: note.intensity }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
