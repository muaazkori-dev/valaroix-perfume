'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProductCatalog from '@/components/ProductCatalog';
import FragranceNotesSection from '@/components/FragranceNotesSection';
import ShopCatalogPage from '@/components/ShopCatalogPage';
import CustomizerSection from '@/components/CustomizerSection';
import ScentFinderQuiz from '@/components/ScentFinderQuiz';
import VIPClubSection from '@/components/VIPClubSection';
import ReviewsSection from '@/components/ReviewsSection';
import TrackOrderModal from '@/components/TrackOrderModal';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import ProductDetailModal from '@/components/ProductDetailModal';
import AdminStudioDrawer from '@/components/admin/AdminStudioDrawer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import Footer from '@/components/Footer';

export default function Home() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <main className="min-h-screen bg-valaroix-dark text-gray-100 selection:bg-valaroix-gold selection:text-valaroix-dark font-sans relative overflow-x-hidden">
      {/* Navbar */}
      <Navbar onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Hero 3D Showcase */}
      <HeroSection onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* 3 Flagship Masterpiece Fragrances */}
      <ProductCatalog />

      {/* Fragrance Pyramid Notes */}
      <FragranceNotesSection />

      {/* Interactive Bespoke Atelier */}
      <CustomizerSection onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Full Boutique Shop */}
      <ShopCatalogPage />

      {/* VIP Club Privé */}
      <VIPClubSection />

      {/* Patron Reviews */}
      <ReviewsSection />

      {/* Footer with Social Media Links */}
      <Footer whatsappNumber="923000000000" />

      {/* Floating WhatsApp Luxury Concierge Button */}
      <FloatingWhatsApp phoneNumber="923000000000" />

      {/* Interactive Modals & Drawers */}
      <CartDrawer />
      <CheckoutModal />
      <ProductDetailModal />
      <ScentFinderQuiz />
      <TrackOrderModal />

      {/* 3D Motion Studio Drawer */}
      <AdminStudioDrawer isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </main>
  );
}
