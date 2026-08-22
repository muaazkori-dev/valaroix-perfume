'use client';

import React from 'react';
import Link from 'next/link';
import { WhatsAppIcon, TikTokIcon } from './FloatingWhatsApp';
import { Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] border-t border-[#D4AF37]/20 text-[#6B6B6B] text-xs pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* BRAND COLUMN */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full border border-[#D4AF37] p-0.5 overflow-hidden">
                <img src="/logo.jpg" alt="VALAROIX" className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="font-serif-mockup text-lg font-bold text-white tracking-widest">
                VALAROIX
              </span>
            </div>
            <p className="text-xs text-[#6B6B6B] leading-relaxed max-w-xs">
              Luxury perfumes crafted for those who value authenticity and elegance.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="space-y-3">
            <h4 className="font-serif-mockup font-bold text-xs uppercase tracking-wider text-white">QUICK LINKS</h4>
            <ul className="space-y-2">
              <li><a href="#hero" className="hover:text-[#D4AF37] transition-colors">Home</a></li>
              <li><a href="#shop" className="hover:text-[#D4AF37] transition-colors">Shop</a></li>
              <li><a href="#shop" className="hover:text-[#D4AF37] transition-colors">Collections</a></li>
              <li><a href="#notes" className="hover:text-[#D4AF37] transition-colors">About Us</a></li>
              <li><a href="#customizer" className="hover:text-[#D4AF37] transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* CUSTOMER SERVICE */}
          <div className="space-y-3">
            <h4 className="font-serif-mockup font-bold text-xs uppercase tracking-wider text-white">CUSTOMER SERVICE</h4>
            <ul className="space-y-2">
              <li><a href="/admin" className="hover:text-[#D4AF37] transition-colors">Track Order</a></li>
              <li><a href="#shop" className="hover:text-[#D4AF37] transition-colors">Shipping Policy</a></li>
              <li><a href="#shop" className="hover:text-[#D4AF37] transition-colors">Returns & Refunds</a></li>
              <li><a href="#shop" className="hover:text-[#D4AF37] transition-colors">Terms & Conditions</a></li>
              <li><a href="#shop" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* FOLLOW US */}
          <div className="space-y-3">
            <h4 className="font-serif-mockup font-bold text-xs uppercase tracking-wider text-white">FOLLOW US</h4>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://www.instagram.com/valaroix?igsh=MXBubjJ3OGh3dXkxYg=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1A1A1A] border border-[#D4AF37]/30 flex items-center justify-center text-gray-300 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
                title="Official Instagram @valaroix"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href="https://www.tiktok.com/@valaroix?_r=1&_t=ZS-98PpZQGSd5Z"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1A1A1A] border border-[#D4AF37]/30 flex items-center justify-center text-gray-300 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
                title="Official TikTok @valaroix"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>

              <a
                href="https://wa.me/923141397378"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1A1A1A] border border-[#D4AF37]/30 flex items-center justify-center text-gray-300 hover:text-emerald-400 hover:border-emerald-500 transition-all"
                title="Official WhatsApp Support 03141397378"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-[#D4AF37]/15 flex flex-wrap justify-between items-center gap-4 text-[11px] text-[#6B6B6B]">
          <span>© 2026 VALAROIX Parfums. All Rights Reserved.</span>
          <span>Made for Muaaz & Fahad</span>
        </div>

      </div>
    </footer>
  );
}
