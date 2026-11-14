'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, CheckCircle2, ArrowLeft, Send, Check, 
  Package, MessageCircle, AlertCircle, PhoneCall, Clock
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

const POPULAR_FLAVOURS = [
  { id: 'aventus', name: 'Creed Aventus', vibe: 'Smoky Pineapple, Birch & Ambergris', family: 'Fruity Woody' },
  { id: 'baccarat', name: 'Baccarat Rouge 540', vibe: 'Saffron, Amberwood, Jasmine & Fir', family: 'Warm Amber' },
  { id: 'oudwood', name: 'Tom Ford Oud Wood', vibe: 'Rare Oud, Sandalwood, Cardamom & Vanilla', family: 'Precious Woody' },
  { id: 'tygar', name: 'Bvlgari Tygar', vibe: 'Sparkling Grapefruit & Deep Ambroxan', family: 'Citrus Amber' },
  { id: 'sauvage-elixir', name: 'Dior Sauvage Elixir', vibe: 'Nutmeg, Cinnamon, Cardamom & Lavender', family: 'Spicy Intense' },
  { id: 'khamrah', name: 'Lattafa Khamrah / Angels Share', vibe: 'Cognac, Cinnamon, Praline & Tonka Bean', family: 'Sweet Gourmand' },
  { id: 'smw', name: 'Silver Mountain Water', vibe: 'Crisp Green Tea, Blackcurrant & Musk', family: 'Fresh Mountain' },
  { id: 'hawas', name: 'Rasasi Hawas', vibe: 'Aquatic Citrus, Cinnamon, Melon & Amber', family: 'Aquatic Fresh' },
  { id: 'bleu', name: 'Bleu de Chanel', vibe: 'Grapefruit, Incense, Mint & Cedarwood', family: 'Classic Aromatic' },
  { id: '9pm-rebel', name: '9 PM Rebel', vibe: 'Pineapple, Green Apple, Caramel & Vanilla', family: 'Fruity Sweet' },
];

const BOTTLE_STYLES = [
  {
    id: 'zayvor-emerald',
    name: 'Emerald Teal Crystal (Zayvor Edition)',
    badge: 'LUXURY HEAVYWEIGHT',
    image: '/products/zayvor.jpg',
    cap: 'Spherical Polished Gold Orb Cap',
    desc: 'Heavy-weighted 50ml crystal bottle with gold ball cap & emerald reflection.'
  },
  {
    id: 'noir-x-matte',
    name: 'Imperial Matte Noir (Noir X Edition)',
    badge: 'FLAGSHIP ICON',
    image: '/products/noir-x.jpg',
    cap: 'Magnetic Jet-Black Crown Cap',
    desc: 'Ultra-matte velvety obsidian finish with radiant gold typography.'
  },
  {
    id: 'vertex-blue',
    name: 'Celestial Royal Blue (Vertex Edition)',
    badge: 'ROYAL SAPPHIRE',
    image: '/products/vertex.jpg',
    cap: 'Deep Midnight Metallic Cap',
    desc: 'Electric sapphire glass bottle with aristocrat gold imperial crest.'
  },
  {
    id: 'classic-clear',
    name: 'Fluted Royal Clear (Classic Edition)',
    badge: 'TIMELESS HERITAGE',
    image: '/products/sauvage.jpg',
    cap: 'Gold Crest Cylinder Cap',
    desc: 'Fluted crystal glass displaying glowing golden pure essence.'
  }
];

