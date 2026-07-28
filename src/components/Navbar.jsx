'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Sliders, Volume2, VolumeX, Compass, Truck, Heart, User, LogIn } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar({ onOpenAdmin }) {
  const { cart, wishlist, setIsCartOpen, setIsTrackOrderOpen, setIsQuizOpen } = useCart();
  const { user, setIsAuthModalOpen, setIsAccountModalOpen } = useAuth();
  
  const [scrolled, setScrolled] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  const handleUserClick = () => {
    if (user) {
      setIsAccountModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'py-3.5 bg-[#070709]/95 border-b border-valaroix-gold/25 shadow-2xl backdrop-blur-md'
          : 'py-6 bg-gradient-to-b from-black/90 via-black/50 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Left Side: Brand Logo & Emblem with distinct right margin */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3.5 group shrink-0">
            <div className="w-11 h-11 rounded-full border border-valaroix-gold/60 p-0.5 bg-valaroix-dark group-hover:border-valaroix-gold group-hover:scale-105 transition-all duration-300 shadow-[0_0_18px_rgba(212,175,55,0.3)] overflow-hidden">
              <img
                src="/logo.jpg"
                alt="VALAROIX Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-[0.2em] text-gold-gradient block leading-tight">
                VALAROIX
              </span>
              <span className="block text-[9px] tracking-[0.35em] text-valaroix-gold/80 uppercase font-medium mt-0.5">
                Haute Parfumerie
              </span>
            </div>
          </Link>

          {/* Navigation Links with Spacious Gap */}
          <nav className="hidden xl:flex items-center gap-8 text-xs tracking-[0.18em] uppercase font-medium text-gray-300 pl-6 border-l border-valaroix-gold/20">
            <a href="#hero" className="hover:text-valaroix-gold transition-colors py-1">
              3D Showcase
            </a>
            <a href="#shop" className="hover:text-valaroix-gold transition-colors py-1">
              Boutique Store
            </a>
            <a href="#notes" className="hover:text-valaroix-gold transition-colors py-1">
              Fragrance Notes
            </a>
            <a href="#customizer" className="hover:text-valaroix-gold transition-colors py-1">
              Bespoke Atelier
            </a>
            <button
              onClick={() => setIsQuizOpen(true)}
              className="flex items-center gap-1.5 text-valaroix-gold hover:underline font-bold py-1"
            >
              <Compass className="w-3.5 h-3.5" /> Scent Profiler
            </button>
          </nav>
        </div>

        {/* Right Action Icons & Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* CUSTOMER AUTH & VIP PROFILE BUTTON */}
          <button
            onClick={handleUserClick}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full glass-panel-gold border border-valaroix-gold/40 text-xs font-bold text-valaroix-gold hover:bg-valaroix-gold hover:text-valaroix-dark transition-all shadow-md"
            title={user ? 'View VIP Account & Order History' : 'Sign In / Sign Up'}
          >
            {user ? (
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-valaroix-gold text-valaroix-dark text-[10px] font-bold flex items-center justify-center">
                  {(user.user_metadata?.full_name || user.email)?.[0]?.toUpperCase()}
                </span>
                <span className="hidden md:inline font-mono">My Account & Orders</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </div>
            )}
          </button>

          {/* Track Courier Link */}
          <button
            onClick={() => setIsTrackOrderOpen(true)}
            title="Track Courier Order"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel border-valaroix-gold/30 text-xs text-gray-300 hover:text-valaroix-gold hover:border-valaroix-gold transition-all"
          >
            <Truck className="w-3.5 h-3.5 text-valaroix-gold" />
            <span>Track Order</span>
          </button>

          {/* Wishlist Indicator */}
          {wishlist.length > 0 && (
            <a
              href="#shop"
              className="p-2.5 rounded-full glass-panel border-valaroix-gold/40 text-red-400 relative"
              title="Saved Wishlist Items"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            </a>
          )}

          {/* Ambient Sound Toggle */}
          <button
            onClick={toggleAudio}
            title="Luxury Ambient Sound"
            className="p-2.5 rounded-full glass-panel hover:border-valaroix-gold/60 text-valaroix-gold/80 hover:text-valaroix-gold transition-all"
          >
            {isPlayingAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* 3D Studio Trigger */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full glass-panel border-valaroix-gold/40 text-valaroix-gold text-xs font-semibold tracking-wider hover:bg-valaroix-gold/10 transition-all shadow-[0_0_12px_rgba(212,175,55,0.15)]"
          >
            <Sliders className="w-3.5 h-3.5 text-valaroix-gold animate-pulse-slow" />
            <span className="hidden sm:inline">3D Studio</span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-full btn-gold flex items-center justify-center shadow-lg"
          >
            <ShoppingBag className="w-5 h-5 text-valaroix-dark" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-valaroix-amber text-white text-[10px] font-bold flex items-center justify-center shadow-lg animate-bounce">
                {totalItems}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
