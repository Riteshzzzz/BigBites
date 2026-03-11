'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Image from 'next/image';
import { Tag, Clock, Share2, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

const activeOffers = [
  {
    id: 1,
    title: '50% OFF up to ₹200',
    code: 'BIGBITES50',
    description: 'Valid on all orders above ₹400. Applicable for new users only.',
    expiry: 'Expires in 2 days',
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=600&q=80',
    color: 'from-orange-500 to-amber-400'
  },
  {
    id: 2,
    title: 'Free Delivery Weekend',
    code: 'FREEDEL',
    description: 'Get free delivery on your favorite restaurants all weekend.',
    expiry: 'Expires in 1 day',
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
    color: 'from-blue-500 to-indigo-400'
  },
  {
    id: 3,
    title: 'Flat 20% OFF on Pizzas',
    code: 'PIZZAFEST',
    description: 'Celebrate pizza festival with flat 20% off from select outlets.',
    expiry: 'Expires in 5 days',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    color: 'from-red-500 to-rose-400'
  },
  {
    id: 4,
    title: 'Buy 1 Get 1 Burger',
    code: 'BOGO',
    description: 'Buy one burger, get another absolutely free at Burger & Co.',
    expiry: 'Expires in 12 hours',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
    color: 'from-amber-600 to-yellow-500'
  }
];

export default function OffersPage() {
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Coupon ${code} copied to clipboard!`);
  };

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-background)]">
      <Navbar />
      
      {/* Header */}
      <div className="pt-32 pb-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold font-outfit text-gray-900 tracking-tight mb-4"
          >
            Exclusive <span className="text-[var(--color-primary)]">Offers & Deals</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Discover the best discounts from your favorite restaurants. Use these promo codes to save big on your next meal!
          </motion.p>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {activeOffers.map((offer, index) => (
            <motion.div 
              key={offer.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 flex flex-col sm:flex-row group"
            >
              <div className="sm:w-2/5 h-48 sm:h-auto relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${offer.color} opacity-20 z-10 group-hover:opacity-10 transition-opacity`}></div>
                <Image 
                  src={offer.image} 
                  alt={offer.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="sm:w-3/5 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold text-gray-900 font-outfit leading-tight">{offer.title}</h3>
                    <Share2 className="w-5 h-5 text-gray-400 cursor-pointer hover:text-[var(--color-primary)] transition-colors" />
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{offer.description}</p>
                  
                  <div className="flex items-center gap-2 text-sm font-medium text-amber-600 bg-amber-50 w-max px-3 py-1.5 rounded-lg mb-6">
                    <Clock className="w-4 h-4" />
                    <span>{offer.expiry}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-4 mt-auto">
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[var(--color-primary)]" />
                    <span className="font-bold text-gray-900 border-2 border-dashed border-gray-300 px-3 py-1 rounded bg-gray-50 uppercase tracking-widest">{offer.code}</span>
                  </div>
                  <button 
                    onClick={() => handleCopyCode(offer.code)}
                    className="flex items-center justify-center p-2 rounded-full bg-gray-50 text-gray-500 hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                    title="Copy Code"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
