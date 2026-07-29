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
  const { cart, setIsCartOpen, setIsTrackOrderOpen, setIsQuizOpen } = useCart();
  const { user, setIsAuthModalOpen, setIsAccountModalOpen } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUserClick = () => {
    if (user) {
      setIsAccountModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const searchResults = searchQuery.trim().length > 0
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.topNotes.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 left-0 right-0 z-40 transition-all duration-300">
      
      {/* MAIN NAVBAR BAR */}
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? 'py-2 bg-[#070709]/98 border-b border-valaroix-gold/30 shadow-2xl backdrop-blur-md'
            : 'py-2.5 bg-black/95 border-b border-valaroix-gold/20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-2">
          
          {/* Top Row: Logo (Left) + Action Icons (Right) */}
          <div className="flex items-center justify-between gap-3">
            
            {/* BRAND LOGO & EMBLEM */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-valaroix-gold/60 p-0.5 bg-valaroix-dark group-hover:border-valaroix-gold transition-all duration-300 overflow-hidden shrink-0">
                <img
                  src="/logo.jpg"
                  alt="VALAROIX Emblem"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <span className="font-bold text-base sm:text-lg tracking-wider text-white block leading-tight">
                  VALAROIX
                </span>
                <span className="block text-[8px] tracking-widest text-valaroix-gold uppercase font-medium">
                  Parfums
                </span>
              </div>
            </Link>

            {/* Desktop Center Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-gray-300">
              <a href="#hero" className="hover:text-valaroix-gold transition-colors py-1">3D Showcase</a>
              <a href="#shop" className="hover:text-valaroix-gold transition-colors py-1">Boutique Store</a>
              <a href="#notes" className="hover:text-valaroix-gold transition-colors py-1">Fragrance Notes</a>
              <a href="#customizer" className="hover:text-valaroix-gold transition-colors py-1">Bespoke Atelier</a>
            </nav>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              
              {/* TRACK ORDER */}
              <button
                onClick={() => setIsTrackOrderOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel border-valaroix-gold/30 text-xs text-gray-300 hover:text-valaroix-gold transition-all"
                title="Track Order"
              >
                <Truck className="w-3.5 h-3.5 text-valaroix-gold" />
                <span>Track</span>
              </button>

              {/* USER SIGN IN / ACCOUNT */}
              <button
                onClick={handleUserClick}
                className="px-3 py-1.5 rounded-xl glass-panel-gold border border-valaroix-gold/40 text-xs font-bold text-valaroix-gold hover:bg-valaroix-gold hover:text-valaroix-dark transition-all"
                title={user ? 'My Account' : 'Sign In'}
              >
                {user ? (
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-valaroix-gold text-valaroix-dark text-[9px] font-bold flex items-center justify-center">
                      {(user.user_metadata?.full_name || user.email)?.[0]?.toUpperCase()}
                    </span>
                    <span className="font-medium text-xs">Account</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </div>
                )}
              </button>

              {/* CLEAN CART BAG BUTTON WITH COUNT PILL */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="px-3 py-1.5 rounded-xl btn-gold text-xs font-bold text-valaroix-dark flex items-center gap-1.5 shadow-md hover:scale-105 transition-all"
                title="Cart"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-valaroix-dark" />
                <span>Cart</span>
                {totalItems > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-black text-valaroix-gold text-[10px] font-bold min-w-[18px] text-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* 3 LINES MENU BUTTON */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl glass-panel border-valaroix-gold/30 text-xs font-bold text-gray-200 hover:text-valaroix-gold transition-all"
                title="Browse Menu"
              >
                <Menu className="w-4 h-4 text-valaroix-gold" />
              </button>

            </div>

          </div>

          {/* Bottom Row: Full Width Clean Live Search Bar */}
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder='Search perfumes (e.g. Sauvage, Cedrat Boise...)'
              className="w-full bg-black/80 border border-valaroix-gold/35 rounded-xl pl-3.5 pr-9 py-1.5 text-xs text-gray-200 placeholder-gray-400 focus:outline-none focus:border-valaroix-gold font-sans"
            />
            <button
              aria-label="Search"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-valaroix-gold"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            {/* Live Search Results Dropdown */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-valaroix-dark border border-valaroix-gold/40 rounded-2xl p-3 shadow-2xl space-y-2 z-50">
                <span className="block text-[10px] uppercase font-sans text-valaroix-gold font-bold px-2">Matching Perfumes:</span>
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
                    <span className="font-bold text-valaroix-gold">From Rs. {item.pricing['50ml']['10h'].pkr.toLocaleString()}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* SLIDE-OVER CATEGORIES & MOBILE MENU DRAWER */}
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
                  <div className="w-8 h-8 rounded-full border border-valaroix-gold p-0.5">
                    <img src="/logo.jpg" alt="Logo" className="w-full h-full rounded-full object-cover" />
                  </div>
                  <span className="font-bold text-lg text-white">VALAROIX</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-full glass-panel text-gray-400 hover:text-valaroix-gold"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-2 text-sm font-medium text-gray-200 font-sans">
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
