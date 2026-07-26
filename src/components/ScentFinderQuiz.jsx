'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight, CheckCircle2, RefreshCw, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { products } from './ProductCatalog';

export default function ScentFinderQuiz() {
  const { isQuizOpen, setIsQuizOpen, addToCart } = useCart();
  const [step, setStep] = useState(0); // 0, 1, 2, 3 (result)
  const [answers, setAnswers] = useState({});

  if (!isQuizOpen) return null;

  const questions = [
    {
      title: "1. What is your desired olfactory aura?",
      options: [
        { label: "Regal & Powerful", desc: "A commanding presence infused with rare woods and amber", match: "valaroix-aureum-oud" },
        { label: "Warm & Golden Signature", desc: "Kashmiri saffron and 24k gold particle radiance", match: "valaroix-elixir-noir" },
        { label: "Romantic & Crimson Velvet", desc: "Hand-picked Grasse Damask Rose and raspberry sweetness", match: "valaroix-rose-imperial" },
        { label: "Sacred & Creamy Luxury", desc: "Butter-soft Mysore Sandalwood and bourbon vanilla", match: "valaroix-santal-royal" },
      ]
    },
    {
      title: "2. When do you wear your fragrance most?",
      options: [
        { label: "Evening Galas & Black-Tie VIP Events", match: "valaroix-elixir-noir" },
        { label: "Intimate Encounters & Candlelit Dinners", match: "valaroix-rose-imperial" },
        { label: "Daily Signature Statement", match: "valaroix-santal-royal" },
        { label: "Private Member Clubs & Executive Meetings", match: "valaroix-aureum-oud" },
      ]
    },
    {
      title: "3. Choose your anchor note element:",
      options: [
        { label: "40-Year Aged Cambodian Oud & Smoked Frankincense", match: "valaroix-aureum-oud" },
        { label: "Golden Ambergris & Kashmiri Saffron", match: "valaroix-elixir-noir" },
        { label: "Bulgarian Rose & White Musk Velvet", match: "valaroix-rose-imperial" },
        { label: "Mysore Sandalwood & Amber Resins", match: "valaroix-santal-royal" },
      ]
    }
  ];

  const handleSelectOption = (match) => {
    const newAnswers = { ...answers, [step]: match };
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setStep(3); // Result
    }
  };

  // Find most frequent matched product
  const getRecommendedProduct = () => {
    const counts = {};
    Object.values(answers).forEach((id) => {
      counts[id] = (counts[id] || 0) + 1;
    });
    const winnerId = Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b), 'valaroix-elixir-noir');
    return products.find((p) => p.id === winnerId) || products[0];
  };

  const recommended = getRecommendedProduct();

  const handleReset = () => {
    setStep(0);
    setAnswers({});
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsQuizOpen(false)}
          className="fixed inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-xl bg-valaroix-dark border border-valaroix-gold/40 rounded-3xl p-8 shadow-[0_0_80px_rgba(212,175,55,0.25)] z-10"
        >
          {/* Close */}
          <button
            onClick={() => setIsQuizOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full glass-panel text-gray-400 hover:text-valaroix-gold"
          >
            <X className="w-5 h-5" />
          </button>

          {step < 3 ? (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-valaroix-gold text-xs uppercase tracking-widest font-bold">
                <Sparkles className="w-4 h-4" /> Signature Scent Profiler ({step + 1}/3)
              </div>

              <h3 className="font-serif text-2xl font-bold text-white tracking-wide">
                {questions[step].title}
              </h3>

              <div className="space-y-3 pt-2">
                {questions[step].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(opt.match)}
                    className="w-full p-4 rounded-2xl glass-panel border-valaroix-gold/20 hover:border-valaroix-gold hover:bg-valaroix-gold/10 text-left transition-all group flex flex-col gap-1"
                  >
                    <span className="font-serif text-base font-bold text-white group-hover:text-valaroix-gold">
                      {opt.label}
                    </span>
                    {opt.desc && (
                      <span className="text-xs text-gray-400 font-light">{opt.desc}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Quiz Result */
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full glass-panel-gold border border-valaroix-gold flex items-center justify-center mx-auto text-valaroix-gold">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-valaroix-gold font-bold">Your Olfactory Match</span>
                <h3 className="font-serif text-3xl font-bold text-white">{recommended.name}</h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto">{recommended.description}</p>
              </div>

              <div className="glass-panel p-4 rounded-2xl border-valaroix-gold/30 text-left text-xs space-y-1.5 max-w-md mx-auto">
                <div className="flex justify-between text-gray-300 font-bold">
                  <span>Top Note Accord:</span>
                  <span className="text-valaroix-gold">{recommended.topNotes}</span>
                </div>
                <div className="flex justify-between text-gray-300 font-bold">
                  <span>Base Note Anchor:</span>
                  <span className="text-valaroix-gold">{recommended.baseNotes}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  onClick={handleReset}
                  className="px-5 py-3 rounded-full glass-panel text-xs text-gray-400 hover:text-valaroix-gold flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Retake Quiz
                </button>

                <button
                  onClick={() => {
                    addToCart(recommended, '100ml');
                    setIsQuizOpen(false);
                  }}
                  className="btn-gold px-8 py-3.5 rounded-full text-xs uppercase font-bold tracking-wider flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Add Match To Bag (${recommended.price})
                </button>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
