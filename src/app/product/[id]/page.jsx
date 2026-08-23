'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Star, ShoppingBag, ShieldCheck, 
  Truck, CheckCircle2, RotateCcw, Clock, ChevronRight 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import FloatingWhatsApp, { WhatsAppIcon } from '@/components/FloatingWhatsApp';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { products } from '@/components/ProductCatalog';

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [quantity, setQuantity] = useState(1);

  // Find product by URL param ID, fallback to Sauvage
  const productId = params?.id || 'valaroix-sauvage-imperial';
  const product = products.find((p) => p.id === productId || p.id.includes(productId)) || products[0];

  const pricePkr = product.startingPrice?.pkr || product.exactPkr || 2699;

  const handleAddToCart = () => {
    if (product.isSoldOut) return;
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product, '50ml', 'None', '10h');
    }
  };

  const whatsappOrderUrl = `https://wa.me/923141397378?text=${encodeURIComponent(
    `Hello VALAROIX, I want to order: ${product.name} (50ml • Rs. ${pricePkr}). Please confirm my order.`
  )}`;

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-gray-100 font-sans relative overflow-x-hidden selection:bg-[#D4AF37] selection:text-black">
      {/* Navbar */}
      <Navbar />

      {/* Breadcrumb & Back Link */}
      <div className="pt-24 sm:pt-28 pb-4 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center gap-2 text-xs text-gray-400 font-sans">
          <Link href="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <Link href="/#shop" className="hover:text-[#D4AF37] transition-colors">Collection</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-[#D4AF37] font-semibold truncate">{product.name}</span>
        </div>
      </div>

      {/* Main Product Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          
          {/* LEFT: Product Photo Showcase */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative w-full h-[360px] sm:h-[480px] lg:h-[540px] rounded-3xl overflow-hidden bg-[#141414] border border-[#D4AF37]/30 shadow-2xl flex items-center justify-center p-4 sm:p-8 group">
              
              {/* Sold Out Tag */}
              {product.isSoldOut && (
                <div className="absolute top-4 left-4 z-20 bg-red-600 text-white text-xs font-black uppercase px-4 py-1.5 rounded-full shadow-2xl tracking-wider">
                  SOLD OUT
                </div>
              )}

              {/* Free Delivery Badge */}
              <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-emerald-500/40 text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-400" /> Free TCS Delivery
              </div>

              {/* Product Bottle Image */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain rounded-2xl group-hover:scale-105 transition-transform duration-500"
              />

              {/* Bottom Subtle Badge */}
              <div className="absolute bottom-4 left-4 right-4 z-20 bg-black/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
                <span className="text-gray-400">Size & Quality:</span>
                <span className="text-[#D4AF37] font-bold">50ml • 30% Pure Oil Extrait</span>
              </div>
            </div>

            {/* Quality Mini Badges */}
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-gray-300">
              <div className="p-2.5 rounded-xl bg-[#141414] border border-white/5 flex flex-col items-center gap-1">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-semibold">10-12h+ Lasting</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#141414] border border-white/5 flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-semibold">TCS 2-3 Days</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#141414] border border-white/5 flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-semibold">Easy Returns</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Simple, Clean Product Info & Buying Box */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Title & Subtitle */}
            <div className="space-y-2">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/30">
                HAUTE PARFUMERIE
              </span>
              <h1 className="font-serif-mockup text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 font-medium">
                {product.subtitle}
              </p>
            </div>

            {/* Price Box */}
            <div className="p-5 rounded-2xl bg-[#141414] border border-[#D4AF37]/40 flex items-center justify-between shadow-xl">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gray-400 block font-semibold">Special Price (Free Delivery)</span>
                <span className="font-serif-mockup text-2xl sm:text-3xl font-extrabold text-[#D4AF37]">
                  {formatPrice(product.startingPrice)}
                </span>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Free Delivery
                </span>
              </div>
            </div>

            {/* Product Key Specs (Easy to Understand) */}
            <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Bottle Volume:</span>
                <span className="font-bold text-white">50 ML Glass Bottle</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Oil Concentration:</span>
                <span className="font-bold text-[#D4AF37]">30% Pure Fragrance Oil</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Performance:</span>
                <span className="font-bold text-white">10 to 12+ Hours Lasting</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Courier Partner:</span>
                <span className="font-bold text-white">TCS Express Courier (Free)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400">Payment Options:</span>
                <span className="font-bold text-emerald-400">Cash on Delivery (COD) / Bank Transfer</span>
              </div>
            </div>

            {/* Fragrance Notes */}
            <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-2 text-xs">
              <h4 className="font-bold uppercase text-[11px] tracking-wider text-[#D4AF37]">
                Fragrance Scent Notes
              </h4>
              <div className="space-y-1.5 text-gray-300 text-[11px]">
                <p><strong className="text-gray-400">Top Notes:</strong> {product.topNotes || 'Fresh Bergamot & Citrus'}</p>
                <p><strong className="text-gray-400">Heart Notes:</strong> {product.heartNotes || 'Lavender, Spices & Rose'}</p>
                <p><strong className="text-gray-400">Base Notes:</strong> {product.baseNotes || 'Amberwood, Leather & Sandalwood'}</p>
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              
              {!product.isSoldOut && (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-gray-300">Quantity:</span>
                  <div className="flex items-center border border-[#D4AF37]/40 rounded-xl bg-[#141414] overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-sm font-bold text-white hover:bg-white/10"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-xs font-bold text-[#D4AF37] font-mono">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1.5 text-sm font-bold text-white hover:bg-white/10"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Main Button */}
              {product.isSoldOut ? (
                <button
                  disabled
                  className="w-full py-4 rounded-2xl bg-gray-800 text-gray-500 font-bold uppercase tracking-wider text-xs cursor-not-allowed text-center border border-gray-700"
                >
                  CURRENTLY SOLD OUT
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 rounded-2xl btn-mockup-gold text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" /> ADD TO CART ({formatPrice(pricePkr * quantity)})
                </button>
              )}

              {/* Direct WhatsApp Order CTA */}
              {!product.isSoldOut && (
                <a
                  href={whatsappOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-colors text-center block"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                  <span>Order Directly on WhatsApp</span>
                </a>
              )}
            </div>

            {/* Guarantee / Return Policy */}
            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-3 border-t border-white/10">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> 100% Original Scent
              </span>
              <span className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" /> 7 Days Money-Back Guarantee
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp */}
      <FloatingWhatsApp phoneNumber="923141397378" />

      {/* Drawers */}
      <CartDrawer />
      <CheckoutModal />
    </main>
  );
}
