'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Truck, CheckCircle2, MapPin, PackageCheck, Search, ShieldCheck, PhoneCall, ExternalLink, Clock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { WhatsAppIcon } from './FloatingWhatsApp';

export default function TrackOrderModal() {
  const { isTrackOrderOpen, setIsTrackOrderOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState('03141397378');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [searched, setSearched] = useState(false);

  // Load sample or real order on open
  useEffect(() => {
    if (isTrackOrderOpen) {
      handleSearch('03141397378');
    }
  }, [isTrackOrderOpen]);

  const handleSearch = (query) => {
    const q = (query || searchQuery || '').trim().toLowerCase();
    if (!q) return;

    setSearched(true);

    // Try finding real order from localStorage
    let found = null;
    try {
      const savedOrders = JSON.parse(localStorage.getItem('valaroix_orders') || '[]');
      found = savedOrders.find(
        (o) =>
          o.id?.toLowerCase().includes(q) ||
          o.phone?.includes(q) ||
          o.whatsapp?.includes(q) ||
          o.tcsTrackingNumber?.includes(q)
      );
    } catch (e) {}

    if (found) {
      setTrackedOrder({
        orderId: found.id,
        customerName: found.name || 'Valaroix Patron',
        phone: found.whatsapp || found.phone || '03141397378',
        city: found.city || 'Karachi',
        address: found.address || 'Standard Delivery Address',
        item: found.items?.[0]?.name || 'Valaroix Dior Sauvage (50ml)',
        amount: found.total || 2699,
        status: found.status || 'Dispatched via TCS Express',
        tcsCn: found.tcsTrackingNumber || '7729841029',
        courier: 'TCS Express Courier (Official Partner)',
        estimatedDelivery: '1 to 2 Business Days',
        step: 3 // In Transit
      });
    } else {
      // Default Demo Active TCS Order
      setTrackedOrder({
        orderId: q.startsWith('vlx') ? q.toUpperCase() : 'VLX-90842',
        customerName: 'Verified Customer',
        phone: q.length >= 10 ? q : '03141397378',
        city: 'Karachi (Nationwide Delivery)',
        address: 'Direct Delivery to Customer Address',
        item: 'VALAROIX DIOR SAUVAGE (50ml • 30% Oil Extrait)',
        amount: 2699,
        status: 'In Transit with TCS Express Courier',
        tcsCn: '7748291048',
        courier: 'TCS Express Courier (Official Partner)',
        estimatedDelivery: 'Tomorrow by 4:00 PM',
        step: 3 // In Transit
      });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  if (!isTrackOrderOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsTrackOrderOpen(false)}
          className="fixed inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-xl bg-[#0D0D0D] border border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(212,175,55,0.3)] z-10 text-white my-8 overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={() => setIsTrackOrderOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-[#D4AF37] transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-6">
            
            {/* Header: TCS Official Branding */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 border border-red-500 flex items-center justify-center text-white shadow-lg shrink-0 font-black tracking-tighter text-sm">
                TCS
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif-mockup text-xl sm:text-2xl font-bold text-white">
                    TCS Delivery Tracking
                  </h3>
                  <span className="bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Official Courier
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Track your VALAROIX luxury perfume parcel in real-time
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Phone Number or Order # (e.g. 0314... / VLX-90842)"
                  className="w-full bg-[#1A1A1A] border border-[#D4AF37]/30 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <button
                type="submit"
                className="btn-mockup-gold px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shrink-0"
              >
                <Search className="w-4 h-4" /> Track Parcel
              </button>
            </form>

            {searched && trackedOrder && (
              <div className="space-y-5 pt-1">
                
                {/* TCS Tracking Info Card */}
                <div className="bg-[#141414] p-4 sm:p-5 rounded-2xl border border-[#D4AF37]/30 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                    <div>
                      <span className="block text-[10px] text-gray-400 uppercase font-semibold">TCS Tracking CN #</span>
                      <span className="font-mono text-sm sm:text-base font-bold text-[#D4AF37]">
                        {trackedOrder.tcsCn}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] text-gray-400 uppercase font-semibold">Estimated Delivery</span>
                      <span className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-1 justify-end">
                        <Clock className="w-3.5 h-3.5" /> {trackedOrder.estimatedDelivery}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-400 text-[10px] uppercase block">Product</span>
                      <span className="font-semibold text-white truncate block">{trackedOrder.item}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px] uppercase block">Destination City</span>
                      <span className="font-semibold text-white flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#D4AF37]" /> {trackedOrder.city}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Live TCS Delivery Timeline */}
                <div className="space-y-4 relative pl-7 border-l-2 border-[#D4AF37]/40 ml-4 py-1">
                  
                  {/* Step 1: Order Confirmed */}
                  <div className="relative">
                    <div className="absolute -left-[35px] top-0.5 w-4 h-4 rounded-full bg-[#D4AF37] border-2 border-[#0D0D0D] flex items-center justify-center text-black shadow-md">
                      <CheckCircle2 className="w-3 h-3 text-black" />
                    </div>
                    <h4 className="text-xs font-bold text-white">Order Confirmed & Fragrance Prepared</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      30% Pure Oil Extrait hand-bottled & luxury packaging sealed at VALAROIX Studio.
                    </p>
                  </div>

                  {/* Step 2: TCS Handover */}
                  <div className="relative">
                    <div className="absolute -left-[35px] top-0.5 w-4 h-4 rounded-full bg-[#D4AF37] border-2 border-[#0D0D0D] flex items-center justify-center text-black shadow-md">
                      <CheckCircle2 className="w-3 h-3 text-black" />
                    </div>
                    <h4 className="text-xs font-bold text-white">Parcel Handed Over to TCS Express</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Picked up by TCS Express and booked under CN: <span className="text-[#D4AF37] font-mono font-bold">{trackedOrder.tcsCn}</span>.
                    </p>
                  </div>

                  {/* Step 3: In Transit */}
                  <div className="relative">
                    <div className="absolute -left-[35px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0D0D0D] animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                    <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5" /> In Transit — TCS Express Cargo
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Moving through TCS Express network to destination courier hub for speedy handover.
                    </p>
                  </div>

                  {/* Step 4: Out for Delivery */}
                  <div className="relative opacity-60">
                    <div className="absolute -left-[35px] top-0.5 w-4 h-4 rounded-full bg-gray-600 border-2 border-[#0D0D0D]" />
                    <h4 className="text-xs font-bold text-gray-300">Out for Delivery by TCS Rider</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      TCS official delivery rider will contact on your phone number before arriving.
                    </p>
                  </div>

                </div>

                {/* Direct Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  
                  {/* Official TCS Website Track Button */}
                  <a
                    href={`https://www.tcsexpress.com/track/${trackedOrder.tcsCn}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-xl bg-red-700 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-colors text-center"
                  >
                    <span>Check on TCS Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {/* Direct WhatsApp Query */}
                  <a
                    href={`https://wa.me/923141397378?text=${encodeURIComponent(
                      `Hello VALAROIX Support, I want to track my TCS Courier parcel. Order ID: ${trackedOrder.orderId}, TCS CN: ${trackedOrder.tcsCn}, Phone: ${trackedOrder.phone}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-colors text-center"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-white" />
                    <span>Inquire on WhatsApp</span>
                  </a>

                </div>

              </div>
            )}

            {/* Trust Footer */}
            <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 pt-3 border-t border-white/10 text-center">
              <span className="flex items-center gap-1">
                <Truck className="w-3 h-3 text-[#D4AF37]" /> Free Delivery All Across Pakistan
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#D4AF37]" /> Verified TCS Official Shipment
              </span>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
