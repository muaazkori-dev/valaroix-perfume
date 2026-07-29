'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle, MessageSquare, X } from 'lucide-react';

export default function ReviewsSection() {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', title: '', content: '', rating: 5 });
  const [allReviews, setAllReviews] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('valaroix_customer_reviews');
      if (saved) {
        setAllReviews(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const handleAddReview = (e) => {
    e.preventDefault();
    const created = {
      id: Date.now(),
      author: newReview.name || 'Verified Buyer',
      location: 'Verified Customer',
      rating: newReview.rating,
      date: 'Just now',
      title: newReview.title,
      content: newReview.content,
      verified: true
    };
    const updated = [created, ...allReviews];
    setAllReviews(updated);
    try {
      localStorage.setItem('valaroix_customer_reviews', JSON.stringify(updated));
    } catch (e) {}
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
              CUSTOMER REVIEWS
            </span>
            <h2 className="font-serif-mockup text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              REAL CLIENT REVIEWS
            </h2>
          </div>

          <button
            onClick={() => setIsReviewFormOpen(true)}
            className="px-5 py-2.5 rounded-xl btn-mockup-gold text-xs font-bold uppercase tracking-wider flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-[#0D0D0D]" /> Write Review
          </button>
        </div>

        {/* Reviews Cards List or Empty State */}
        {allReviews.length > 0 ? (
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
                    <span className="text-[10px] text-[#6B6B6B] block">{rev.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-[#1A1A1A] p-12 rounded-2xl border border-[#D4AF37]/20 text-center space-y-4 max-w-xl mx-auto">
            <MessageSquare className="w-10 h-10 text-[#D4AF37] mx-auto opacity-80" />
            <h3 className="font-serif-mockup font-bold text-lg text-white">No Reviews Yet</h3>
            <p className="text-xs text-[#6B6B6B]">
              Be the first customer to leave an authentic review after receiving your VALAROIX perfume parcel!
            </p>
            <button
              onClick={() => setIsReviewFormOpen(true)}
              className="px-6 py-3 rounded-xl btn-mockup-gold text-xs font-bold uppercase tracking-wider inline-block"
            >
              Write First Review
            </button>
          </div>
        )}

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
                  placeholder="Review Title (e.g. Excellent Smell & Quality)"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  className="w-full bg-[#0D0D0D] border border-[#D4AF37]/30 rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                />
                <textarea
                  required
                  rows={4}
                  placeholder="Share your honest thoughts about your VALAROIX perfume..."
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
