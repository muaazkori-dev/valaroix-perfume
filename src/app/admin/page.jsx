'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  DollarSign, TrendingUp, Package, Users, ShoppingBag, Truck, CheckCircle2, 
  Clock, ArrowLeft, RefreshCw, Smartphone, Sparkles, Filter, ChevronRight, 
  MessageSquare, Sliders, ExternalLink, Download, AlertCircle, Users2, Split, Check
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('partners'); // 'partners' | 'overview' | 'orders' | 'inventory'
  const [orderFilter, setOrderFilter] = useState('all');

  // Sample Live Customer Orders
  const [orders, setOrders] = useState([
    {
      id: 'VLX-98241',
      customerName: 'Muaaz Kori',
      phone: '03141397378',
      city: 'Karachi',
      address: 'DHA Phase 6, Main Khayaban-e-Shahbaz',
      date: '2026-07-28',
      item: 'Valaroix Sauvage Imperial (100ml • 24 Hours+ Extrait)',
      size: '100ml',
      lasting: '24 Hours+ Extrait',
      pricePkr: 6499,
      cogsPkr: 2200,
      profitPkr: 4299,
      status: 'In Transit',
      trackingCode: 'DHL-VAL-88921',
      engraving: 'M.K. 2026',
      paymentMethod: 'Cash On Delivery',
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
      status: 'Pending Dispatch',
      trackingCode: 'DHL-VAL-88922',
      engraving: 'S.A. VIP',
      paymentMethod: 'Card Online',
      settled: false
    },
    {
      id: 'VLX-98243',
      customerName: 'Hamza Khan',
      phone: '03219876543',
      city: 'Islamabad',
      address: 'F-7/2, Street 15',
      date: '2026-07-27',
      item: 'Valaroix Sauvage Imperial (100ml • 10 Hours+ Lasting)',
      size: '100ml',
      lasting: '10 Hours+ Lasting',
      pricePkr: 4499,
      cogsPkr: 1600,
      profitPkr: 2899,
      status: 'Delivered',
      trackingCode: 'DHL-VAL-88920',
      engraving: 'H.K. Privé',
      paymentMethod: 'Cash On Delivery',
      settled: true
    }
  ]);

  // Financial Metrics Calculation
  const totalRevenue = orders.reduce((sum, o) => sum + o.pricePkr, 0);
  const totalCogs = orders.reduce((sum, o) => sum + o.cogsPkr, 0);
  const totalNetProfit = totalRevenue - totalCogs;
  const profitMarginPercent = totalRevenue > 0 ? ((totalNetProfit / totalRevenue) * 100).toFixed(1) : 0;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending Dispatch').length;

  // 50/50 Partner Profit Shares
  const muaazShare = Math.round(totalNetProfit / 2);
  const fahadShare = Math.round(totalNetProfit / 2);

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    if (orderFilter === 'pending') return order.status === 'Pending Dispatch';
    if (orderFilter === 'shipped') return order.status === 'In Transit';
    if (orderFilter === 'delivered') return order.status === 'Delivered';
    return true;
  });

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const handleToggleSettleOrder = (orderId) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, settled: !o.settled } : o))
    );
  };

  const handleOpenWhatsAppCustomer = (phone, orderId, name) => {
    const text = encodeURIComponent(`Assalam-o-Alaikum ${name}! Thank you for ordering from VALAROIX Haute Parfumerie (Order #${orderId}). Your luxury 3D perfume package is being prepared with 24k gold leaf packaging.`);
    window.open(`https://wa.me/92${phone.replace(/^0/, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans flex flex-col pb-20">
      
      {/* 1. TOP MOBILE & DESKTOP EXECUTIVE HEADER BAR */}
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
              <span className="font-serif font-bold text-lg text-white leading-tight block">VALAROIX Executive</span>
              <span className="text-[9px] text-valaroix-gold uppercase font-mono tracking-widest block">Partner Portal: Muaaz & Fahad</span>
            </div>
          </div>
        </div>

        {/* Mobile App Install Indicator */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("To install VALAROIX Admin App on your Phone:\n\niPhone: Tap Share Button -> 'Add to Home Screen'\nAndroid: Tap 3 Dots Menu -> 'Install app'")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel-gold border border-valaroix-gold/40 text-xs font-bold text-valaroix-gold hover:bg-valaroix-gold hover:text-valaroix-dark transition-all"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Mobile App</span>
          </button>
        </div>
      </header>

      {/* 2. NAVIGATION TABS */}
      <div className="bg-valaroix-dark border-b border-valaroix-gold/20 px-4 sm:px-8 py-2 sticky top-[61px] z-30 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('partners')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
              activeTab === 'partners' ? 'bg-valaroix-gold text-valaroix-dark shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Split className="w-4 h-4" /> 50/50 Partner Profit Share
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
              activeTab === 'overview' ? 'bg-valaroix-gold text-valaroix-dark shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Revenue & Profit
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all relative ${
              activeTab === 'orders' ? 'bg-valaroix-gold text-valaroix-dark shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Live Orders
            {pendingOrdersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
              activeTab === 'inventory' ? 'bg-valaroix-gold text-valaroix-dark shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" /> Inventory & Stock
          </button>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-8 flex-1 w-full">
        
        {/* TAB 0: 50/50 PARTNER PROFIT SHARE & LEDGER (MUAAZ & FAHAD) */}
        {activeTab === 'partners' && (
          <div className="space-y-8">
            
            {/* Header Banner */}
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

              <div className="flex items-center gap-4">
                <div className="text-center p-4 rounded-2xl bg-black/80 border border-valaroix-gold/30 min-w-[140px]">
                  <span className="text-[10px] text-gray-400 font-mono block uppercase">Total Net Profit</span>
                  <span className="font-serif text-2xl font-bold text-emerald-400">Rs. {totalNetProfit.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Muaaz & Fahad Partner Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* MUAAZ CARD */}
              <div className="glass-panel p-6 rounded-3xl border-valaroix-gold/40 space-y-4 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-valaroix-gold/20 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-valaroix-gold text-valaroix-dark font-serif font-bold text-xl flex items-center justify-center shadow-lg">
                      M
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-white">MUAAZ</h3>
                      <span className="text-xs text-valaroix-gold font-mono">50% Equal Equity Share</span>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold">
                    Active Partner
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-gray-400 font-mono uppercase block">Muaaz Net Profit Earnings:</span>
                  <span className="font-serif text-4xl font-bold text-gold-gradient block">
                    Rs. {muaazShare.toLocaleString()}
                  </span>
                  <p className="text-[11px] text-gray-400">50% share calculated from all sold orders after deducting production cost.</p>
                </div>
              </div>

              {/* FAHAD CARD */}
              <div className="glass-panel p-6 rounded-3xl border-valaroix-gold/40 space-y-4 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-valaroix-gold/20 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-valaroix-gold text-valaroix-dark font-serif font-bold text-xl flex items-center justify-center shadow-lg">
                      F
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-white">FAHAD</h3>
                      <span className="text-xs text-valaroix-gold font-mono">50% Equal Equity Share</span>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold">
                    Active Partner
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-gray-400 font-mono uppercase block">Fahad Net Profit Earnings:</span>
                  <span className="font-serif text-4xl font-bold text-gold-gradient block">
                    Rs. {fahadShare.toLocaleString()}
                  </span>
                  <p className="text-[11px] text-gray-400">50% share calculated from all sold orders after deducting production cost.</p>
                </div>
              </div>

            </div>

            {/* Per-Order 50/50 Profit Split Ledger Table */}
            <div className="glass-panel p-6 rounded-3xl border-valaroix-gold/30 space-y-4">
              <div className="flex justify-between items-center border-b border-valaroix-gold/20 pb-3">
                <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <Split className="w-5 h-5 text-valaroix-gold" /> Per-Order 50/50 Profit Ledger
                </h3>
                <span className="text-xs text-gray-400 font-mono">Auto-Calculated Margin</span>
              </div>

              <div className="space-y-3">
                {orders.map((order) => {
                  const perOrderMuaazShare = Math.round(order.profitPkr / 2);
                  const perOrderFahadShare = Math.round(order.profitPkr / 2);

                  return (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl bg-black border border-valaroix-gold/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-mono"
                    >
                      <div>
                        <span className="font-bold text-valaroix-gold text-sm block">{order.id} — {order.customerName}</span>
                        <span className="text-gray-400 text-[11px] block">{order.item}</span>
                        <span className="text-gray-500 text-[10px] block">Price: Rs. {order.pricePkr.toLocaleString()} | COGS: Rs. {order.cogsPkr.toLocaleString()}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <div className="px-3 py-1.5 rounded-xl bg-valaroix-gold/10 border border-valaroix-gold/30 text-center">
                          <span className="text-[10px] text-gray-400 block">Net Profit</span>
                          <strong className="text-emerald-400 text-sm">Rs. {order.profitPkr.toLocaleString()}</strong>
                        </div>

                        <div className="px-3 py-1.5 rounded-xl bg-black border border-valaroix-gold/40 text-center">
                          <span className="text-[10px] text-gray-400 block">Muaaz (50%)</span>
                          <strong className="text-white text-sm">Rs. {perOrderMuaazShare.toLocaleString()}</strong>
                        </div>

                        <div className="px-3 py-1.5 rounded-xl bg-black border border-valaroix-gold/40 text-center">
                          <span className="text-[10px] text-gray-400 block">Fahad (50%)</span>
                          <strong className="text-white text-sm">Rs. {perOrderFahadShare.toLocaleString()}</strong>
                        </div>

                        <button
                          onClick={() => handleToggleSettleOrder(order.id)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all ${
                            order.settled
                              ? 'bg-emerald-500 text-black'
                              : 'glass-panel text-gray-400 hover:text-white border-valaroix-gold/30'
                          }`}
                        >
                          {order.settled ? <Check className="w-3.5 h-3.5" /> : null}
                          {order.settled ? 'Settled ✓' : 'Mark Settled'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 1: EXECUTIVE FINANCIAL METRICS & PROFIT ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Top 4 Financial Performance Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Gross Revenue */}
              <div className="glass-panel p-6 rounded-3xl border-valaroix-gold/30 space-y-3 relative overflow-hidden shadow-xl">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="uppercase font-mono tracking-wider font-bold">Total Gross Revenue</span>
                  <div className="p-2 rounded-xl bg-valaroix-gold/10 text-valaroix-gold">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <span className="font-serif text-3xl font-bold text-gold-gradient block">
                    Rs. {totalRevenue.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono block mt-1">
                    ↑ +34.2% vs previous week
                  </span>
                </div>
              </div>

              {/* Net Profit */}
              <div className="glass-panel-gold p-6 rounded-3xl border-valaroix-gold/50 space-y-3 relative overflow-hidden shadow-xl">
                <div className="flex items-center justify-between text-xs text-valaroix-gold">
                  <span className="uppercase font-mono tracking-wider font-bold">Net Profit</span>
                  <div className="p-2 rounded-xl bg-valaroix-gold text-valaroix-dark">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <span className="font-serif text-3xl font-bold text-white block">
                    Rs. {totalNetProfit.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-valaroix-gold font-mono block mt-1">
                    Net Profit Margin: <strong className="text-emerald-400">{profitMarginPercent}%</strong>
                  </span>
                </div>
              </div>

              {/* Total Orders */}
              <div className="glass-panel p-6 rounded-3xl border-valaroix-gold/30 space-y-3 relative overflow-hidden shadow-xl">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="uppercase font-mono tracking-wider font-bold">Total Orders</span>
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <span className="font-serif text-3xl font-bold text-white block">
                    {orders.length} Orders
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono block mt-1">
                    {pendingOrdersCount} pending dispatch
                  </span>
                </div>
              </div>

              {/* Registered VIP Patrons */}
              <div className="glass-panel p-6 rounded-3xl border-valaroix-gold/30 space-y-3 relative overflow-hidden shadow-xl">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="uppercase font-mono tracking-wider font-bold">Registered Patrons</span>
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <span className="font-serif text-3xl font-bold text-white block">
                    128 VIPs
                  </span>
                  <span className="text-[11px] text-purple-300 font-mono block mt-1">
                    100% Verified Customer Database
                  </span>
                </div>
              </div>

            </div>

            {/* Profit Margin Calculation Breakdown Card */}
            <div className="glass-panel p-6 rounded-3xl border-valaroix-gold/30 space-y-4">
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-valaroix-gold" /> Fragrance Unit COGS & Profit Margin Breakdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-4 rounded-2xl bg-black border border-valaroix-gold/20 space-y-2">
                  <span className="text-valaroix-gold font-bold block text-sm">50ml 10h+ Lasting</span>
                  <div className="flex justify-between text-gray-300">
                    <span>Retail Price:</span>
                    <strong className="text-white">Rs. 2,499</strong>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Cost of Goods (COGS):</span>
                    <span>Rs. 850</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 border-t border-valaroix-gold/20 pt-2">
                    <span>Net Profit / Bottle:</span>
                    <strong>Rs. 1,649 (66% Margin)</strong>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black border border-valaroix-gold/20 space-y-2">
                  <span className="text-valaroix-gold font-bold block text-sm">50ml 24h+ Lasting</span>
                  <div className="flex justify-between text-gray-300">
                    <span>Retail Price:</span>
                    <strong className="text-white">Rs. 3,499</strong>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Cost of Goods (COGS):</span>
                    <span>Rs. 1,150</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 border-t border-valaroix-gold/20 pt-2">
                    <span>Net Profit / Bottle:</span>
                    <strong>Rs. 2,349 (67% Margin)</strong>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black border border-valaroix-gold/20 space-y-2">
                  <span className="text-valaroix-gold font-bold block text-sm">100ml 24h+ Extrait</span>
                  <div className="flex justify-between text-gray-300">
                    <span>Retail Price:</span>
                    <strong className="text-white">Rs. 6,499</strong>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Cost of Goods (COGS):</span>
                    <span>Rs. 2,200</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 border-t border-valaroix-gold/20 pt-2">
                    <span>Net Profit / Bottle:</span>
                    <strong>Rs. 4,299 (66% Margin)</strong>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: LIVE ORDERS MANAGEMENT & COURIER DISPATCH */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 glass-panel rounded-2xl border-valaroix-gold/20">
              <div className="flex items-center gap-2 text-xs font-bold">
                <Filter className="w-4 h-4 text-valaroix-gold" /> Filter Orders:
                <button
                  onClick={() => setOrderFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    orderFilter === 'all' ? 'bg-valaroix-gold text-valaroix-dark font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  All ({orders.length})
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
                  onClick={() => setOrderFilter('shipped')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    orderFilter === 'shipped' ? 'bg-blue-500 text-white font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Shipped
                </button>
                <button
                  onClick={() => setOrderFilter('delivered')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    orderFilter === 'delivered' ? 'bg-emerald-500 text-white font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Delivered
                </button>
              </div>

              <span className="text-xs text-gray-400 font-mono">
                Click customer phone to send direct WhatsApp message
              </span>
            </div>

            {/* Orders Cards List (Mobile & Desktop Responsive) */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="glass-panel p-6 rounded-3xl border-valaroix-gold/30 space-y-4 shadow-xl"
                >
                  {/* Header Meta */}
                  <div className="flex flex-wrap justify-between items-start gap-4 border-b border-valaroix-gold/20 pb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-valaroix-gold font-bold text-base">{order.id}</span>
                        <span className="text-xs text-gray-400 font-mono">Placed: {order.date}</span>
                      </div>
                      <h4 className="font-serif text-lg font-bold text-white mt-1">{order.customerName}</h4>
                      <span className="text-xs text-gray-300 block">{order.city} — {order.address}</span>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className="font-serif text-lg font-bold text-gold-gradient">
                        Rs. {order.pricePkr.toLocaleString()}
                      </span>
                      <span className="text-xs text-emerald-400 font-mono">
                        Profit: +Rs. {order.profitPkr.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Purchased Item & Engraving */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-gray-400 block font-mono">Item Ordered:</span>
                      <span className="font-bold text-white block">{order.item}</span>
                      {order.engraving && (
                        <span className="inline-block text-[11px] text-valaroix-gold font-mono px-2 py-0.5 rounded bg-valaroix-gold/10 border border-valaroix-gold/30 mt-1">
                          Laser Engraving: "{order.engraving}"
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 md:text-right font-mono">
                      <span className="text-gray-400 block">Payment Method: {order.paymentMethod}</span>
                      <span className="text-valaroix-gold block font-bold">Courier Tracking: {order.trackingCode}</span>
                    </div>
                  </div>

                  {/* Actions & Status Updates */}
                  <div className="pt-3 border-t border-valaroix-gold/15 flex flex-wrap justify-between items-center gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 font-mono">Status:</span>
                      <span className={`px-3 py-1 rounded-full font-bold text-[11px] ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : order.status === 'In Transit'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Send Direct WhatsApp */}
                      <button
                        onClick={() => handleOpenWhatsAppCustomer(order.phone, order.id, order.customerName)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all border border-emerald-500/40 flex items-center gap-1.5 font-bold"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> WhatsApp ({order.phone})
                      </button>

                      {/* Status Change Buttons */}
                      {order.status === 'Pending Dispatch' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'In Transit')}
                          className="px-3.5 py-1.5 rounded-xl btn-gold text-xs uppercase font-bold"
                        >
                          Dispatch via DHL ➔
                        </button>
                      )}

                      {order.status === 'In Transit' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'Delivered')}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-black text-xs uppercase font-bold"
                        >
                          Mark Delivered ✓
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 3: INVENTORY & BOTTLE STOCK */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl border-valaroix-gold/30 space-y-4">
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-valaroix-gold" /> Raw Material & Bottle Stock Inventory
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-4 rounded-2xl bg-black border border-valaroix-gold/20 space-y-1">
                  <span className="text-gray-400 block">50ml Faceted Crystal Bottles</span>
                  <span className="text-2xl font-bold text-white">450 Units</span>
                  <span className="text-[10px] text-emerald-400 block">In Stock</span>
                </div>

                <div className="p-4 rounded-2xl bg-black border border-valaroix-gold/20 space-y-1">
                  <span className="text-gray-400 block">100ml Faceted Crystal Bottles</span>
                  <span className="text-2xl font-bold text-white">280 Units</span>
                  <span className="text-[10px] text-emerald-400 block">In Stock</span>
                </div>

                <div className="p-4 rounded-2xl bg-black border border-valaroix-gold/20 space-y-1">
                  <span className="text-gray-400 block">24k Gold Atomizer Sprays</span>
                  <span className="text-2xl font-bold text-white">820 Units</span>
                  <span className="text-[10px] text-emerald-400 block">In Stock</span>
                </div>

                <div className="p-4 rounded-2xl bg-black border border-valaroix-gold/20 space-y-1">
                  <span className="text-gray-400 block">Royal Ambergris Extrait Oil</span>
                  <span className="text-2xl font-bold text-white">12.5 Liters</span>
                  <span className="text-[10px] text-valaroix-gold block">Aged in Grasse</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
