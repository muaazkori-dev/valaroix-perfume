'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, ShieldCheck, CreditCard, Lock, Sparkles, Truck, Upload, AlertCircle, Phone, MapPin, User, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useAuth } from '@/context/AuthContext';

export default function CheckoutModal() {
  const { isCheckoutOpen, setIsCheckoutOpen, cart, total, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const { user, userOrders, setUserOrders } = useAuth();

  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [paymentMethod, setPaymentMethod] = useState('advance'); // 'advance' | 'cod'
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || '',
    whatsapp: '',
    address: '',
    city: 'Karachi'
  });

  if (!isCheckoutOpen) return null;

  const handleReceiptUpload = (e) => {
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

  const handleSubmitOrder = (e) => {
    e.preventDefault();

    if (paymentMethod === 'advance' && !receiptPreview) {
      alert('Please upload your SadaPay payment receipt screenshot before confirming!');
      return;
    }

    const orderId = 'VLX-' + Math.floor(10000 + Math.random() * 90000);
    const newOrder = {
      id: orderId,
      customerName: formData.name,
      phone: formData.whatsapp,
      city: formData.city,
      address: formData.address,
      date: new Date().toISOString().split('T')[0],
      items: cart.map((i) => ({
        name: `${i.name} (${i.selectedSize} • ${i.selectedLasting})`,
        pricePkr: i.price,
        size: i.selectedSize,
        quantity: i.quantity
      })),
      pricePkr: total,
      cogsPkr: Math.round(total * 0.35),
      profitPkr: Math.round(total * 0.65),
      status: paymentMethod === 'advance' ? 'Pending Payment Verification' : 'Pending Admin Confirmation',
      trackingCode: 'DHL-' + orderId,
      paymentMethod: paymentMethod === 'advance' ? 'Advance Payment (SadaPay)' : 'Cash On Delivery',
      receiptImage: receiptPreview,
      settled: false
    };

    // Save order in AuthContext state
    setUserOrders([newOrder, ...userOrders]);
    setStep('success');

    // Trigger celebratory gold confetti
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#f3e5ab', '#ffffff', '#e67e22']
      });
    } catch (err) {}
  };

  const handleClose = () => {
    if (step === 'success') {
      clearCart();
    }
    setStep('form');
    setReceiptPreview(null);
    setReceiptFile(null);
    setIsCheckoutOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-2xl bg-valaroix-dark border border-valaroix-gold/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(212,175,55,0.2)] z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 p-2 rounded-full glass-panel text-gray-400 hover:text-valaroix-gold"
          >
            <X className="w-5 h-5" />
          </button>

          {step === 'form' ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full glass-panel-gold border-valaroix-gold flex items-center justify-center text-valaroix-gold">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white">VIP Courier Checkout</h3>
                  <p className="text-xs text-gray-400">Handcrafted Packaging & Express Courier Dispatch</p>
                </div>
              </div>

              <form onSubmit={handleSubmitOrder} className="space-y-5">
                
                {/* 1. CUSTOMER SHIPPING DETAILS */}
                <div className="glass-panel p-5 rounded-2xl border-valaroix-gold/30 space-y-4">
                  <span className="block text-xs uppercase tracking-widest text-valaroix-gold font-bold flex items-center gap-2">
                    <Truck className="w-4 h-4" /> 1. Delivery Information
                  </span>

                  <div className="space-y-3">
                    <div className="relative">
                      <User className="w-4 h-4 text-valaroix-gold absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Full Name (e.g. Muaaz Kori)"
                        className="w-full bg-black border border-valaroix-gold/30 rounded-xl pl-11 pr-4 py-3 text-xs text-gray-200 focus:outline-none focus:border-valaroix-gold"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="relative">
                        <Phone className="w-4 h-4 text-valaroix-gold absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={formData.whatsapp}
                          onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                          placeholder="WhatsApp Number (e.g. 03029111856)"
                          className="w-full bg-black border border-valaroix-gold/30 rounded-xl pl-11 pr-4 py-3 text-xs text-gray-200 focus:outline-none focus:border-valaroix-gold font-mono"
                        />
                      </div>

                      <div className="relative">
                        <MapPin className="w-4 h-4 text-valaroix-gold absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="City (e.g. Karachi, Lahore, Islamabad)"
                          className="w-full bg-black border border-valaroix-gold/30 rounded-xl pl-11 pr-4 py-3 text-xs text-gray-200 focus:outline-none focus:border-valaroix-gold"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <FileText className="w-4 h-4 text-valaroix-gold absolute left-4 top-4" />
                      <textarea
                        required
                        rows={2}
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Complete Street Address & Landmark..."
                        className="w-full bg-black border border-valaroix-gold/30 rounded-xl pl-11 pr-4 py-3 text-xs text-gray-200 focus:outline-none focus:border-valaroix-gold"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. PAYMENT METHOD SELECTION */}
                <div className="glass-panel p-5 rounded-2xl border-valaroix-gold/30 space-y-4">
                  <span className="block text-xs uppercase tracking-widest text-valaroix-gold font-bold flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> 2. Select Payment Method
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* ADVANCE PAYMENT OPTION */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('advance')}
                      className={`p-4 rounded-2xl border text-left transition-all relative ${
                        paymentMethod === 'advance'
                          ? 'glass-panel-gold border-valaroix-gold text-white shadow-xl'
                          : 'bg-black/60 border-valaroix-gold/20 text-gray-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">Advance Payment</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">SadaPay</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">Instant Bank Transfer via SadaPay App</p>
                    </button>

                    {/* CASH ON DELIVERY OPTION */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-4 rounded-2xl border text-left transition-all relative ${
                        paymentMethod === 'cod'
                          ? 'glass-panel-gold border-valaroix-gold text-white shadow-xl'
                          : 'bg-black/60 border-valaroix-gold/20 text-gray-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">Cash On Delivery</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-valaroix-gold/20 text-valaroix-gold border border-valaroix-gold/40">COD</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">Pay Cash when rider delivers to your doorstep</p>
                    </button>

                  </div>

                  {/* ADVANCE PAYMENT SADAPAY ACCOUNT DETAILS & RECEIPT UPLOAD */}
                  {paymentMethod === 'advance' && (
                    <div className="p-4 rounded-2xl bg-black border border-valaroix-gold/40 space-y-4 font-mono text-xs">
                      <div className="space-y-1.5 border-b border-valaroix-gold/20 pb-3">
                        <span className="text-valaroix-gold font-bold block uppercase text-sm">💳 Bank / Easypaisa Account Details:</span>
                        <div className="flex justify-between text-gray-300">
                          <span>Account Title:</span>
                          <strong className="text-white">Zakir Hussain</strong>
                        </div>
                        <div className="flex justify-between text-gray-300">
                          <span>Mobile / Account #:</span>
                          <strong className="text-valaroix-gold">03297062027</strong>
                        </div>
                        <div className="flex justify-between text-gray-300 text-[11px]">
                          <span>IBAN:</span>
                          <strong className="text-white">PK19TMFB0000000085233022</strong>
                        </div>
                      </div>

                      {/* Receipt Upload Box */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-white font-sans">
                          Upload Payment Screenshot / Receipt *
                        </label>

                        <label className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-valaroix-gold/40 bg-valaroix-dark/60 hover:bg-valaroix-gold/10 cursor-pointer transition-all">
                          <Upload className="w-6 h-6 text-valaroix-gold mb-1" />
                          <span className="text-xs text-gray-300 font-sans font-bold">
                            {receiptFile ? receiptFile.name : 'Click to Upload Payment Screenshot'}
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono">PNG, JPG, JPEG</span>
                          <input type="file" accept="image/*" onChange={handleReceiptUpload} className="hidden" />
                        </label>

                        {receiptPreview && (
                          <div className="w-full h-32 rounded-xl overflow-hidden border border-valaroix-gold/50 relative mt-2">
                            <img src={receiptPreview} alt="Receipt Preview" className="w-full h-full object-cover" />
                            <span className="absolute top-2 right-2 text-[9px] bg-emerald-500 text-black px-2 py-0.5 rounded font-bold">Receipt Attached ✓</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>

                {/* Investment Total & Confirm CTA */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="block text-xs text-gray-400 uppercase">Total Amount:</span>
                    <span className="font-serif text-3xl font-bold text-gold-gradient">{formatPrice(total)}</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto btn-gold px-8 py-4 rounded-2xl text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2 shadow-2xl"
                  >
                    Submit Order ➔
                  </button>
                </div>

              </form>
            </div>
          ) : (
            /* Order Submission Pending Receipt */
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full glass-panel-gold border-2 border-valaroix-gold flex items-center justify-center mx-auto text-valaroix-gold">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-amber-400 font-bold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
                  {paymentMethod === 'advance' ? 'Pending Payment Verification' : 'Pending Admin Confirmation'}
                </span>
                <h3 className="font-serif text-3xl font-bold text-white">Order Received, {formData.name}!</h3>
                <p className="text-xs text-gray-300 max-w-md mx-auto">
                  Aapka order receive ho chuka hai. Hamari team admin panel se order confirm kar ke aapke WhatsApp (<strong>{formData.whatsapp}</strong>) par confirmation message bhej dega!
                </p>
              </div>

              <div className="glass-panel p-4 rounded-2xl border-valaroix-gold/30 text-left text-xs font-mono space-y-2 max-w-md mx-auto">
                <div className="flex justify-between text-gray-400 border-b border-valaroix-gold/20 pb-2">
                  <span>Payment Method:</span>
                  <span className="text-valaroix-gold font-bold">{paymentMethod === 'advance' ? 'SadaPay Advance' : 'COD'}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>WhatsApp: {formData.whatsapp}</span>
                </div>
                <div className="flex justify-between font-bold text-valaroix-gold pt-2 border-t border-valaroix-gold/20">
                  <span>Total Amount:</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="btn-gold px-8 py-3 rounded-xl text-xs uppercase font-bold tracking-wider"
              >
                Return to Storefront
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
