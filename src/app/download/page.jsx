import React from 'react';
import Link from 'next/link';
import { Download, ShieldCheck, Sparkles, ArrowLeft, CheckCircle2, BellRing, Settings } from 'lucide-react';

export const metadata = {
  title: 'Download VALAROIX Mobile Apps — Customer & Admin APKs',
  description: 'Download official Android release APKs for VALAROIX Luxury Parfums and VALAROIX Admin Hub.',
};

export default function DownloadAppsPage() {
  const customerApkUrl = 'https://github.com/muaazkori-dev/valaroix-perfume/releases/download/v1.0.7/valaroix-customer.apk';
  const adminApkUrl = 'https://github.com/muaazkori-dev/valaroix-perfume/releases/download/v1.0.7/valaroix-admin.apk';

  return (
    <div className="min-h-screen bg-[#0B0B0E] text-white py-12 px-4 sm:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] hover:underline mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to VALAROIX Boutique
          </Link>
          <div className="inline-block px-3 py-1 rounded-full border border-[#D4AF37]/40 bg-[#141414] text-[11px] font-bold text-[#D4AF37] uppercase tracking-widest">
            OFFICIAL ANDROID APKS (v1.0.7)
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-white tracking-wide">
            Download VALAROIX Mobile Apps
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto">
            Choose your app below to download the official Android Release APK directly to your phone.
          </p>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          
          {/* 1. CUSTOMER APP */}
          <div className="bg-[#141414] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-[#D4AF37] transition-all">
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-black border border-[#D4AF37] p-1 shadow-lg overflow-hidden shrink-0">
                  <img src="/customer-logo.jpg" alt="VALAROIX Customer App" className="w-full h-full object-cover rounded-xl" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#D4AF37] tracking-widest uppercase block">FOR CUSTOMERS</span>
                  <h2 className="text-lg font-bold text-white leading-tight font-serif">VALAROIX Parfums</h2>
                  <span className="text-xs text-gray-400">Release v1.0.5 (Native APK)</span>
                </div>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">
                Dedicated luxury fragrance shopping app. Browse NOIR X, VERTEX, and SAUVAGE with 40% oil concentration, 1-tap cart, COD checkout, and instant status updates when admin confirms your parcel.
              </p>

              <div className="space-y-1.5 pt-2 text-[11px] text-gray-400">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Full Fragrance Notes & Details</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 1-Tap Cash on Delivery Order</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Live TCS Courier Tracking & Push Alerts</div>
              </div>
            </div>

            <div className="pt-6">
              <a
                href={customerApkUrl}
                download="valaroix-customer.apk"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B38728] text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Download Customer App (.APK)</span>
              </a>
            </div>
          </div>

          {/* 2. ADMIN APP */}
          <div className="bg-[#141414] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-[#D4AF37] transition-all">
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-black border border-[#D4AF37] p-1 shadow-lg overflow-hidden shrink-0">
                  <img src="/admin-logo.jpg" alt="VALAROIX Admin App" className="w-full h-full object-cover rounded-xl" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-400 tracking-widest uppercase block">FOR OWNER / ADMIN</span>
                  <h2 className="text-lg font-bold text-white leading-tight font-serif">VALAROIX Admin Hub</h2>
                  <span className="text-xs text-gray-400">Release v1.0.5 (Native APK)</span>
                </div>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">
                Executive order desk for Muaaz & Fahad. WhatsApp-style heads-up drop-down banner alerts, sound chimes & vibration on website orders, 1-click TCS booking, profit calculator, and PIN lock security (9824).
              </p>

              <div className="space-y-1.5 pt-2 text-[11px] text-gray-400">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" /> WhatsApp-Style Drop-down Heads-Up Alerts</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" /> 1-Click TCS Courier Booking</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" /> WhatsApp Customer Dispatch (03029111856)</div>
              </div>
            </div>

            <div className="pt-6">
              <a
                href={adminApkUrl}
                download="valaroix-admin.apk"
                className="w-full py-3.5 rounded-2xl bg-[#1A1A1A] border border-[#D4AF37] text-[#D4AF37] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:bg-[#D4AF37] hover:text-black active:scale-95 transition-all"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Download Admin App (.APK)</span>
              </a>
            </div>
          </div>

        </div>

        {/* Android 13/14 Restricted Settings & Notifications Setup Card */}
        <div className="bg-[#141414] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-7 shadow-xl space-y-3">
          <div className="flex items-center gap-2.5 text-[#D4AF37]">
            <BellRing className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-bold text-white text-sm sm:text-base">
              Android 13 / 14 / 15 Notification Setup (Agar "Deny" ya Greyed out ho):
            </h3>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Android 13 aur 14 par direct APK install karne par security ki wajah se notifications pehle "Restricted" hoti hain. Inhein 10 seconds mein enable karein:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <div className="bg-black/60 border border-white/10 rounded-2xl p-4 space-y-1.5">
              <span className="font-bold text-[#D4AF37] block">Tariqa:</span>
              <p className="text-gray-300">
                1. Phone ki <strong>Settings ➔ Apps ➔ VALAROIX Admin</strong> kholiye.<br />
                2. Top right par <strong>3 dots (⋮)</strong> dabayein.<br />
                3. <strong>"Allow restricted settings"</strong> par tap karein.<br />
                4. Phir wapas <strong>Notifications</strong> par ja kar <strong>Allow</strong> kar dein!
              </p>
            </div>
            <div className="bg-black/60 border border-white/10 rounded-2xl p-4 space-y-1.5">
              <span className="font-bold text-emerald-400 block">In-App 1-Tap Test:</span>
              <p className="text-gray-300">
                Admin App ke andar upar bell 🔔 icon dabayein. Wahan se direct <strong>"Open App Settings"</strong> khul jayega aur aap <strong>"Send Test Alert Now"</strong> dabakar test drop-down notification check kar sakte hain!
              </p>
            </div>
          </div>
        </div>

        {/* General Installation Instructions */}
        <div className="bg-[#141414]/60 border border-white/10 rounded-2xl p-6 text-xs text-gray-400 space-y-2">
          <h3 className="font-bold text-white text-sm">How to Install on Android:</h3>
          <p>1. Tap the download button above for your desired app.</p>
          <p>2. Open the downloaded <strong className="text-white">.apk</strong> file from your phone's notification bar or Downloads folder.</p>
          <p>3. If prompted, allow <strong className="text-[#D4AF37]">"Install unknown apps"</strong> in your Android settings.</p>
          <p>4. Tap <strong className="text-white">Install</strong> and enjoy the native app!</p>
        </div>

      </div>
    </div>
  );
}
