'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  DollarSign, TrendingUp, Package, Users, ShoppingBag, Truck, CheckCircle2, 
  Clock, ArrowLeft, RefreshCw, Smartphone, Sparkles, Filter, ChevronRight, 
  MessageSquare, Sliders, ExternalLink, Download, AlertCircle, Users2, Split, Check, X, Eye, PhoneCall, Printer, FileText, Lock, ShieldCheck, Key, Trash2
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
      address: 'House 42, Street 7, Phase 5 DHA',
      date: '2026-08-23',
      item: 'Valaroix Dior Sauvage (50ml • 30% Pure Oil)',
      size: '50ml',
      lasting: '10 Hours+ Lasting',
      pricePkr: 2699,
      cogsPkr: 950,
      profitPkr: 1749,
      status: 'In Transit with TCS Express',
      tcsTrackingNumber: '7748291048',
      paymentMethod: 'Cash On Delivery',
      receiptImage: null
    }
  ];

  const [localOrders, setLocalOrders] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('valaroix_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        const repaired = parsed.map((o) => {
          const price = getOrderPrice(o);
          const profit = getOrderProfit(o);
          return {
            ...o,
            pricePkr: price,
            total: price,
            profitPkr: profit,
            status: o.status || 'Pending Verification'
          };
        });
        setLocalOrders(repaired);
        localStorage.setItem('valaroix_orders', JSON.stringify(repaired));
      } else {
        setLocalOrders(initialSampleOrders);
        localStorage.setItem('valaroix_orders', JSON.stringify(initialSampleOrders));
      }
      const authSaved = sessionStorage.getItem('valaroix_admin_auth');
      if (authSaved === 'true') {
        setIsAuthenticated(true);
      }
    } catch (e) {
      setLocalOrders(initialSampleOrders);
    }
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

  // Combine and deduplicate orders
  const combinedList = [...localOrders, ...userOrders, ...initialSampleOrders];
  const allOrders = combinedList.filter(
    (order, index, self) => index === self.findIndex((o) => o.id === order.id)
  );

  const getOrderPrice = (o) => {
    if (o.pricePkr && o.pricePkr > 0) return o.pricePkr;
    if (o.total && o.total > 0) return o.total;
    if (o.items && o.items.length > 0) {
      return o.items.reduce((sum, item) => sum + (item.price || item.exactPkr || 2699) * (item.quantity || 1), 0);
    }
    const itemStr = (o.item || o.items?.[0]?.name || '').toLowerCase();
    if (itemStr.includes('ysl')) return 3300;
    if (itemStr.includes('cedrat')) return 2999;
    return 2699;
  };

  const getOrderProfit = (o) => {
    const price = getOrderPrice(o);
    if (o.profitPkr && o.profitPkr > 0) return o.profitPkr;
    const cogs = o.cogsPkr || Math.round(price * 0.35);
    return price - cogs;
  };

  // Helper to update status everywhere and trigger instant UI re-render
  const updateOrderStatus = (orderId, newStatus) => {
    const updated = allOrders.map((o) =>
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    setLocalOrders(updated);
    if (setUserOrders) {
      setUserOrders(updated);
    }
    try {
      localStorage.setItem('valaroix_orders', JSON.stringify(updated));
    } catch (e) {}
    return updated;
  };

  // Delete Order Handler
  const handleDeleteOrder = (orderId) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    const updated = allOrders.filter((o) => o.id !== orderId);
    setLocalOrders(updated);
    if (setUserOrders) {
      setUserOrders(updated);
    }
    try {
      localStorage.setItem('valaroix_orders', JSON.stringify(updated));
    } catch (e) {}
  };

  // Financial Metrics Calculation
  const totalRevenue = allOrders.reduce((sum, o) => sum + getOrderPrice(o), 0);
  const totalNetProfit = allOrders.reduce((sum, o) => sum + getOrderProfit(o), 0);
  const totalCogs = totalRevenue - totalNetProfit;
  const pendingOrdersCount = allOrders.filter((o) => (o.status || '').toLowerCase().includes('pending')).length;

  // 50/50 Partner Profit Shares
  const muaazShare = Math.round(totalNetProfit / 2);
  const fahadShare = Math.round(totalNetProfit / 2);

  // Filtered Orders
  const filteredOrders = allOrders.filter((order) => {
    const st = (order.status || '').toLowerCase();
    if (orderFilter === 'pending') return st.includes('pending');
    if (orderFilter === 'confirmed') return st.includes('confirmed') || st.includes('transit');
    if (orderFilter === 'delivered') return st.includes('delivered');
    if (orderFilter === 'cancelled') return st.includes('cancel');
    return true;
  });

  // Trigger Print / PDF Download for Photo-State Shop
  const handlePrintDailySlips = () => {
    setIsPrintingSlips(true);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // Direct WhatsApp Inquiry to Client
  const handleAskClientOnWhatsApp = (order) => {
    const itemName = order.items ? order.items.map(i => i.name).join(', ') : (order.item || 'VALAROIX Fragrance');
    const price = getOrderPrice(order);
    const message = `Assalam-o-Alaikum ${order.customerName || 'Valaroix Patron'}! 👋

Aapka VALAROIX Haute Parfumerie Order #${order.id} receive ho chuka hai!

📦 Item: ${itemName}
💰 Total Amount: Rs. ${price.toLocaleString()}
🚚 Delivery Address: ${order.address}, ${order.city}
💳 Payment Method: ${order.paymentMethod}

Kya aap is order ko CONFIRM karte hain? 
Khabar dein taaki hum aapka luxury parcel TCS Express se aaj hi dispatch kar sakein!

Reply:
1. CONFIRM ORDER
2. CANCEL ORDER`;

    const text = encodeURIComponent(message);
    const cleanPhone = (order.phone || order.whatsapp || '03141397378').replace(/^0/, '');
    window.open(`https://wa.me/92${cleanPhone}?text=${text}`, '_blank');
  };

  const handleConfirmOrder = (order) => {
    updateOrderStatus(order.id, 'Confirmed & Dispatched via TCS');
    const price = getOrderPrice(order);
    const cleanPhone = (order.phone || order.whatsapp || '').replace(/^0/, '');
    const text = encodeURIComponent(`Assalam-o-Alaikum ${order.customerName}! Your VALAROIX order #${order.id} has been CONFIRMED. Total: Rs. ${price.toLocaleString()}. Your parcel is booked with TCS Express Courier!`);
    window.open(`https://wa.me/92${cleanPhone}?text=${text}`, '_blank');
  };

  const handleCancelOrder = (order) => {
    updateOrderStatus(order.id, 'Cancelled');
    const cleanPhone = (order.phone || order.whatsapp || '').replace(/^0/, '');
    const text = encodeURIComponent(`Assalam-o-Alaikum ${order.customerName}! Your VALAROIX order #${order.id} has been CANCELLED as requested.`);
    window.open(`https://wa.me/92${cleanPhone}?text=${text}`, '_blank');
  };

  // IF NOT AUTHENTICATED: SHOW HIGH SECURITY PARTNER VAULT LOGIN GATE
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center p-4 selection:bg-[#D4AF37] selection:text-[#0D0D0D] w-full max-w-full overflow-x-hidden">
        <div className="w-full max-w-md bg-[#1A1A1A] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(212,175,55,0.2)] text-center space-y-6">
          
          <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37] mx-auto flex items-center justify-center text-[#D4AF37] bg-black/60 shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] text-[#D4AF37] uppercase font-mono tracking-[0.25em] block">
              SECURE PARTNER VAULT
            </span>
            <h1 className="font-serif-mockup text-xl sm:text-2xl font-extrabold text-white mt-1">
              VALAROIX Executive App
            </h1>
            <p className="text-xs text-gray-400 mt-2">
              Enter Owner Passcode (PIN: 9824) to manage live orders, SadaPay slips & 50/50 profit splits.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="••••"
                className="w-full bg-black/80 border border-[#D4AF37]/40 rounded-2xl py-3.5 text-center text-2xl tracking-[0.5em] font-mono text-[#D4AF37] focus:outline-none focus:border-[#D4AF37] placeholder:text-gray-600"
                autoFocus
              />
            </div>

            {pinError && (
              <p className="text-xs text-red-400 font-mono">
                Incorrect Master PIN. Please try again.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl btn-mockup-gold text-xs font-bold uppercase tracking-wider shadow-xl hover:scale-[1.02] transition-transform cursor-pointer"
            >
              Access Executive Dashboard
            </button>
          </form>

          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#D4AF37] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-gray-100 font-sans selection:bg-[#D4AF37] selection:text-black flex flex-col w-full max-w-full overflow-x-hidden">
      
      {/* DASHBOARD MAIN APP UI */}
      <div className="print:hidden flex flex-col flex-1 w-full max-w-full">
        
        {/* HEADER */}
        <header className="sticky top-0 z-40 bg-black/95 border-b border-[#D4AF37]/30 backdrop-blur-md px-4 py-3 flex items-center justify-between shadow-2xl w-full">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full border border-[#D4AF37]/60 p-0.5 bg-black overflow-hidden shrink-0">
              <img src="/logo.jpg" alt="VALAROIX" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="truncate">
              <span className="font-serif-mockup font-bold text-sm sm:text-base text-white leading-tight flex items-center gap-1.5 truncate">
                VALAROIX Executive <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              </span>
              <span className="text-[9px] text-[#D4AF37] uppercase font-mono tracking-wider block truncate">
                Muaaz & Fahad Admin Panel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-xl border border-white/10 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> View Store
            </Link>

            <button
              onClick={() => {
                sessionStorage.removeItem('valaroix_admin_auth');
                setIsAuthenticated(false);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock</span>
            </button>
          </div>
        </header>

        {/* NAVIGATION TABS */}
        <div className="bg-[#141414] border-b border-[#D4AF37]/20 px-4 py-2.5 sticky top-[57px] z-30 overflow-x-auto no-scrollbar w-full">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider min-w-max">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all relative ${
                activeTab === 'orders' ? 'bg-[#D4AF37] text-black shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Live Orders ({allOrders.length})
              {pendingOrdersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('partners')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === 'partners' ? 'bg-[#D4AF37] text-black shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Split className="w-3.5 h-3.5" /> 50/50 Profit Split
            </button>

            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === 'overview' ? 'bg-[#D4AF37] text-black shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" /> Financial Metrics
            </button>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6 flex-1 w-full max-w-full">
          
          {/* TAB 1: LIVE ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-5 w-full">
              
              {/* Filter Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-[#141414] rounded-2xl border border-white/10 w-full shadow-lg">
                <div className="flex items-center gap-2 text-xs font-bold flex-wrap">
                  <Filter className="w-3.5 h-3.5 text-[#D4AF37]" /> Filter:
                  <button
                    onClick={() => setOrderFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs transition-all ${
                      orderFilter === 'all' ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-400 hover:text-white bg-white/5'
                    }`}
                  >
                    All ({allOrders.length})
                  </button>
                  <button
                    onClick={() => setOrderFilter('pending')}
                    className={`px-3 py-1.5 rounded-xl text-xs transition-all ${
                      orderFilter === 'pending' ? 'bg-amber-500 text-black font-bold' : 'text-gray-400 hover:text-white bg-white/5'
                    }`}
                  >
                    Pending ({pendingOrdersCount})
                  </button>
                  <button
                    onClick={() => setOrderFilter('confirmed')}
                    className={`px-3 py-1.5 rounded-xl text-xs transition-all ${
                      orderFilter === 'confirmed' ? 'bg-emerald-500 text-black font-bold' : 'text-gray-400 hover:text-white bg-white/5'
                    }`}
                  >
                    Confirmed / Dispatched
                  </button>
                  <button
                    onClick={() => setOrderFilter('delivered')}
                    className={`px-3 py-1.5 rounded-xl text-xs transition-all ${
                      orderFilter === 'delivered' ? 'bg-blue-500 text-white font-bold' : 'text-gray-400 hover:text-white bg-white/5'
                    }`}
                  >
                    Delivered
                  </button>
                  <button
                    onClick={() => setOrderFilter('cancelled')}
                    className={`px-3 py-1.5 rounded-xl text-xs transition-all ${
                      orderFilter === 'cancelled' ? 'bg-red-500 text-white font-bold' : 'text-gray-400 hover:text-white bg-white/5'
                    }`}
                  >
                    Cancelled
                  </button>
                </div>

                <button
                  onClick={handlePrintDailySlips}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-500 text-black text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Print TCS Delivery Slips
                </button>
              </div>

              {/* Orders List */}
              <div className="space-y-4 w-full">
                {filteredOrders.length === 0 ? (
                  <div className="p-8 text-center bg-[#141414] rounded-2xl border border-white/10 text-gray-400 text-xs">
                    No orders found matching this filter.
                  </div>
                ) : (
                  filteredOrders.map((order) => {
                    const price = getOrderPrice(order);
                    const profit = getOrderProfit(order);
                    const receiptUrl = order.receiptImage || order.receiptPreview;
                    const st = (order.status || '').toLowerCase();
                    const isConfirmed = st.includes('confirmed') || st.includes('dispatched') || st.includes('transit');
                    const isCancelled = st.includes('cancel');
                    const isDelivered = st.includes('delivered');

                    return (
                      <div
                        key={order.id}
                        className="p-5 sm:p-6 rounded-3xl bg-[#141414] border border-[#D4AF37]/30 space-y-4 shadow-xl relative w-full overflow-hidden"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 border-b border-white/10 pb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[#D4AF37] font-bold text-sm sm:text-base">{order.id}</span>
                              <span className="text-[11px] text-gray-400 font-mono">Date: {order.date || 'Today'}</span>
                            </div>
                            <h4 className="font-serif-mockup text-lg sm:text-xl font-bold text-white mt-1">
                              {order.customerName || order.name || 'Valaroix Patron'}
                            </h4>
                            
                            {/* WhatsApp Direct */}
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-xs text-gray-400">Phone / WhatsApp:</span>
                              <button
                                onClick={() => handleAskClientOnWhatsApp(order)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold hover:bg-emerald-500 hover:text-black transition-all flex items-center gap-1.5 cursor-pointer"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>{order.phone || order.whatsapp}</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>

                            <span className="text-xs text-gray-300 block mt-1.5">
                              <strong className="text-white font-semibold">{order.city}</strong> — {order.address}
                            </span>
                          </div>

                          <div className="flex flex-col sm:items-end gap-1">
                            <span className="font-serif-mockup text-2xl font-black text-[#D4AF37]">
                              Rs. {price.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-300">
                              Payment: <strong className="text-[#D4AF37] uppercase">{order.paymentMethod || 'COD'}</strong>
                            </span>
                            <span className="text-xs text-emerald-400 font-mono">
                              Profit: +Rs. {profit.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Items & Payment Slip Preview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-black/50 p-4 rounded-2xl border border-white/5">
                          
                          {/* Items */}
                          <div className="space-y-1.5">
                            <span className="text-gray-400 block font-semibold text-[11px] uppercase">Items Ordered:</span>
                            {order.items && order.items.length > 0 ? (
                              order.items.map((i, idx) => (
                                <span key={idx} className="font-bold text-white block">
                                  • {i.name} {i.quantity > 1 ? `(Qty: ${i.quantity})` : ''}
                                </span>
                              ))
                            ) : (
                              <span className="font-bold text-white block">• {order.item || 'VALAROIX Luxury Perfume'}</span>
                            )}
                          </div>

                          {/* Payment Receipt Slip */}
                          <div className="space-y-1.5">
                            <span className="text-gray-400 block font-semibold text-[11px] uppercase">Payment Receipt / Slip:</span>
                            {receiptUrl ? (
                              <div className="flex items-center gap-3">
                                <div
                                  onClick={() => setSelectedReceipt(receiptUrl)}
                                  className="w-12 h-12 rounded-xl overflow-hidden border border-[#D4AF37] bg-black shrink-0 cursor-pointer hover:scale-105 transition-transform"
                                >
                                  <img src={receiptUrl} alt="Slip" className="w-full h-full object-cover" />
                                </div>
                                <button
                                  onClick={() => setSelectedReceipt(receiptUrl)}
                                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] text-xs font-bold hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer"
                                >
                                  <Eye className="w-4 h-4" /> View Uploaded Receipt Slip
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-500 italic block py-1">
                                {order.paymentMethod === 'advance' ? 'No screenshot uploaded (Check Bank app)' : 'Cash on Delivery (No slip needed)'}
                              </span>
                            )}
                          </div>

                        </div>

                        {/* Status Badge & Control Buttons */}
                        <div className="pt-2 border-t border-white/10 space-y-3 text-xs">
                          
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-xs font-semibold">Current Order Status:</span>
                            <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                              isDelivered
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                                : isConfirmed
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : isCancelled
                                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                            }`}>
                              {order.status || 'Pending Verification'}
                            </span>
                          </div>

                          {/* ACTION BUTTONS TOOLBAR */}
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                            
                            {/* 1. Confirm & Dispatch */}
                            <button
                              onClick={() => handleConfirmOrder(order)}
                              className="py-2.5 px-3 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                              title="Mark as Confirmed & TCS Dispatched"
                            >
                              <Check className="w-4 h-4" />
                              <span>Confirm Order</span>
                            </button>

                            {/* 2. In Transit */}
                            <button
                              onClick={() => updateOrderStatus(order.id, 'In Transit with TCS Express')}
                              className="py-2.5 px-3 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-black border border-cyan-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Truck className="w-4 h-4" />
                              <span>In Transit</span>
                            </button>

                            {/* 3. Mark Delivered */}
                            <button
                              onClick={() => updateOrderStatus(order.id, 'Delivered & Payment Collected')}
                              className="py-2.5 px-3 rounded-xl bg-blue-500/20 text-blue-300 hover:bg-blue-500 hover:text-white border border-blue-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                            >
                              <PackageCheck className="w-4 h-4" />
                              <span>Delivered</span>
                            </button>

                            {/* 4. Cancel Order */}
                            <button
                              onClick={() => handleCancelOrder(order)}
                              className="py-2.5 px-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/40 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                              <span>Cancel</span>
                            </button>

                            {/* 5. Delete Order */}
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              className="py-2.5 px-3 rounded-xl bg-gray-800 text-gray-300 hover:bg-red-700 hover:text-white border border-white/10 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer col-span-2 sm:col-span-1"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete</span>
                            </button>

                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

            </div>
          )}

          {/* TAB 2: PARTNERS 50/50 PROFIT SPLITTER */}
          {activeTab === 'partners' && (
            <div className="space-y-6 w-full">
              <div className="p-6 rounded-3xl bg-[#141414] border border-[#D4AF37]/50 flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xl w-full">
                <div className="space-y-1.5 text-center md:text-left">
                  <span className="text-xs uppercase font-mono text-[#D4AF37] font-bold tracking-widest flex items-center gap-2 justify-center md:justify-start">
                    <Sparkles className="w-4 h-4" /> Equal Equity Partnership (50% / 50%)
                  </span>
                  <h2 className="font-serif-mockup text-2xl sm:text-3xl font-extrabold text-white">MUAAZ & FAHAD Profit Splitter</h2>
                  <p className="text-xs text-gray-300 max-w-xl">
                    Har sale ka cost price (COGS) nikal kar baqi saara net profit automated 50/50 split hota hai.
                  </p>
                </div>

                <div className="text-center p-4 rounded-2xl bg-black border border-[#D4AF37]/40 min-w-[160px]">
                  <span className="text-[10px] text-gray-400 font-mono block uppercase font-bold">Total Net Profit</span>
                  <span className="font-serif-mockup text-2xl sm:text-3xl font-extrabold text-emerald-400">Rs. {totalNetProfit.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="p-6 rounded-3xl bg-[#141414] border border-[#D4AF37]/40 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-black font-serif-mockup font-bold text-xl flex items-center justify-center shadow-lg">M</div>
                      <div>
                        <h3 className="font-serif-mockup text-xl font-bold text-white">MUAAZ</h3>
                        <span className="text-xs text-[#D4AF37] font-mono font-semibold">50% Equal Share</span>
                      </div>
                    </div>
                  </div>
                  <span className="font-serif-mockup text-3xl font-black text-[#D4AF37] block">Rs. {muaazShare.toLocaleString()}</span>
                </div>

                <div className="p-6 rounded-3xl bg-[#141414] border border-[#D4AF37]/40 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-black font-serif-mockup font-bold text-xl flex items-center justify-center shadow-lg">F</div>
                      <div>
                        <h3 className="font-serif-mockup text-xl font-bold text-white">FAHAD</h3>
                        <span className="text-xs text-[#D4AF37] font-mono font-semibold">50% Equal Share</span>
                      </div>
                    </div>
                  </div>
                  <span className="font-serif-mockup text-3xl font-black text-[#D4AF37] block">Rs. {fahadShare.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SALES & NET PROFIT OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4 w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div className="p-6 rounded-3xl bg-[#141414] border border-white/10 text-center space-y-1.5 shadow-xl">
                  <span className="text-xs text-gray-400 font-mono uppercase">Total Gross Sales</span>
                  <span className="font-serif-mockup text-2xl sm:text-3xl font-black text-white block">Rs. {totalRevenue.toLocaleString()}</span>
                </div>

                <div className="p-6 rounded-3xl bg-[#141414] border border-white/10 text-center space-y-1.5 shadow-xl">
                  <span className="text-xs text-gray-400 font-mono uppercase">Total Cost of Goods (COGS)</span>
                  <span className="font-serif-mockup text-2xl sm:text-3xl font-black text-amber-400 block">Rs. {totalCogs.toLocaleString()}</span>
                </div>

                <div className="p-6 rounded-3xl bg-[#141414] border border-[#D4AF37]/40 text-center space-y-1.5 shadow-xl">
                  <span className="text-xs text-gray-400 font-mono uppercase">Net Operating Profit</span>
                  <span className="font-serif-mockup text-2xl sm:text-3xl font-black text-emerald-400 block">Rs. {totalNetProfit.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

        </main>

        {/* RECEIPT POPUP MODAL */}
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="relative max-w-lg w-full bg-[#141414] border border-[#D4AF37] rounded-3xl p-6 space-y-4 shadow-[0_0_80px_rgba(212,175,55,0.4)]">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-gray-300 hover:text-[#D4AF37] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <h4 className="font-serif-mockup text-lg font-bold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#D4AF37]" /> SadaPay Payment Receipt Screenshot
              </h4>
              <div className="w-full max-h-[70vh] rounded-2xl overflow-hidden border border-[#D4AF37]/30 bg-black flex items-center justify-center p-2">
                <img src={selectedReceipt} alt="Receipt Full" className="w-full max-h-[60vh] object-contain rounded-xl" />
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
