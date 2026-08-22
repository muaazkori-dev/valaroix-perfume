'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, Search, User, Menu, X, Truck, 
  Sparkles, Compass, Sliders, ChevronRight 
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { products } from './ProductCatalog';

export default function Navbar({ onOpenAdmin }) {
  const { cart, setIsCartOpen, setIsTrackOrderOpen } = useCart();
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
      
      {/* EXACT MOCKUP HEADER NAVBAR */}
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? 'py-3 bg-[#0D0D0D]/98 border-b border-[#D4AF37]/30 shadow-2xl backdrop-blur-md'
            : 'py-4 bg-[#0D0D0D] border-b border-[#D4AF37]/20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-4">
          
          {/* LEFT: BRAND EMBLEM LOGO & TITLE */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 rounded-full border border-[#D4AF37]/60 p-0.5 bg-[#1A1A1A] overflow-hidden shrink-0">
              <img
                src="/logo.jpg"
                alt="VALAROIX Emblem"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="font-serif-mockup text-lg sm:text-xl font-bold tracking-widest text-white group-hover:text-[#D4AF37] transition-colors leading-tight">
              VALAROIX
            </span>
          </Link>

          {/* CENTER: DESKTOP NAVIGATION LINKS (MATCHING MOCKUP) */}
          <nav className="hidden lg:flex items-center gap-8 text-xs uppercase font-semibold tracking-widest text-gray-300">
            <a href="#hero" className="hover:text-[#D4AF37] transition-colors py-1">HOME</a>
            <a href="#shop" className="hover:text-[#D4AF37] transition-colors py-1">SHOP</a>
            <a href="#shop" className="hover:text-[#D4AF37] transition-colors py-1">COLLECTIONS</a>
            <a href="#notes" className="hover:text-[#D4AF37] transition-colors py-1">ABOUT US</a>
            <a href="#customizer" className="hover:text-[#D4AF37] transition-colors py-1">CONTACT</a>
          </nav>

          {/* RIGHT: CLEAN ICONS (SEARCH, USER, CART, MENU) */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* SEARCH ICON */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-lg text-gray-300 hover:text-[#D4AF37] transition-colors"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* TRACK ORDER */}
            <button
              onClick={() => setIsTrackOrderOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D4AF37]/30 text-xs text-gray-300 hover:text-[#D4AF37] transition-all"
              title="Track Order"
            >
              <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Track</span>
            </button>

            {/* USER SIGN IN / ACCOUNT */}
            <button
              onClick={handleUserClick}
              className="p-2 rounded-lg text-gray-300 hover:text-[#D4AF37] transition-colors"
              title={user ? 'My Account' : 'Sign In'}
            >
              {user ? (
                <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-[#0D0D0D] text-xs font-bold flex items-center justify-center">
                  {(user.user_metadata?.full_name || user.email)?.[0]?.toUpperCase()}
                </span>
              ) : (
                <User className="w-5 h-5" />
              )}
            </button>

            {/* CART BAG BUTTON */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-3 py-1.5 rounded-full btn-mockup-gold text-xs font-bold text-[#0D0D0D] flex items-center gap-1.5 shadow-md"
              title="Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#0D0D0D]" />
              <span>Cart</span>
              {totalItems > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#0D0D0D] text-[#D4AF37] text-[10px] font-bold min-w-[16px] text-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* 3 LINES MENU BUTTON */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-[#D4AF37] lg:hidden transition-colors"
              title="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

          </div>

        </div>
      </div>

      {/* FULLSCREEN SEARCH MODAL OVERLAY */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-2xl w-full bg-[#1A1A1A] border border-[#D4AF37]/40 rounded-3xl p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-4">
              <span className="font-serif-mockup text-lg font-bold text-[#D4AF37] tracking-wider">
                SEARCH VALAROIX BOUTIQUE
              </span>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 rounded-full bg-[#0D0D0D] text-gray-400 hover:text-[#D4AF37]"
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
                className="w-full bg-[#0D0D0D] border border-[#D4AF37]/40 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
              />
              <Search className="w-5 h-5 text-[#D4AF37] absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

            {/* Results List */}
            {searchResults.length > 0 ? (
              <div className="max-h-80 overflow-y-auto space-y-2 pt-2">
                {searchResults.map((item) => (
                  <Link
                    key={item.id}
                    href={`/product/${item.id}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0D0D0D] hover:bg-[#D4AF37]/15 border border-[#D4AF37]/20 transition-all"
                  >
                    <div>
                      <span className="font-serif-mockup font-bold text-white text-sm block">{item.name}</span>
                      <span className="text-xs text-gray-400">{item.subtitle}</span>
                    </div>
                    <span className="font-bold text-[#D4AF37] text-xs">
                      From Rs. {item.pricing['50ml']['10h'].pkr.toLocaleString()}
                    </span>
                  </Link>
                ))}
              </div>
            ) : searchQuery.trim().length > 0 ? (
              <p className="text-center py-8 text-xs text-gray-400">No matching perfumes found.</p>
            ) : null}

          </div>
        </div>
      )}

      {/* MOBILE MENU DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="relative w-80 max-w-full bg-[#1A1A1A] border-r border-[#D4AF37]/30 p-6 shadow-2xl flex flex-col justify-between z-10 space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-[#D4AF37] p-0.5">
                    <img src="/logo.jpg" alt="Logo" className="w-full h-full rounded-full object-cover" />
                  </div>
                  <span className="font-serif-mockup text-lg font-bold text-white">VALAROIX</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-full bg-[#0D0D0D] text-gray-400 hover:text-[#D4AF37]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-2 text-sm font-semibold uppercase tracking-wider text-gray-200">
                <a
                  href="#hero"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#D4AF37]/15 hover:text-[#D4AF37] transition-all"
                >
                  <span>HOME</span>
                  <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
                </a>

                <a
                  href="#shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#D4AF37]/15 hover:text-[#D4AF37] transition-all"
                >
                  <span>SHOP</span>
                  <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
                </a>

                <a
                  href="#shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#D4AF37]/15 hover:text-[#D4AF37] transition-all"
                >
                  <span>COLLECTIONS</span>
                  <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
                </a>

                <a
                  href="#notes"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#D4AF37]/15 hover:text-[#D4AF37] transition-all"
                >
                  <span>ABOUT US</span>
                  <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
                </a>

                <a
                  href="#customizer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#D4AF37]/15 hover:text-[#D4AF37] transition-all"
                >
                  <span>CONTACT</span>
                  <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
                </a>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-[#D4AF37]/20">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-3 rounded-xl bg-[#0D0D0D] text-[#D4AF37] text-xs uppercase font-bold flex items-center justify-center gap-2 border border-[#D4AF37]/30"
              >
                <Sliders className="w-4 h-4" /> Partner Admin Panel
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
}
