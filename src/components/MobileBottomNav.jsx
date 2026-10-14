'use client';

import React, { useState, useEffect } from 'react';
import { Home, Sparkles, Truck, ShoppingBag, MessageCircle, Download, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function MobileBottomNav() {
  const { cart, setIsCartOpen, setIsTrackOrderOpen } = useCart();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallPill, setShowInstallPill] = useState(true);
  const [isIos, setIsIos] = useState(false);
  const [showIosPrompt, setShowIosPrompt] = useState(false);

  const totalQuantity = cart ? cart.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0;

  useEffect(() => {
    // Auto-register service worker for PWA support & offline caching
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // Detect standalone mode
    const standalone = 
      (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) ||
      (typeof navigator !== 'undefined' && navigator.standalone === true);
    setIsInstalled(standalone);

    // Detect iOS Safari
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase();
      const isApple = /iphone|ipad|ipod/.test(ua);
      setIsIos(isApple);
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    const handleCustomInstall = () => {
      handleInstallClick();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('valaroix:install-pwa', handleCustomInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('valaroix:install-pwa', handleCustomInstall);
    };
  }, [deferredPrompt, isIos]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      setCanInstall(false);
    } else if (isIos) {
      setShowIosPrompt(true);
    } else {
      alert('To install VALAROIX App, tap the 3-dots menu in Chrome/Browser and select "Install app" or "Add to Home Screen".');
    }
  };

  const scrollToSection = (id) => {
    if (window.location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>

      {/* iOS "Add to Home Screen" Instruction Modal */}
      {showIosPrompt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#D4AF37] rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37] mx-auto flex items-center justify-center text-[#D4AF37]">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-serif">Install VALAROIX on iPhone</h3>
              <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                1. Tap the <strong className="text-[#D4AF37]">Share button ⎋</strong> at the bottom of Safari.<br />
                2. Scroll down and tap <strong className="text-[#D4AF37]">Add to Home Screen ⊞</strong>.<br />
                3. Enjoy instant full-screen shopping!
              </p>
            </div>
            <button
              onClick={() => setShowIosPrompt(false)}
              className="w-full py-2.5 rounded-xl bg-[#D4AF37] text-black text-xs font-black uppercase tracking-wider"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* NATIVE MOBILE BOTTOM NAVIGATION BAR */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0B0E]/95 backdrop-blur-2xl border-t border-[#D4AF37]/30 shadow-[0_-10px_35px_rgba(0,0,0,0.9)] px-2 py-1.5"
        style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }}
        aria-label="Mobile Bottom Navigation"
      >
        <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
          
          {/* 1. Home */}
          <button
            onClick={() => scrollToSection('hero')}
            className="flex flex-col items-center justify-center py-1 text-gray-400 hover:text-[#D4AF37] active:scale-95 transition-all group"
          >
            <Home className="w-5 h-5 group-hover:text-[#D4AF37] transition-colors" />
            <span className="text-[10px] font-medium tracking-tight mt-0.5 group-hover:text-[#D4AF37]">
              Home
            </span>
          </button>

          {/* 2. Parfums Collection */}
          <button
            onClick={() => scrollToSection('shop')}
            className="flex flex-col items-center justify-center py-1 text-gray-400 hover:text-[#D4AF37] active:scale-95 transition-all group"
          >
            <Sparkles className="w-5 h-5 group-hover:text-[#D4AF37] transition-colors" />
            <span className="text-[10px] font-medium tracking-tight mt-0.5 group-hover:text-[#D4AF37]">
              Parfums
            </span>
          </button>

          {/* 3. Track Order */}
          <button
            onClick={() => setIsTrackOrderOpen(true)}
            className="flex flex-col items-center justify-center py-1 text-gray-400 hover:text-[#D4AF37] active:scale-95 transition-all group"
          >
            <Truck className="w-5 h-5 group-hover:text-[#D4AF37] transition-colors" />
            <span className="text-[10px] font-medium tracking-tight mt-0.5 group-hover:text-[#D4AF37]">
              Track
            </span>
          </button>

          {/* 4. Cart with Live Badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center justify-center py-1 text-gray-400 hover:text-[#D4AF37] active:scale-95 transition-all relative group"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 group-hover:text-[#D4AF37] transition-colors" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-gradient-to-r from-red-600 to-amber-600 text-white text-[9px] font-black flex items-center justify-center shadow-lg border border-black animate-pulse">
                  {totalQuantity}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium tracking-tight mt-0.5 group-hover:text-[#D4AF37]">
              Cart
            </span>
          </button>

          {/* 5. WhatsApp Concierge */}
          <a
            href="https://wa.me/923029111856?text=Assalam-o-Alaikum%20VALAROIX%2C%20I%20want%20to%20order%20luxury%20perfumes."
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-1 text-emerald-400 hover:text-emerald-300 active:scale-95 transition-all group"
          >
            <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-medium tracking-tight mt-0.5 text-emerald-400">
              Concierge
            </span>
          </a>

        </div>
      </nav>
    </>
  );
}
