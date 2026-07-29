'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle, Sparkles, MessageSquare, X } from 'lucide-react';

const reviewsData = [
  {
    id: 1,
    author: 'Hamza Malik',
    location: 'DHA Phase 6, Karachi',
    rating: 5,
    date: 'Yesterday',
    perfume: 'Valaroix Sauvage Imperial (24h Extrait)',
    title: 'Bhai bilkul insane lasting hai! 24 ghante baad bhi kapron se khushboo arahi hai.',
    content: 'Pehle mujhe laga online fraud na ho, lekin jab delivery ayi aur bottle spray ki to sach me kamaal smell hai. Sauvage Elixir se 100% match hai aur projection bohut strong hai!',
    verified: true
  },
  {
    id: 2,
    author: 'Shahzaib Ahmed',
    location: 'Gulberg III, Lahore',
    rating: 5,
    date: '3 days ago',
    perfume: 'Valaroix Cedrat Boise Extreme',
    title: 'Masterpiece fragrance! Express courier delivery in 2 days.',
    content: 'Packaging aur bottle quality dekh kar dil khush ho gaya. Fresh lemon aur leather smell hai jo poore office me phel jati hai. SadePay se payment ki thi aur instant confirm ho gaya.',
    verified: true
  },
  {
    id: 3,
    author: 'Dr. Usman Farooq',
    location: 'F-8/2, Islamabad',
    rating: 5,
    date: '1 week ago',
    perfume: 'Valaroix Baccarat Amber 540',
    title: 'Top notch quality. Highly recommended for perfume lovers.',
    content: 'Baccarat 540 wala same sweet ambergris aur saffron scent profile hai. Lasting effortlessly 12-14 hours+ rehti hai. Value for money deal!',
    verified: true
  }
];

export default function ReviewsSection() {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', title: '', content: '', rating: 5 });
  const [allReviews, setAllReviews] = useState(reviewsData);

  const handleAddReview = (e) => {
    e.preventDefault();
    const created = {
      id: Date.now(),
      author: newReview.name || 'Verified Buyer',
      location: 'Verified Customer, Pakistan',
      rating: newReview.rating,
      date: 'Just now',
      perfume: 'Valaroix Sauvage Imperial',
      title: newReview.title,
      content: newReview.content,
      verified: true
    };
    setAllReviews([created, ...allReviews]);
    setIsReviewFormOpen(false);
    setNewReview({ name: '', title: '', content: '', rating: 5 });
  };

  return (
    <section id="notes" className="py-20 bg-[#0D0D0D] relative border-t border-[#D4AF37]/20 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
              CUSTOMER TRUST & REVIEWS
            </span>
            <h2 className="font-serif-mockup text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              WHAT OUR CLIENTS SAY
            </h2>
          </div>

          <button
            onClick={() => setIsReviewFormOpen(true)}
            className="px-5 py-2.5 rounded-xl btn-mockup-gold text-xs font-bold uppercase tracking-wider flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-[#0D0D0D]" /> Write Review
          </button>
        </div>

        {/* Ratings Breakdown Summary */}
        <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-[#D4AF37]/30 grid grid-cols-1 md:grid-cols-4 gap-6 text-center shadow-xl">
          <div className="space-y-1">
            <span className="font-serif-mockup text-3xl font-extrabold text-[#D4AF37]">4.98 / 5.0</span>
            <div className="flex justify-center text-[#D4AF37]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="block text-[10px] text-[#6B6B6B]">Based on 520+ Pakistani Customers</span>
          </div>

          <div className="space-y-1">
            <span className="block text-xs uppercase font-bold text-gray-300">Longevity Guarantee</span>
            <span className="font-serif-mockup text-xl font-bold text-[#D4AF37]">10h - 24h+ Lasting</span>
            <span className="block text-[10px] text-[#6B6B6B]">Pure Extrait Oils</span>
          </div>

          <div className="space-y-1">
            <span className="block text-xs uppercase font-bold text-gray-300">Delivery Speed</span>
            <span className="font-serif-mockup text-xl font-bold text-[#D4AF37]">24 - 48 Hours</span>
            <span className="block text-[10px] text-[#6B6B6B]">Free Courier Pakistan</span>
          </div>

          <div className="space-y-1">
            <span className="block text-xs uppercase font-bold text-gray-300">Customer Satisfaction</span>
            <span className="font-serif-mockup text-xl font-bold text-[#D4AF37]">99.2% Positive</span>
            <span className="block text-[10px] text-[#6B6B6B]">Verified Buyers</span>
          </div>
        </div>

        {/* Reviews Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {allReviews.map((rev) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-[#1A1A1A] p-6 rounded-2xl border border-[#D4AF37]/20 flex flex-col justify-between space-y-4 shadow-lg hover:border-[#D4AF37]/50 transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <div className="flex text-[#D4AF37]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#6B6B6B]">{rev.date}</span>
                </div>

                <h3 className="font-serif-mockup text-sm font-bold text-white leading-snug">
                  "{rev.title}"
                </h3>

                <p className="text-gray-300 text-xs font-light leading-relaxed">
                  {rev.content}
                </p>
              </div>

              <div className="pt-3 border-t border-[#D4AF37]/15 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                    {rev.author}
                    {rev.verified && <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37]" />}
                  </h4>
                  <span className="text-[10px] text-[#6B6B6B] block">{rev.perfume} • {rev.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Write a Review Modal */}
      <AnimatePresence>
        {isReviewFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative w-full max-w-lg bg-[#1A1A1A] border border-[#D4AF37]/40 rounded-3xl p-6 shadow-2xl space-y-4">
              <button
                onClick={() => setIsReviewFormOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-serif-mockup text-xl font-bold text-white">Write Customer Review</h3>
              
              <form onSubmit={handleAddReview} className="space-y-3 text-xs">
                <input
                  type="text"
                  required
                  placeholder="Your Name & City"
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  className="w-full bg-[#0D0D0D] border border-[#D4AF37]/30 rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                />
                <input
                  type="text"
                  required
                  placeholder="Review Headline (e.g. Amazing Smell & Fast Delivery)"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  className="w-full bg-[#0D0D0D] border border-[#D4AF37]/30 rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                />
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us about your experience with VALAROIX Perfumes..."
                  value={newReview.content}
                  onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                  className="w-full bg-[#0D0D0D] border border-[#D4AF37]/30 rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                />
                <button type="submit" className="w-full btn-mockup-gold py-3 rounded-xl font-bold uppercase tracking-wider">
                  Submit Customer Review
                </button>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
