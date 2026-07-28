'use client';

import React from 'react';

// Official Authentic WhatsApp SVG Logo Icon
export function WhatsAppIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.854 0-3.62-.497-5.163-1.439l-.37-.225-3.834 1.006 1.024-3.737-.247-.393a10.05 10.05 0 0 1-1.543-5.385c0-5.556 4.521-10.077 10.076-10.077 2.691 0 5.221 1.047 7.124 2.951a10.007 10.007 0 0 1 2.95 7.125c0 5.556-4.521 10.077-10.077 10.077m0-18.423c-6.49 0-11.769 5.279-11.769 11.769 0 2.19.603 4.329 1.748 6.197l-1.86 6.786 6.945-1.821c1.802.983 3.834 1.501 5.936 1.501 6.49 0 11.769-5.279 11.769-11.769 0-3.144-1.224-6.098-3.447-8.321-2.223-2.223-5.177-3.447-8.322-3.447" />
    </svg>
  );
}

// Official Authentic TikTok SVG Logo Icon
export function TikTokIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.33 0 .64.06.94.16V9.02a6.3 6.3 0 0 0-.94-.07 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.05a8.27 8.27 0 0 0 4.77 1.48V7.07a4.85 4.85 0 0 1-1.01-.38z" />
    </svg>
  );
}

export default function FloatingWhatsApp({ phoneNumber = '923141397378' }) {
  const defaultMessage = encodeURIComponent(
    'Hello VALAROIX Haute Parfumerie, I am interested in acquiring your 3D Luxury Perfumes.'
  );

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
      {/* 1 CLICK DIRECT WHATSAPP OPEN (No Popup Tooltip) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Chat with VALAROIX Support"
        className="group relative w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_0_25px_rgba(37,211,102,0.5)] hover:scale-110 hover:shadow-[0_0_35px_rgba(37,211,102,0.8)] transition-all duration-300 border border-white/30"
      >
        {/* Glowing Ambient Outer Ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />

        {/* Authentic Official WhatsApp Icon */}
        <WhatsAppIcon className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" />

        {/* Notification Badge Dot */}
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-valaroix-gold border-2 border-black flex items-center justify-center text-[8px] font-bold text-valaroix-dark">
          1
        </span>
      </a>
    </div>
  );
}
