'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, Search, Menu, X, Truck, User, LogIn, 
  Sparkles, Compass, Sliders, Volume2, VolumeX, Heart, ChevronRight 
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { products } from './ProductCatalog';

export default function Navbar({ onOpenAdmin }) {
  const { cart, wishlist, setIsCartOpen, setIsTrackOrderOpen, setIsQuizOpen } = useCart();
  const { user, setIsAuthModalOpen, setIsAccountModalOpen } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // Filter products for quick search dropdown
  const searchResults = searchQuery.trim().length > 0
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.topNotes.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
      
      {/* 1. TOP ANNOUNCEMENT BANNER BAR */}
      <div className="bg-gradient-to-r from-valaroix-dark via-[#1a1710] to-valaroix-dark border-b border-valaroix-gold/25 py-2 px-4 text-center text-xs font-mono text-valaroix-gold flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-valaroix-gold" />
        <span>Welcome to VALAROIX Haute Parfumerie! Enjoy Free Express Courier Shipping & Complimentary Laser Engraving.</span>
      </div>

      {/* 2. MAIN HEADER NAVBAR BAR */}
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? 'py-3 bg-[#070709]/98 border-b border-valaroix-gold/30 shadow-2xl backdrop-blur-md'
            : 'py-4 bg-black/90 border-b border-valaroix-gold/20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          
          {/* LEFT: BRAND LOGO & EMBLEM */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-full border border-valaroix-gold/60 p-0.5 bg-valaroix-dark group-hover:border-valaroix-gold transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.3)] overflow-hidden">
              <img
                src="/logo.jpg"
                alt="VALAROIX Emblem"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-serif text-xl font-bold tracking-[0.2em] text-gold-gradient block leading-tight">
                VALAROIX
              </span>
              <span className="block text-[8px] tracking-[0.3em] text-valaroix-gold/80 uppercase font-medium">
                Haute Parfumerie
              </span>
            </div>
          </Link>

          {/* CENTER: PROMINENT LIVE SEARCH BAR */}
          <div className="flex-1 max-w-lg relative mx-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder='Search for "Sauvage", "Cedrat Boise", "YSL Y"...'
                className="w-full bg-black/80 border border-valaroix-gold/35 rounded-full pl-5 pr-11 py-2.5 text-xs text-gray-200 placeholder-gray-400 focus:outline-none focus:border-valaroix-gold focus:ring-1 focus:ring-valaroix-gold/50 shadow-inner"
              />
              <button
                aria-label="Search"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-valaroix-gold hover:scale-110 transition-transform"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Live Search Results Dropdown */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-valaroix-dark border border-valaroix-gold/40 rounded-2xl p-3 shadow-2xl space-y-2 z-50">
                <span className="block text-[10px] uppercase font-mono text-valaroix-gold font-bold px-2">Matching Fragrances:</span>
                {searchResults.map((item) => (
                  <Link
                    key={item.id}
                    href={`/product/${item.id}`}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-valaroix-gold/15 transition-all text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">{item.name}</span>
                      <span className="text-[10px] text-gray-400">{item.subtitle}</span>
                    </div>
                    <span className="font-serif font-bold text-valaroix-gold">From Rs. {item.pricing['50ml']['10h'].pkr.toLocaleString()}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: ACTION BUTTONS (Browse Categories 3-Lines, Track Order, Sign In, Cart) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* 3 LINES HAMBURGER CATEGORIES MENU BUTTON */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full glass-panel border-valaroix-gold/30 text-xs font-bold text-gray-200 hover:text-valaroix-gold hover:border-valaroix-gold transition-all"
              title="Browse Categories & Links"
            >
              <Menu className="w-4 h-4 text-valaroix-gold" />
              <span className="hidden md:inline">Browse Shop</span>
            </button>

            {/* TRACK ORDER PILL BUTTON */}
            <button
              onClick={() => setIsTrackOrderOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-full glass-panel border-valaroix-gold/30 text-xs text-gray-300 hover:text-valaroix-gold hover:border-valaroix-gold transition-all"
              title="Track Courier Order"
            >
              <Truck className="w-3.5 h-3.5 text-valaroix-gold" />
              <span>Track Order</span>
            </button>

            {/* SIGN IN / MY ACCOUNT PILL BUTTON */}
            <button
              onClick={handleUserClick}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full glass-panel-gold border border-valaroix-gold/40 text-xs font-bold text-valaroix-gold hover:bg-valaroix-gold hover:text-valaroix-dark transition-all shadow-md"
              title={user ? 'View Account & Order History' : 'Sign In'}
            >
              {user ? (
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-valaroix-gold text-valaroix-dark text-[10px] font-bold flex items-center justify-center">
                    {(user.user_metadata?.full_name || user.email)?.[0]?.toUpperCase()}
                  </span>
                  <span className="hidden xl:inline font-mono">My Account</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </div>
              )}
            </button>

            {/* CART BAG BUTTON WITH COUNT BADGE AT THE END */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full btn-gold flex items-center justify-center shadow-lg"
              title="Shopping Bag"
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
      </div>

      {/* 3. SLIDE-OVER CATEGORIES & MOBILE MENU DRAWER (3 Lines Menu) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="relative w-80 max-w-full bg-valaroix-dark border-r border-valaroix-gold/30 p-6 shadow-2xl flex flex-col justify-between z-10 space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-valaroix-gold/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full border border-valaroix-gold p-0.5">
                    <img src="/logo.jpg" alt="Logo" className="w-full h-full rounded-full object-cover" />
                  </div>
                  <span className="font-serif text-lg font-bold text-gold-gradient">VALAROIX</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-full glass-panel text-gray-400 hover:text-valaroix-gold"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Categories Links */}
              <div className="space-y-2 text-sm font-medium uppercase tracking-wider text-gray-200">
                <a
                  href="#hero"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-valaroix-gold/15 hover:text-valaroix-gold transition-all"
                >
                  <span>3D Showcase</span>
                  <ChevronRight className="w-4 h-4 text-valaroix-gold" />
                </a>

                <a
                  href="#shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-valaroix-gold/15 hover:text-valaroix-gold transition-all"
                >
                  <span>Boutique Store</span>
                  <ChevronRight className="w-4 h-4 text-valaroix-gold" />
                </a>

                <a
                  href="#notes"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-valaroix-gold/15 hover:text-valaroix-gold transition-all"
                >
                  <span>Fragrance Notes</span>
                  <ChevronRight className="w-4 h-4 text-valaroix-gold" />
                </a>

                <a
                  href="#customizer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-valaroix-gold/15 hover:text-valaroix-gold transition-all"
                >
                  <span>Bespoke Atelier</span>
                  <ChevronRight className="w-4 h-4 text-valaroix-gold" />
                </a>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsQuizOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl text-valaroix-gold hover:bg-valaroix-gold/15 font-bold transition-all"
                >
                  <span className="flex items-center gap-2"><Compass className="w-4 h-4" /> Scent Profiler</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-6 border-t border-valaroix-gold/20">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-3 rounded-xl glass-panel text-valaroix-gold text-xs uppercase font-bold flex items-center justify-center gap-2"
              >
                <Sliders className="w-4 h-4" /> 3D Motion Studio
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
}
