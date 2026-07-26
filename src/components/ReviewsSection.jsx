'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle, Sparkles, MessageSquare, ThumbsUp, X } from 'lucide-react';

const reviewsData = [
  {
    id: 1,
    author: 'Duchess Genevieve L.',
    location: 'Monaco',
    rating: 5,
    date: '2 days ago',
    perfume: 'Valaroix Elixir Noir (100ml)',
    title: 'An absolute masterpiece. Lasts over 28 hours on skin.',
    content: 'The Kashmiri Saffron combined with the 40-year aged Cambodian Oud creates an aroma that turns heads everywhere I go in Monte Carlo. The 24k gold engraved medallion is pure luxury.',
    verified: true
  },
  {
    id: 2,
    author: 'Baron Harrison Croft',
    location: 'London, UK',
    rating: 5,
    date: '1 week ago',
    perfume: 'Valaroix Aureum Oud (Bespoke 250ml)',
    title: 'The rarest agarwood scent I have ever encountered.',
    content: 'As a collector of niche perfumes for over 20 years, Valaroix Aureum Oud stands in a league of its own. The smoked honey and frankincense notes develop beautifully.',
    verified: true
  },
  {
    id: 3,
    author: 'Elena Rostova',
    location: 'Paris, France',
    rating: 5,
    date: '2 weeks ago',
    perfume: 'Valaroix Rose Imperial (100ml)',
    title: 'Pure Grasse Damask Rose perfection.',
    content: 'You can immediately tell the roses were cold-extracted at dawn. The sillage is intoxicating without being overpowering. Will be repurchasing for life.',
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
      author: newReview.name || 'Anonymous VIP',
      location: 'Verified Buyer',
      rating: newReview.rating,
      date: 'Just now',
      perfume: 'Valaroix Elixir Noir',
      title: newReview.title,
      content: newReview.content,
      verified: true
    };
    setAllReviews([created, ...allReviews]);
    setIsReviewFormOpen(false);
    setNewReview({ name: '', title: '', content: '', rating: 5 });
  };

  return (
    <section className="py-24 bg-black relative border-t border-valaroix-gold/20">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel-gold text-valaroix-gold text-xs uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" /> Verified Patron Experiences
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Words From Our <span className="text-gold-gradient">Royal Patrons</span>
            </h2>
          </div>

          <button
            onClick={() => setIsReviewFormOpen(true)}
            className="btn-gold px-6 py-3 rounded-full text-xs uppercase font-bold tracking-wider flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" /> Write VIP Review
          </button>
        </div>

        {/* Ratings Breakdown Summary */}
        <div className="glass-panel p-6 rounded-3xl border-valaroix-gold/30 mb-12 grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <span className="font-serif text-4xl font-bold text-gold-gradient">4.96 / 5.0</span>
            <div className="flex justify-center text-valaroix-gold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="block text-[11px] text-gray-400">Based on 440 Verified Patron Reviews</span>
          </div>

          <div className="space-y-1">
            <span className="block text-xs uppercase font-bold text-gray-300">Longevity Rating</span>
            <span className="font-serif text-2xl font-bold text-valaroix-gold">24+ Hours</span>
            <span className="block text-[10px] text-gray-500">98% report all-day sillage</span>
          </div>

          <div className="space-y-1">
            <span className="block text-xs uppercase font-bold text-gray-300">Bottle Craftsmanship</span>
            <span className="font-serif text-2xl font-bold text-valaroix-gold">100% Exceptional</span>
            <span className="block text-[10px] text-gray-500">Hand-faceted crystal glass</span>
          </div>

          <div className="space-y-1">
            <span className="block text-xs uppercase font-bold text-gray-300">Repeat Patron Rate</span>
            <span className="font-serif text-2xl font-bold text-valaroix-gold">94.2%</span>
            <span className="block text-[10px] text-gray-500">Club Privé members</span>
          </div>
        </div>

        {/* Reviews Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {allReviews.map((rev) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-panel p-6 rounded-3xl border-valaroix-gold/20 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex text-valaroix-gold">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-500">{rev.date}</span>
                </div>

                <h3 className="font-serif text-base font-bold text-white leading-snug">
                  "{rev.title}"
                </h3>

                <p className="text-gray-400 text-xs font-light leading-relaxed">
                  {rev.content}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-valaroix-gold/15 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-gray-200 flex items-center gap-1.5">
                    {rev.author}
                    {rev.verified && <CheckCircle className="w-3.5 h-3.5 text-valaroix-gold" />}
                  </h4>
                  <span className="text-[10px] text-valaroix-gold/80">{rev.perfume} • {rev.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Write a Review Modal */}
      <AnimatePresence>
        {isReviewFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setIsReviewFormOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-md" />
            
            <div className="relative w-full max-w-lg bg-valaroix-dark border border-valaroix-gold/40 rounded-3xl p-6 shadow-2xl z-10 space-y-4">
              <button
                onClick={() => setIsReviewFormOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-serif text-2xl font-bold text-white">Write Patron Review</h3>
              
              <form onSubmit={handleAddReview} className="space-y-3 text-xs">
                <input
                  type="text"
                  required
                  placeholder="Your Name & Title"
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  className="w-full bg-black border border-valaroix-gold/30 rounded-xl p-3 text-gray-200"
                />
                <input
                  type="text"
                  required
                  placeholder="Review Headline"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  className="w-full bg-black border border-valaroix-gold/30 rounded-xl p-3 text-gray-200"
                />
                <textarea
                  required
                  rows={4}
                  placeholder="Your Olfactory Experience & Sillage Notes..."
                  value={newReview.content}
                  onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                  className="w-full bg-black border border-valaroix-gold/30 rounded-xl p-3 text-gray-200"
                />
                <button type="submit" className="w-full btn-gold py-3 rounded-full font-bold uppercase tracking-wider">
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
