'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Instagram, Facebook, Twitter, Youtube, MessageCircle, 
  Sparkles, Mail, ShieldCheck, Truck, Award, ArrowUp 
} from 'lucide-react';

export default function Footer({ whatsappNumber = '923000000000' }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    {
      name: 'Instagram',
      handle: '@valaroix.parfums',
      icon: Instagram,
      url: 'https://instagram.com/valaroix.parfums',
      color: 'hover:text-pink-500 hover:border-pink-500/50'
    },
    {
      name: 'TikTok',
      handle: '@valaroix.official',
      icon: Sparkles,
      url: 'https://tiktok.com/@valaroix.official',
      color: 'hover:text-cyan-400 hover:border-cyan-400/50'
    },
    {
      name: 'Facebook',
      handle: 'Valaroix Parfumerie',
      icon: Facebook,
      url: 'https://facebook.com/valaroix',
      color: 'hover:text-blue-500 hover:border-blue-500/50'
    },
    {
      name: 'WhatsApp Concierge',
      handle: `+${whatsappNumber}`,
      icon: MessageCircle,
      url: `https://wa.me/${whatsappNumber}`,
      color: 'hover:text-emerald-400 hover:border-emerald-400/50'
    },
    {
      name: 'Twitter / X',
      handle: '@valaroix',
      icon: Twitter,
      url: 'https://twitter.com/valaroix',
      color: 'hover:text-sky-400 hover:border-sky-400/50'
    },
    {
      name: 'YouTube',
      handle: 'Valaroix Official',
      icon: Youtube,
      url: 'https://youtube.com/@valaroix',
      color: 'hover:text-red-500 hover:border-red-500/50'
    }
  ];

  return (
    <footer className="bg-black border-t border-valaroix-gold/20 pt-20 pb-12 relative overflow-hidden text-gray-300 font-sans">
      {/* Background ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-valaroix-gold/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-16">
        
        {/* Top Grid: Brand Intro + Social Media Links + VIP Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          {/* Brand Info (4 Cols) */}
          <div className="md:col-span-4 space-y-5">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="w-12 h-12 rounded-full border border-valaroix-gold/60 p-0.5 bg-valaroix-dark overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                <img src="/logo.jpg" alt="VALAROIX Emblem" className="w-full h-full object-cover rounded-full" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-[0.2em] text-gold-gradient block">
                  VALAROIX
                </span>
                <span className="block text-[9px] tracking-[0.35em] text-valaroix-gold/80 uppercase font-medium">
                  Haute Parfumerie
                </span>
              </div>
            </Link>

            <p className="text-xs text-gray-400 font-light leading-relaxed max-w-sm">
              Ultra-luxury 3D perfume boutique. Encased in hand-faceted crystal glass with 24k gold leaf spray atomizer. Aged in Grasse, France.
            </p>

            <div className="flex items-center gap-3 text-xs text-valaroix-gold font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Authentic Extrait Guarantee</span>
            </div>
          </div>

          {/* Social Media Links Section (4 Cols) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-serif text-sm font-bold uppercase tracking-widest text-valaroix-gold flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Connect With VALAROIX Privé
            </h4>

            <p className="text-xs text-gray-400 font-light">
              Follow our official social profiles for exclusive drops, VIP vault access, and BTS fragrance maceration videos:
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`glass-panel p-3 rounded-xl border-valaroix-gold/20 flex items-center gap-2.5 transition-all text-xs text-gray-300 font-medium ${social.color}`}
                  >
                    <IconComponent className="w-4 h-4 text-valaroix-gold shrink-0" />
                    <div className="min-w-0">
                      <span className="block font-bold text-[11px] truncate text-white">{social.name}</span>
                      <span className="block text-[9px] text-gray-400 truncate font-mono">{social.handle}</span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* VIP Newsletter Subscription (4 Cols) */}
          <div className="md:col-span-4 space-y-4 glass-panel p-6 rounded-3xl border-valaroix-gold/30">
            <h4 className="font-serif text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-valaroix-gold" /> Join VIP Privé Club
            </h4>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              Subscribe to receive private invitation codes for new batch releases and 15% VIP inaugural discount.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your VIP email address..."
                className="w-full bg-black border border-valaroix-gold/30 rounded-xl px-4 py-3 text-xs text-gray-200 focus:outline-none focus:border-valaroix-gold"
              />
              <button
                type="submit"
                className="w-full btn-gold py-3 rounded-xl text-xs uppercase font-bold tracking-widest shadow-lg"
              >
                Join Privé Vault ➔
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Scroll to Top */}
        <div className="pt-8 border-t border-valaroix-gold/15 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-mono">
          <p>© {new Date().getFullYear()} VALAROIX Haute Parfumerie. All Rights Reserved.</p>

          <div className="flex items-center gap-6">
            <a href="#hero" className="hover:text-valaroix-gold transition-colors">Privacy Policy</a>
            <a href="#hero" className="hover:text-valaroix-gold transition-colors">Terms of Service</a>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full glass-panel hover:text-valaroix-gold text-valaroix-gold border-valaroix-gold/30 flex items-center gap-1 text-[11px]"
            >
              Back To Top <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
