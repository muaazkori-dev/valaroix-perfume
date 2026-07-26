'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FragranceNotesSection from '@/components/FragranceNotesSection';
import ProductCatalog from '@/components/ProductCatalog';
import ShopCatalogPage from '@/components/ShopCatalogPage';
import CustomizerSection from '@/components/CustomizerSection';
import VIPClubSection from '@/components/VIPClubSection';
import ReviewsSection from '@/components/ReviewsSection';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import ProductDetailModal from '@/components/ProductDetailModal';
import ScentFinderQuiz from '@/components/ScentFinderQuiz';
import TrackOrderModal from '@/components/TrackOrderModal';
import AdminStudioDrawer from '@/components/admin/AdminStudioDrawer';
import { Sparkles, ShieldCheck, Truck, Award } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Home() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const { setIsQuizOpen, setIsTrackOrderOpen } = useCart();

  return (
    <main className="min-h-screen bg-valaroix-dark relative selection:bg-valaroix-gold selection:text-valaroix-dark overflow-x-hidden">
      {/* Luxury Navigation Bar */}
      <Navbar onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Hero 3D Showcase Stage */}
      <HeroSection onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* E-Commerce Value Proposition Banner */}
      <section className="py-8 bg-black border-t border-b border-valaroix-gold/20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <Truck className="w-5 h-5 text-valaroix-gold" />
            <span className="text-xs font-bold text-gray-200 uppercase tracking-wider">Free Express Courier Delivery</span>
            <span className="text-[10px] text-gray-500">Handcrafted & shipped from Grasse, France</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Award className="w-5 h-5 text-valaroix-gold" />
            <span className="text-xs font-bold text-gray-200 uppercase tracking-wider">100% Extrait Concentration</span>
            <span className="text-[10px] text-gray-500">Highest 30%+ pure perfume oil density</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-valaroix-gold" />
            <span className="text-xs font-bold text-gray-200 uppercase tracking-wider">Numbered Certificate</span>
            <span className="text-[10px] text-gray-500">Signed by Master Perfumer</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Sparkles className="w-5 h-5 text-valaroix-gold" />
            <span className="text-xs font-bold text-gray-200 uppercase tracking-wider">24k Gold Atomizer Nozzle</span>
            <span className="text-[10px] text-gray-500">Hand-finished metallic cap & medallion</span>
          </div>
        </div>
      </section>

      {/* Full E-Commerce Shop Boutique (Search, Categories, Sorting, Wishlist) */}
      <ShopCatalogPage />

      {/* Olfactory Composition Notes Breakdown */}
      <FragranceNotesSection />

      {/* Flagship Collection Showcase */}
      <ProductCatalog />

      {/* Bespoke Monogramming Customizer */}
      <CustomizerSection />

      {/* VIP Loyalty Privé Program */}
      <VIPClubSection />

      {/* Verified Patron Reviews & Ratings */}
      <ReviewsSection />

      {/* Footer */}
      <footer className="bg-black py-16 border-t border-valaroix-gold/25 text-gray-400 text-xs">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo.jpg" alt="VALAROIX Logo" className="w-8 h-8 rounded-full border border-valaroix-gold" />
              <span className="font-serif text-2xl font-bold tracking-[0.2em] text-gold-gradient">
                VALAROIX
              </span>
            </div>
            <p className="font-light text-gray-400 leading-relaxed text-xs">
              Maison De Haute Parfumerie. Crafting immortal fragrances encased in hand-faceted crystal glass.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white uppercase tracking-widest text-xs">E-Commerce Boutique</h4>
            <ul className="space-y-2 font-light">
              <li><a href="#shop" className="hover:text-valaroix-gold transition-colors">All Perfumes</a></li>
              <li><button onClick={() => setIsQuizOpen(true)} className="hover:text-valaroix-gold transition-colors">Scent Profiler Quiz</button></li>
              <li><button onClick={() => setIsTrackOrderOpen(true)} className="hover:text-valaroix-gold transition-colors">Track Courier Order</button></li>
              <li><a href="#customizer" className="hover:text-valaroix-gold transition-colors">Bespoke Engraving</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white uppercase tracking-widest text-xs">Services & VIP</h4>
            <ul className="space-y-2 font-light">
              <li><a href="#customizer" className="hover:text-valaroix-gold transition-colors">Diamond Laser Monogramming</a></li>
              <li><a href="#customizer" className="hover:text-valaroix-gold transition-colors">Velvet Box Customization</a></li>
              <li><button onClick={() => setIsAdminOpen(true)} className="hover:text-valaroix-gold transition-colors">3D Studio Experience</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white uppercase tracking-widest text-xs">Maison Atelier</h4>
            <p className="font-light leading-relaxed">
              28 Rue du Faubourg Saint-Honoré, 75008 Paris, France
            </p>
            <p className="font-mono text-valaroix-gold">vip@valaroix-parfums.com</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-valaroix-gold/15 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-500">
          <p>© 2026 VALAROIX HAUTE PARFUMERIE. All rights reserved.</p>
          <div className="flex gap-6">
            <button onClick={() => setIsAdminOpen(true)} className="text-valaroix-gold hover:underline">
              Launch 3D Admin Studio
            </button>
          </div>
        </div>
      </footer>

      {/* Drawers and Modals */}
      <CartDrawer />
      <CheckoutModal />
      <ProductDetailModal />
      <ScentFinderQuiz />
      <TrackOrderModal />
      <AdminStudioDrawer isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </main>
  );
}
