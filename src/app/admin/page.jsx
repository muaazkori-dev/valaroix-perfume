'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  DollarSign, TrendingUp, Package, Users, ShoppingBag, Truck, CheckCircle2, 
  Clock, ArrowLeft, RefreshCw, Smartphone, Sparkles, Filter, ChevronRight, 
  MessageSquare, Sliders, ExternalLink, Download, AlertCircle, Users2, Split, Check, X, Eye, PhoneCall, Printer, FileText, Lock, ShieldCheck, Key
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboardPage() {
  const { userOrders, setUserOrders } = useAuth();
  
  // Security Gate State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState('orders');
  const [orderFilter, setOrderFilter] = useState('all');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isPrintingSlips, setIsPrintingSlips] = useState(false);

  // Initial Sample Orders
  const initialSampleOrders = [
    {
      id: 'VLX-98241',
      customerName: 'Muaaz Kori',
      phone: '03141397378',
      city: 'Karachi',
      address: 'DHA Phase 6, Main Khayaban-e-Shahbaz',
      date: '2026-07-28',
      item: 'Valaroix Sauvage Imperial (50ml • 24 Hours+ Extrait)',
      size: '50ml',
      lasting: '24 Hours+ Extrait',
      pricePkr: 3499,
      cogsPkr: 1100,
      profitPkr: 2399,
      status: 'Confirmed & Processing',
      trackingCode: 'DHL-VAL-88921',
      engraving: 'M.K. 2026',
      paymentMethod: 'Advance Payment (SadaPay)',
      receiptImage: null,
      settled: false
    },
    {
      id: 'VLX-98242',
      customerName: 'Shahzaib Ahmed',
      phone: '03001234567',
      city: 'Lahore',
      address: 'Gulberg III, Near MM Alam Road',
      date: '2026-07-28',
      item: 'Valaroix Sauvage Imperial (50ml • 10 Hours+ Lasting)',
      size: '50ml',
      lasting: '10 Hours+ Lasting',
      pricePkr: 2499,
      cogsPkr: 850,
      profitPkr: 1649,
      status: 'Pending Admin Confirmation',
      trackingCode: 'DHL-VAL-88922',
      engraving: 'S.A. VIP',
      paymentMethod: 'Cash On Delivery',
      receiptImage: null,
      settled: false
    }
  ];

  const [localOrders, setLocalOrders] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('valaroix_orders');
      if (saved) {
        setLocalOrders(JSON.parse(saved));
      }
      const authSaved = sessionStorage.getItem('valaroix_admin_auth');
      if (authSaved === 'true') {
        setIsAuthenticated(true);
      }
    } catch (e) {}
  }, []);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === '9824') {
      setIsAuthenticated(true);
      setPinError(false);
      try {
        sessionStorage.setItem('valaroix_admin_auth', 'true');
      } catch (e) {}
    } else {
      setPinError(true);
    }
  };

  const allOrders = [...localOrders, ...userOrders, ...initialSampleOrders].filter(
    (order, index, self) => index === self.findIndex((o) => o.id === order.id)
  );

  // Financial Metrics Calculation
  const totalRevenue = allOrders.reduce((sum, o) => sum + (o.pricePkr || 0), 0);
  const totalCogs = allOrders.reduce((sum, o) => sum + (o.cogsPkr || 0), 0);
  const totalNetProfit = totalRevenue - totalCogs;
  const pendingOrdersCount = allOrders.filter((o) => (o.status || '').includes('Pending')).length;

  // 50/50 Partner Profit Shares
  const muaazShare = Math.round(totalNetProfit / 2);
  const fahadShare = Math.round(totalNetProfit / 2);

  // Filtered Orders
  const filteredOrders = allOrders.filter((order) => {
    const st = order.status || '';
    if (orderFilter === 'pending') return st.includes('Pending');
    if (orderFilter === 'confirmed') return st.includes('Confirmed');
    if (orderFilter === 'delivered') return st.includes('Delivered');
    return true;
  });

  // Trigger Print / PDF Download for Photo-State Shop
  const handlePrintDailySlips = () => {
    setIsPrintingSlips(true);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // Direct WhatsApp Inquiry to Client (Ask to Confirm or Cancel Order)
  const handleAskClientOnWhatsApp = (order) => {
    const itemName = order.items ? order.items.map(i => i.name).join(', ') : order.item;
    const message = `Assalam-o-Alaikum ${order.customerName}! 👋

Aapka VALAROIX Haute Parfumerie Order #${order.id} receive ho chuka hai!

📦 Item: ${itemName}
💰 Total Amount: Rs. ${(order.pricePkr || 0).toLocaleString()}
🚚 Delivery Address: ${order.address}, ${order.city}
💳 Payment Method: ${order.paymentMethod}

Kya aap is order ko CONFIRM karte hain? 
Khabar dein taaki hum aapka luxury parcel aaj hi dispatch kar sakein!

Reply:
1. CONFIRM ORDER
2. CANCEL ORDER`;

    const text = encodeURIComponent(message);
    const cleanPhone = (order.phone || '').replace(/^0/, '');
    window.open(`https://wa.me/92${cleanPhone}?text=${text}`, '_blank');
  };

  const handleConfirmOrder = (orderId, customerName, phone, pricePkr) => {
    const updated = allOrders.map((o) =>
      o.id === orderId ? { ...o, status: 'Confirmed & Processing' } : o
    );
    setUserOrders(updated);
    try {
      localStorage.setItem('valaroix_orders', JSON.stringify(updated));
    } catch (e) {}

    const cleanPhone = (phone || '').replace(/^0/, '');
    const text = encodeURIComponent(`Assalam-o-Alaikum ${customerName}! Your VALAROIX order #${orderId} has been CONFIRMED. Total: Rs. ${(pricePkr || 0).toLocaleString()}. We are preparing your luxury perfume package for courier dispatch!`);
    window.open(`https://wa.me/92${cleanPhone}?text=${text}`, '_blank');
  };

  const handleCancelOrder = (orderId, customerName, phone) => {
    const updated = allOrders.map((o) =>
      o.id === orderId ? { ...o, status: 'Cancelled' } : o
    );
    setUserOrders(updated);
    try {
      localStorage.setItem('valaroix_orders', JSON.stringify(updated));
    } catch (e) {}

    const cleanPhone = (phone || '').replace(/^0/, '');
    const text = encodeURIComponent(`Assalam-o-Alaikum ${customerName}! Your VALAROIX order #${orderId} has been CANCELLED as requested.`);
    window.open(`https://wa.me/92${cleanPhone}?text=${text}`, '_blank');
  };

  // IF NOT AUTHENTICATED: SHOW HIGH SECURITY PARTNER VAULT LOGIN GATE
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center p-4 selection:bg-[#D4AF37] selection:text-[#0D0D0D]">
        <div className="w-full max-w-md bg-[#1A1A1A] border border-[#D4AF37]/40 rounded-3xl p-8 shadow-[0_0_80px_rgba(212,175,55,0.2)] text-center space-y-6">
          
          <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37] mx-auto flex items-center justify-center text-[#D4AF37] bg-black/60 shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] text-[#D4AF37] uppercase font-mono tracking-[0.25em] block">
              SECURE PARTNER VAULT
            </span>
            <h1 className="font-serif-mockup text-2xl font-extrabold text-white mt-1">
              VALAROIX Executive App
            </h1>
            <p className="text-xs text-[#6B6B6B] mt-2">
              Enter Owner Passcode (PIN) to access live orders, SadaPay receipts & 50/50 profit metrics.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                maxLength={6}
                required
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="Enter Passcode (PIN: 9824)"
                className="w-full bg-[#0D0D0D] border border-[#D4AF37]/30 rounded-2xl py-3.5 px-4 text-center text-xl font-mono text-[#D4AF37] tracking-[0.4em] focus:outline-none focus:border-[#D4AF37]"
              />
              <Key className="w-4 h-4 text-[#D4AF37]/60 absolute right-4 top-4" />
            </div>

            {pinError && (
              <p className="text-xs text-red-400 font-mono font-bold animate-shake">
                ❌ Invalid Passcode! Please enter correct owner PIN.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl btn-mockup-gold text-xs font-bold uppercase tracking-wider shadow-xl flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#0D0D0D]" /> Unlock Owner Portal
            </button>
          </form>

          <div className="pt-4 border-t border-[#D4AF37]/15">
            <Link href="/" className="text-xs text-[#6B6B6B] hover:text-[#D4AF37] transition-colors flex items-center justify-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Customer Storefront
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans flex flex-col pb-20">
      
      {/* PHOTO-STATE PRINTABLE COURIER SHIPPING SLIPS VIEW (Appears only during window.print()) */}
      <div className={`${isPrintingSlips ? 'block' : 'hidden'} print:block print:fixed print:inset-0 print:bg-white print:text-black print:z-50 p-8`}>
        <div className="text-center pb-6 border-b-2 border-black mb-6">
          <h1 className="text-2xl font-bold uppercase tracking-wider">VALAROIX HAUTE PARFUMERIE</h1>
          <p className="text-sm font-bold">DAILY COURIER DISPATCH SHIPPING PARCHI SLIPS</p>
          <p className="text-xs">Generated for Photo-State Printing • Date: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="border-2 border-black rounded-lg p-5 space-y-3 bg-white text-black text-xs font-mono relative">
              
              {/* Slip Header */}
              <div className="flex justify-between items-center border-b-2 border-black pb-2">
                <span className="font-bold text-sm">VALAROIX DISPATCH SLIP</span>
                <span className="font-bold text-sm bg-black text-white px-2 py-0.5 rounded">{order.id}</span>
              </div>

              {/* Consignee Shipping Address */}
              <div className="space-y-1">
                <span className="font-bold underline uppercase text-[10px] block">SHIP TO (CUSTOMER DETAILS):</span>
                <p className="text-sm font-bold">{order.customerName}</p>
                <p className="font-bold text-sm">Phone / WhatsApp: {order.phone}</p>
                <p className="font-semibold">{order.city}</p>
                <p className="text-xs">{order.address}</p>
              </div>

              {/* Order Contents */}
              <div className="border-t border-b border-black py-2 space-y-1">
                <span className="font-bold text-[10px] uppercase block">PARCEL CONTENTS:</span>
                {order.items ? (
                  order.items.map((i, idx) => (
                    <span key={idx} className="block font-bold">• {i.name}</span>
                  ))
                ) : (
                  <span className="block font-bold">• {order.item}</span>
                )}
                {order.engraving && (
                  <span className="block text-[10px] italic">Engraving: "{order.engraving}"</span>
                )}
              </div>

              {/* Payment Box */}
              <div className="flex justify-between items-center bg-gray-100 p-2 border border-black rounded">
                <div>
                  <span className="text-[10px] block font-bold">PAYMENT TYPE:</span>
                  <span className="font-bold uppercase text-xs">{order.paymentMethod}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] block font-bold">COLLECT AMOUNT:</span>
                  <span className="text-base font-extrabold">Rs. {(order.pricePkr || 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Sender Return Address */}
              <div className="pt-2 text-[9px] text-gray-700 flex justify-between items-center border-t border-gray-300">
                <span>From: VALAROIX Parfums, Karachi</span>
                <span>Helpline: 03141397378</span>
              </div>

            </div>
          ))}
        </div>

        <div className="mt-8 text-center print:hidden">
          <button
            onClick={() => setIsPrintingSlips(false)}
            className="px-6 py-3 rounded-xl bg-black text-white font-bold text-xs uppercase"
          >
            Close Print View
          </button>
        </div>
      </div>

      {/* DASHBOARD MAIN APP UI */}
      <div className="print:hidden flex flex-col flex-1">
        
        {/* TOP HEADER */}
        <header className="sticky top-0 z-40 bg-black/95 border-b border-valaroix-gold/30 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-full glass-panel border-valaroix-gold/30 text-valaroix-gold hover:scale-105 transition-transform">
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full border border-valaroix-gold/60 p-0.5 bg-valaroix-dark overflow-hidden">
                <img src="/logo.jpg" alt="VALAROIX Logo" className="w-full h-full object-cover rounded-full" />
              </div>
              <div>
                <span className="font-serif font-bold text-lg text-white leading-tight block flex items-center gap-1.5">
                  VALAROIX Executive App <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </span>
                <span className="text-[9px] text-valaroix-gold uppercase font-mono tracking-widest block">Owner Portal: Muaaz & Fahad</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Generate Daily Printable PDF Slips Button for Photo-State Shop */}
            <button
              onClick={handlePrintDailySlips}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 transition-all shadow-lg"
              title="Generate Daily Courier Shipping Slips PDF for Photo-State Shop Printing"
            >
              <Printer className="w-4 h-4" />
              <span>Print Daily Slips (PDF)</span>
            </button>

            <button
              onClick={() => {
                sessionStorage.removeItem('valaroix_admin_auth');
                setIsAuthenticated(false);
              }}
              className="px-3 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
            >
              Lock Vault
            </button>
          </div>
        </header>

        {/* NAVIGATION TABS */}
        <div className="bg-valaroix-dark border-b border-valaroix-gold/20 px-4 sm:px-8 py-2 sticky top-[61px] z-30 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all relative ${
                activeTab === 'orders' ? 'bg-valaroix-gold text-valaroix-dark shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Live Orders ({allOrders.length})
              {pendingOrdersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('partners')}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                activeTab === 'partners' ? 'bg-valaroix-gold text-valaroix-dark shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Split className="w-4 h-4" /> 50/50 Partner Share
            </button>

            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                activeTab === 'overview' ? 'bg-valaroix-gold text-valaroix-dark shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" /> Sales & Net Profit
            </button>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-8 flex-1 w-full">
          
          {/* TAB 1: LIVE ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              {/* Filter Bar & PDF Generator Action */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 glass-panel rounded-2xl border-valaroix-gold/20">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Filter className="w-4 h-4 text-valaroix-gold" /> Filter Orders:
                  <button
                    onClick={() => setOrderFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      orderFilter === 'all' ? 'bg-valaroix-gold text-valaroix-dark font-bold' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    All ({allOrders.length})
                  </button>
                  <button
                    onClick={() => setOrderFilter('pending')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      orderFilter === 'pending' ? 'bg-amber-500 text-black font-bold' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Pending ({pendingOrdersCount})
                  </button>
                  <button
                    onClick={() => setOrderFilter('confirmed')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      orderFilter === 'confirmed' ? 'bg-emerald-500 text-black font-bold' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Confirmed
                  </button>
                </div>

                <button
                  onClick={handlePrintDailySlips}
                  className="px-4 py-2 rounded-xl bg-valaroix-gold/15 text-valaroix-gold hover:bg-valaroix-gold hover:text-black border border-valaroix-gold/40 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <FileText className="w-4 h-4" /> Generate Photo-State Printable PDF
                </button>
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="glass-panel p-6 rounded-3xl border-valaroix-gold/30 space-y-4 shadow-xl relative"
                  >
                    {/* Order Header Meta */}
                    <div className="flex flex-wrap justify-between items-start gap-4 border-b border-valaroix-gold/20 pb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-valaroix-gold font-bold text-base">{order.id}</span>
                          <span className="text-xs text-gray-400 font-mono">Date: {order.date}</span>
                        </div>
                        <h4 className="font-serif text-xl font-bold text-white mt-1">{order.customerName}</h4>
                        
                        {/* WhatsApp Direct Clickable Link next to phone number */}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-300 font-mono">WhatsApp:</span>
                          <button
                            onClick={() => handleAskClientOnWhatsApp(order)}
                            className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold hover:bg-emerald-500 hover:text-black transition-all flex items-center gap-1.5"
                            title="Open Direct WhatsApp Chat with Client"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{order.phone}</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs text-gray-300 block mt-1">{order.city} — {order.address}</span>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="font-serif text-2xl font-bold text-gold-gradient">
                          Rs. {(order.pricePkr || 0).toLocaleString()}
                        </span>
                        <span className="text-xs font-mono text-gray-400">Payment: <strong className="text-valaroix-gold">{order.paymentMethod}</strong></span>
                        <span className="text-xs text-emerald-400 font-mono mt-1">
                          Profit: +Rs. {(order.profitPkr || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Purchased Item & Receipt Attachment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <span className="text-gray-400 block font-mono">Items Ordered:</span>
                        {order.items ? (
                          order.items.map((i, idx) => (
                            <span key={idx} className="font-bold text-white block">• {i.name}</span>
                          ))
                        ) : (
                          <span className="font-bold text-white block">{order.item}</span>
                        )}
                      </div>

                      {/* Receipt Image Preview if Advance Payment */}
                      {order.receiptImage && (
                        <div className="space-y-1">
                          <span className="text-gray-400 block font-mono">SadaPay Receipt Attachment:</span>
                          <button
                            onClick={() => setSelectedReceipt(order.receiptImage)}
                            className="flex items-center gap-2 p-2 rounded-xl bg-valaroix-gold/10 border border-valaroix-gold/40 text-valaroix-gold text-xs font-bold hover:bg-valaroix-gold hover:text-black transition-all"
                          >
                            <Eye className="w-4 h-4" /> View SadaPay Payment Receipt Screenshot
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Actions & Status Updates */}
                    <div className="pt-3 border-t border-valaroix-gold/15 flex flex-wrap justify-between items-center gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-mono">Current Status:</span>
                        <span className={`px-3 py-1 rounded-full font-bold text-[11px] ${
                          (order.status || '').includes('Confirmed')
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : (order.status || '').includes('Cancelled')
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                        }`}>
                          {order.status}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => handleAskClientOnWhatsApp(order)}
                          className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-black border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                          title="Send pre-filled WhatsApp message to client asking to confirm or cancel"
                        >
                          <MessageSquare className="w-4 h-4" /> 💬 Ask Client on WhatsApp
                        </button>

                        <button
                          onClick={() => handleConfirmOrder(order.id, order.customerName, order.phone, order.pricePkr)}
                          className="px-4 py-2 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 text-xs uppercase font-bold flex items-center gap-1.5 shadow-lg"
                        >
                          <Check className="w-4 h-4" /> ✅ Confirm Order
                        </button>

                        <button
                          onClick={() => handleCancelOrder(order.id, order.customerName, order.phone)}
                          className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/40 text-xs uppercase font-bold flex items-center gap-1.5"
                        >
                          <X className="w-4 h-4" /> ❌ Cancel Order
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 2: PARTNERS 50/50 PROFIT SPLITTER */}
          {activeTab === 'partners' && (
            <div className="space-y-8">
              <div className="glass-panel-gold p-6 rounded-3xl border border-valaroix-gold/50 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                <div className="space-y-2 text-center md:text-left">
                  <span className="text-xs uppercase font-mono text-valaroix-gold font-bold tracking-widest flex items-center gap-2 justify-center md:justify-start">
                    <Sparkles className="w-4 h-4" /> Equal Equity Partnership (50% / 50%)
                  </span>
                  <h2 className="font-serif text-3xl font-bold text-white">MUAAZ & FAHAD Profit Splitter</h2>
                  <p className="text-xs text-gray-300 max-w-xl font-light">
                    Har sale ka cost price (COGS) nikal kar baqi saara net profit automated 50/50 split hota hai.
                  </p>
                </div>

                <div className="text-center p-4 rounded-2xl bg-black/80 border border-valaroix-gold/30 min-w-[140px]">
                  <span className="text-[10px] text-gray-400 font-mono block uppercase">Total Net Profit</span>
                  <span className="font-serif text-2xl font-bold text-emerald-400">Rs. {totalNetProfit.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-3xl border-valaroix-gold/40 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-valaroix-gold/20 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-valaroix-gold text-valaroix-dark font-serif font-bold text-xl flex items-center justify-center">M</div>
                      <div>
                        <h3 className="font-serif text-2xl font-bold text-white">MUAAZ</h3>
                        <span className="text-xs text-valaroix-gold font-mono">50% Equal Equity Share</span>
                      </div>
                    </div>
                  </div>
                  <span className="font-serif text-4xl font-bold text-gold-gradient block">Rs. {muaazShare.toLocaleString()}</span>
                </div>

                <div className="glass-panel p-6 rounded-3xl border-valaroix-gold/40 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-valaroix-gold/20 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-valaroix-gold text-valaroix-dark font-serif font-bold text-xl flex items-center justify-center">F</div>
                      <div>
                        <h3 className="font-serif text-2xl font-bold text-white">FAHAD</h3>
                        <span className="text-xs text-valaroix-gold font-mono">50% Equal Equity Share</span>
                      </div>
                    </div>
                  </div>
                  <span className="font-serif text-4xl font-bold text-gold-gradient block">Rs. {fahadShare.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SALES & NET PROFIT OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-3xl border-valaroix-gold/30 text-center space-y-2">
                  <span className="text-xs text-gray-400 font-mono uppercase">Total Gross Sales</span>
                  <span className="font-serif text-3xl font-bold text-white block">Rs. {totalRevenue.toLocaleString()}</span>
                </div>

                <div className="glass-panel p-6 rounded-3xl border-valaroix-gold/30 text-center space-y-2">
                  <span className="text-xs text-gray-400 font-mono uppercase">Total Cost of Goods (COGS)</span>
                  <span className="font-serif text-3xl font-bold text-amber-400 block">Rs. {totalCogs.toLocaleString()}</span>
                </div>

                <div className="glass-panel p-6 rounded-3xl border-valaroix-gold/30 text-center space-y-2">
                  <span className="text-xs text-gray-400 font-mono uppercase">Net Operating Profit</span>
                  <span className="font-serif text-3xl font-bold text-emerald-400 block">Rs. {totalNetProfit.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

        </main>

        {/* RECEIPT POPUP MODAL */}
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="relative max-w-lg w-full bg-valaroix-dark border border-valaroix-gold rounded-3xl p-6 space-y-4">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="absolute top-4 right-4 p-2 rounded-full glass-panel text-gray-400 hover:text-valaroix-gold"
              >
                <X className="w-5 h-5" />
              </button>
              <h4 className="font-serif text-lg font-bold text-white">SadaPay Payment Receipt Screenshot</h4>
              <div className="w-full max-h-[70vh] rounded-2xl overflow-hidden border border-valaroix-gold/30">
                <img src={selectedReceipt} alt="Receipt Full" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
