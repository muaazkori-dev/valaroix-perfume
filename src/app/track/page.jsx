'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Search, Truck, CheckCircle2, MapPin, Package, Clock, 
  ShieldCheck, Phone, ArrowLeft, RefreshCw, AlertCircle, 
  Check, Sparkles, Navigation, Send
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/FloatingWhatsApp';

export default function TrackOrderPage() {
  const [searchQuery, setSearchQuery] = useState('VLX-81416');
  const [trackedData, setTrackedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchTracking = async (queryToSearch) => {
    const q = (queryToSearch || searchQuery || '').trim();
    if (!q) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/tracking?q=${encodeURIComponent(q)}`, { cache: 'no-store' });
      const data = await res.json();

      if (data.success && data.order) {
        setTrackedData(data.order);
        setErrorMsg(null);
      } else {
        setTrackedData(null);
        setErrorMsg(data.message || 'No tracking information found for this query.');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to live tracking server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch for demo/default
    fetchTracking('VLX-81416');
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTracking(searchQuery);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-gray-100 font-sans flex flex-col selection:bg-[#D4AF37] selection:text-black">
      {/* Top Navbar */}
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 pt-28 pb-20 space-y-8">
        
        {/* Header Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
            <Truck className="w-3.5 h-3.5" /> Official TCS Envio Live Tracking
          </div>
          <h1 className="font-serif-mockup text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Track Your Luxury Parcel
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
            Real-time live delivery milestones from Karachi Warehouse to your doorstep across Pakistan.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-[#141414] border border-[#D4AF37]/40 rounded-3xl p-4 sm:p-6 shadow-[0_0_50px_rgba(212,175,55,0.15)]">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#D4AF37] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Order # (VLX-81416) or Phone Number (03183931685) or TCS CN"
                className="w-full bg-black/80 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm font-mono text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl btn-mockup-gold text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all shrink-0"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Tracking...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track Parcel</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Search Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-3 text-[11px] text-gray-400">
            <span className="text-gray-500">Quick Test:</span>
            {['VLX-81416', '03183931685', '7780863721'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSearchQuery(tag);
                  fetchTracking(tag);
                }}
                className="px-2.5 py-0.5 rounded-lg bg-white/5 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] border border-white/5 font-mono transition-all cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Live Tracking Result Display */}
        {trackedData && (
          <div className="space-y-6">
            
            {/* Live Status Hero Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1A1A1A] to-[#121212] border border-[#D4AF37]/50 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#D4AF37] font-bold">Order ID: #{trackedData.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 uppercase">
                      Live TCS Envio
                    </span>
                  </div>
                  <h2 className="font-serif-mockup text-2xl sm:text-3xl font-bold text-white mt-1">
                    {trackedData.currentStatusText}
                  </h2>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">TCS Consignment CN</span>
                  <span className="font-mono font-bold text-base text-white block">{trackedData.tcsTrackingNumber}</span>
                  <span className="text-[11px] text-emerald-400 font-semibold mt-0.5 block">
                    ETA: {trackedData.expectedDelivery}
                  </span>
                </div>
              </div>

              {/* Progress Summary Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 text-xs font-mono">
                <div className="p-3 rounded-xl bg-black/60 border border-white/5">
                  <span className="text-[10px] text-gray-400 uppercase block font-sans">Origin</span>
                  <strong className="text-white text-xs sm:text-sm">{trackedData.origin}</strong>
                </div>
                <div className="p-3 rounded-xl bg-black/60 border border-white/5">
                  <span className="text-[10px] text-gray-400 uppercase block font-sans">Destination</span>
                  <strong className="text-[#D4AF37] text-xs sm:text-sm">{trackedData.destination}</strong>
                </div>
                <div className="p-3 rounded-xl bg-black/60 border border-white/5">
                  <span className="text-[10px] text-gray-400 uppercase block font-sans">Courier Partner</span>
                  <strong className="text-white text-xs sm:text-sm">{trackedData.courier}</strong>
                </div>
                <div className="p-3 rounded-xl bg-black/60 border border-white/5">
                  <span className="text-[10px] text-gray-400 uppercase block font-sans">Booking Date</span>
                  <strong className="text-white text-xs sm:text-sm">{trackedData.bookingDate}</strong>
                </div>
              </div>
            </div>

            {/* Visual Step-by-Step Milestones Timeline */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#141414] border border-white/10 space-y-6">
              <h3 className="font-serif-mockup text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Navigation className="w-5 h-5 text-[#D4AF37]" />
                <span>Live Shipment Checkpoints</span>
              </h3>

              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#D4AF37]/30">
                {trackedData.timeline && trackedData.timeline.map((item, idx) => (
                  <div key={idx} className="relative group">
                    {/* Node Dot */}
                    <div className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                      item.completed
                        ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.6)]'
                        : item.isCurrent
                        ? 'bg-amber-500 text-black border-amber-400 animate-pulse'
                        : 'bg-black text-gray-600 border-gray-700'
                    }`}>
                      {item.completed ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className={`text-sm sm:text-base font-bold ${item.completed ? 'text-white' : 'text-gray-500'}`}>
                          {item.title}
                        </h4>
                        <span className="text-[11px] font-mono text-gray-400">{item.timestamp}</span>
                      </div>
                      <p className="text-xs text-[#D4AF37] font-semibold">{item.location}</p>
                      <p className="text-xs text-gray-400">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recipient & Order Details Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Delivery Details */}
              <div className="p-5 rounded-2xl bg-[#141414] border border-white/10 space-y-3 text-xs">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Customer & Delivery Address</span>
                <div className="space-y-1.5">
                  <p className="font-bold text-white text-sm">{trackedData.customerName}</p>
                  <p className="text-gray-300"><strong className="text-gray-400">Phone:</strong> {trackedData.phone}</p>
                  <p className="text-gray-300"><strong className="text-gray-400">Address:</strong> {trackedData.address}, {trackedData.city}</p>
                </div>
              </div>

              {/* Fragrance Item & Payment */}
              <div className="p-5 rounded-2xl bg-[#141414] border border-white/10 space-y-3 text-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Ordered Fragrance</span>
                  <p className="font-bold text-white text-sm mt-1">{trackedData.item}</p>
                  <p className="text-gray-400 mt-1">Payment: <strong className="text-white uppercase">{trackedData.paymentMethod}</strong></p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10 font-mono">
                  <span className="text-gray-400">Total Bill:</span>
                  <span className="font-serif-mockup text-lg font-bold text-[#D4AF37]">Rs. {trackedData.total.toLocaleString()}</span>
                </div>
              </div>

            </div>

            {/* Help & WhatsApp Inquiry CTA */}
            <div className="p-5 rounded-2xl bg-black/80 border border-[#25D366]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/20 border border-[#25D366] flex items-center justify-center text-[#25D366] shrink-0">
                  <WhatsAppIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Need Urgent Delivery Help?</h4>
                  <p className="text-xs text-gray-400">Directly ask our logistics support team on WhatsApp</p>
                </div>
              </div>

              <a
                href={`https://wa.me/923029111856?text=${encodeURIComponent(
                  `Hello VALAROIX Support! I am tracking my parcel:\nOrder ID: #${trackedData.id}\nTCS CN: ${trackedData.tcsTrackingNumber}\nName: ${trackedData.customerName}\nStatus: ${trackedData.currentStatusText}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shrink-0"
              >
                <span>Ask on WhatsApp</span>
                <Send className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
