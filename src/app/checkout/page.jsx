'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle2, Truck, ShieldCheck, ArrowLeft, ShoppingBag, 
  MapPin, Phone, User, Building, Lock, Sparkles, ChevronRight, Upload, AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsApp, { WhatsAppIcon } from '@/components/FloatingWhatsApp';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useAuth } from '@/context/AuthContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, total, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const { userOrders, setUserOrders } = useAuth();

  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'advance'
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: 'Karachi',
    address: '',
    notes: ''
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please enter your full name');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      alert('Please enter a valid phone / WhatsApp number (e.g. 03141234567)');
      return;
    }
    if (!formData.address.trim()) {
      alert('Please enter your complete delivery address');
      return;
    }

    setIsSubmitting(true);

    const orderId = `VLX-${Math.floor(10000 + Math.random() * 90000)}`;
    const tcsTrackingNumber = `77${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newOrder = {
      id: orderId,
      customerName: formData.name,
      name: formData.name,
      phone: formData.phone,
      whatsapp: formData.phone,
      city: formData.city,
      address: formData.address,
      notes: formData.notes,
      paymentMethod,
      receiptPreview,
      items: cart.length > 0 ? cart : [
        {
          name: 'VALAROIX DIOR SAUVAGE',
          quantity: 1,
          price: 2699,
          image: '/products/sauvage.jpg?v=2'
        }
      ],
      total: total > 0 ? total : 2699,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      status: 'Confirmed & Processing',
      tcsTrackingNumber,
      courier: 'TCS Express Courier'
    };

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('valaroix_orders') || '[]');
      const updated = [newOrder, ...existing];
      localStorage.setItem('valaroix_orders', JSON.stringify(updated));

      if (setUserOrders) {
        setUserOrders(updated);
      }
    } catch (err) {}

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {}

    setPlacedOrder(newOrder);
    setIsSubmitting(false);
    setStep('success');
    clearCart();
  };

  const effectiveCart = cart.length > 0 ? cart : [
    {
      cartItemId: 'demo-1',
      name: 'VALAROIX DIOR SAUVAGE',
      quantity: 1,
      price: 2699,
      image: '/products/sauvage.jpg?v=2'
    }
  ];

  const effectiveTotal = total > 0 ? total : 2699;

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-gray-100 font-sans relative overflow-x-hidden selection:bg-[#D4AF37] selection:text-black">
      {/* Navbar */}
      <Navbar />

      {/* Breadcrumb Header */}
      <div className="pt-24 sm:pt-28 pb-4 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center gap-2 text-xs text-gray-400 font-sans">
          <Link href="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <Link href="/#shop" className="hover:text-[#D4AF37] transition-colors">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-[#D4AF37] font-semibold">Fast Checkout</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-20">
        {step === 'success' && placedOrder ? (
          /* ================= ORDER SUCCESS CONFIRMATION SCREEN ================= */
          <div className="max-w-2xl mx-auto bg-[#141414] border border-[#D4AF37]/50 rounded-3xl p-6 sm:p-10 shadow-[0_0_80px_rgba(212,175,55,0.25)] text-center space-y-6">
            
            {/* Success Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-9 h-9 sm:w-12 sm:h-12" />
            </div>

            {/* Title & Order ID */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/30">
                ORDER CONFIRMED
              </span>
              <h2 className="font-serif-mockup text-2xl sm:text-4xl font-extrabold text-white">
                Thank You, {placedOrder.customerName}!
              </h2>
              <p className="text-xs sm:text-sm text-gray-300">
                Your order has been received and is being prepared for dispatch via <strong className="text-white font-bold">TCS Express Courier</strong>.
              </p>
            </div>

            {/* Order Details Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-white/10 text-left space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-gray-400">Order Number:</span>
                <span className="font-mono text-sm font-bold text-[#D4AF37]">{placedOrder.id}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-gray-400">TCS Consignment CN:</span>
                <span className="font-mono text-xs font-bold text-emerald-400">{placedOrder.tcsTrackingNumber}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-gray-400">Delivery Address:</span>
                <span className="font-semibold text-white truncate max-w-[220px] sm:max-w-xs">{placedOrder.address}, {placedOrder.city}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-gray-400">Payment Method:</span>
                <span className="font-semibold text-white">{placedOrder.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Advance SadaPay / Bank Transfer'}</span>
              </div>
              <div className="flex justify-between items-center pt-1 font-bold text-sm">
                <span className="text-white">Total Amount:</span>
                <span className="text-[#D4AF37] font-serif-mockup">{formatPrice(placedOrder.total)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href={`https://wa.me/923141397378?text=${encodeURIComponent(
                  `Hello VALAROIX, I have placed Order #${placedOrder.id} for Rs. ${placedOrder.total}. Name: ${placedOrder.customerName}, Phone: ${placedOrder.phone}, Address: ${placedOrder.address}, ${placedOrder.city}. Please confirm dispatch.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-colors text-center"
              >
                <WhatsAppIcon className="w-4 h-4 text-white" />
                <span>Confirm on WhatsApp</span>
              </a>

              <Link
                href="/"
                className="py-3.5 px-4 rounded-xl btn-mockup-outline text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors text-center"
              >
                <span>Continue Shopping</span>
              </Link>
            </div>

          </div>
        ) : (
          /* ================= MAIN CHECKOUT FORM LAYOUT ================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
            
            {/* LEFT 7 COLS: Delivery & Payment Details Form */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-1">
                <h1 className="font-serif-mockup text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Checkout & Delivery
                </h1>
                <p className="text-xs text-gray-400">
                  Fill in your delivery address for Free TCS Express delivery across Pakistan
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. CUSTOMER & DELIVERY INFO */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
                  <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> 1. Delivery Information
                  </h3>

                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-300 uppercase">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Muaaz Kori"
                        className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  {/* Phone & City Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* WhatsApp / Phone */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-gray-300 uppercase">
                        Phone / WhatsApp Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. 03141397378"
                          className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>

                    {/* City */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-gray-300 uppercase">
                        City *
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                        >
                          <option value="Karachi">Karachi</option>
                          <option value="Lahore">Lahore</option>
                          <option value="Islamabad">Islamabad</option>
                          <option value="Rawalpindi">Rawalpindi</option>
                          <option value="Faisalabad">Faisalabad</option>
                          <option value="Multan">Multan</option>
                          <option value="Peshawar">Peshawar</option>
                          <option value="Quetta">Quetta</option>
                          <option value="Sialkot">Sialkot</option>
                          <option value="Gujranwala">Gujranwala</option>
                          <option value="Hyderabad">Hyderabad</option>
                          <option value="Bahawalpur">Bahawalpur</option>
                          <option value="Other City">Other City (All Pakistan)</option>
                        </select>
                      </div>
                    </div>

                  </div>

                  {/* Complete Address */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-300 uppercase">
                      Complete Street Address & House / Flat # *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g. House # 12, Street 4, Phase 6, DHA, Near Main Market"
                      className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37] resize-none"
                    />
                  </div>

                </div>

                {/* 2. PAYMENT METHOD SELECTOR */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
                  <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                    <Lock className="w-4 h-4" /> 2. Select Payment Method
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Cash On Delivery (COD) */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        paymentMethod === 'cod'
                          ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-white shadow-lg'
                          : 'bg-[#1A1A1A] border-white/5 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs sm:text-sm text-white">Cash on Delivery</span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white uppercase">
                          COD
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400">
                        Pay cash to the TCS rider when your parcel arrives at your doorstep.
                      </p>
                    </button>

                    {/* Advance Bank Transfer / SadaPay */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('advance')}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        paymentMethod === 'advance'
                          ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-white shadow-lg'
                          : 'bg-[#1A1A1A] border-white/5 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs sm:text-sm text-white">SadaPay / Bank Transfer</span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#D4AF37] text-black uppercase">
                          Instant
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400">
                        Transfer directly via SadaPay, Nayapay, or Bank app.
                      </p>
                    </button>

                  </div>

                  {/* SadaPay Details (Shown if Advance is selected) */}
                  {paymentMethod === 'advance' && (
                    <div className="p-4 rounded-2xl bg-black/80 border border-[#D4AF37]/40 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-bold uppercase tracking-wide">
                        <Building className="w-4 h-4" /> SadaPay Account Details:
                      </div>
                      <div className="space-y-1.5 text-xs text-gray-300 font-mono">
                        <div className="flex justify-between py-0.5">
                          <span className="text-gray-400">Account Title:</span>
                          <span className="font-bold text-white">Aijaz Ali</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-gray-400">SadaPay Mobile #:</span>
                          <span className="font-bold text-[#D4AF37]">03472818878</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-gray-400">IBAN:</span>
                          <span className="text-[11px] text-gray-300 font-bold">PK58SADA0000003472818878</span>
                        </div>
                      </div>

                      {/* Optional Upload Slip */}
                      <div className="pt-2 border-t border-white/10">
                        <label className="block text-[11px] text-gray-400 mb-1">
                          Upload Payment Screenshot / Receipt (Optional):
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#D4AF37] file:text-black hover:file:bg-[#bfa030] cursor-pointer"
                        />
                        {receiptPreview && (
                          <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden border border-[#D4AF37]">
                            <img src={receiptPreview} alt="Receipt Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl btn-mockup-gold text-xs sm:text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-2xl hover:scale-[1.01] transition-transform cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>
                    {paymentMethod === 'cod' ? 'CONFIRM ORDER (Cash on Delivery)' : 'CONFIRM ORDER (Advance Paid)'}
                  </span>
                </button>

              </form>

            </div>

            {/* RIGHT 5 COLS: Order Summary & Trust */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
              
              <div className="p-5 sm:p-6 rounded-2xl bg-[#141414] border border-[#D4AF37]/30 space-y-4 shadow-xl">
                <h3 className="font-serif-mockup text-base sm:text-lg font-bold text-white pb-3 border-b border-white/10 flex items-center justify-between">
                  <span>Order Summary</span>
                  <span className="text-xs font-mono text-[#D4AF37] font-semibold">
                    {effectiveCart.length} item(s)
                  </span>
                </h3>

                {/* Items List */}
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {effectiveCart.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 py-2 border-b border-white/5">
                      <div className="w-12 h-12 rounded-xl bg-black border border-white/10 p-1 shrink-0 flex items-center justify-center">
                        <img
                          src={item.image || '/products/sauvage.jpg?v=2'}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif-mockup text-xs font-bold text-white truncate">
                          {item.name}
                        </h4>
                        <span className="text-[10px] text-gray-400 block font-mono">
                          Qty: {item.quantity || 1} • 50ml Pure Oil
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#D4AF37] font-mono shrink-0">
                        {formatPrice((item.price || 2699) * (item.quantity || 1))}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-2 text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal:</span>
                    <span className="text-white font-mono">{formatPrice(effectiveTotal)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" /> TCS Express Delivery:
                    </span>
                    <span className="font-bold uppercase">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base font-bold text-white pt-2 border-t border-white/10">
                    <span>Total Amount:</span>
                    <span className="text-[#D4AF37] font-serif-mockup">{formatPrice(effectiveTotal)}</span>
                  </div>
                </div>

              </div>

              {/* Trust Badges */}
              <div className="p-4 rounded-2xl bg-[#141414] border border-white/5 space-y-2 text-[11px] text-gray-400">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Dispatched within 24 hours via <strong>TCS Express Courier</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>100% Authentic Luxury Fragrance Guarantee</span>
                </div>
              </div>

            </div>

          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp */}
      <FloatingWhatsApp phoneNumber="923141397378" />
    </main>
  );
}
