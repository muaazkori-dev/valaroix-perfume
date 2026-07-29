'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, Search, Menu, X, Truck, User, 
  Sparkles, Compass, Sliders, ChevronRight, ExternalLink 
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { products } from './ProductCatalog';

export default function Navbar({ onOpenAdmin }) {
  const { cart, setIsCartOpen, setIsTrackOrderOpen, setIsQuizOpen } = useCart();
  const { user, setIsAuthModalOpen, setIsAccountModalOpen } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
      
      {/* HIGH-FASHION EDITORIAL HEADER BAR */}
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? 'py-3 bg-[#08080c]/98 border-b border-valaroix-gold/30 shadow-2xl backdrop-blur-md'
            : 'py-4 bg-[#08080c]/90 border-b border-valaroix-gold/20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-4">
          
          {/* LEFT: BRAND EMBLEM & EDITORIAL LOGO */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-valaroix-gold/70 p-0.5 bg-valaroix-dark group-hover:border-valaroix-gold transition-all duration-300 overflow-hidden shadow-lg shrink-0">
              <img
                src="/logo.jpg"
                alt="VALAROIX Emblem"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-luxury text-lg sm:text-xl font-bold tracking-[0.2em] text-white group-hover:text-valaroix-gold transition-colors leading-tight">
                VALAROIX
              </span>
              <span className="block text-[8px] tracking-[0.3em] text-valaroix-gold uppercase font-medium">
                Haute Parfumerie
              </span>
            </div>
          </Link>

          {/* CENTER: DESKTOP EDITORIAL NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold uppercase tracking-[0.2em] text-gray-300">
            <a href="#hero" className="hover:text-valaroix-gold transition-colors py-1">3D Showcase</a>
            <a href="#shop" className="hover:text-valaroix-gold transition-colors py-1">Boutique Collection</a>
            <a href="#notes" className="hover:text-valaroix-gold transition-colors py-1">Fragrance Notes</a>
            <a href="#customizer" className="hover:text-valaroix-gold transition-colors py-1">Bespoke Atelier</a>
          </nav>

          {/* RIGHT: CLEAN MINIMALIST ACTION BUTTONS */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* 1. SEARCH MODAL TRIGGER BUTTON */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl glass-panel border-valaroix-gold/30 text-xs text-gray-300 hover:text-valaroix-gold hover:border-valaroix-gold transition-all flex items-center gap-1.5"
              title="Search Perfumes"
            >
              <Search className="w-4 h-4 text-valaroix-gold" />
              <span className="hidden sm:inline font-medium text-xs">Search</span>
            </button>

            {/* 2. TRACK ORDER */}
            <button
              onClick={() => setIsTrackOrderOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl glass-panel border-valaroix-gold/30 text-xs text-gray-300 hover:text-valaroix-gold transition-all"
              title="Track Order"
            >
              <Truck className="w-3.5 h-3.5 text-valaroix-gold" />
              <span>Track</span>
            </button>

            {/* 3. USER ACCOUNT BUTTON */}
            <button
              onClick={handleUserClick}
              className="p-2 sm:px-3 sm:py-2 rounded-xl glass-panel-gold border border-valaroix-gold/40 text-xs font-bold text-valaroix-gold hover:bg-valaroix-gold hover:text-valaroix-dark transition-all"
              title={user ? 'My Account' : 'Sign In'}
            >
              {user ? (
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-valaroix-gold text-valaroix-dark text-[9px] font-bold flex items-center justify-center">
                    {(user.user_metadata?.full_name || user.email)?.[0]?.toUpperCase()}
                  </span>
                  <span className="hidden sm:inline font-medium text-xs">Account</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </div>
              )}
            </button>

            {/* 4. SLEEK CART BUTTON (With Count Pill Inside) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-3.5 py-2 rounded-xl btn-gold text-xs font-bold text-valaroix-dark flex items-center gap-1.5 shadow-lg hover:scale-105 transition-all"
              title="View Cart"
            >
              <ShoppingBag className="w-4 h-4 text-valaroix-dark" />
              <span>Cart</span>
              {totalItems > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-black text-valaroix-gold text-[10px] font-bold min-w-[18px] text-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* 5. 3-LINES MENU BUTTON */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl glass-panel border-valaroix-gold/30 text-xs font-bold text-gray-200 hover:text-valaroix-gold transition-all"
              title="Browse Menu"
            >
              <Menu className="w-4.5 h-4.5 text-valaroix-gold" />
            </button>

          </div>

        </div>
      </div>

      {/* FULLSCREEN SLEEK LUXURY SEARCH OVERLAY MODAL */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-2xl w-full bg-valaroix-dark border border-valaroix-gold/40 rounded-3xl p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-valaroix-gold/20 pb-4">
              <span className="font-serif-luxury text-lg font-bold text-valaroix-gold tracking-wider">
                SEARCH VALAROIX BOUTIQUE
              </span>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 rounded-full glass-panel text-gray-400 hover:text-valaroix-gold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Type perfume name (e.g. Sauvage, Cedrat Boise...)'
                className="w-full bg-black border border-valaroix-gold/40 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-valaroix-gold font-sans"
              />
              <Search className="w-5 h-5 text-valaroix-gold absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

            {/* Results List */}
            {searchResults.length > 0 ? (
              <div className="max-h-80 overflow-y-auto space-y-2 pt-2">
                {searchResults.map((item) => (
                  <Link
                    key={item.id}
                    href={`/product/${item.id}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-black/60 hover:bg-valaroix-gold/15 border border-valaroix-gold/20 transition-all"
                  >
                    <div>
                      <span className="font-serif-luxury font-bold text-white text-sm block">{item.name}</span>
                      <span className="text-xs text-gray-400">{item.subtitle}</span>
                    </div>
                    <span className="font-bold text-valaroix-gold text-xs">
                      From Rs. {item.pricing['50ml']['10h'].pkr.toLocaleString()}
                    </span>
                  </Link>
                ))}
              </div>
            ) : searchQuery.trim().length > 0 ? (
              <p className="text-center py-8 text-xs text-gray-400">No matching perfumes found.</p>
            ) : (
              <div className="pt-2 text-xs text-gray-400 font-sans space-y-2">
                <span className="block font-bold text-valaroix-gold uppercase text-[10px] tracking-wider">Popular Searches:</span>
                <div className="flex flex-wrap gap-2">
                  {['Sauvage Imperial', 'Cedrat Boise', 'Aventu Royal', 'Baccarat Amber'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-3 py-1.5 rounded-xl bg-black border border-valaroix-gold/30 hover:border-valaroix-gold text-gray-300 text-xs"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

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
                  <span className="font-serif-luxury text-lg font-bold text-white">VALAROIX</span>
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
                  <span>Boutique Collection</span>
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
