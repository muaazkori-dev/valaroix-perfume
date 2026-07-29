'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProductCatalog from '@/components/ProductCatalog';
import ReviewsSection from '@/components/ReviewsSection';
import TrackOrderModal from '@/components/TrackOrderModal';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import ProductDetailModal from '@/components/ProductDetailModal';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import CustomerAccountModal from '@/components/CustomerAccountModal';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] text-gray-100 font-sans relative overflow-x-hidden">
      {/* 1. Header Navbar */}
      <Navbar />

      {/* 2. Hero Showcase Banner */}
      <HeroSection />

      {/* 3. Our Collection Best Sellers Shelf (#F7F4EE Soft Cream) & Trust Badges */}
      <ProductCatalog />

      {/* 4. Customer Reviews & 5-Star Trust Section */}
      <ReviewsSection />

      {/* 5. Footer */}
      <Footer />

      {/* Floating WhatsApp Direct Chat Support Button */}
      <FloatingWhatsApp phoneNumber="923141397378" />

      {/* Customer Modals */}
      <AuthModal />
      <CustomerAccountModal />
      <CartDrawer />
      <CheckoutModal />
      <ProductDetailModal />
      <TrackOrderModal />
    </main>
  );
}
