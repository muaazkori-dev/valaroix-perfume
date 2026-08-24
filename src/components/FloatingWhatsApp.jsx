'use client';

import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

// Official Pixel-Perfect Authentic WhatsApp Vector SVG Logo Icon
export function WhatsAppIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} viewBox="0 0 448 512" fill="currentColor">
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3 18.6-68.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
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

export default function FloatingWhatsApp({ phoneNumber = '923029111856' }) {
  const controls = useAnimation();
  const [isDragged, setIsDragged] = useState(false);

  const defaultMessage = encodeURIComponent(
    'Hello VALAROIX Haute Parfumerie, I am interested in acquiring your Luxury Perfumes.'
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  const handleDragEnd = (event, info) => {
    if (Math.abs(info.offset.x) > 10 || Math.abs(info.offset.y) > 10) {
      setIsDragged(true);
      setTimeout(() => setIsDragged(false), 200);
    }

    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 400;
    const finalX = info.point.x;

    if (finalX < screenWidth / 2) {
      controls.start({
        x: -(screenWidth - 80),
        transition: { type: 'spring', stiffness: 350, damping: 25 }
      });
    } else {
      controls.start({
        x: 0,
        transition: { type: 'spring', stiffness: 350, damping: 25 }
      });
    }
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      animate={controls}
      onDragEnd={handleDragEnd}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 cursor-grab active:cursor-grabbing touch-none select-none"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          if (isDragged) {
            e.preventDefault();
          }
        }}
        aria-label="Direct WhatsApp Chat with VALAROIX Support"
        className="group relative w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_0_25px_rgba(37,211,102,0.6)] hover:shadow-[0_0_35px_rgba(37,211,102,0.9)] transition-shadow duration-300 border-2 border-white/40 block"
      >
        {/* Glowing Ambient Outer Ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />

        {/* Authentic Official WhatsApp Icon */}
        <WhatsAppIcon className="w-7 h-7 text-white group-hover:rotate-12 transition-transform duration-300 pointer-events-none" />
      </a>
    </motion.div>
  );
}
