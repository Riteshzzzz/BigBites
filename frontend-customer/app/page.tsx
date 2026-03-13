"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, Bike, Star, ArrowRight, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCartStore } from '../store/cartStore';
import axios from 'axios';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const categoriesData = [
  { name: 'All', emoji: '🍽️' },
  { name: 'Pizza', emoji: '🍕' },
  { name: 'Burger', emoji: '🍔' },
  { name: 'Healthy', emoji: '🥗' },
  { name: 'Asian', emoji: '🍜' },
  { name: 'Desserts', emoji: '🍰' },
  { name: 'Beverages', emoji: '🥤' }
];

const foodItems = [
  { id: 'item1', name: 'Margherita Pizza', category: 'Pizza', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=500&q=80', price: 299, restaurantName: 'The Spice Garden', restaurantId: 'mock1' },
  { id: 'item2', name: 'Cheese Burger', category: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80', price: 149, restaurantName: 'Burger King', restaurantId: 'mock2' },
  { id: 'item3', name: 'Caesar Salad', category: 'Healthy', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80', price: 199, restaurantName: 'Healthy Greens', restaurantId: 'mock3' },
  { id: 'item4', name: 'Spicy Ramen', category: 'Asian', image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&w=500&q=80', price: 349, restaurantName: 'Tokyo Bites', restaurantId: 'mock4' },
  { id: 'item5', name: 'Chocolate Cake', category: 'Desserts', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80', price: 129, restaurantName: 'Sweet Tooth', restaurantId: 'mock5' },
  { id: 'item6', name: 'Iced Latte', category: 'Beverages', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80', price: 99, restaurantName: 'Coffee House', restaurantId: 'mock6' },
  { id: 'item7', name: 'Pepperoni Pizza', category: 'Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=500&q=80', price: 399, restaurantName: 'Pizza Hut', restaurantId: 'mock7' },
  { id: 'item8', name: 'Sushi Combo', category: 'Asian', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=500&q=80', price: 499, restaurantName: 'Sushi Bar', restaurantId: 'mock8' }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [topRestaurants, setTopRestaurants] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const baseUrl = rawApiUrl.replace(/\/$/, '');
        const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
        
        const res = await axios.get(`${apiUrl}/restaurants?limit=3`);
        if (res.data.success) {
          setTopRestaurants(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch top restaurants:', err);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen">
        {/* ======= HERO SECTION ======= */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden w-full">
          {/* Background Elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--color-primary-light)]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--color-accent)]/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              
              {/* Text Content */}
              <motion.div 
                className="w-full lg:w-1/2"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary-dark)] rounded-full text-sm font-semibold mb-6 w-max">
                  <Bike className="w-4 h-4 flex-shrink-0" />
                  <span>Fastest Delivery in City</span>
                </motion.div>
                
                <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-outfit font-extrabold text-gray-900 leading-tight mb-6">
                  Craving Something <span className="text-[var(--color-primary)]">Delicious?</span>
                </motion.h1>
                
                <motion.p variants={itemVariants} className="text-gray-600 text-lg mb-10 max-w-xl">
                  Order food from favourite restaurants near you. Explore top cuisines, get exciting deals, and enjoy superfast delivery directly to your door.
                </motion.p>
                
                <motion.div variants={itemVariants} className="bg-white p-2 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center max-w-2xl border border-gray-100">
                  <div className="flex-1 flex items-center px-4 w-full border-b sm:border-b-0 sm:border-r border-gray-200 py-3 sm:py-0">
                    <MapPin className="text-[var(--color-primary)] w-5 h-5 flex-shrink-0" />
                    <input 
                      type="text" 
                      placeholder="Enter delivery location" 
                      className="w-full bg-transparent border-none outline-none px-3 text-gray-700 placeholder-gray-400"
                    />
                  </div>
                  <div className="flex-1 flex items-center px-4 w-full py-3 sm:py-0">
                    <Search className="text-[var(--color-primary)] w-5 h-5 flex-shrink-0" />
                    <input 
                      type="text" 
                      placeholder="Search for food..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent border-none outline-none px-3 text-gray-700 placeholder-gray-400"
                    />
                  </div>
                  <button className="w-full sm:w-auto bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-8 py-4 rounded-xl font-medium transition-colors">
                    Find Food
                  </button>
                </motion.div>
              </motion.div>

              {/* Image Content */}
              <motion.div 
                className="w-full lg:w-1/2 relative flex justify-center lg:justify-end"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {/* Hero Illustration Wrapper */}
                <div className="relative w-full max-w-md aspect-square rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-accent)] p-2 animate-float">
                  <div className="w-full h-full rounded-full bg-white overflow-hidden border-8 border-white flex items-center justify-center relative shadow-2xl">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)' }}></div>
                  </div>
                  
                  {/* Floating Badges */}
                  <div className="absolute -left-8 top-20 bg-white p-3 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100">
                    <div className="bg-green-100 p-2 rounded-full"><Star className="w-5 h-5 text-green-600 fill-green-600" /></div>
                    <div>
                      <p className="font-bold text-gray-900 leading-none">4.9/5</p>
                      <p className="text-xs text-gray-500">Top Rated</p>
                    </div>
                  </div>
                  
                  <div className="absolute -right-4 bottom-20 bg-white p-3 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100">
                    <div className="bg-[var(--color-primary)]/10 p-2 rounded-full"><Clock className="w-5 h-5 text-[var(--color-primary)]" /></div>
                    <div>
                      <p className="font-bold text-gray-900 leading-none">Under 30m</p>
                      <p className="text-xs text-gray-500">Delivery</p>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ======= FEATURES SECTION ======= */}
        <section className="py-20 bg-white w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              
              <motion.div 
                className="flex flex-col items-center text-center p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-20 h-20 bg-[var(--color-primary)]/10 rounded-3xl flex items-center justify-center mb-6 transform rotate-3 hover:rotate-6 transition-transform">
                  <Bike className="w-10 h-10 text-[var(--color-primary)]" />
                </div>
                <h3 className="text-xl font-bold font-outfit text-gray-900 mb-3">Lightning Delivery</h3>
                <p className="text-gray-600">Experience our superfast delivery system designed to get your food hot and fresh.</p>
              </motion.div>

              <motion.div 
                className="flex flex-col items-center text-center p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="w-20 h-20 bg-[var(--color-secondary)]/10 rounded-3xl flex items-center justify-center mb-6 transform -rotate-3 hover:-rotate-6 transition-transform">
                  <MapPin className="w-10 h-10 text-[var(--color-secondary)]" />
                </div>
                <h3 className="text-xl font-bold font-outfit text-gray-900 mb-3">Live Tracking</h3>
                <p className="text-gray-600">Know exactly where your order is with our real-time GPS tracking system.</p>
              </motion.div>

              <motion.div 
                className="flex flex-col items-center text-center p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mb-6 transform rotate-3 hover:rotate-6 transition-transform">
                  <ShieldCheck className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold font-outfit text-gray-900 mb-3">Best Quality</h3>
                <p className="text-gray-600">We partner with top-rated restaurants to ensure the best food quality every time.</p>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ======= CATEGORIES SECTION ======= */}
        <section className="py-20 w-full bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold font-outfit text-gray-900 mb-2">Explore Categories</h2>
                <p className="text-gray-600">Discover flavors from around the world.</p>
              </div>
            </div>
            <div className="flex overflow-x-auto pb-6 pt-2 gap-4 hide-scrollbar snap-x">
              {categoriesData.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`min-w-[140px] snap-center rounded-2xl p-6 text-center cursor-pointer border shadow-sm transition-all group flex flex-col items-center justify-center ${
                    selectedCategory === cat.name 
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-[var(--color-primary)]/20 shadow-lg' 
                    : 'border-gray-100 bg-white hover:shadow-md'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
                    selectedCategory === cat.name ? 'bg-[var(--color-primary)]/20' : 'bg-gray-50 group-hover:bg-[var(--color-primary)]/10'
                  }`}>
                    <span className="text-3xl">{cat.emoji}</span>
                  </div>
                  <h3 className={`font-semibold transition-colors ${
                    selectedCategory === cat.name ? 'text-[var(--color-primary)] font-bold' : 'text-gray-900 group-hover:text-[var(--color-primary)]'
                  }`}>{cat.name}</h3>
                </motion.div>
              ))}
            </div>

            {/* Food Items Grid for Selected Category */}
            <motion.div 
              className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={selectedCategory}
            >
              {foodItems.filter(item => selectedCategory === 'All' || item.category === selectedCategory).map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow flex flex-col group cursor-pointer"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gray-200 group-hover:scale-110 transition-transform duration-500" style={{ backgroundImage: 'url(' + item.image + ')', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-900 text-lg group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">{item.name}</h4>
                      <span className="font-bold text-[var(--color-primary)] whitespace-nowrap ml-2">₹{item.price}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-5">{item.restaurantName}</p>
                    <button 
                      onClick={() => addItem({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: 1,
                        image: item.image,
                        restaurantId: item.restaurantId,
                        restaurantName: item.restaurantName
                      })}
                      className="mt-auto w-full py-2.5 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary-dark)] font-semibold hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                    >
                      Quick Add
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ======= TOP RESTAURANTS SECTION ======= */}
        <section className="py-24 w-full bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold font-outfit text-gray-900 mb-2">Top Restaurants</h2>
                <p className="text-gray-600">The most loved places in your area.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(topRestaurants.length > 0 ? topRestaurants.slice(0, 3) : [
                { _id: 'mock1', name: 'The Spice Garden', image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80', rating: '4.8', cuisine: ['North Indian', 'Chinese', 'Desserts'], deliveryTime: '30-40 min' },
                { _id: 'mock2', name: 'Burger & Co', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80', rating: '4.5', cuisine: ['American', 'Fast Food'], deliveryTime: '20-30 min' },
                { _id: 'mock3', name: 'Healthy Greens', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80', rating: '4.9', cuisine: ['Healthy', 'Salads'], deliveryTime: '15-25 min' }
              ]).map((restaurant) => (
                <motion.div
                  key={restaurant._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col"
                  onClick={() => window.location.href = `/restaurants/${restaurant._id}`}
                >
                  <div className="relative h-56 overflow-hidden">
                    <div className="absolute inset-0 bg-gray-200 group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: 'url(' + (restaurant.image || 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80') + ')', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                    
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm flex items-center gap-1">
                      <Star className="w-3 h-3 text-[var(--color-accent)] fill-[var(--color-accent)]" /> {restaurant.rating || "4.8"}
                    </div>
                    
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">{restaurant.name}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-1">{restaurant.cuisine?.join(', ')}</p>
                    
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg">
                        <Clock className="w-4 h-4 mr-1.5 text-gray-500" />
                        {restaurant.deliveryTime || '30-40 min'}
                      </div>
                      <div className="flex items-center text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg">
                        <Bike className="w-4 h-4 mr-1.5 text-gray-500" />
                        Free Delivery
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link href="/restaurants" className="inline-flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white px-8 py-3.5 rounded-xl font-medium transition-colors">
                View All Restaurants
              </Link>
            </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </>
  );
}
