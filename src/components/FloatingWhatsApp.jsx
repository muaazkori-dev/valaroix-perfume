'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function FloatingWhatsApp({ phoneNumber = '923141397378' }) {
  const [isOpen, setIsOpen] = useState(false);

  const defaultMessage = encodeURIComponent(
    'Hello VALAROIX Haute Parfumerie, I am interested in acquiring your 3D Luxury Perfumes.'
  );

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto">
      {/* Quick Chat Popup Tooltip */}
      {isOpen && (
        <div className="w-72 glass-panel p-5 rounded-2xl border-valaroix-gold/40 shadow-[0_10px_30px_rgba(0,0,0,0.8)] space-y-3 animate-fade-in text-xs">
          <div className="flex items-center justify-between border-b border-valaroix-gold/20 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-serif font-bold text-white text-sm">VALAROIX Concierge</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-gray-300 font-light leading-relaxed">
            Welcome to VALAROIX Privé Concierge. Need assistance choosing your fragrance or custom order?
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all shadow-lg"
          >
            <MessageCircle className="w-4 h-4" /> Start WhatsApp Chat
          </a>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Contact VALAROIX Concierge on WhatsApp"
        className="group relative w-14 h-14 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:scale-110 hover:shadow-[0_0_35px_rgba(16,185,129,0.7)] transition-all duration-300 border border-emerald-400/40"
      >
        {/* Glowing Ambient Outer Ring */}
        <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping pointer-events-none" />

        <MessageCircle className="w-7 h-7 text-white fill-current group-hover:rotate-12 transition-transform duration-300" />

        {/* Unread Message Badge Dot */}
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-valaroix-gold border-2 border-black flex items-center justify-center text-[8px] font-bold text-valaroix-dark">
          1
        </span>
      </button>
    </div>
  );
}
