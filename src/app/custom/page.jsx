'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, ShieldCheck, CheckCircle2, Truck, Copy, Check, 
  Upload, ArrowLeft, Send, Eye, Lock, Package, Clock, 
  Flame, Droplets, Award, MessageCircle, AlertCircle
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
  const router = useRouter();

  // Builder States
  const [selectedFlavour, setSelectedFlavour] = useState('aventus');
  const [customFlavourText, setCustomFlavourText] = useState('');
  const [selectedBottle, setSelectedBottle] = useState('zayvor-emerald');
  const [customLabel, setCustomLabel] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  
  // Minimum quantity: 2 bottles required
  const [quantity, setQuantity] = useState(2);
  const [quantityWarning, setQuantityWarning] = useState(false);

  // Delivery & Payment States
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  // Calculations: Rs. 2,999 display -> pure hundred count 3,000 per bottle
  const pricePerBottle = 3000;
  const totalAmount = quantity * pricePerBottle;
  const advanceAmount = Math.round(totalAmount * 0.3); // 30% Advance
  const codRemainingAmount = totalAmount - advanceAmount; // 70% Remaining COD

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

  const handleCopy = (text, field) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawData = event.target.result;
        try {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxDim = 800;
            let width = img.width;
            let height = img.height;
            if (width > height) {
              if (width > maxDim) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              }
            } else {
              if (height > maxDim) {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            setReceiptPreview(canvas.toDataURL('image/jpeg', 0.65));
          };
          img.src = rawData;
        } catch (_) {
          setReceiptPreview(rawData);
        }
      };
      reader.readAsDataURL(file);
    }
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
    const effectiveLabel = customLabel.trim() || `${customerName.toUpperCase()} EXCLUSIF`;

    const customOrderPayload = {
      id: orderId,
      customerName,
      name: customerName,
      phone,
      whatsapp: phone,
      city: city.trim() || 'Pakistan',
      address: address.trim(),
      notes: `BESPOKE CUSTOM PERFUME ORDER:\n• Flavour: ${effectiveFlavourName}\n• Bottle: ${selectedBottleObj.name}\n• Custom Label: ${effectiveLabel}\n• Quantity: ${quantity} Bottles (Same Flavour)\n• 30% Advance Deposit: Rs. ${advanceAmount.toLocaleString()}\n• 70% COD Balance: Rs. ${codRemainingAmount.toLocaleString()}${transactionId ? `\n• TxID: ${transactionId}` : ''}${customNotes ? `\n• Special Notes: ${customNotes}` : ''}`,
      item: `VALAROIX BESPOKE: ${effectiveFlavourName} (${quantity} Bottles • ${effectiveLabel})`,
      items: [
        {
          id: `bespoke-${selectedFlavour}`,
          name: `VALAROIX BESPOKE — ${effectiveFlavourName}`,
          quantity,
          price: pricePerBottle,
          exactPkr: pricePerBottle,
          displayPrice: 2999,
          image: selectedBottleObj.image,
          isCustom: true,
          customFlavour: effectiveFlavourName,
          customBottle: selectedBottleObj.name,
          customLabel: effectiveLabel,
        }
      ],
      total: totalAmount,
      pricePkr: totalAmount,
      paymentMethod: `30% Advance (Rs. ${advanceAmount.toLocaleString()}) + 70% COD (Rs. ${codRemainingAmount.toLocaleString()})`,
      status: receiptPreview ? 'Pending Verification (Advance Slip Attached)' : 'Pending Advance Deposit Verification',
      receiptImage: receiptPreview,
      isCustom: true,
      customFlavour: effectiveFlavourName,
      customBottle: selectedBottleObj.name,
      customLabel: effectiveLabel,
      advancePaidPkr: advanceAmount,
      codRemainingPkr: codRemainingAmount,
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
      alert('Order could not be saved to server, but we will send it via WhatsApp.');
      setOrderSuccess(customOrderPayload);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppDirectUrl = () => {
    const effectiveLabel = customLabel.trim() || `${customerName || 'VALAROIX'} EXCLUSIF`;
    const text = `Assalam-o-Alaikum VALAROIX! ✨\n\nMujhe apna Custom Perfume banwana hai:\n\n🧪 *Fragrance / Flavour:* ${effectiveFlavourName}\n🍾 *Bottle Choice:* ${selectedBottleObj.name}\n🏷️ *Custom Bottle Label:* ${effectiveLabel}\n📦 *Quantity:* ${quantity} Bottles (Same Flavour)\n\n💰 *Total Amount:* Rs. ${totalAmount.toLocaleString()}\n💳 *30% Advance Deposit Required:* Rs. ${advanceAmount.toLocaleString()}\n🚚 *70% Remaining Balance (COD):* Rs. ${codRemainingAmount.toLocaleString()}\n\n📍 *Delivery Details:*\nName: ${customerName || 'Customer'}\nPhone: ${phone || ''}\nCity: ${city || ''}\nAddress: ${address || ''}\n\n👉 Baraye meharbani confirm karein taake mein 30% advance deposit ki receipt share kar sakun. Shukriya!`;
    return `https://wa.me/923029111856?text=${encodeURIComponent(text)}`;
  };

  return (
    <main className="min-h-screen bg-[#070709] text-gray-100 font-sans relative overflow-x-hidden pb-20">
      <Navbar />

      {/* LUXURY ATELIER HERO */}
      <section className="relative pt-10 pb-16 px-4 sm:px-8 border-b border-[#D4AF37]/20 bg-gradient-to-b from-[#121217] via-[#0A0A0D] to-[#070709]">
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
            Aapki shakhsiyat ka munfarid ittar. Koi bhi designer scent, exclusive bottle, aur aapka apna naam bottle par engrave karwayen.
          </p>

          {/* TWO GOLDEN RULES BANNER */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-left max-w-2xl mx-auto">
            <div className="p-3.5 rounded-2xl bg-black/60 border border-[#D4AF37]/40 flex items-start gap-3 shadow-lg">
              <Package className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs text-white block uppercase tracking-wide">Rule 1: Minimum 2 Bottles</strong>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Aik hi flavour / formula mein minimum <strong>2 bottles</strong> ka order lazmi hai taake lab distillation standard maintain rahe.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/60 border border-[#D4AF37]/40 flex items-start gap-3 shadow-lg">
              <Lock className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs text-white block uppercase tracking-wide">Rule 2: 30% Advance Deposit</strong>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Custom label aur formula prepare karne ke liye <strong>30% advance</strong> lazmi hai. Baqi <strong>70% Cash on Delivery (COD)</strong> rider ko dain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN BUILDER CONTAINER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
        
        {/* SUCCESS CONFIRMATION MODAL */}
        {orderSuccess && (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#18181F] to-[#0E0E12] border-2 border-[#D4AF37] shadow-2xl text-center space-y-5 my-8">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-[#D4AF37]" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                BESPOKE ORDER SUBMITTED
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif-mockup font-bold text-white">
                Mubarak Ho, {orderSuccess.customerName}!
              </h2>
              <p className="text-xs text-gray-300">
                Aapka custom perfume order receive ho chuka hai. Order ID: <strong className="text-[#D4AF37] font-mono">#{orderSuccess.id}</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/80 border border-white/10 text-xs text-left space-y-2.5 max-w-md mx-auto">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Flavour / Scent:</span>
                <strong className="text-white">{orderSuccess.customFlavour}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Custom Label:</span>
                <strong className="text-[#D4AF37]">{orderSuccess.customLabel}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Total Quantity:</span>
                <strong className="text-white">{quantity} Bottles (Same Flavour)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Total Bill:</span>
                <strong className="text-white font-mono">Rs. {orderSuccess.total?.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#D4AF37]/30 bg-[#D4AF37]/10 px-2 rounded-lg">
                <span className="text-[#D4AF37] font-bold">30% Advance Required:</span>
                <strong className="text-[#D4AF37] font-mono text-sm">Rs. {orderSuccess.advancePaidPkr?.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between py-1 text-emerald-400 px-2">
                <span>70% Cash on Delivery (COD):</span>
                <strong className="font-mono">Rs. {orderSuccess.codRemainingPkr?.toLocaleString()}</strong>
              </div>
            </div>

            <div className="space-y-3 max-w-md mx-auto pt-2">
              <a
                href={getWhatsAppDirectUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Send Order & 30% Slip on WhatsApp</span>
              </a>

              <Link
                href="/"
                className="block py-3 text-xs text-gray-400 hover:text-white transition-colors"
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
                    Select Fragrance Flavour / Inspiration
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
                  <p className="text-[11px] text-gray-400 mt-1">Type any designer name or blend you desire</p>
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
                  Select Luxury 50ml Bottle Style
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

            {/* STEP 3: CUSTOM BOTTLE LABEL / ENGRAVING */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#111116] border border-[#D4AF37]/30 space-y-5 shadow-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#D4AF37] text-black font-extrabold text-xs flex items-center justify-center">3</div>
                <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                  Personalized Bottle Label / Engraving
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                <div className="space-y-3">
                  <label className="text-xs text-gray-300 font-semibold block">
                    Aapka Naam ya Perfume Title (Bottle ke sticker par print hoga):
                  </label>
                  <input
                    type="text"
                    value={customLabel}
                    onChange={(e) => setCustomLabel(e.target.value)}
                    placeholder="e.g. Muaaz Signature, Fahad Imperial, Royal Oud..."
                    maxLength={28}
                    className="w-full bg-[#1A1A22] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <p className="text-[11px] text-gray-400">
                    Max 28 characters. Yeh naam luxury gold metallic crest ke neeche print kiya jayega.
                  </p>
                </div>

                {/* Live Preview Badge */}
                <div className="p-5 rounded-2xl bg-black border border-[#D4AF37]/40 text-center space-y-2 shadow-inner">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-mono">
                    LIVE LABEL PREVIEW
                  </span>
                  <div className="py-3 px-4 rounded-xl border border-[#D4AF37]/60 bg-gradient-to-b from-[#141414] to-black inline-block min-w-[220px]">
                    <span className="text-[9px] text-[#D4AF37] font-serif tracking-[0.25em] block uppercase font-bold">
                      VALAROIX HAUTE PARFUMERIE
                    </span>
                    <strong className="text-base sm:text-lg text-white font-serif-mockup font-extrabold tracking-wider block mt-0.5">
                      {customLabel.trim() ? customLabel.toUpperCase() : 'YOUR NAME EXCLUSIF'}
                    </strong>
                    <span className="text-[8px] text-gray-400 tracking-widest uppercase block mt-0.5">
                      {effectiveFlavourName} • 50ML EXTRAIT
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 4: QUANTITY SELECTOR (STRICT MINIMUM 2 BOTTLES) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#111116] border border-[#D4AF37]/30 space-y-5 shadow-xl">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#D4AF37] text-black font-extrabold text-xs flex items-center justify-center">4</div>
                  <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                    Select Quantity (Minimum 2 Bottles Required)
                  </h2>
                </div>
                <span className="text-xs text-[#D4AF37] font-mono font-bold">
                  Rs. 2,999 / Bottle (Pure 3,000 count)
                </span>
              </div>

              {/* Requirement Rule Notice */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-xs text-amber-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 font-bold block">Important Compounding Rule:</strong>
                  Kyunke hum custom perfume ki concentrate khud prepare karte hain, is liye <strong>aik hi flavour mein kam az kam 2 bottles</strong> banana zaroori hota hai taake oil concentrate balance theek rahe.
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

            {/* STEP 5: 30% ADVANCE PAYMENT SYSTEM & BREAKDOWN */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#181822] to-[#101016] border-2 border-[#D4AF37] space-y-6 shadow-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#D4AF37] text-black font-extrabold text-xs flex items-center justify-center">5</div>
                <h2 className="text-base sm:text-lg font-bold text-[#D4AF37] uppercase tracking-wider">
                  Payment Breakdown (30% Advance + 70% COD)
                </h2>
              </div>

              {/* Bill Calculation Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
                
                {/* Total Bill */}
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Total Amount ({quantity}x Rs. 3,000)</span>
                  <strong className="text-xl sm:text-2xl text-white font-serif-mockup font-extrabold block">
                    Rs. {totalAmount.toLocaleString()}
                  </strong>
                  <span className="text-[10px] text-emerald-400 block font-semibold">Free Express Delivery</span>
                </div>

                {/* 30% Advance (Mandatory) */}
                <div className="p-4 rounded-2xl bg-[#D4AF37]/15 border-2 border-[#D4AF37] space-y-1 shadow-lg relative overflow-hidden">
                  <span className="absolute -top-1 -right-1 px-2 py-0.5 rounded-bl-lg bg-[#D4AF37] text-black text-[9px] font-black uppercase">
                    Pay Now
                  </span>
                  <span className="text-[10px] text-[#D4AF37] uppercase font-bold block">30% Advance Required</span>
                  <strong className="text-2xl sm:text-3xl text-[#D4AF37] font-serif-mockup font-black block">
                    Rs. {advanceAmount.toLocaleString()}
                  </strong>
                  <span className="text-[10px] text-gray-300 block">To Start Lab Blending</span>
                </div>

                {/* 70% Remaining COD */}
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">70% Cash on Delivery</span>
                  <strong className="text-xl sm:text-2xl text-emerald-400 font-serif-mockup font-extrabold block">
                    Rs. {codRemainingAmount.toLocaleString()}
                  </strong>
                  <span className="text-[10px] text-gray-400 block">Pay to Rider on Arrival</span>
                </div>

              </div>

              {/* Account Details Box */}
              <div className="p-5 rounded-2xl bg-black border border-[#D4AF37]/50 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#D4AF37]" /> Send 30% Advance (Rs. {advanceAmount.toLocaleString()}) to:
                  </span>
                  <span className="text-[10px] text-[#D4AF37] font-bold uppercase bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/30">
                    SadaPay / JazzCash / Easypaisa
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-gray-400 uppercase block font-medium">Account / Mobile Number:</span>
                    <strong className="text-lg text-white font-mono font-bold tracking-widest block">
                      03297062027
                    </strong>
                    <span className="text-[11px] text-[#D4AF37] block">Account Title: <strong>Fahad / VALAROIX Official</strong></span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy('03297062027', 'acc')}
                    className="py-2.5 px-4 rounded-xl bg-[#D4AF37] text-black font-extrabold text-xs uppercase flex items-center gap-1.5 shadow-md hover:bg-yellow-400 transition-colors cursor-pointer"
                  >
                    {copiedField === 'acc' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'acc' ? 'Copied!' : 'Copy Number'}</span>
                  </button>
                </div>
              </div>

              {/* Screenshot / Slip Upload Field */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <label className="text-xs text-gray-300 font-bold uppercase block flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#D4AF37]" />
                  Attach 30% Payment Screenshot / Slip (Optional, ya WhatsApp par bhej dein):
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <label className="flex-1 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-[#D4AF37]/50 bg-white/5 hover:bg-white/10 text-xs text-[#D4AF37] font-bold cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Upload Screenshot</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>

                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Transaction ID / Sender Name (e.g. TRX-9824)"
                    className="flex-1 w-full bg-[#1A1A22] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {receiptPreview && (
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-black border border-emerald-500/50">
                    <img src={receiptPreview} alt="Slip" className="w-12 h-12 rounded-lg object-cover" />
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Screenshot attached successfully!
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* STEP 6: DELIVERY ADDRESS & CONTACT */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#111116] border border-[#D4AF37]/30 space-y-5 shadow-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#D4AF37] text-black font-extrabold text-xs flex items-center justify-center">6</div>
                <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                  Customer Delivery Information
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
                  placeholder="Agar formula mein koi specific note tez ya halka rakhna hai toh yahan likhein..."
                  className="w-full bg-[#1A1A22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37] resize-none"
                />
              </div>
            </div>

            {/* ACTION CTA BUTTONS */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B38728] text-black font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-2xl hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Submitting Custom Formula...</span>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-black" />
                    <span>Confirm Bespoke Order (30% Advance: Rs. {advanceAmount.toLocaleString()})</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <span className="text-xs text-gray-400">or order directly via WhatsApp Concierge:</span>
              </div>

              <a
                href={getWhatsAppDirectUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-2xl bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/40 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all text-center block cursor-pointer shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Discuss & Order Custom Perfume on WhatsApp (03029111856)</span>
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
