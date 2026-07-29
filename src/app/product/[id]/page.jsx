'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Star, ShoppingBag, Clock, Sparkles, ShieldCheck, 
  Truck, Check, PenTool, Flame, RefreshCw, Award, ChevronRight 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import AdminStudioDrawer from '@/components/admin/AdminStudioDrawer';
import ValaroixBottleCanvas from '@/components/3d/ValaroixBottleCanvas';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { products } from '@/components/ProductCatalog';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, setIsCheckoutOpen } = useCart();
  const { formatPrice, currency } = useCurrency();
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Find product by URL param ID, fallback to Sauvage
  const productId = params?.id || 'sauvage';
  const product = products.find((p) => p.id === productId) || products[0];

  // Options State
  const [selectedSize, setSelectedSize] = useState('100ml'); // '50ml' | '100ml'
  const [selectedEdition, setSelectedEdition] = useState('24h'); // '10h' | '24h'
  const [engraving, setEngraving] = useState('');
  const [activeTab, setActiveTab] = useState('notes');

  // Dynamic Price calculation based on exact pricing matrix
  const getSelectedPriceObj = (size = selectedSize, edition = selectedEdition) => {
    if (product.pricing && product.pricing[size] && product.pricing[size][edition]) {
      const base = product.pricing[size][edition];
      if (engraving.trim().length > 0) {
        return {
          pkr: base.pkr + 500,
          usd: base.usd + 2
        };
      }
      return base;
    }
    return { pkr: 2499, usd: 9 };
  };

  const finalPriceObj = getSelectedPriceObj();

  const handleAddToCart = () => {
    const customizedProduct = {
      ...product,
      name: `${product.name} (${selectedSize} • ${selectedEdition === '24h' ? '24 Hours+ Extrait' : '10 Hours+ EDP'})`,
      price: currency === 'PKR' ? finalPriceObj.pkr / 280 : finalPriceObj.usd,
      exactPkr: finalPriceObj.pkr
    };
    addToCart(customizedProduct, selectedSize, engraving);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setIsCheckoutOpen(true);
  };

  return (
    <main className="min-h-screen bg-valaroix-dark text-gray-100 selection:bg-valaroix-gold selection:text-valaroix-dark font-sans relative overflow-x-hidden">
      {/* Luxury Navbar */}
      <Navbar onOpenAdmin={() => setIsAdminOpen(true)} />

      <div className="pt-28 pb-20 max-w-7xl mx-auto px-6">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-8 font-mono">
          <Link href="/" className="hover:text-valaroix-gold transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-valaroix-gold/50" />
          <Link href="/#catalog" className="hover:text-valaroix-gold transition-colors">Fragrances</Link>
          <ChevronRight className="w-3.5 h-3.5 text-valaroix-gold/50" />
          <span className="text-valaroix-gold font-bold">{product.name}</span>
        </div>

        {/* Back Button */}
        <Link
          href="/#catalog"
          className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-valaroix-gold hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back To Collection
        </Link>

        {/* Main Product Showcase Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Interactive 3D Bottle Stage (6 Cols) */}
          <div className="lg:col-span-6 h-[500px] lg:h-[620px] relative rounded-3xl glass-panel border border-valaroix-gold/30 shadow-[0_0_60px_rgba(212,175,55,0.18)] overflow-hidden">
            
            {/* Tag Badge */}
            <div className="absolute top-6 left-6 z-20 px-3.5 py-1.5 rounded-full glass-panel-gold border border-valaroix-gold/50 text-valaroix-gold text-xs font-bold uppercase tracking-wider">
              {product.tag}
            </div>

            {/* Drag Hint */}
            <div className="absolute top-6 right-6 z-20 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-valaroix-gold/30 text-[11px] text-gray-300 font-mono">
              360° Interactive 3D Model
            </div>

            {/* 3D WebGL Bottle Canvas */}
            <ValaroixBottleCanvas interactive={true} />

            <div className="absolute bottom-6 left-6 right-6 z-20 p-4 rounded-2xl glass-panel border-valaroix-gold/20 flex items-center justify-between text-xs">
              <span className="text-gray-300 font-medium">Selected Bottle Finish:</span>
              <span className="font-serif text-valaroix-gold font-bold">{product.name.split(' ')[1]} Metallic Edition</span>
            </div>
          </div>

          {/* Right Column: Options & Purchase Customization (6 Cols) */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Title & Subtitle */}
            <div className="space-y-2">
              <span className="text-xs uppercase font-mono tracking-widest text-valaroix-gold bg-valaroix-gold/10 px-3 py-1 rounded-full border border-valaroix-gold/30">
                {selectedEdition === '24h' ? '24 Hours+ Pure Extrait Concentration' : '10 Hours+ Intense Eau De Parfum'}
              </span>

              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight mt-3">
                {product.name}
              </h1>
              
              <p className="text-sm text-valaroix-gold/90 font-medium">
                {product.subtitle}
              </p>

              {/* Rating & In Stock */}
              <div className="flex items-center gap-4 text-xs pt-2">
                <div className="flex items-center text-valaroix-gold font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 text-sm">{product.rating}</span>
                </div>
                <span className="text-gray-400">({product.reviewsCount} Verified Patron Reviews)</span>
                <span className="text-valaroix-emerald font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-valaroix-emerald animate-ping" /> In Stock (Batch #904)
                </span>
              </div>
            </div>

            <p className="text-gray-300 text-sm font-light leading-relaxed">
              {product.description}
            </p>

            {/* Dynamic Calculated Price with Exact Currency Formatting */}
            <div className="p-6 rounded-2xl glass-panel-gold border border-valaroix-gold flex items-center justify-between shadow-2xl">
              <div>
                <span className="block text-xs text-gray-400 uppercase tracking-wider">Total Special Price ({selectedSize} • {selectedEdition === '24h' ? '24 Hours+' : '10 Hours+'})</span>
                <span className="font-serif text-4xl font-bold text-gold-gradient">
                  {formatPrice(finalPriceObj)}
                </span>
              </div>

              <div className="text-right text-xs text-valaroix-gold font-mono">
                <span className="block">Complimentary Express Courier</span>
                <span className="text-gray-400">Includes 24k Gold Atomizer</span>
              </div>
            </div>

            {/* OPTION 1: BOTTLE VOLUME SIZE SELECTOR */}
            <div className="glass-panel p-6 rounded-2xl border-valaroix-gold/25 space-y-3">
              <label className="block text-xs uppercase tracking-widest text-valaroix-gold font-bold">
                1. Choose Bottle Volume Size
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedSize('50ml')}
                  className={`py-3.5 px-4 rounded-xl text-xs font-bold border uppercase transition-all flex flex-col items-center gap-1 ${
                    selectedSize === '50ml'
                      ? 'bg-valaroix-gold text-valaroix-dark border-valaroix-gold shadow-lg'
                      : 'bg-black/60 text-gray-300 border-valaroix-gold/20 hover:border-valaroix-gold'
                  }`}
                >
                  <span>50 ml Edition</span>
                  <span className="text-[10px] opacity-80 font-mono">
                    Starting {formatPrice(getSelectedPriceObj('50ml', '10h'))}
                  </span>
                </button>

                <button
                  onClick={() => setSelectedSize('100ml')}
                  className={`py-3.5 px-4 rounded-xl text-xs font-bold border uppercase transition-all flex flex-col items-center gap-1 ${
                    selectedSize === '100ml'
                      ? 'bg-valaroix-gold text-valaroix-dark border-valaroix-gold shadow-lg'
                      : 'bg-black/60 text-gray-300 border-valaroix-gold/20 hover:border-valaroix-gold'
                  }`}
                >
                  <span>100 ml Edition</span>
                  <span className="text-[10px] opacity-80 font-mono">
                    Starting {formatPrice(getSelectedPriceObj('100ml', '10h'))}
                  </span>
                </button>
              </div>
            </div>

            {/* OPTION 2: LONGEVITY & LASTING EDITION SELECTOR */}
            <div className="glass-panel p-6 rounded-2xl border-valaroix-gold/25 space-y-3">
              <label className="block text-xs uppercase tracking-widest text-valaroix-gold font-bold flex items-center gap-2">
                <Clock className="w-4 h-4" /> 2. Choose Longevity Lasting Edition ({selectedSize})
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedEdition('10h')}
                  className={`p-4 rounded-xl border text-left transition-all relative ${
                    selectedEdition === '10h'
                      ? 'bg-valaroix-gold/20 border-valaroix-gold text-white shadow-lg'
                      : 'bg-black/60 border-valaroix-gold/20 text-gray-400 hover:border-valaroix-gold/50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-gray-100">10 Hours+ Lasting</span>
                    <span className="font-mono text-xs text-valaroix-gold">
                      {formatPrice(getSelectedPriceObj(selectedSize, '10h'))}
                    </span>
                  </div>
                  <span className="block text-[11px] text-gray-400">Eau de Parfum Intense (20% Oil)</span>
                </button>

                <button
                  onClick={() => setSelectedEdition('24h')}
                  className={`p-4 rounded-xl border text-left transition-all relative ${
                    selectedEdition === '24h'
                      ? 'bg-valaroix-gold text-valaroix-dark border-valaroix-gold font-bold shadow-xl'
                      : 'bg-black/60 border-valaroix-gold/20 text-gray-400 hover:border-valaroix-gold/50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm">24 Hours+ Lasting 🔥</span>
                    <span className="font-mono text-xs">
                      {formatPrice(getSelectedPriceObj(selectedSize, '24h'))}
                    </span>
                  </div>
                  <span className={`block text-[11px] ${selectedEdition === '24h' ? 'text-valaroix-dark/80 font-medium' : 'text-gray-400'}`}>
                    Pure Extrait De Parfum (35% Oil)
                  </span>
                </button>
              </div>
            </div>

            {/* OPTION 3: DIAMOND LASER MONOGRAM ENGRAVING */}
            <div className="glass-panel p-6 rounded-2xl border-valaroix-gold/25 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase tracking-widest text-valaroix-gold font-bold flex items-center gap-2">
                  <PenTool className="w-4 h-4" /> 3. Custom Monogram Laser Engraving (+{formatPrice({ pkr: 500, usd: 2 })})
                </label>
                <span className="text-[10px] text-gray-400">Optional</span>
              </div>
              <input
                type="text"
                maxLength={12}
                value={engraving}
                onChange={(e) => setEngraving(e.target.value)}
                placeholder="Enter Name / Monogram (e.g. V.A. 2026)"
                className="w-full bg-black border border-valaroix-gold/30 rounded-xl px-4 py-3 text-xs font-mono text-valaroix-gold tracking-widest uppercase focus:outline-none focus:border-valaroix-gold"
              />
            </div>

            {/* ACTION CTAs: Add to Cart & Buy Now */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="btn-gold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 text-xs uppercase font-bold tracking-wider shadow-2xl"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart ({formatPrice(finalPriceObj)})
              </button>

              <button
                onClick={handleBuyNow}
                className="py-4 px-6 rounded-2xl glass-panel-gold border border-valaroix-gold text-valaroix-gold text-xs uppercase font-bold tracking-wider hover:bg-valaroix-gold hover:text-valaroix-dark transition-all shadow-2xl"
              >
                Buy Now ⚡
              </button>
            </div>

            {/* Trust Guarantee Icons */}
            <div className="grid grid-cols-3 gap-3 text-center pt-2 text-[10px] text-gray-400">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-valaroix-gold" />
                <span>Express Courier Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-valaroix-gold" />
                <span>100% Authenticity Guarantee</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Award className="w-4 h-4 text-valaroix-gold" />
                <span>Master Perfumer Certificate</span>
              </div>
            </div>

            {/* Accordion Tabs for Scent Details & Ingredients */}
            <div className="pt-6 border-t border-valaroix-gold/20 space-y-4">
              <div className="flex gap-4 border-b border-valaroix-gold/20 pb-3 text-xs font-bold uppercase tracking-wider">
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`pb-2 transition-all ${
                    activeTab === 'notes' ? 'text-valaroix-gold border-b-2 border-valaroix-gold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Olfactory Notes
                </button>
                <button
                  onClick={() => setActiveTab('craft')}
                  className={`pb-2 transition-all ${
                    activeTab === 'craft' ? 'text-valaroix-gold border-b-2 border-valaroix-gold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Longevity & Craft
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-2 transition-all ${
                    activeTab === 'shipping' ? 'text-valaroix-gold border-b-2 border-valaroix-gold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Shipping & Return
                </button>
              </div>

              {activeTab === 'notes' && (
                <div className="space-y-3 text-xs text-gray-300 font-light">
                  <div className="p-3 rounded-xl glass-panel">
                    <strong className="text-valaroix-gold font-mono uppercase block mb-1">Top Notes:</strong>
                    <span>{product.topNotes}</span>
                  </div>
                  <div className="p-3 rounded-xl glass-panel">
                    <strong className="text-valaroix-gold font-mono uppercase block mb-1">Heart Notes:</strong>
                    <span>{product.heartNotes}</span>
                  </div>
                  <div className="p-3 rounded-xl glass-panel">
                    <strong className="text-valaroix-gold font-mono uppercase block mb-1">Base Notes:</strong>
                    <span>{product.baseNotes}</span>
                  </div>
                </div>
              )}

              {activeTab === 'craft' && (
                <div className="p-4 rounded-xl glass-panel text-xs text-gray-300 space-y-2 leading-relaxed font-light">
                  <p><strong>Maceration:</strong> Aged for 180 days in French Oak Casks in Grasse, France.</p>
                  <p><strong>Concentration:</strong> 24 Hours+ Extrait contains 35% pure perfume oil density.</p>
                  <p><strong>Bottle:</strong> Hand-faceted crystal glass with 24k gold leaf atomizer nozzle.</p>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="p-4 rounded-xl glass-panel text-xs text-gray-300 space-y-2 leading-relaxed font-light">
                  <p><strong>Express Courier:</strong> Dispatched via DHL Express within 24 hours.</p>
                  <p><strong>Packaging:</strong> Encased in an obsidian velvet gift box with security seal.</p>
                  <p><strong>Returns:</strong> 30-Day VIP Satisfaction Guarantee.</p>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Drawers and Modals */}
      <CartDrawer />
      <CheckoutModal />
      <AdminStudioDrawer isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </main>
  );
}
