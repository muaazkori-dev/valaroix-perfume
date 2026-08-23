'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Lock, Check, X, Eye, Printer, Filter, 
  MessageSquare, Trash2, Split, TrendingUp, Sparkles, ExternalLink,
  ShoppingBag, ArrowLeft, Truck, PackageCheck, Bell, Volume2, VolumeX,
  Phone, MapPin, Clock, AlertCircle, CheckCircle2, RefreshCw, Send,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboardPage() {
  const { userOrders, setUserOrders } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [orderFilter, setOrderFilter] = useState('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);
  const [newOrderToast, setNewOrderToast] = useState(null);
  const [statusToast, setStatusToast] = useState(null);

  const initialSampleOrders = [
    {
      id: 'VLX-12630',
      customerName: 'Ali Hamza',
      phone: '03337155323',
      city: 'Larkana',
      address: 'wahid chowk green road rehbar model school larkana',
      date: '2026-08-23',
      item: 'VALAROIX YSL Y (50ml • 30% Pure Oil)',
      size: '50ml',
      pricePkr: 3300,
      cogsPkr: 1100,
      profitPkr: 2200,
      status: 'Confirmed & Dispatched via TCS',
      tcsTrackingNumber: '7748291048',
      paymentMethod: 'Advance Payment (SadaPay)',
      receiptImage: null
    },
    {
      id: 'VLX-90842',
      customerName: 'Taimoor Tariq',
      phone: '03141397378',
      city: 'Karachi',
      address: 'House 42, Street 7, Phase 5 DHA',
      date: '2026-08-23',
      item: 'VALAROIX DIOR SAUVAGE (50ml • 30% Pure Oil)',
      size: '50ml',
      pricePkr: 2699,
      cogsPkr: 950,
      profitPkr: 1749,
      status: 'In Transit with TCS Express',
      tcsTrackingNumber: '7729841029',
      paymentMethod: 'Cash On Delivery',
      receiptImage: null
    }
  ];

  const [localOrders, setLocalOrders] = useState([]);

  // Audio Chime Synthesizer
  const playAlertSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {}
  };

  // Trigger Native Mobile & Desktop System Push Notification (Works with Screen Locked & in Background)
  const triggerNativePushNotification = (order) => {
    try {
      // Haptic Vibration on mobile phone
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([300, 100, 300, 100, 300]);
      }

      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          const title = `🔔 New Order #${order.id} — Rs. ${getOrderPrice(order).toLocaleString()}`;
          const options = {
            body: `${order.customerName || 'Customer'} ordered ${order.item || 'Perfume'} (${order.city || 'Pakistan'})`,
            icon: '/logo.jpg',
            badge: '/logo.jpg',
            vibrate: [300, 100, 300, 100, 300],
            tag: `valaroix-order-${order.id}`,
            renotify: true,
            data: { url: '/admin' }
          };

          // Try Service Worker registration (Mobile Phone lock-screen support)
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then((registration) => {
              registration.showNotification(title, options);
            }).catch(() => {
              new Notification(title, options);
            });
          } else {
            new Notification(title, options);
          }
        }
      }
    } catch (e) {}
  };

  const requestNotificationPermission = () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          setHasNotificationPermission(true);
          // Register Service Worker for mobile phone
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => {});
          }
          setStatusToast('🔔 Mobile & System Notifications Enabled! You will receive alerts even when screen is locked.');
          setTimeout(() => setStatusToast(null), 4500);
        }
      });
    }
  };

  // Helper calculation for Price & Profit
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

  // Fetch orders from Central Server Cloud Database & Poll every 3.5 seconds
  useEffect(() => {
    let lastOrderIds = new Set();

    const fetchServerOrders = async () => {
      try {
        const res = await fetch('/api/orders', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.orders) && data.orders.length > 0) {
            const serverOrders = data.orders;
            
            // Check for brand new orders not seen before
            if (lastOrderIds.size > 0) {
              const newOrders = serverOrders.filter(o => !lastOrderIds.has(o.id));
              if (newOrders.length > 0) {
                const latest = newOrders[0];
                playAlertSound();
                triggerNativePushNotification(latest);
                setNewOrderToast(latest);
                setTimeout(() => setNewOrderToast(null), 6000);
              }
            }

            // Update tracked IDs
            lastOrderIds = new Set(serverOrders.map(o => o.id));

            // Sync with local state
            setLocalOrders((prev) => {
              const merged = [...serverOrders, ...prev];
              const unique = merged.filter((o, idx, self) => idx === self.findIndex(x => x.id === o.id));
              return unique;
            });

            try {
              localStorage.setItem('valaroix_orders', JSON.stringify(serverOrders));
            } catch (e) {}
          }
        }
      } catch (err) {}
    };

    // Initial fetch from LocalStorage first for instant UI
    try {
      const saved = localStorage.getItem('valaroix_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLocalOrders(parsed);
          lastOrderIds = new Set(parsed.map(o => o.id));
        }
      }
      const authSaved = sessionStorage.getItem('valaroix_admin_auth');
      if (authSaved === 'true') {
        setIsAuthenticated(true);
      }
    } catch (e) {}

    // Register Service Worker for mobile notifications
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // Fetch from server immediately
    fetchServerOrders();

    // Poll server every 3.5 seconds for real-time live incoming orders from mobile phones
    const pollInterval = setInterval(fetchServerOrders, 3500);

    // Real-Time BroadcastChannel listener for same-device tabs
    let channel;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      channel = new BroadcastChannel('valaroix_orders_channel');
      channel.onmessage = (event) => {
        if (event.data?.type === 'NEW_ORDER' && event.data.order) {
          playAlertSound();
          triggerNativePushNotification(event.data.order);
          setNewOrderToast(event.data.order);
          setTimeout(() => setNewOrderToast(null), 6000);
          fetchServerOrders();
        }
      };
    }

    return () => {
      clearInterval(pollInterval);
      if (channel) channel.close();
    };
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

  // Update order status everywhere with server cloud sync
  const updateOrderStatus = (orderId, newStatus, message) => {
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

    // Sync to cloud server API
    try {
      fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      }).catch(() => {});
    } catch (e) {}

    setStatusToast(message || `Order #${orderId} status changed to: ${newStatus}`);
    setTimeout(() => setStatusToast(null), 3500);

    return updated;
  };

  // Delete Order with server cloud sync
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

    // Sync to cloud server API
    try {
      fetch('/api/orders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      }).catch(() => {});
    } catch (e) {}

    setStatusToast(`Order #${orderId} deleted.`);
    setTimeout(() => setStatusToast(null), 3000);
  };

  // Financial Metrics
  const totalRevenue = allOrders.reduce((sum, o) => sum + getOrderPrice(o), 0);
  const totalNetProfit = allOrders.reduce((sum, o) => sum + getOrderProfit(o), 0);
  const pendingOrdersCount = allOrders.filter((o) => (o.status || '').toLowerCase().includes('pending')).length;
  const muaazShare = Math.round(totalNetProfit / 2);
  const fahadShare = Math.round(totalNetProfit / 2);

  // Filtered list
  const filteredOrders = allOrders.filter((order) => {
    const st = (order.status || '').toLowerCase();
    if (orderFilter === 'pending') return st.includes('pending');
    if (orderFilter === 'confirmed') return st.includes('confirmed') || st.includes('transit');
    if (orderFilter === 'delivered') return st.includes('delivered');
    if (orderFilter === 'cancelled') return st.includes('cancel');
    return true;
  });

  // Client WhatsApp Action 1: ASK CUSTOMER TO CONFIRM ON WHATSAPP
  const handleAskCustomerToConfirm = (order) => {
    const cleanPhone = (order.phone || order.whatsapp || '').replace(/^0/, '');
    const price = getOrderPrice(order);
    const text = encodeURIComponent(
      `Assalam-o-Alaikum ${order.customerName}! ✨\n\nHum VALAROIX Luxury Fragrance se baat kar rahe hain.\n\nAapka order receive hua hai:\n📦 Order: #${order.id}\n🌸 Product: ${order.items ? order.items.map(i=>i.name).join(', ') : order.item}\n💰 Total Amount: Rs. ${price.toLocaleString()}\n📍 Address: ${order.address}, ${order.city}\n\n👉 Kya aap is order ko CONFIRM karte hain taake hum TCS Express se parcel dispatch kar dein? Baraye meharbani 'YES' likh kar reply karein. Shukriya!`
    );
    window.open(`https://wa.me/92${cleanPhone}?text=${text}`, '_blank');
  };

  // Client WhatsApp Action 2: SEND TCS DISPATCH CONFIRMATION
  const handleSendDispatchWhatsApp = (order) => {
    const cleanPhone = (order.phone || order.whatsapp || '').replace(/^0/, '');
    const price = getOrderPrice(order);
    const text = encodeURIComponent(
      `Assalam-o-Alaikum ${order.customerName}! ✨\n\nAapka VALAROIX Luxury Perfume order #${order.id} CONFIRM kar diya gaya hai!\n\n📦 Item: ${order.items ? order.items.map(i=>i.name).join(', ') : order.item}\n💰 Total Bill: Rs. ${price.toLocaleString()}\n🚚 Delivery via: TCS Express Courier (Tracking CN: ${order.tcsTrackingNumber || '7780863721'})\n\nParcel 24 hours ke andar deliver ho jayega. Shukriya!`
    );
    window.open(`https://wa.me/92${cleanPhone}?text=${text}`, '_blank');
  };

  // Client WhatsApp Action 3: SEND CANCEL ALERT
  const handleSendCancelWhatsApp = (order) => {
    const cleanPhone = (order.phone || order.whatsapp || '').replace(/^0/, '');
    const text = encodeURIComponent(
      `Assalam-o-Alaikum ${order.customerName}! Aapka VALAROIX order #${order.id} cancel kar diya gaya hai. Mazeed maloomat ke liye hum se rabta karein.`
    );
    window.open(`https://wa.me/92${cleanPhone}?text=${text}`, '_blank');
  };

  // IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-[#141414] border border-[#D4AF37]/50 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37] mx-auto flex items-center justify-center text-[#D4AF37]">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h1 className="font-serif-mockup text-2xl font-extrabold text-white">
              VALAROIX Admin
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Enter Owner Passcode to manage orders & profits
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError(false);
              }}
              placeholder="Enter PIN (9824)"
              className="w-full bg-black border border-[#D4AF37]/40 rounded-2xl py-3.5 text-center text-xl font-mono text-[#D4AF37] tracking-[0.4em] focus:outline-none focus:border-[#D4AF37]"
              autoFocus
            />

            {pinError && (
              <p className="text-xs text-red-400 font-mono">
                Incorrect PIN. Enter 9824
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl btn-mockup-gold text-xs font-bold uppercase tracking-wider"
            >
              Open Admin Panel
            </button>
          </form>

          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#D4AF37]">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-gray-100 font-sans flex flex-col pb-16">
      
      {/* STATUS ACTION TOAST */}
      {statusToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1A1A1A] border border-[#D4AF37] text-white px-5 py-3 rounded-2xl shadow-[0_10px_40px_rgba(212,175,55,0.4)] flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{statusToast}</span>
        </div>
      )}

      {/* REAL-TIME NEW ORDER TOAST ALERT */}
      {newOrderToast && (
        <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-emerald-950 border-2 border-emerald-400 text-white p-4 rounded-2xl shadow-[0_10px_40px_rgba(16,185,129,0.5)] animate-bounce flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-emerald-400 animate-pulse" />
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-300 block">🔔 NEW LIVE ORDER RECEIVED!</span>
              <h4 className="font-bold text-xs sm:text-sm">{newOrderToast.customerName || 'Customer'} — Rs. {getOrderPrice(newOrderToast).toLocaleString()}</h4>
            </div>
          </div>
          <button
            onClick={() => setNewOrderToast(null)}
            className="p-1 rounded-lg bg-black/40 text-gray-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TOP BAR */}
      <header className="sticky top-0 z-40 bg-[#141414] border-b border-[#D4AF37]/30 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#D4AF37] text-black font-serif-mockup font-black text-base flex items-center justify-center shadow-lg">
            V
          </div>
          <div>
            <h2 className="font-serif-mockup font-bold text-base sm:text-lg text-white leading-tight flex items-center gap-1.5">
              VALAROIX Admin Panel <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </h2>
            <span className="text-[10px] text-[#D4AF37] font-mono">Owner Portal: Muaaz & Fahad</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playAlertSound();
            }}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
              soundEnabled ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-white/5 text-gray-400 border-white/10'
            }`}
            title={soundEnabled ? 'Live Order Sound: ON' : 'Live Order Sound: OFF'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Sound ON' : 'Sound OFF'}</span>
          </button>

          <a
            href="/VALAROIX-Executive-Owner-App.apk"
            download
            className="px-3 py-2 rounded-xl bg-[#D4AF37] text-black text-xs font-black flex items-center gap-1.5 shadow-md hover:bg-amber-400 transition-all"
            title="Download Updated Android APK with Gold Logo & Lock-Screen Alerts"
          >
            <span>📱 Download App (Gold Logo)</span>
          </a>

          <Link
            href="/"
            className="px-3 py-2 rounded-xl border border-white/10 text-xs text-gray-300 hover:text-white bg-white/5"
          >
            View Store
          </Link>

          <button
            onClick={() => {
              sessionStorage.removeItem('valaroix_admin_auth');
              setIsAuthenticated(false);
            }}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/40 text-xs font-bold"
          >
            <Lock className="w-4 h-4 sm:hidden" />
            <span className="hidden sm:inline">Lock</span>
          </button>
        </div>
      </header>

      {/* DASHBOARD STATS BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Total Orders */}
          <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Total Orders</span>
            <span className="font-serif-mockup text-xl sm:text-2xl font-black text-white block">{allOrders.length}</span>
          </div>

          {/* Pending Action */}
          <div className="p-4 rounded-2xl bg-[#141414] border border-amber-500/30 space-y-1">
            <span className="text-[10px] text-amber-400 uppercase font-bold block">Pending Action</span>
            <span className="font-serif-mockup text-xl sm:text-2xl font-black text-amber-400 block">{pendingOrdersCount}</span>
          </div>

          {/* Total Revenue */}
          <div className="p-4 rounded-2xl bg-[#141414] border border-[#D4AF37]/30 space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Total Sales</span>
            <span className="font-serif-mockup text-xl sm:text-2xl font-black text-[#D4AF37] block">Rs. {totalRevenue.toLocaleString()}</span>
          </div>

          {/* 50/50 Share */}
          <div className="p-4 rounded-2xl bg-[#141414] border border-emerald-500/30 space-y-1">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block">50/50 Share Each</span>
            <span className="font-serif-mockup text-xl sm:text-2xl font-black text-emerald-400 block">Rs. {muaazShare.toLocaleString()}</span>
          </div>

        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6 w-full flex-1">
        
        {/* Navigation & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-[#141414] rounded-2xl border border-white/10">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setOrderFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                orderFilter === 'all' ? 'bg-[#D4AF37] text-black' : 'text-gray-400 bg-white/5 hover:text-white'
              }`}
            >
              All Orders ({allOrders.length})
            </button>
            <button
              onClick={() => setOrderFilter('pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                orderFilter === 'pending' ? 'bg-amber-500 text-black' : 'text-gray-400 bg-white/5 hover:text-white'
              }`}
            >
              Pending ({pendingOrdersCount})
            </button>
            <button
              onClick={() => setOrderFilter('confirmed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                orderFilter === 'confirmed' ? 'bg-emerald-500 text-black' : 'text-gray-400 bg-white/5 hover:text-white'
              }`}
            >
              Dispatched via TCS
            </button>
            <button
              onClick={() => setOrderFilter('cancelled')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                orderFilter === 'cancelled' ? 'bg-red-500 text-white' : 'text-gray-400 bg-white/5 hover:text-white'
              }`}
            >
              Cancelled
            </button>
          </div>
        </div>

        {/* ORDER CARDS LIST */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center bg-[#141414] rounded-3xl border border-white/10 text-gray-400 text-xs">
              No orders found in this tab.
            </div>
          ) : (
            filteredOrders.map((order) => {
              const price = getOrderPrice(order);
              const receiptUrl = order.receiptImage || order.receiptPreview;
              const st = (order.status || '').toLowerCase();
              const isConfirmed = st.includes('confirmed') || st.includes('dispatched');
              const isInTransit = st.includes('transit');
              const isDelivered = st.includes('delivered');
              const isCancelled = st.includes('cancel');
              const isPending = !isConfirmed && !isInTransit && !isDelivered && !isCancelled;

              return (
                <div
                  key={order.id}
                  className="p-5 sm:p-6 rounded-3xl bg-[#141414] border border-[#D4AF37]/30 space-y-4 shadow-xl relative"
                >
                  {/* Top Order Meta */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 pb-3 border-b border-white/10">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm sm:text-base font-bold text-[#D4AF37]">{order.id}</span>
                        <span className="text-[10px] text-gray-400 font-mono">Date: {order.date || 'Today'}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isDelivered ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                          : isInTransit ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : isConfirmed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : isCancelled ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                        }`}>
                          {order.status || 'Pending Confirmation'}
                        </span>
                      </div>
                      <h3 className="font-serif-mockup text-lg sm:text-xl font-bold text-white mt-1">
                        {order.customerName}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-300 mt-1">
                        <span className="text-gray-400">WhatsApp:</span>
                        <a
                          href={`https://wa.me/92${(order.phone || '').replace(/^0/, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono font-bold text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" /> {order.phone}
                        </a>
                      </div>
                      <p className="text-xs text-gray-300 mt-1">
                        <strong className="text-white">{order.city}</strong> — {order.address}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Total Amount</span>
                      <span className="font-serif-mockup text-2xl font-extrabold text-[#D4AF37]">
                        Rs. {price.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400 block mt-0.5">
                        Payment: <strong className="text-white uppercase">{order.paymentMethod || 'COD'}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Order Items & Receipt Slip */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-black/60 border border-white/5 text-xs">
                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-bold block mb-1">Item Details:</span>
                      <span className="font-bold text-white block">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((i, idx) => (
                            <span key={idx} className="block">• {i.name} (Qty: {i.quantity || 1})</span>
                          ))
                        ) : (
                          <span>• {order.item || 'VALAROIX Fragrance'}</span>
                        )}
                      </span>
                    </div>

                    {/* Receipt Screenshot Viewer */}
                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-bold block mb-1">Payment Slip / Screenshot:</span>
                      {receiptUrl ? (
                        <div className="flex items-center gap-2">
                          <div
                            onClick={() => setSelectedReceipt(receiptUrl)}
                            className="w-12 h-12 rounded-xl overflow-hidden border-2 border-[#D4AF37] bg-black cursor-pointer shadow-md shrink-0 hover:scale-105 transition-transform"
                          >
                            <img src={receiptUrl} alt="Slip" className="w-full h-full object-cover" />
                          </div>
                          <button
                            onClick={() => setSelectedReceipt(receiptUrl)}
                            className="px-3 py-2 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] text-xs font-bold hover:bg-[#D4AF37] hover:text-black transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Eye className="w-4 h-4" /> View SadaPay Slip
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs italic block py-1">
                          {order.paymentMethod?.toLowerCase().includes('advance') || order.paymentMethod?.toLowerCase().includes('sada')
                            ? '⚠️ SadaPay Screenshot not attached (Verify in SadaPay: 03472818878)'
                            : 'Cash on Delivery (No slip required)'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ACTION BUTTONS: STEP-BY-STEP PROGRESSIVE PIPELINE */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-2">
                    
                    {/* STAGE 1: PENDING -> SHOW ONLY CONFIRM BUTTON */}
                    {isPending && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Confirmed & Dispatched via TCS', `✓ Order #${order.id} Confirmed!`)}
                        className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer min-w-[160px]"
                      >
                        <Check className="w-4 h-4" />
                        <span>Confirm Order</span>
                      </button>
                    )}

                    {/* STAGE 2: CONFIRMED -> CONFIRM IS GONE, NOW SHOW ONLY IN-TRANSIT BUTTON */}
                    {isConfirmed && !isInTransit && !isDelivered && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'In Transit with TCS Express', `🚚 Order #${order.id} Handed Over to TCS!`)}
                        className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer min-w-[160px]"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Handover to TCS (In Transit)</span>
                      </button>
                    )}

                    {/* STAGE 3: IN TRANSIT -> IN-TRANSIT IS GONE, NOW SHOW ONLY DELIVERED BUTTON */}
                    {isInTransit && !isDelivered && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Delivered & Payment Collected', `🎁 Order #${order.id} Delivered Successfully!`)}
                        className="flex-1 py-3 px-4 rounded-xl bg-blue-500 text-white hover:bg-blue-400 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer min-w-[160px]"
                      >
                        <PackageCheck className="w-4 h-4" />
                        <span>Mark Order as Delivered</span>
                      </button>
                    )}

                    {/* STAGE 4: DELIVERED -> SHOW COMPLETED BADGE */}
                    {isDelivered && (
                      <div className="flex-1 py-2.5 px-4 rounded-xl bg-blue-950/60 border border-blue-500/50 text-blue-400 text-xs font-bold flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-400" />
                        <span>Order Completed & Delivered ✓</span>
                      </div>
                    )}

                    {/* IF CANCELLED -> SHOW REOPEN OPTION */}
                    {isCancelled && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Pending Verification', `🔄 Order #${order.id} Reopened.`)}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-black border border-amber-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Reopen Order</span>
                      </button>
                    )}

                    {/* WHATSAPP ACTION 1: ASK CUSTOMER TO CONFIRM ON WHATSAPP */}
                    {isPending && (
                      <button
                        onClick={() => handleAskCustomerToConfirm(order)}
                        className="py-2.5 px-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        title="Send WhatsApp message asking customer to confirm order"
                      >
                        <HelpCircle className="w-4 h-4" />
                        <span>Ask WhatsApp</span>
                      </button>
                    )}

                    {/* WHATSAPP ACTION 2: SEND TCS DISPATCH NOTIFICATION */}
                    {isConfirmed && (
                      <button
                        onClick={() => handleSendDispatchWhatsApp(order)}
                        className="py-2.5 px-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        title="Send WhatsApp dispatch tracking alert to customer"
                      >
                        <Send className="w-4 h-4" />
                        <span>Notify Dispatch</span>
                      </button>
                    )}

                    {/* CANCEL BUTTON */}
                    {!isDelivered && !isCancelled && (
                      <button
                        onClick={() => {
                          updateOrderStatus(order.id, 'Cancelled', `Order #${order.id} Cancelled.`);
                          handleSendCancelWhatsApp(order);
                        }}
                        className="py-2.5 px-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/40 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                        title="Cancel Order and Notify Customer via WhatsApp"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    )}

                    {/* DELETE BUTTON */}
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="py-2.5 px-3 rounded-xl bg-gray-800 text-gray-400 hover:bg-red-700 hover:text-white border border-white/10 text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                      title="Delete Order Permanently"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>

                </div>
              );
            })
          )}
        </div>

      </main>

      {/* FULL RECEIPT PREVIEW MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-lg w-full bg-[#141414] border border-[#D4AF37] rounded-3xl p-6 space-y-4 shadow-2xl">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-gray-300 hover:text-[#D4AF37]"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="font-serif-mockup text-lg font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#D4AF37]" /> Payment Receipt Slip
            </h4>
            <div className="w-full max-h-[70vh] rounded-2xl overflow-hidden border border-white/10 bg-black flex items-center justify-center p-2">
              <img src={selectedReceipt} alt="Receipt Slip" className="w-full max-h-[60vh] object-contain rounded-xl" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
