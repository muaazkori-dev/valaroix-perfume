'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Lock, Check, X, Eye, Printer, Filter, 
  MessageSquare, Trash2, Split, TrendingUp, Sparkles, ExternalLink,
  ShoppingBag, ArrowLeft, Truck, PackageCheck, Bell, Volume2, VolumeX,
  Phone, MapPin, Clock, AlertCircle, CheckCircle2, RefreshCw, Send,
  HelpCircle, Copy, CheckCheck, Zap, Layers
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
  const [copiedField, setCopiedField] = useState(null);
  const [bookingOrderId, setBookingOrderId] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [cancelConfirmOrder, setCancelConfirmOrder] = useState(null);
  const [selectedLabelOrder, setSelectedLabelOrder] = useState(null);
  const [isTestMode, setIsTestMode] = useState(false);

  const initialSampleOrders = [];

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

            // Sync with local state intelligently without overwriting recent user actions
            setLocalOrders((prev) => {
              if (serverOrders.length === 0) {
                return [];
              }
              const merged = serverOrders.map((so) => {
                const local = prev.find((p) => p.id === so.id);
                if (!local) return so;
                const isLocalModified = (local.status && local.status !== 'Pending Verification') || local.tcsTrackingNumber;
                if (isLocalModified && (so.status === 'Pending Verification' || !so.status) && !so.tcsTrackingNumber) {
                  return { ...so, status: local.status, tcsTrackingNumber: local.tcsTrackingNumber };
                }
                return { ...local, ...so };
              });
              return merged;
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
          const clean = parsed.filter(o => o.id !== 'VLX-12630' && o.id !== 'VLX-90842' && o.id !== 'VLX-81416' && o.id !== 'VLX-24705');
          setLocalOrders(clean);
          lastOrderIds = new Set(clean.map(o => o.id));
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

  // Clear All Orders completely
  const handleClearAllOrders = async () => {
    if (!confirm('⚠️ Are you sure you want to delete ALL previous orders? This will reset all orders.')) return;
    setLocalOrders([]);
    if (setUserOrders) {
      setUserOrders([]);
    }
    try {
      localStorage.removeItem('valaroix_orders');
    } catch (e) {}

    try {
      await fetch('/api/orders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clearAll: true })
      });
    } catch (e) {}

    setStatusToast('🗑️ All previous orders deleted successfully.');
    setTimeout(() => setStatusToast(null), 3500);
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

  // 1-Tap Copy Helper with visual feedback
  const handleCopy = (text, fieldId) => {
    if (!text) return;
    try {
      navigator.clipboard.writeText(String(text));
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (e) {}
  };

  // Auto-Book with TCS API in 1-Click
  const handleAutoBookTCS = async (order) => {
    setBookingOrderId(order.id);
    try {
      const price = getOrderPrice(order);
      const res = await fetch('/api/tcs/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          customerName: order.customerName || order.name || 'Valaroix Patron',
          phone: order.phone || order.whatsapp || '',
          city: order.city || 'Karachi',
          address: order.address || 'Standard Delivery Address',
          item: order.items ? order.items.map(i => `${i.name} x${i.quantity || 1}`).join(', ') : (order.item || 'VALAROIX Fragrance'),
          pieces: order.items ? order.items.reduce((s, i) => s + (i.quantity || 1), 0) : 1,
          totalAmount: price,
          paymentMethod: order.paymentMethod || 'COD'
        })
      });

      const data = await res.json();
      if (data.success && data.tcsTrackingNumber) {
        const cnNumber = data.tcsTrackingNumber;

        // 1. Update local orders state immediately
        setLocalOrders((prev) =>
          prev.map((o) =>
            o.id === order.id
              ? { ...o, status: 'Confirmed & Dispatched via TCS', tcsTrackingNumber: cnNumber }
              : o
          )
        );

        if (setUserOrders) {
          setUserOrders((prev) =>
            prev.map((o) =>
              o.id === order.id
                ? { ...o, status: 'Confirmed & Dispatched via TCS', tcsTrackingNumber: cnNumber }
                : o
            )
          );
        }

        // 2. Persist to localStorage
        try {
          const saved = JSON.parse(localStorage.getItem('valaroix_orders') || '[]');
          const updatedSaved = saved.map(o => o.id === order.id ? { ...o, status: 'Confirmed & Dispatched via TCS', tcsTrackingNumber: cnNumber } : o);
          localStorage.setItem('valaroix_orders', JSON.stringify(updatedSaved));
        } catch (e) {}

        // 3. Persist to central cloud database
        try {
          await fetch('/api/orders', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: order.id,
              status: 'Confirmed & Dispatched via TCS',
              tcsTrackingNumber: cnNumber
            })
          });
        } catch (e) {}

        setStatusToast(`🚀 TCS Auto-Booked! CN: #${cnNumber} assigned to Order #${order.id}`);
        setTimeout(() => setStatusToast(null), 4500);
      } else {
        alert(data.message || 'TCS Booking failed. Please check connection.');
      }
    } catch (err) {
      alert('TCS Booking network error.');
    } finally {
      setBookingOrderId(null);
    }
  };

  // Trigger Cancellation Confirmation Modal
  const handleCancelOrder = (order) => {
    setCancelConfirmOrder(order);
  };

  // Unified Execute Cancel Handler (for both Pending and TCS Dispatched orders)
  const executeCancelOrder = async (order, sendWhatsApp = false) => {
    const isBookedWithTCS = !!order.tcsTrackingNumber;
    setCancellingOrderId(order.id);
    setCancelConfirmOrder(null);
    const updatedStatus = isBookedWithTCS ? 'Cancelled (TCS Booking Deleted)' : 'Cancelled';

    try {
      // 1. Immediately update local state
      setLocalOrders((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, status: updatedStatus, tcsTrackingNumber: null } : o
        )
      );
      if (setUserOrders) {
        setUserOrders((prev) =>
          prev.map((o) =>
            o.id === order.id ? { ...o, status: updatedStatus, tcsTrackingNumber: null } : o
          )
        );
      }

      // 2. Persist to localStorage
      try {
        const saved = JSON.parse(localStorage.getItem('valaroix_orders') || '[]');
        const updatedSaved = saved.map((o) =>
          o.id === order.id ? { ...o, status: updatedStatus, tcsTrackingNumber: null } : o
        );
        localStorage.setItem('valaroix_orders', JSON.stringify(updatedSaved));
      } catch (e) {}

      // 3. Persist to central cloud database
      try {
        await fetch('/api/orders', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: order.id,
            status: updatedStatus,
            tcsTrackingNumber: null
          })
        });
      } catch (e) {}

      // 4. If booked with TCS, call TCS cancellation endpoint to delete from TCS Envio portal
      if (isBookedWithTCS) {
        try {
          await fetch('/api/tcs/cancel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: order.id,
              tcsTrackingNumber: order.tcsTrackingNumber
            })
          });
        } catch (e) {}
      }

      setStatusToast(`✓ Order #${order.id} Cancelled successfully.`);
      setTimeout(() => setStatusToast(null), 3500);

      // 5. Optionally open WhatsApp immediately
      if (sendWhatsApp) {
        handleSendCancelWhatsApp(order);
      }
    } catch (err) {
      alert('Failed to cancel order.');
    } finally {
      setCancellingOrderId(null);
    }
  };

  // Combine multiple orders for same customer phone
  const handleCombineOrders = (phoneToCombine) => {
    const matching = allOrders.filter(o => (o.phone === phoneToCombine || o.whatsapp === phoneToCombine) && (o.status || '').toLowerCase().includes('pending'));
    if (matching.length < 2) return;

    const primaryOrder = matching[0];
    const otherOrders = matching.slice(1);
    
    // Combine items & calculate combined price
    const combinedItems = matching.flatMap(o => o.items || [{ name: o.item, quantity: 1, price: getOrderPrice(o) }]);
    const combinedPrice = matching.reduce((sum, o) => sum + getOrderPrice(o), 0);
    const otherIds = otherOrders.map(o => o.id).join(', ');

    const updated = allOrders.map(o => {
      if (o.id === primaryOrder.id) {
        return {
          ...o,
          items: combinedItems,
          pricePkr: combinedPrice,
          total: combinedPrice,
          remarks: `Combined with ${otherIds}`
        };
      }
      if (otherOrders.some(other => other.id === o.id)) {
        return {
          ...o,
          status: 'Cancelled (Merged into #' + primaryOrder.id + ')'
        };
      }
      return o;
    });

    setLocalOrders(updated);
    if (setUserOrders) setUserOrders(updated);
    try {
      localStorage.setItem('valaroix_orders', JSON.stringify(updated));
    } catch (e) {}

    setStatusToast(`📦 Merged ${matching.length} Orders into Order #${primaryOrder.id} (Total: Rs. ${combinedPrice.toLocaleString()})`);
    setTimeout(() => setStatusToast(null), 4000);
  };

  // Client WhatsApp Action 1: ASK CUSTOMER TO CONFIRM ON WHATSAPP
  const handleAskCustomerToConfirm = (order) => {
    const cleanPhone = (order.phone || order.whatsapp || '').replace(/^0/, '');
    const price = getOrderPrice(order);
    const text = encodeURIComponent(
      `Assalam-o-Alaikum ${order.customerName}! ✨\n\nHum VALAROIX Luxury Fragrance se baat kar rahe hain.\n\nAapka order receive hua hai:\n📦 Order: #${order.id}\n🌸 Product: ${order.items ? order.items.map(i=>`${i.name} (x${i.quantity || 1})`).join(', ') : order.item}\n💰 Total Amount: Rs. ${price.toLocaleString()} (${order.paymentMethod || 'COD'})\n📍 Address: ${order.address}, ${order.city}\n\n👉 Kya aap is order ko CONFIRM karte hain taake hum TCS Express se parcel dispatch kar dein? Baraye meharbani 'YES' likh kar reply karein. Shukriya!\n\nTeam VALAROIX`
    );
    window.open(`https://wa.me/92${cleanPhone}?text=${text}`, '_blank');
  };

  // Client WhatsApp Action 2: SEND TCS DISPATCH CONFIRMATION WITH LIVE TRACKING LINK
  const handleSendDispatchWhatsApp = (order) => {
    const cleanPhone = (order.phone || order.whatsapp || '').replace(/^0/, '');
    const price = getOrderPrice(order);
    const cn = order.tcsTrackingNumber || '7780863721';
    const trackUrl = `https://valaroix.com/track?q=${cn}`;
    const text = encodeURIComponent(
      `Assalam-o-Alaikum ${order.customerName}! ✨\n\nVALAROIX Parfums se aapka luxury perfume order #${order.id} CONFIRM aur DISPATCH kar diya gaya hai!\n\n📦 Item: ${order.items ? order.items.map(i=>`${i.name} (x${i.quantity || 1})`).join(', ') : order.item}\n💰 Total Bill: Rs. ${price.toLocaleString()} (${order.paymentMethod || 'COD'})\n🏷️ TCS Consignment CN: ${cn}\n📍 Live Parcel Tracking: ${trackUrl}\n\nAapka parcel 1-2 din me TCS delivery rider deliver kar dega. Shukriya!\n\nTeam VALAROIX`
    );
    window.open(`https://wa.me/92${cleanPhone}?text=${text}`, '_blank');
  };

  // Client WhatsApp Action 3: SEND CANCEL ALERT
  const handleSendCancelWhatsApp = (order) => {
    const cleanPhone = (order.phone || order.whatsapp || '').replace(/^0/, '');
    const price = getOrderPrice(order);
    const text = encodeURIComponent(
      `Assalam-o-Alaikum ${order.customerName || 'Valued Customer'}! ✨\n\nHum VALAROIX Luxury Fragrance se baat kar rahe hain.\n\nAapka order #${order.id} cancel kar diya gaya hai.\n\n📦 Order: #${order.id}\n🌸 Item: ${order.items ? order.items.map(i => `${i.name} x${i.quantity || 1}`).join(', ') : (order.item || 'VALAROIX Fragrance')}\n💰 Total Bill: Rs. ${price.toLocaleString()}\n\nAgar aap dobara order place karna chahte hain ya koi sawal hai, to hum se isi WhatsApp par rabta kar sakte hain.\n\nShukriya!\nTeam VALAROIX\nhttps://valaroix.com`
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
          {/* TCS Test Mode / Live Mode Switch */}
          <button
            onClick={() => {
              const nextMode = !isTestMode;
              setIsTestMode(nextMode);
              setStatusToast(nextMode ? '🧪 TCS Sandbox Test Mode: ON (Safe Simulation)' : '🔴 Live TCS Production API: ACTIVE');
              setTimeout(() => setStatusToast(null), 3000);
            }}
            className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
              isTestMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
            }`}
            title={isTestMode ? 'Test Mode Active: Safe testing without real courier booking' : 'Live Mode Active: Real bookings sent to TCS'}
          >
            <span className={`w-2 h-2 rounded-full ${isTestMode ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
            <span>{isTestMode ? '🧪 TCS Test Mode' : '🟢 Live TCS API'}</span>
          </button>

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

          {allOrders.length > 0 && (
            <button
              onClick={handleClearAllOrders}
              className="px-3.5 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-sm"
              title="Delete all orders completely"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Orders</span>
            </button>
          )}
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

              const samePhonePendingOrders = allOrders.filter(
                (o) => (o.phone === order.phone || o.whatsapp === order.phone) && (o.status || '').toLowerCase().includes('pending')
              );
              const hasMultiplePending = samePhonePendingOrders.length > 1;
              const isBookingThis = bookingOrderId === order.id;

              return (
                <div
                  key={order.id}
                  className="p-5 sm:p-6 rounded-3xl bg-[#141414] border border-[#D4AF37]/30 space-y-4 shadow-xl relative"
                >
                  {/* MULTIPLE ORDERS FROM SAME CUSTOMER DETECTED BANNER */}
                  {hasMultiplePending && isPending && (
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-[#D4AF37]/20 to-amber-500/20 border border-[#D4AF37] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-amber-300">
                        <Layers className="w-4 h-4 text-[#D4AF37] shrink-0" />
                        <span><strong>Same Customer Alert:</strong> {samePhonePendingOrders.length} pending orders found for phone <strong>{order.phone}</strong></span>
                      </div>
                      <button
                        onClick={() => handleCombineOrders(order.phone)}
                        className="px-3 py-1.5 rounded-xl bg-[#D4AF37] text-black font-black uppercase text-[11px] hover:bg-yellow-400 transition-all cursor-pointer shadow-md shrink-0 flex items-center gap-1.5"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Combine into 1 Parcel (Save Delivery Fee)</span>
                      </button>
                    </div>
                  )}

                  {/* Top Order Meta with 1-Tap Copy Buttons */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 pb-3 border-b border-white/10">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm sm:text-base font-bold text-[#D4AF37]">#{order.id}</span>
                        <button
                          onClick={() => handleCopy(order.id, `id-${order.id}`)}
                          className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-[#D4AF37]/20 text-gray-400 hover:text-[#D4AF37] text-[10px] font-mono flex items-center gap-1 border border-white/5"
                          title="Copy Order ID"
                        >
                          {copiedField === `id-${order.id}` ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === `id-${order.id}` ? 'Copied' : 'Copy'}</span>
                        </button>
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

                      {/* Customer Name & Copy */}
                      <div className="flex items-center gap-2 pt-0.5">
                        <h3 className="font-serif-mockup text-lg sm:text-xl font-bold text-white">
                          {order.customerName}
                        </h3>
                        <button
                          onClick={() => handleCopy(order.customerName, `name-${order.id}`)}
                          className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-[#D4AF37]/20 text-gray-400 hover:text-[#D4AF37] text-[10px] font-sans flex items-center gap-1 border border-white/5"
                          title="Copy Customer Name"
                        >
                          {copiedField === `name-${order.id}` ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === `name-${order.id}` ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      {/* Phone / WhatsApp & Copy */}
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <span className="text-gray-400">Phone:</span>
                        <a
                          href={`https://wa.me/92${(order.phone || '').replace(/^0/, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono font-bold text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" /> {order.phone}
                        </a>
                        <button
                          onClick={() => handleCopy(order.phone, `phone-${order.id}`)}
                          className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-[#D4AF37]/20 text-gray-400 hover:text-[#D4AF37] text-[10px] font-mono flex items-center gap-1 border border-white/5"
                          title="Copy Phone Number"
                        >
                          {copiedField === `phone-${order.id}` ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === `phone-${order.id}` ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      {/* Delivery Address & Copy */}
                      <div className="flex items-start gap-2 text-xs text-gray-300 pt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-gray-200">
                            <strong className="text-white">{order.city}</strong> — {order.address}
                          </p>
                        </div>
                        <button
                          onClick={() => handleCopy(`${order.address}, ${order.city}`, `addr-${order.id}`)}
                          className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-[#D4AF37]/20 text-gray-400 hover:text-[#D4AF37] text-[10px] font-sans flex items-center gap-1 border border-white/5 shrink-0"
                          title="Copy Full Address"
                        >
                          {copiedField === `addr-${order.id}` ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === `addr-${order.id}` ? 'Copied' : 'Copy Address'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="text-left sm:text-right space-y-1">
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Total Amount</span>
                      <div className="flex items-center sm:justify-end gap-2">
                        <span className="font-serif-mockup text-2xl font-extrabold text-[#D4AF37]">
                          Rs. {price.toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleCopy(price, `price-${order.id}`)}
                          className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-[#D4AF37]/20 text-gray-400 hover:text-[#D4AF37] text-[10px] font-mono border border-white/5"
                          title="Copy Amount"
                        >
                          {copiedField === `price-${order.id}` ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <span className="text-xs text-gray-400 block mt-0.5">
                        Payment: <strong className="text-white uppercase">{order.paymentMethod || 'COD'}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Order Items & Receipt Slip */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-black/60 border border-white/5 text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-400 text-[10px] uppercase font-bold block">Item Details:</span>
                        <button
                          onClick={() => handleCopy(order.items ? order.items.map(i => `${i.name} (Qty: ${i.quantity || 1})`).join(', ') : order.item, `item-${order.id}`)}
                          className="text-[10px] text-[#D4AF37] hover:underline flex items-center gap-1"
                        >
                          <Copy className="w-2.5 h-2.5" /> Copy Item
                        </button>
                      </div>
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
                            <Eye className="w-4 h-4" /> View Payment Slip
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs italic block py-1">
                          {order.paymentMethod?.toLowerCase().includes('advance') || order.paymentMethod?.toLowerCase().includes('sada') || order.paymentMethod?.toLowerCase().includes('bank')
                            ? '⚠️ Payment Screenshot not attached (Verify in Account: 03297062027)'
                            : 'Cash on Delivery (No slip required)'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* OFFICIAL TCS CONSIGNMENT RECEIPT & TRACKING CARD (IF DISPATCHED) */}
                  {order.tcsTrackingNumber && (isConfirmed || isInTransit || isDelivered) && (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/30 via-black to-red-950/20 border border-red-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-black uppercase">TCS Envio</span>
                          <span className="text-gray-400 text-xs">Consignment CN:</span>
                          <strong className="font-mono text-sm text-white font-bold tracking-wider">{order.tcsTrackingNumber}</strong>
                          <button
                            onClick={() => handleCopy(order.tcsTrackingNumber, `cn-${order.id}`)}
                            className="p-1 rounded bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
                            title="Copy TCS CN"
                          >
                            {copiedField === `cn-${order.id}` ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <p className="text-[11px] text-gray-400">
                          Live Customer Link: <a href={`https://valaroix.com/track?q=${order.tcsTrackingNumber}`} target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline font-mono">valaroix.com/track?q={order.tcsTrackingNumber}</a>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                        <button
                          onClick={() => setSelectedLabelOrder(order)}
                          className="py-2 px-3 rounded-xl bg-white/10 hover:bg-[#D4AF37]/20 text-gray-200 hover:text-[#D4AF37] border border-white/20 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                          title="Print official TCS Shipping Label Sticker (4x6 / A4)"
                        >
                          <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Print Label</span>
                        </button>

                        <button
                          onClick={() => handleSendDispatchWhatsApp(order)}
                          className="flex-1 sm:flex-none py-2 px-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer"
                          title="Send TCS tracking link to customer on WhatsApp"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send WhatsApp Tracking Alert</span>
                        </button>

                        {!isDelivered && (
                          <button
                            onClick={() => handleCancelOrder(order)}
                            disabled={cancellingOrderId === order.id}
                            className="py-2 px-3 rounded-xl bg-red-900/40 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm"
                            title="Cancel and delete this booking from TCS Envio portal"
                          >
                            {cancellingOrderId === order.id ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Cancelling...</span>
                              </>
                            ) : (
                              <>
                                <X className="w-3.5 h-3.5" />
                                <span>Cancel TCS Booking</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ACTION BUTTONS PIPELINE */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-2">
                    
                    {/* PENDING STAGE 1: ASK WHATSAPP CONFIRMATION */}
                    {isPending && (
                      <button
                        onClick={() => handleAskCustomerToConfirm(order)}
                        className="py-3 px-4 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                        title="Send WhatsApp message asking customer to confirm order"
                      >
                        <HelpCircle className="w-4 h-4" />
                        <span>1. Ask WhatsApp</span>
                      </button>
                    )}

                    {/* PENDING STAGE 2: 1-CLICK AUTO-BOOK & DISPATCH VIA TCS API */}
                    {isPending && (
                      <button
                        onClick={() => handleAutoBookTCS(order)}
                        disabled={isBookingThis}
                        className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer min-w-[190px]"
                        title="Auto-book with TCS API and generate tracking CN"
                      >
                        {isBookingThis ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Booking TCS...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 fill-black" />
                            <span>2. Auto-Book TCS (Dispatch)</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* STAGE 2: CONFIRMED -> HANDOVER IN-TRANSIT & PRINT LABEL */}
                    {isConfirmed && !isInTransit && !isDelivered && (
                      <>
                        <button
                          onClick={() => setSelectedLabelOrder(order)}
                          className="py-3 px-3.5 rounded-xl bg-white/10 hover:bg-[#D4AF37]/20 text-gray-200 hover:text-[#D4AF37] border border-white/20 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                          title="Print official TCS Shipping Label Sticker"
                        >
                          <Printer className="w-4 h-4 text-[#D4AF37]" />
                          <span>Print TCS Label</span>
                        </button>

                        <button
                          onClick={() => updateOrderStatus(order.id, 'In Transit with TCS Express', `🚚 Order #${order.id} Handed Over to TCS!`)}
                          className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer min-w-[160px]"
                        >
                          <Truck className="w-4 h-4" />
                          <span>Handover to TCS (In Transit)</span>
                        </button>
                      </>
                    )}

                    {/* STAGE 3: IN TRANSIT -> MARK DELIVERED */}
                    {isInTransit && !isDelivered && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Delivered & Payment Collected', `🎁 Order #${order.id} Delivered Successfully!`)}
                        className="flex-1 py-3 px-4 rounded-xl bg-blue-500 text-white hover:bg-blue-400 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer min-w-[160px]"
                      >
                        <PackageCheck className="w-4 h-4" />
                        <span>Mark Order as Delivered</span>
                      </button>
                    )}

                    {/* STAGE 4: DELIVERED -> COMPLETED BADGE */}
                    {isDelivered && (
                      <div className="flex-1 py-2.5 px-4 rounded-xl bg-blue-950/60 border border-blue-500/50 text-blue-400 text-xs font-bold flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-400" />
                        <span>Order Completed & Delivered ✓</span>
                      </div>
                    )}

                    {/* IF CANCELLED -> WHATSAPP CANCEL NOTICE & REOPEN */}
                    {isCancelled && (
                      <div className="flex flex-wrap items-center gap-2 flex-1">
                        <button
                          onClick={() => handleSendCancelWhatsApp(order)}
                          className="flex-1 py-2.5 px-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md min-w-[200px]"
                          title="Send Cancellation Notification to Customer via WhatsApp"
                        >
                          <Send className="w-4 h-4" />
                          <span>Send WhatsApp Cancellation Alert</span>
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Pending Verification', `🔄 Order #${order.id} Reopened.`)}
                          className="py-2.5 px-4 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-black border border-amber-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>Reopen Order</span>
                        </button>
                      </div>
                    )}

                    {/* CANCEL BUTTON */}
                    {!isDelivered && !isCancelled && (
                      <button
                        onClick={() => handleCancelOrder(order)}
                        disabled={cancellingOrderId === order.id}
                        className="py-2.5 px-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/40 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                        title="Cancel Order (with confirmation & TCS deletion)"
                      >
                        {cancellingOrderId === order.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
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

      {/* IN-APP CANCEL CONFIRMATION MODAL */}
      {cancelConfirmOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-md w-full bg-[#141414] border border-red-500/50 rounded-3xl p-6 space-y-5 shadow-2xl">
            <button
              onClick={() => setCancelConfirmOrder(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-gray-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-red-400">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h4 className="font-serif-mockup text-lg font-bold text-white">
                  Cancel Order #{cancelConfirmOrder.id}
                </h4>
                <p className="text-xs text-gray-400">
                  Confirmation & WhatsApp Alert
                </p>
              </div>
            </div>

            {/* ORDER BRIEF */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Customer:</span>
                <span className="font-bold text-white">{cancelConfirmOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Phone:</span>
                <span className="font-mono text-[#D4AF37]">{cancelConfirmOrder.phone || cancelConfirmOrder.whatsapp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Bill:</span>
                <span className="font-bold text-[#D4AF37]">Rs. {getOrderPrice(cancelConfirmOrder).toLocaleString()}</span>
              </div>
              {cancelConfirmOrder.tcsTrackingNumber && (
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-cyan-400">
                  <span className="text-gray-400">TCS Booking:</span>
                  <span className="font-mono font-bold">CN #{cancelConfirmOrder.tcsTrackingNumber}</span>
                </div>
              )}
            </div>

            {/* NOTICE */}
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 space-y-1.5">
              <p className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-red-400" /> Order Cancel karne par:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-gray-300">
                {cancelConfirmOrder.tcsTrackingNumber ? (
                  <li>TCS Envio portal se booking <strong>free me automatically cancel & delete</strong> ho jayegi.</li>
                ) : (
                  <li>Order status Cancelled me move ho jayega.</li>
                )}
                <li>Aap customer ko 1-Click me WhatsApp par cancellation alert bhej sakte hain.</li>
              </ul>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => executeCancelOrder(cancelConfirmOrder, true)}
                className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Cancel & Send WhatsApp Notice</span>
              </button>

              <button
                onClick={() => executeCancelOrder(cancelConfirmOrder, false)}
                className="w-full py-2.5 px-4 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel Order Only (Without WhatsApp)</span>
              </button>

              <button
                onClick={() => setCancelConfirmOrder(null)}
                className="w-full py-2 text-center text-xs text-gray-400 hover:text-white cursor-pointer"
              >
                Don't Cancel (Wapis Chalein)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL 1:1 TCS AIRWAY BILL (CONSIGNEE'S COPY) PRINTABLE MODAL */}
      {selectedLabelOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative max-w-2xl w-full bg-white text-black rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 my-6">
            
            {/* Header Controls (Hidden on Print) */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-2.5 print:hidden">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-red-600 text-white flex items-center justify-center font-black text-xs">
                  TCS
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 leading-tight">Official TCS Consignment Slip (Consignee's Copy)</h4>
                  <p className="text-[10px] text-gray-500 font-mono">CN #{selectedLabelOrder.tcsTrackingNumber || '772234300003'}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLabelOrder(null)}
                className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 100% EXACT 1:1 REPLICA OF OFFICIAL TCS CONSIGNEE'S COPY SLIP */}
            <div id="tcs-official-slip" className="border border-black bg-white text-black font-sans text-[11px] leading-tight select-text">
              
              {/* ROW 1: 4 BLOCKS (LOGO, BARCODE+CN, QR CODE, META TABLE) */}
              <div className="grid grid-cols-12 border-b border-black">
                
                {/* 1. TCS LOGO (3 Cols) */}
                <div className="col-span-3 p-2 border-r border-black flex flex-col items-center justify-center text-center">
                  <svg viewBox="0 0 170 50" className="w-24 sm:w-28 h-auto mx-auto" xmlns="http://www.w3.org/2000/svg">
                    <g fill="#ED1C24">
                      {/* Left Wing 1 (Outer chevron) */}
                      <path d="M 8 38 L 24 10 L 36 24 L 20 44 Z" />
                      {/* Left Wing 2 (Inner chevron) */}
                      <path d="M 27 38 L 43 10 L 53 20 L 39 42 Z" />
                      
                      {/* Italic Bold TCS Lettering */}
                      <polygon points="53,10 77,10 74,16 67,16 59,38 52,38 60,16 52,16" />
                      <path d="M 87 10 C 80 10 73 15 71 23 C 69 31 73 38 82 38 C 88 38 93 34 94 30 L 87 30 C 86 32 84 33 81 33 C 76 33 74 29 76 23 C 77 18 81 15 86 15 C 89 15 91 16 92 18 L 97 14 C 95 11 91 10 87 10 Z" />
                      <path d="M 104 10 C 98 10 95 13 94 17 C 93 21 96 23 100 24.5 L 102 25.5 C 104 26.5 105 27.5 104 29.5 C 103 32 100 33 97 33 C 93 33 90 31 89 28 L 83 29 C 85 34 89 38 96 38 C 103 38 109 34 110 29 C 111 24 107 22 103 21 L 100.5 20 C 98 19 97 18 97.5 16.5 C 98 15 100 14 103 14 C 106 14 108 15 109 17 L 114 14 C 112 11 108 10 104 10 Z" />
                      
                      {/* Registered Circle (R) */}
                      <circle cx="119" cy="11" r="3" fill="none" stroke="#ED1C24" strokeWidth="0.8" />
                      <text x="119" y="13.2" fontSize="4" fontFamily="Arial, sans-serif" fontWeight="bold" textAnchor="middle" fill="#ED1C24">R</text>
                    </g>
                  </svg>
                  <div className="text-[10px] text-black mt-1 font-sans">TCS (Pvt)Ltd</div>
                </div>

                {/* 2. BARCODE & CN (3 Cols) */}
                <div className="col-span-3 p-1.5 border-r border-black flex flex-col items-center justify-center text-center">
                  <img
                    src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${selectedLabelOrder.tcsTrackingNumber || '772234300003'}&scale=2&height=12`}
                    alt="CN Barcode"
                    className="h-8 w-auto max-w-[125px] object-contain mx-auto"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="text-[11px] font-bold font-mono mt-0.5 tracking-wider text-black">
                    {selectedLabelOrder.tcsTrackingNumber || '772234300003'}
                  </div>
                  <div className="text-[10px] text-black">Consignee's Copy</div>
                </div>

                {/* 3. GIANT CENTERED QR CODE (3 Cols) */}
                <div className="col-span-3 p-1.5 border-r border-black flex items-center justify-center bg-white">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=https://valaroix.com/track?q=${selectedLabelOrder.tcsTrackingNumber || '772234300003'}`}
                    alt="QR"
                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                  />
                </div>

                {/* 4. META TABLE WITH GREY LABELS / WHITE VALUES (3 Cols) */}
                <div className="col-span-3 text-[10px]">
                  <table className="w-full h-full border-collapse">
                    <tbody>
                      <tr className="border-b border-black">
                        <td className="bg-[#C4C4C4] p-1 font-bold border-r border-black w-[45%]">Date/Time:</td>
                        <td className="bg-white p-1 text-[9.5px] leading-none">{selectedLabelOrder.date || '28/09/2026'}<br/>{selectedLabelOrder.time || '22:20:32'}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="bg-[#C4C4C4] p-1 font-bold border-r border-black">Service:</td>
                        <td className="bg-white p-1 font-medium">Express</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="bg-[#C4C4C4] p-1 font-bold border-r border-black">Origin:</td>
                        <td className="bg-white p-1 font-bold uppercase">TANDO ADAM</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="bg-[#C4C4C4] p-1 font-bold border-r border-black">Destination:</td>
                        <td className="bg-white p-1 font-bold uppercase">{selectedLabelOrder.city?.toUpperCase() || 'KARACHI'}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="bg-[#C4C4C4] p-1 font-bold border-r border-black">Pieces:</td>
                        <td className="bg-white p-1">1</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="bg-[#C4C4C4] p-1 font-bold border-r border-black">Weight:</td>
                        <td className="bg-white p-1">0.5</td>
                      </tr>
                      <tr>
                        <td className="bg-[#C4C4C4] p-1 font-bold border-r border-black">Fragile:</td>
                        <td className="bg-white p-1 font-bold">YES</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>

              {/* ROW 2: SHIPPER'S DETAILS (GREY HEADER) */}
              <div className="bg-[#B0B0B0] py-0.5 px-2 font-bold text-center text-xs border-b border-black text-black">
                Shipper's Details
              </div>

              {/* ROW 3: SHIPPER ADDRESS & COD AMOUNT BLOCK */}
              <div className="flex border-b border-black">
                {/* LEFT: SHIPPER ADDRESS */}
                <div className="flex-1 p-2 text-[10.5px] leading-snug border-r border-black flex flex-col justify-between min-h-[75px]">
                  <div>
                    <div className="font-bold text-black">Valaroix - Valaroix</div>
                    <div className="text-black">Valaroix (Toor colony) Tando Adam</div>
                  </div>
                  <div className="mt-2 text-black">
                    <div>+92 3029111856</div>
                    <div>support@valaroix.com</div>
                  </div>
                </div>

                {/* RIGHT: COD AMOUNT BLOCK */}
                <div className="w-[240px] sm:w-[260px] flex">
                  <div className="w-[85px] bg-[#C4C4C4] flex flex-col items-center justify-center border-r border-black font-bold text-center p-1 text-xs text-black">
                    <div>COD</div>
                    <div>Amount</div>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center p-2 text-center bg-white">
                    {/* COD Barcode */}
                    <img
                      src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${selectedLabelOrder.tcsTrackingNumber || '772234300003'}&scale=2&height=9`}
                      alt="COD Barcode"
                      className="h-6 w-auto max-w-[120px] object-contain mx-auto"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="font-bold text-sm sm:text-base mt-0.5 tracking-tight text-black">
                      {selectedLabelOrder.paymentMethod?.toLowerCase().includes('advance')
                        ? 'RS0'
                        : `RS${getOrderPrice(selectedLabelOrder)}`}
                    </div>
                  </div>
                </div>
              </div>

              {/* ROW 4: CONSIGNEE'S DETAILS (GREY HEADER) */}
              <div className="bg-[#B0B0B0] py-0.5 px-2 font-bold text-center text-xs border-b border-black text-black">
                Consignee's Details
              </div>

              {/* ROW 5: CONSIGNEE TABLE (GREY LABELS / WHITE VALUES) */}
              <table className="w-full border-collapse text-[10.5px]">
                <tbody>
                  {/* NAME & CUST REF */}
                  <tr className="border-b border-black">
                    <td className="bg-[#C4C4C4] p-1 sm:p-1.5 font-bold border-r border-black w-[110px] text-black">Name:</td>
                    <td className="bg-white p-1 sm:p-1.5 border-r border-black font-medium text-black">{selectedLabelOrder.customerName}</td>
                    <td className="bg-[#C4C4C4] p-1 sm:p-1.5 font-bold border-r border-black w-[90px] text-black">Cust. Ref.#:</td>
                    <td className="bg-white p-1 sm:p-1.5 w-[130px] font-mono text-black">#{selectedLabelOrder.id}</td>
                  </tr>

                  {/* ADDRESS */}
                  <tr className="border-b border-black">
                    <td className="bg-[#C4C4C4] p-2 font-bold border-r border-black align-top text-black">Address:</td>
                    <td colSpan={3} className="bg-white p-2 align-top font-bold text-black leading-snug">
                      {selectedLabelOrder.address}, {selectedLabelOrder.city}
                    </td>
                  </tr>

                  {/* CONTACT # */}
                  <tr className="border-b border-black">
                    <td className="bg-[#C4C4C4] p-1 sm:p-1.5 font-bold border-r border-black text-black">Contact #</td>
                    <td colSpan={3} className="bg-white p-1 sm:p-1.5 font-bold text-black">
                      {selectedLabelOrder.phone || selectedLabelOrder.whatsapp}
                    </td>
                  </tr>

                  {/* PRODUCT DETAILS */}
                  <tr className="border-b border-black">
                    <td className="bg-[#C4C4C4] p-2 font-bold border-r border-black align-top text-black">Product Details:</td>
                    <td colSpan={3} className="bg-white p-2 min-h-[35px] align-top text-black">
                      Perfume Bottle (Cosmetics)
                    </td>
                  </tr>

                  {/* REMARKS */}
                  <tr className="border-b border-black">
                    <td className="bg-[#C4C4C4] p-1 sm:p-1.5 font-bold border-r border-black text-black">Remarks:</td>
                    <td colSpan={3} className="bg-white p-1 sm:p-1.5 text-black">
                      Please call customer before delivery
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* ROW 6: BOTTOM DISCLAIMER */}
              <div className="p-1 text-[8.5px] sm:text-[9.5px] text-center text-black leading-tight">
                Please don't accept if shipment is not intact. Before paying the COD amount, shipment cannot be opened.In case of complaints, pleae contact Muaaz at 03029111856.
              </div>

            </div>

            {/* ACTION BUTTONS (DOWNLOAD & SHARE) */}
            <div className="space-y-2 pt-2 print:hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                
                {/* 1. SAVE AS PDF FOR PRINT SHOP */}
                <button
                  onClick={() => {
                    const printContent = document.getElementById('tcs-official-slip');
                    const win = window.open('', '', 'width=850,height=900');
                    win.document.write(`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <title>TCS_Consignment_${selectedLabelOrder.tcsTrackingNumber || selectedLabelOrder.id}</title>
                          <style>
                            @page { size: auto; margin: 6mm; }
                            body { font-family: Arial, Helvetica, sans-serif; padding: 10px; margin: 0; background: #fff; color: #000; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                            table { border-collapse: collapse; width: 100%; }
                            td, th { border-color: #000 !important; }
                            .border { border: 1px solid #000 !important; }
                            .border-b { border-bottom: 1px solid #000 !important; }
                            .border-r { border-right: 1px solid #000 !important; }
                            .bg-C4C4C4 { background-color: #c4c4c4 !important; }
                            .bg-B0B0B0 { background-color: #b0b0b0 !important; }
                            .bg-white { background-color: #ffffff !important; }
                          </style>
                        </head>
                        <body onload="window.print();window.close();">
                          ${printContent.innerHTML}
                        </body>
                      </html>
                    `);
                    win.document.close();
                  }}
                  className="py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95"
                  title="Download / Save as PDF or Print directly"
                >
                  <Printer className="w-4 h-4" />
                  <span>📥 Save PDF / Print (Shop Copy)</span>
                </button>

                {/* 2. FORWARD DETAILS TO PRINT SHOP VIA WHATSAPP */}
                <button
                  onClick={() => {
                    const cn = selectedLabelOrder.tcsTrackingNumber || '772234300003';
                    const price = getOrderPrice(selectedLabelOrder);
                    const msg = encodeURIComponent(
                      `*TCS OFFICIAL CONSIGNMENT SLIP — VALAROIX*\n\n🏷️ *TCS CN:* ${cn}\n📦 *Order ID:* #${selectedLabelOrder.id}\n👤 *Customer:* ${selectedLabelOrder.customerName}\n📱 *Contact:* ${selectedLabelOrder.phone}\n📍 *Address:* ${selectedLabelOrder.address}, ${selectedLabelOrder.city}\n💰 *COD Bill:* Rs. ${price.toLocaleString()}\n\n🔗 *Track / View Online:* https://valaroix.com/track?q=${cn}`
                    );
                    window.open(`https://wa.me/?text=${msg}`, '_blank');
                  }}
                  className="py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
                  title="Forward to print shop on WhatsApp"
                >
                  <Send className="w-4 h-4" />
                  <span>📲 Forward to WhatsApp Print Shop</span>
                </button>

              </div>

              <button
                onClick={() => setSelectedLabelOrder(null)}
                className="w-full py-2 text-center text-xs text-gray-500 hover:text-gray-900 font-semibold cursor-pointer"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