export default function CustomPerfumePage() {
  // Builder States
  const [selectedFlavour, setSelectedFlavour] = useState('aventus');
  const [customFlavourText, setCustomFlavourText] = useState('');
  const [selectedBottle, setSelectedBottle] = useState('zayvor-emerald');
  const [customNotes, setCustomNotes] = useState('');
  
  // Minimum quantity: 2 bottles required
  const [quantity, setQuantity] = useState(2);
  const [quantityWarning, setQuantityWarning] = useState(false);

  // Delivery States
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const handleDecreaseQuantity = () => {
    if (quantity <= 2) {
      setQuantityWarning(true);
      setTimeout(() => setQuantityWarning(false), 3000);
      return;
    }
    setQuantity(quantity - 1);
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const effectiveFlavourName = selectedFlavour === 'custom'
    ? (customFlavourText.trim() || 'Custom Bespoke Blend')
    : (POPULAR_FLAVOURS.find(f => f.id === selectedFlavour)?.name || 'Custom Blend');

  const selectedBottleObj = BOTTLE_STYLES.find(b => b.id === selectedBottle) || BOTTLE_STYLES[0];

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      alert('Please enter your full name');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      alert('Please enter your valid phone / WhatsApp number (e.g. 03001234567)');
      return;
    }
    if (!address.trim()) {
      alert('Please enter complete street delivery address');
      return;
    }
    if (selectedFlavour === 'custom' && !customFlavourText.trim()) {
      alert('Please specify the custom fragrance name or notes you want us to formulate.');
      return;
    }

    setIsSubmitting(true);

    const orderId = `VLX-CUST-${Math.floor(10000 + Math.random() * 90000)}`;

    const customOrderPayload = {
      id: orderId,
      customerName,
      name: customerName,
      phone,
      whatsapp: phone,
      city: city.trim() || 'Pakistan',
      address: address.trim(),
      notes: `BESPOKE CUSTOM PERFUME REQUEST:\n• Flavour: ${effectiveFlavourName}\n• Bottle: ${selectedBottleObj.name}\n• Quantity: ${quantity} Bottles (Same Flavour)\n• Payment Terms: 30% Advance Deposit + 70% COD\n• Status: Request Confirmed (Team will contact customer)${customNotes ? `\n• Special Notes: ${customNotes}` : ''}`,
      item: `VALAROIX BESPOKE: ${effectiveFlavourName} (${quantity} Bottles)`,
      items: [
        {
          id: `bespoke-${selectedFlavour}`,
          name: `VALAROIX BESPOKE — ${effectiveFlavourName}`,
          quantity,
          image: selectedBottleObj.image,
          isCustom: true,
          customFlavour: effectiveFlavourName,
          customBottle: selectedBottleObj.name,
        }
      ],
      total: 0, // Quotation handled by concierge
      paymentMethod: '30% Advance Deposit + 70% COD',
      status: 'Custom Order Confirmed (Contact Customer)',
      isCustom: true,
      customFlavour: effectiveFlavourName,
      customBottle: selectedBottleObj.name,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      tcsTrackingNumber: null
    };

    try {
      // 1. Save to localStorage
      try {
        const saved = JSON.parse(localStorage.getItem('valaroix_orders') || '[]');
        localStorage.setItem('valaroix_orders', JSON.stringify([customOrderPayload, ...saved]));
      } catch (_) {}

      // 2. Post to Cloud Server
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customOrderPayload)
      });

      // 3. Broadcast channel
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        try {
          const ch = new BroadcastChannel('valaroix_orders_channel');
          ch.postMessage({ type: 'NEW_ORDER', order: customOrderPayload });
          ch.close();
        } catch (_) {}
      }

      setOrderSuccess(customOrderPayload);
    } catch (err) {
      setOrderSuccess(customOrderPayload);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppDirectUrl = () => {
    const text = `Assalam-o-Alaikum VALAROIX! ✨\n\nMujhe apna Custom Perfume order karna hai:\n\n🧪 *Fragrance / Flavour:* ${effectiveFlavourName}\n🍾 *Bottle Choice:* ${selectedBottleObj.name}\n📦 *Quantity:* ${quantity} Bottles (Same Flavour)\n\n📍 *Customer Details:*\nName: ${customerName || 'Customer'}\nPhone: ${phone || ''}\nCity: ${city || ''}\nAddress: ${address || ''}\n\n👉 Baraye meharbani details confirm karein. Shukriya!`;
    return `https://wa.me/923029111856?text=${encodeURIComponent(text)}`;
  };

  return (
    <main className="min-h-screen bg-[#070709] text-gray-100 font-sans relative overflow-x-hidden pb-20">
      <Navbar />

      {/* LUXURY ATELIER HERO */}
      <section className="relative pt-10 pb-12 px-4 sm:px-8 border-b border-[#D4AF37]/20 bg-gradient-to-b from-[#121217] via-[#0A0A0D] to-[#070709]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#D4AF37] transition-colors mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#D4AF37] text-[11px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            VALAROIX BESPOKE ATELIER
          </div>

          <h1 className="font-serif-mockup text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Apni Pasand Ka Perfume <span className="text-[#D4AF37]">Banwayen</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Koi bhi designer scent, clone ya apni pasand ka fragrance flavour select karein aur luxury bottle mein banwayen.
          </p>

          {/* TWO CORE RULES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-left max-w-2xl mx-auto">
            <div className="p-3.5 rounded-2xl bg-black/60 border border-[#D4AF37]/40 flex items-start gap-3 shadow-lg">
              <Package className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs text-white block uppercase tracking-wide">Minimum 2 Bottles</strong>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Aik hi flavour / scent formula mein minimum <strong>2 bottles</strong> ka order required hota hai.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/60 border border-[#D4AF37]/40 flex items-start gap-3 shadow-lg">
              <Sparkles className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs text-white block uppercase tracking-wide">30% Advance Deposit Policy</strong>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Custom formula tayar karne ke liye <strong>30% advance</strong> aur baqi <strong>70% Cash on Delivery (COD)</strong> hota hai.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN BUILDER CONTAINER */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 py-10">
        
        {/* SUCCESS CONFIRMATION STATE */}
        {orderSuccess && (
          <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#181822] to-[#0E0E14] border-2 border-[#D4AF37] shadow-2xl text-center space-y-6 my-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-9 h-9 text-[#D4AF37]" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#D4AF37] px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 inline-block">
                ORDER CONFIRMED
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif-mockup font-bold text-white">
                Thank You, {orderSuccess.customerName}!
              </h2>
              <p className="text-xs sm:text-sm text-gray-400">
                Your custom fragrance request has been logged under Request ID: <strong className="text-[#D4AF37] font-mono">#{orderSuccess.id}</strong>
              </p>
            </div>

            {/* PROMINENT ENGLISH NOTICE AS REQUESTED BY USER */}
            <div className="p-5 sm:p-6 rounded-2xl bg-black/90 border border-emerald-500/50 text-left space-y-3 max-w-xl mx-auto shadow-xl">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>We Will Contact You Shortly</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-sans">
                <strong>We have received your custom fragrance order and our team will contact you ourselves directly via WhatsApp or phone call.</strong> You do not need to worry or do anything further right now—our concierge will get in touch with you shortly to finalize your bespoke formula and delivery details.
              </p>
            </div>

            {/* ORDER SUMMARY */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-xs text-left space-y-2 max-w-xl mx-auto">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Selected Fragrance:</span>
                <strong className="text-white">{orderSuccess.customFlavour}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Bottle Style:</span>
                <strong className="text-white">{orderSuccess.customBottle}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Quantity:</span>
                <strong className="text-[#D4AF37]">{quantity} Bottles (Same Flavour)</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400">Payment Terms:</span>
                <span className="text-emerald-400 font-semibold">30% Advance + 70% Cash on Delivery</span>
              </div>
            </div>

            {/* OPTIONAL WHATSAPP BUTTON IF THEY WANT TO CHAT IMMEDIATELY */}
            <div className="space-y-3 max-w-xl mx-auto pt-2">
              <a
                href={getWhatsAppDirectUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Chat Directly on WhatsApp (Optional)</span>
              </a>

              <Link
                href="/"
                className="block py-2 text-xs text-gray-400 hover:text-white transition-colors"
              >
                Return to Home Catalog
              </Link>
            </div>
          </div>
        )}

        {!orderSuccess && (
          <form onSubmit={handleSubmitOrder} className="space-y-8">

            {/* STEP 1: CHOOSE FRAGRANCE / FLAVOUR */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#111116] border border-[#D4AF37]/30 space-y-5 shadow-xl">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#D4AF37] text-black font-extrabold text-xs flex items-center justify-center">1</div>
                  <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                    Select Fragrance Flavour / Scent Inspiration
                  </h2>
                </div>
                <span className="text-[11px] text-gray-400 font-medium">40% Pure Oil Concentration</span>
              </div>

              {/* Grid of Famous Fragrance Profiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {POPULAR_FLAVOURS.map((f) => {
                  const isSelected = selectedFlavour === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedFlavour(f.id)}
                      className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer relative overflow-hidden ${
                        isSelected
                          ? 'bg-[#D4AF37]/15 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10'
                          : 'bg-[#16161D] border-white/5 hover:border-white/20 text-gray-300'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#D4AF37] text-black flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                      <span className="text-[10px] text-[#D4AF37] font-semibold uppercase block tracking-wider">
                        {f.family}
                      </span>
                      <strong className="text-xs sm:text-sm text-white block mt-0.5">{f.name}</strong>
                      <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">{f.vibe}</p>
                    </button>
                  );
                })}

                {/* Option for Completely Custom Flavour */}
                <button
                  type="button"
                  onClick={() => setSelectedFlavour('custom')}
                  className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer relative ${
                    selectedFlavour === 'custom'
                      ? 'bg-emerald-500/15 border-emerald-400 shadow-lg'
                      : 'bg-[#16161D] border-dashed border-white/20 hover:border-white/40 text-gray-300'
                  }`}
                >
                  {selectedFlavour === 'custom' && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-400 text-black flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                  <span className="text-[10px] text-emerald-400 font-bold uppercase block tracking-wider">
                    ✨ Your Own Scent
                  </span>
                  <strong className="text-xs sm:text-sm text-white block mt-0.5">Custom Flavour / Clone</strong>
                  <p className="text-[11px] text-gray-400 mt-1">Type any designer perfume name or notes</p>
                </button>
              </div>

              {/* Custom Flavour Input Field */}
              {selectedFlavour === 'custom' && (
                <div className="pt-2 space-y-1.5 animate-fadeIn">
                  <label className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">
                    Type Your Desired Perfume Name / Clone / Notes: *
                  </label>
                  <input
                    type="text"
                    required
                    value={customFlavourText}
                    onChange={(e) => setCustomFlavourText(e.target.value)}
                    placeholder="e.g. Louis Vuitton Imagination, Creed Green Irish Tweed, Tom Ford Black Orchid..."
                    className="w-full bg-[#1A1A22] border border-emerald-500/60 rounded-xl px-4 py-3 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-400"
                  />
                  <p className="text-[11px] text-gray-400">
                    Humare expert perfumers aapki pasand ka scent exact master formula ke sath tayar karenge.
                  </p>
                </div>
              )}
            </div>

            {/* STEP 2: CHOOSE BOTTLE STYLE */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#111116] border border-[#D4AF37]/30 space-y-5 shadow-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#D4AF37] text-black font-extrabold text-xs flex items-center justify-center">2</div>
                <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                  Select 50ml Luxury Bottle Style
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {BOTTLE_STYLES.map((b) => {
                  const isSelected = selectedBottle === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBottle(b.id)}
                      className={`p-4 rounded-2xl text-left border transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#D4AF37]/15 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10'
                          : 'bg-[#16161D] border-white/5 hover:border-white/20'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#D4AF37] text-black flex items-center justify-center z-10">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}

                      <div className="space-y-2.5">
                        <div className="w-full h-36 rounded-xl overflow-hidden bg-black/60 border border-white/10 relative">
                          <img src={b.image} alt={b.name} className="w-full h-full object-cover" />
                          <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/80 text-[#D4AF37] text-[9px] font-bold uppercase tracking-wider border border-[#D4AF37]/30">
                            {b.badge}
                          </span>
                        </div>

                        <div>
                          <strong className="text-xs text-white block font-bold">{b.name}</strong>
                          <span className="text-[10px] text-gray-400 block mt-0.5">{b.cap}</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-gray-400 mt-2 line-clamp-2">{b.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: QUANTITY SELECTOR (STRICT MINIMUM 2 BOTTLES) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#111116] border border-[#D4AF37]/30 space-y-5 shadow-xl">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#D4AF37] text-black font-extrabold text-xs flex items-center justify-center">3</div>
                  <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                    Quantity (Minimum 2 Bottles in Same Flavour)
                  </h2>
                </div>
              </div>

              {/* Requirement Rule Notice */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-xs text-amber-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 font-bold block">Important Rule:</strong>
                  Aik hi flavour / perfume formula mein <strong>minimum 2 bottles</strong> banwana lazmi hai.
                </div>
              </div>

              {quantityWarning && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-500 text-xs text-red-300 animate-bounce text-center font-bold">
                  ⚠️ Minimum 2 bottles ka order lazmi hai! 2 se kam custom perfume formulate nahi ho sakta.
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-black/60 border border-white/10">
                <div>
                  <span className="text-xs text-gray-300 font-semibold block">Select Number of Bottles:</span>
                  <span className="text-[11px] text-gray-400">All bottles will be formulated with: <strong>{effectiveFlavourName}</strong></span>
                </div>

                <div className="flex items-center border border-[#D4AF37] rounded-2xl bg-[#16161E] overflow-hidden shadow-lg">
                  <button
                    type="button"
                    onClick={handleDecreaseQuantity}
                    className="px-4 py-2 text-lg font-bold text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                    title="Minimum 2 bottles"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 text-base font-extrabold text-[#D4AF37] font-mono">
                    {quantity} Bottles
                  </span>
                  <button
                    type="button"
                    onClick={handleIncreaseQuantity}
                    className="px-4 py-2 text-lg font-bold text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* STEP 4: DELIVERY ADDRESS & CONTACT */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#111116] border border-[#D4AF37]/30 space-y-5 shadow-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#D4AF37] text-black font-extrabold text-xs flex items-center justify-center">4</div>
                <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                  Your Delivery Details
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-300 uppercase">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Muaaz Khan"
                    className="w-full bg-[#1A1A22] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-300 uppercase">WhatsApp / Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03001234567"
                    className="w-full bg-[#1A1A22] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-300 uppercase">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Karachi, Lahore, Islamabad, Multan..."
                    className="w-full bg-[#1A1A22] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-300 uppercase">Complete Delivery Street Address *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House / Flat #, Street, Area / Sector"
                    className="w-full bg-[#1A1A22] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-300 uppercase">Special Instructions / Custom Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Agar scent mein koi specific note tez ya halka rakhna hai toh yahan likhein..."
                  className="w-full bg-[#1A1A22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37] resize-none"
                />
              </div>

              {/* Informative English Banner */}
              <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 text-xs text-gray-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Our team will contact you directly to confirm your order details.</span>
              </div>
            </div>

            {/* ACTION CTA BUTTONS */}
            <div className="space-y-3 pt-2">
              {/* MAIN SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B38728] text-black font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-2xl hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Submitting Custom Formula Request...</span>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-black" />
                    <span>Confirm Custom Perfume Order</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <span className="text-xs text-gray-400 font-medium">ya direct WhatsApp par order karein:</span>
              </div>

              {/* DIRECT WHATSAPP BUTTON */}
              <a
                href={getWhatsAppDirectUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all text-center block cursor-pointer shadow-lg"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Order on WhatsApp (03029111856)</span>
              </a>
            </div>

          </form>
        )}

      </section>

      <Footer />
      <FloatingWhatsApp phoneNumber="923029111856" />
    </main>
  );
}
